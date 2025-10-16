package com.tofork.paymentservice.stripe;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.model.Event;
import com.tofork.paymentservice.dto.StripePaymentRequest;
import com.tofork.paymentservice.model.Payment;
import com.tofork.paymentservice.model.PaymentStatus;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * StripeService - Gestisce l'integrazione con Stripe (VERSIONE SEMPLIFICATA)
 */
@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    /**
     * Crea un PaymentIntent per pagamenti con carta
     */
    public PaymentIntent createPaymentIntent(StripePaymentRequest request) throws StripeException {
        // Converti amount in centesimi
        Long amountInCents = request.getAmount().multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amountInCents);
        params.put("currency", request.getCurrency().toLowerCase());
        params.put("description", request.getDescription());
        
        if (request.getCustomerEmail() != null) {
            params.put("receipt_email", request.getCustomerEmail());
        }
        
        if (request.getMetadata() != null) {
            params.put("metadata", request.getMetadata());
        }

        // Configura metodi di pagamento automatici
        params.put("automatic_payment_methods", Map.of("enabled", true));

        return PaymentIntent.create(params);
    }

    /**
     * Recupera un PaymentIntent
     */
    public PaymentIntent retrievePaymentIntent(String paymentIntentId) throws StripeException {
        return PaymentIntent.retrieve(paymentIntentId);
    }

    /**
     * Crea un rimborso
     */
    public Refund createRefund(String chargeId, BigDecimal amount, String reason) throws StripeException {
        Map<String, Object> params = new HashMap<>();
        params.put("charge", chargeId);
        
        if (amount != null) {
            Long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();
            params.put("amount", amountInCents);
        }
        
        if (reason != null) {
            params.put("reason", reason);
        }

        return Refund.create(params);
    }

    /**
     * Converte stato Stripe in PaymentStatus interno
     */
    public PaymentStatus convertStripeStatus(String stripeStatus) {
        return switch (stripeStatus.toLowerCase()) {
            case "succeeded" -> PaymentStatus.SUCCEEDED;
            case "processing" -> PaymentStatus.PROCESSING;
            case "requires_payment_method", "requires_confirmation", "requires_action" -> PaymentStatus.PENDING;
            case "canceled" -> PaymentStatus.CANCELLED;
            default -> PaymentStatus.FAILED;
        };
    }

    /**
     * Aggiorna Payment con dati da Stripe
     */
    public void updatePaymentFromStripe(Payment payment, PaymentIntent paymentIntent) {
        payment.setStripePaymentIntentId(paymentIntent.getId());
        payment.setStatus(convertStripeStatus(paymentIntent.getStatus()));
        
        if (paymentIntent.getLatestCharge() != null) {
            payment.setStripeChargeId(paymentIntent.getLatestCharge());
        }
        
        if ("succeeded".equals(paymentIntent.getStatus())) {
            payment.setProcessedAt(java.time.LocalDateTime.now());
        }
        
        if (paymentIntent.getLastPaymentError() != null) {
            payment.setFailureReason(paymentIntent.getLastPaymentError().getMessage());
        }
    }

    /**
     * Gestisce webhook (versione base)
     */
    public void handleWebhook(String payload) {
        // Log per debugging
        System.out.println("Webhook ricevuto: " + payload);
    }

    public String getPublishableKey() {
        return stripePublishableKey;
    }
}
