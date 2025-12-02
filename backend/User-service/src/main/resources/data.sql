-- Password is 'password' (BCrypt encoded)
INSERT INTO users (id, email, password, first_name, last_name, role, provider, enabled) VALUES 
(1001, 'owner1@test.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Mario', 'Rossi', 'RESTAURANT_OWNER', 'LOCAL', true),
(1002, 'owner2@test.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Luigi', 'Verdi', 'RESTAURANT_OWNER', 'LOCAL', true),
(1003, 'owner3@test.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Anna', 'Bianchi', 'RESTAURANT_OWNER', 'LOCAL', true)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to avoid primary key violation
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
