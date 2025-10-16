package com.tofork.paymentservice.service;

import com.tofork.paymentservice.dto.CreatePaymentRequest;
import com.tofork.paymentservice.dto.PaymentResponse;
import com.tofork.paymentservice.model.Payment;
import com.tofork.paymentservice.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface PaymentService {

    /**
     * Crea un nuovo pagamento
     */
    PaymentResponse createPayment(CreatePaymentRequest request) throws Exception;

    /**
     * Trova pagamento per ID
     */
    Payment findPaymentById(Long paymentId) throws Exception;

    /**
     * Conferma pagamento Stripe
     */
    Payment confirmPayment(String paymentIntentId) throws Exception;

    /**
     * Gestisce webhook Stripe
     */
    void handleStripeWebhook(String payload, String signature) throws Exception;

    /**
     * Crea rimborso
     */
    Payment createRefund(Long paymentId, BigDecimal amount, String reason, Long userId, String userRole) throws Exception;

    /**
     * Ottieni tutti i pagamenti di un utente
     */
    List<Payment> getUserPayments(Long userId);

    /**
     * Ottieni pagamenti di un utente filtrati per stato
     */
    List<Payment> getUserPaymentsByStatus(Long userId, PaymentStatus status);

    /**
     * Ottieni pagamenti per ordine
     */
    List<Payment> getOrderPayments(Long orderId);

    /**
     * Ottieni pagamenti per prenotazione
     */
    List<Payment> getBookingPayments(Long bookingId);

    /**
     * Verifica se l'utente può accedere al pagamento
     */
    boolean canUserAccessPayment(Long paymentId, Long userId, String userRole) throws Exception;

    /**
     * Calcola statistiche pagamenti
     */
    Map<String, Object> getPaymentStats();

    /**
     * Calcola revenue per range di date
     */
    BigDecimal calculateRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Ottieni conteggio pagamenti per stato
     */
    Map<PaymentStatus, Long> getPaymentCountsByStatus();
}
