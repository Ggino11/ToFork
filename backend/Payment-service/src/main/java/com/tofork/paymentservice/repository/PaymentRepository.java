package com.tofork.paymentservice.repository;

import com.tofork.paymentservice.model.Payment;
import com.tofork.paymentservice.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Trova i pagamenti per ID utente
    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Trova i pagamenti per ID ordine
    List<Payment> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    // Trova i pagamenti tramite ID prenotazione
    List<Payment> findByBookingIdOrderByCreatedAtDesc(Long bookingId);

    // Trova i pagamenti in base allo stato
    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);

    // Trova i pagamenti per ID utente e stato
    List<Payment> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, PaymentStatus status);

    // Trova il pagamento tramite ID intento di pagamento Stripe
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);

    // Trova il pagamento tramite ID addebito Stripe
    Optional<Payment> findByStripeChargeId(String stripeChargeId);

    // Trova i pagamenti per intervallo di date
    List<Payment> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    // Calcola il totale per stato
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    BigDecimal getTotalRevenueByStatus(@Param("status") PaymentStatus status);

    // Calcola il totale per intervallo di date
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCEEDED' AND p.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Conta i pagamenti in base allo stato
    Long countByStatus(PaymentStatus status);

    // Conta i pagamenti per l'utente
    Long countByUserId(Long userId);

    // Trova pagamenti riusciti per l'utente
    List<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status);

    // Trova i pagamenti che possono essere rimborsati ?? serve?
    @Query("SELECT p FROM Payment p WHERE p.status = 'SUCCEEDED' AND (p.refundedAmount IS NULL OR p.refundedAmount < p.amount)")
    List<Payment> findRefundablePayments();
}
