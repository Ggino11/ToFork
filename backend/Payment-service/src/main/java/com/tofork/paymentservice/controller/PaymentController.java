package com.tofork.paymentservice.controller;

import com.tofork.paymentservice.dto.ApiResponse;
import com.tofork.paymentservice.dto.CreatePaymentRequest;
import com.tofork.paymentservice.dto.PaymentResponse;
import com.tofork.paymentservice.jwt.JwtService;
import com.tofork.paymentservice.model.Payment;
import com.tofork.paymentservice.model.PaymentStatus;
import com.tofork.paymentservice.service.PaymentService;
import com.tofork.paymentservice.stripe.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * PaymentController - Endpoint per gestione pagamenti ToFork
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private StripeService stripeService;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    /**
     * POST /api/payments - Crea nuovo pagamento
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @RequestBody CreatePaymentRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validazione token
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            // Estrai info utente dal token
            Long tokenUserId = jwtService.getUserIdFromToken(token);
            String userEmail = jwtService.getEmailFromToken(token);

            // Verifica corrispondenza con i dati della richiesta
            if (!tokenUserId.equals(request.getUserId())) {
                return ResponseEntity.ok(ApiResponse.error("ID utente non corrispondente"));
            }

            // Imposta dati utente dal token (più sicuri)
            request.setUserEmail(userEmail);

            PaymentResponse paymentResponse = paymentService.createPayment(request);
            return ResponseEntity.ok(ApiResponse.success("Pagamento creato con successo", paymentResponse));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante creazione pagamento: " + e.getMessage()));
        }
    }

    /**
     * GET /api/payments/{paymentId} - Dettagli pagamento specifico
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentById(
            @PathVariable Long paymentId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long userId = jwtService.getUserIdFromToken(token);
            String userRole = jwtService.getRoleFromToken(token);

            // Verifica autorizzazione
            if (!paymentService.canUserAccessPayment(paymentId, userId, userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato ad accedere a questo pagamento"));
            }

            Payment payment = paymentService.findPaymentById(paymentId);
            return ResponseEntity.ok(ApiResponse.success("Pagamento trovato", payment));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero pagamento: " + e.getMessage()));
        }
    }

    /**
     * GET /api/payments/user/{userId} - Storico pagamenti utente
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getUserPayments(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long tokenUserId = jwtService.getUserIdFromToken(token);
            String userRole = jwtService.getRoleFromToken(token);

            // Verifica autorizzazione (utente può vedere solo i propri pagamenti, admin può vedere tutti)
            if (!tokenUserId.equals(userId) && !"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato a vedere i pagamenti di questo utente"));
            }

            List<Payment> payments;
            if (status != null && !status.trim().isEmpty()) {
                PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
                payments = paymentService.getUserPaymentsByStatus(userId, paymentStatus);
            } else {
                payments = paymentService.getUserPayments(userId);
            }

            return ResponseEntity.ok(ApiResponse.success("Pagamenti utente recuperati", payments));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero pagamenti utente: " + e.getMessage()));
        }
    }

    /**
     * GET /api/payments/order/{orderId} - Pagamenti per ordine
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getOrderPayments(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            List<Payment> payments = paymentService.getOrderPayments(orderId);
            return ResponseEntity.ok(ApiResponse.success("Pagamenti ordine recuperati", payments));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero pagamenti ordine: " + e.getMessage()));
        }
    }

    /**
     * GET /api/payments/booking/{bookingId} - Pagamenti per prenotazione
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getBookingPayments(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            List<Payment> payments = paymentService.getBookingPayments(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Pagamenti prenotazione recuperati", payments));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero pagamenti prenotazione: " + e.getMessage()));
        }
    }

    /**
     * POST /api/payments/{paymentId}/confirm - Conferma pagamento
     */
    @PostMapping("/{paymentId}/confirm")
    public ResponseEntity<ApiResponse<Payment>> confirmPayment(
            @PathVariable Long paymentId,
            @RequestParam String paymentIntentId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Payment confirmedPayment = paymentService.confirmPayment(paymentIntentId);
            return ResponseEntity.ok(ApiResponse.success("Pagamento confermato", confirmedPayment));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante conferma pagamento: " + e.getMessage()));
        }
    }

    /**
     * POST /api/payments/{paymentId}/refund - Crea rimborso
     */
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<Payment>> createRefund(
            @PathVariable Long paymentId,
            @RequestParam(required = false) BigDecimal amount,
            @RequestParam(required = false) String reason,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long userId = jwtService.getUserIdFromToken(token);
            String userRole = jwtService.getRoleFromToken(token);

            Payment refundedPayment = paymentService.createRefund(paymentId, amount, reason, userId, userRole);
            return ResponseEntity.ok(ApiResponse.success("Rimborso creato con successo", refundedPayment));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante rimborso: " + e.getMessage()));
        }
    }

    /**
     * POST /api/payments/stripe/webhook - Webhook Stripe
     */
    @PostMapping("/stripe/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        try {
            paymentService.handleStripeWebhook(payload, signature);
            return ResponseEntity.ok("Webhook handled successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook handling failed: " + e.getMessage());
        }
    }

    /**
     * GET /api/payments/stripe/config - Configurazione Stripe pubblica
     */
    @GetMapping("/stripe/config")
    public ResponseEntity<ApiResponse<Map<String, String>>> getStripeConfig() {
        Map<String, String> config = Map.of(
                "publishableKey", stripeService.getPublishableKey()
        );
        return ResponseEntity.ok(ApiResponse.success("Configurazione Stripe", config));
    }

    /**
     * GET /api/payments/stats - Statistiche pagamenti
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPaymentStats(
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            String userRole = jwtService.getRoleFromToken(token);

            // Solo admin possono vedere statistiche globali
            if (!"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato a vedere statistiche"));
            }

            Map<String, Object> stats = paymentService.getPaymentStats();
            return ResponseEntity.ok(ApiResponse.success("Statistiche pagamenti recuperate", stats));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero statistiche: " + e.getMessage()));
        }
    }

    // Helper methods
    private boolean isValidAuthHeader(String authHeader) {
        return authHeader != null && authHeader.startsWith("Bearer ");
    }

    private String extractToken(String authHeader) {
        return authHeader.substring(7);
    }
}
