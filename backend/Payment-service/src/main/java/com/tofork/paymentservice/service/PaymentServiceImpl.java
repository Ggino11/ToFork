package com.tofork.paymentservice.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.tofork.paymentservice.dto.CreatePaymentRequest;
import com.tofork.paymentservice.dto.PaymentResponse;
import com.tofork.paymentservice.dto.StripePaymentRequest;
import com.tofork.paymentservice.model.Payment;
import com.tofork.paymentservice.model.PaymentMethod;
import com.tofork.paymentservice.model.PaymentStatus;
import com.tofork.paymentservice.repository.PaymentRepository;
import com.tofork.paymentservice.stripe.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StripeService stripeService;

    @Override
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) throws Exception {
        // Validazione input
        if (!request.isValid()) {
            throw new Exception("Dati pagamento non validi");
        }

        // Crea pagamento nel database
        Payment payment = new Payment();
        payment.setUserId(request.getUserId());
        payment.setUserEmail(request.getUserEmail());
        payment.setOrderId(request.getOrderId());
        payment.setBookingId(request.getBookingId());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setDescription(request.getDescription());
        payment.setStatus(PaymentStatus.PENDING);

        Payment savedPayment = paymentRepository.save(payment);

        // Gestisci diversi metodi di pagamento
        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(savedPayment.getId());
        response.setAmount(savedPayment.getAmount());
        response.setCurrency(savedPayment.getCurrency());
        response.setStatus(savedPayment.getStatus());

        try {
            if (request.getPaymentMethod() == PaymentMethod.STRIPE_CARD) {
                // Crea PaymentIntent per pagamenti con carta
                StripePaymentRequest stripeRequest = new StripePaymentRequest(
                    request.getAmount(), 
                    request.getCurrency(), 
                    request.getDescription(), 
                    request.getUserEmail()
                );
                
                // Aggiungi metadata
                Map<String, String> metadata = new HashMap<>();
                metadata.put("payment_id", savedPayment.getId().toString());
                metadata.put("user_id", request.getUserId().toString());
                if (request.getOrderId() != null) {
                    metadata.put("order_id", request.getOrderId().toString());
                }
                if (request.getBookingId() != null) {
                    metadata.put("booking_id", request.getBookingId().toString());
                }
                stripeRequest.setMetadata(metadata);

                PaymentIntent paymentIntent = stripeService.createPaymentIntent(stripeRequest);
                
                // Aggiorna payment con dati Stripe
                savedPayment.setStripePaymentIntentId(paymentIntent.getId());
                paymentRepository.save(savedPayment);
                
                response.setClientSecret(paymentIntent.getClientSecret());

            } else if (request.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
                // Pagamento alla consegna - stato confermato ma non pagato
                savedPayment.setStatus(PaymentStatus.PENDING);
                paymentRepository.save(savedPayment);
                response.setStatus(PaymentStatus.PENDING);
            }

        } catch (StripeException e) {
            // In caso di errore Stripe, aggiorna payment
            savedPayment.setStatus(PaymentStatus.FAILED);
            savedPayment.setFailureReason(e.getMessage());
            paymentRepository.save(savedPayment);
            
            throw new Exception("Errore durante creazione pagamento Stripe: " + e.getMessage());
        }

        return response;
    }

    @Override
    public Payment findPaymentById(Long paymentId) throws Exception {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isEmpty()) {
            throw new Exception("Pagamento non trovato con ID: " + paymentId);
        }
        return paymentOpt.get();
    }

    @Override
    @Transactional
    public Payment confirmPayment(String paymentIntentId) throws Exception {
        try {
            PaymentIntent paymentIntent = stripeService.retrievePaymentIntent(paymentIntentId);
            
            Optional<Payment> paymentOpt = paymentRepository.findByStripePaymentIntentId(paymentIntentId);
            if (paymentOpt.isEmpty()) {
                throw new Exception("Pagamento non trovato per PaymentIntent: " + paymentIntentId);
            }
            
            Payment payment = paymentOpt.get();
            stripeService.updatePaymentFromStripe(payment, paymentIntent);
            
            return paymentRepository.save(payment);

        } catch (StripeException e) {
            throw new Exception("Errore durante conferma pagamento: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handleStripeWebhook(String payload, String signature) throws Exception {
        // Gestione webhook semplificata per ora
        try {
            // Log del webhook ricevuto
            System.out.println("Webhook Stripe ricevuto: " + payload);
            
            // TODO: Implementare parsing JSON manuale del payload
            // Per ora accettiamo tutti i webhook senza validazione signature
            stripeService.handleWebhook(payload);

        } catch (Exception e) {
            throw new Exception("Errore durante elaborazione webhook: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Payment createRefund(Long paymentId, BigDecimal amount, String reason, Long userId, String userRole) throws Exception {
        Payment payment = findPaymentById(paymentId);
        
        // Verifica autorizzazioni
        if (!"ADMIN".equals(userRole) && !payment.getUserId().equals(userId)) {
            throw new Exception("Non autorizzato a rimborsare questo pagamento");
        }
        
        if (!payment.canBeRefunded()) {
            throw new Exception("Pagamento non può essere rimborsato");
        }
        
        if (amount != null && amount.compareTo(payment.getRemainingRefundableAmount()) > 0) {
            throw new Exception("Importo rimborso maggiore del disponibile");
        }

        try {
            // Crea rimborso su Stripe
            stripeService.createRefund(payment.getStripeChargeId(), amount, reason);
            
            // Aggiorna payment
            if (amount == null) {
                // Rimborso completo
                payment.setRefundedAmount(payment.getAmount());
                payment.setStatus(PaymentStatus.REFUNDED);
            } else {
                // Rimborso parziale
                BigDecimal currentRefunded = payment.getRefundedAmount() != null ? payment.getRefundedAmount() : BigDecimal.ZERO;
                payment.setRefundedAmount(currentRefunded.add(amount));
                
                if (payment.getRefundedAmount().compareTo(payment.getAmount()) >= 0) {
                    payment.setStatus(PaymentStatus.REFUNDED);
                } else {
                    payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
                }
            }
            
            return paymentRepository.save(payment);

        } catch (StripeException e) {
            throw new Exception("Errore durante rimborso: " + e.getMessage());
        }
    }

    @Override
    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Payment> getUserPaymentsByStatus(Long userId, PaymentStatus status) {
        return paymentRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
    }

    @Override
    public List<Payment> getOrderPayments(Long orderId) {
        return paymentRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
    }

    @Override
    public List<Payment> getBookingPayments(Long bookingId) {
        return paymentRepository.findByBookingIdOrderByCreatedAtDesc(bookingId);
    }

    @Override
    public boolean canUserAccessPayment(Long paymentId, Long userId, String userRole) throws Exception {
        if ("ADMIN".equals(userRole)) {
            return true;
        }
        
        Payment payment = findPaymentById(paymentId);
        return payment.getUserId().equals(userId);
    }

    @Override
    public Map<String, Object> getPaymentStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Revenue totale
        BigDecimal totalRevenue = paymentRepository.getTotalRevenueByStatus(PaymentStatus.SUCCEEDED);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        // Conteggio per stato
        Map<PaymentStatus, Long> statusCounts = getPaymentCountsByStatus();
        stats.put("paymentsByStatus", statusCounts);
        
        return stats;
    }

    @Override
    public BigDecimal calculateRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal revenue = paymentRepository.getTotalRevenueByDateRange(startDate, endDate);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Override
    public Map<PaymentStatus, Long> getPaymentCountsByStatus() {
        Map<PaymentStatus, Long> counts = new HashMap<>();
        
        for (PaymentStatus status : PaymentStatus.values()) {
            Long count = paymentRepository.countByStatus(status);
            counts.put(status, count != null ? count : 0L);
        }
        
        return counts;
    }
}
