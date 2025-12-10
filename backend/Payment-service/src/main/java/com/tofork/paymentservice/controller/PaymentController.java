package com.tofork.paymentservice.controller;

import com.tofork.paymentservice.dto.CreatePaymentRequest;
import com.tofork.paymentservice.dto.PaymentResponse;
import com.tofork.paymentservice.model.Payment;
import com.tofork.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<PaymentResponse> createCheckout(@RequestBody CreatePaymentRequest request) {
        try {
            String url = paymentService.initiatePayment(request);
            return ResponseEntity.ok(new PaymentResponse(url));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/success")
    public ResponseEntity<Payment> success(@RequestParam("session_id") String sessionId) {
        try {
            Payment payment = paymentService.completePayment(sessionId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
