package com.tofork.paymentservice.service;

import com.stripe.model.checkout.Session;
import com.tofork.paymentservice.dto.CreatePaymentRequest;
import com.tofork.paymentservice.model.Payment;
import com.tofork.paymentservice.model.PaymentStatus;
import com.tofork.paymentservice.repository.PaymentRepository;
import com.tofork.paymentservice.stripe.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public String initiatePayment(CreatePaymentRequest request) throws Exception {
        // 1. Crea sessione Stripe
        Session session = stripeService.createCheckoutSession(
            request.getOrderId(), 
            request.getAmount(), 
            request.getSuccessUrl(), 
            request.getCancelUrl()
        );

        // 2. Salva pagamento PENDING
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setStripeSessionId(session.getId());
        paymentRepository.save(payment);

        return session.getUrl();
    }

    @Override
    public Payment completePayment(String sessionId) throws Exception {
        // 1. Recupera Sessione Stripe
        Session session = stripeService.retrieveSession(sessionId);
        
        // 2. Verifica stato pagamento
        if (!"paid".equals(session.getPaymentStatus())) {
            throw new Exception("Pagamento non completato su Stripe");
        }

        // 3. Trova pagamento nel DB
        Payment payment = paymentRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new Exception("Pagamento non trovato"));

        // 4. Se già pagato, ritorna
        if (payment.getStatus() == PaymentStatus.PAID) {
            return payment;
        }

        // 5. Aggiorna stato locale
        payment.setStatus(PaymentStatus.PAID);
        paymentRepository.save(payment);

        // 6. Notifica Order-service
        notifyOrderService(payment.getOrderId());

        return payment;
    }

    private void notifyOrderService(Long orderId) {
        try {
            String url = "http://tofork-order-service:8082/api/orders/" + orderId + "/pay";
            
            HttpHeaders headers = new HttpHeaders();
            // Auth interna
            headers.set("X-Internal-Secret", "TOFORK_INTERNAL_SECRET_2025");
            
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            restTemplate.exchange(url, HttpMethod.POST, entity, Object.class);
            
        } catch (Exception e) {
            System.err.println("Errore notifica Order-service: " + e.getMessage());
            // Non blocchiamo il flusso, il pagamento è preso. 
            // In produzione useremmo code di messaggi (RabbitMQ) per resilienza.
        }
    }
}
