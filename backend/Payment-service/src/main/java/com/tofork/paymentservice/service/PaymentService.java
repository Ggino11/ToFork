package com.tofork.paymentservice.service;

import com.tofork.paymentservice.dto.CreatePaymentRequest;
import com.tofork.paymentservice.model.Payment;

public interface PaymentService {
    String initiatePayment(CreatePaymentRequest request) throws Exception;
    Payment completePayment(String sessionId) throws Exception;
}
