-- Schema per User Service
CREATE SCHEMA IF NOT EXISTS user_service AUTHORIZATION postgres;

-- Schema per Order Service
CREATE SCHEMA IF NOT EXISTS order_service AUTHORIZATION postgres;

-- Schema per Restaurant Service
CREATE SCHEMA IF NOT EXISTS restaurant_service AUTHORIZATION postgres;

-- Schema per Payment Service
CREATE SCHEMA IF NOT EXISTS payment_service AUTHORIZATION postgres;

-- Schema per Booking Service
CREATE SCHEMA IF NOT EXISTS booking_service AUTHORIZATION postgres;

-- Imposta il search path
ALTER DATABASE tofork SET search_path TO user_service, order_service, restaurant_service, payment_service, booking_service, public;
