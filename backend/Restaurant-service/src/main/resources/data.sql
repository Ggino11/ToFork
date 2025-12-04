-- Reset sequences to avoid conflicts
SELECT setval('restaurants_id_seq', (SELECT MAX(id) FROM restaurants));
SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));
SELECT setval('restaurant_tables_id_seq', (SELECT MAX(id) FROM restaurant_tables));

-- M** Bun (ID 1) -> Owner 1001
INSERT INTO restaurants (id, name, slug, address, description, image, category, average_price, owner_id)
VALUES (1, 'M** Bun', 'm-bun', 'Corso Giuseppe Siccardi 8/A, 10122 Torino Italia', 'Fast food piemontese che propone hamburger preparati al momento...', '/panino.png', 'Burgers & Fast Food', 12.0, 1001)
ON CONFLICT (id) DO NOTHING;

-- Da Zero (ID 2) -> Owner 1002
INSERT INTO restaurants (id, name, slug, address, description, image, category, average_price, owner_id)
VALUES (2, 'Da Zero', 'da-zero', 'Via Giovanni Botero 18, 10122 Torino Italia', 'Crea una pizza originale, riconoscibile dalla qualità dei prodotti...', '/da_zero.png', 'Pizza', 20.0, 1002)
ON CONFLICT (id) DO NOTHING;

-- Mollica (ID 3) -> Owner 1003
INSERT INTO restaurants (id, name, slug, address, description, image, category, average_price, owner_id)
VALUES (3, 'Mollica', 'mollica', 'Piazza Madama Cristina, 2 bis, 10125 Torino Italia', 'La prima panineria i cui ingredienti provengono esclusivamente dalle terre...', '/mollica.png', 'Burgers & Fast Food', 15.0, 1003)
ON CONFLICT (id) DO NOTHING;


-- Menu Items for M** Bun (ID 1)
-- Burgers
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, available) VALUES
(1, 'CHEL', 'Hamburger di manzo, insalata, pomodoro, maionese', 8.70, '/img/burger1.jpg', 'Burgers', true),
(1, 'BUN CLASSICO', 'Con formaggio, cipolla e salsa BBQ', 9.90, '/img/burger2.jpg', 'Burgers', true),
(1, 'VEG BURGER', 'Burger vegetariano con verdure grigliate', 9.20, '/img/burger3.jpg', 'Burgers', true);

-- Patatine
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, available) VALUES
(1, 'PATATE CLASSICHE', 'Fritte croccanti con sale marino', 4.50, '/img/fries1.jpg', 'Patatine', true),
(1, 'PATATE SPECIAL', 'Con cheddar fuso e pancetta', 6.00, '/img/fries2.jpg', 'Patatine', true);

-- Cold Drinks
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, available) VALUES
(1, 'Coca-Cola', '33cl', 2.50, '/img/drink1.jpg', 'Cold Drinks', true),
(1, 'Birra Artigianale', 'Bionda 50cl', 5.00, '/img/drink2.jpg', 'Cold Drinks', true);


-- Menu Items for Da Zero (ID 2)
-- Burgers (Mock data has burgers for pizza place?)
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, available) VALUES
(2, 'CHfrefrEL', 'Hamburger di manzo, insalata, pomodoro, maionese', 8.70, '/img/burger1.jpg', 'Burgers', true),
(2, 'freff eff', 'Con forfrfrefrefeaa BBQ', 9.90, '/img/burger2.jpg', 'Burgers', true),
(2, 'frffr frsf', 'Burger vegetariano con verdure grigliate', 9.20, '/img/burger3.jpg', 'Burgers', true);

-- Patatine
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, available) VALUES
(2, 'PAefefrf', 'jfjdfrfe', 4.50, '/img/fries1.jpg', 'Patatine', true),
(2, 'PATATE SPECIAL', 'Con cheddar fuso e pancetta', 6.00, '/img/fries2.jpg', 'Patatine', true);

-- Cold Drinks
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, available) VALUES
(2, 'Coca-ina', '330gr', 2.50, '/img/drink1.jpg', 'Cold Drinks', true),
(2, 'Birra ', 'Bionda 50cl', 5.00, '/img/drink2.jpg', 'Cold Drinks', true);


-- Menu Items for Mollica (ID 3)
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, available) VALUES
(3, 'CHfrefrEL', 'Hamburger di manzo, insalata, pomodoro, maionese', 8.70, '/img/burger1.jpg', 'Burgers', true),
(3, 'freff eff', 'Con forfrfrefrefeaa BBQ', 9.90, '/img/burger2.jpg', 'Burgers', true),
(3, 'frffr frsf', 'Burger vegetariano con verdure grigliate', 9.20, '/img/burger3.jpg', 'Burgers', true);


-- Tables for M** Bun (ID 1)
INSERT INTO restaurant_tables (restaurant_id, table_number, capacity, status) VALUES
(1, 1, 4, 'AVAILABLE'),
(1, 2, 2, 'AVAILABLE'),
(1, 3, 6, 'OCCUPIED'),
(1, 4, 4, 'RESERVED');

-- Tables for Da Zero (ID 2)
INSERT INTO restaurant_tables (restaurant_id, table_number, capacity, status) VALUES
(2, 1, 4, 'AVAILABLE'),
(2, 2, 2, 'AVAILABLE'),
(2, 3, 8, 'AVAILABLE');

-- Tables for Mollica (ID 3)
INSERT INTO restaurant_tables (restaurant_id, table_number, capacity, status) VALUES
(3, 1, 2, 'AVAILABLE'),
(3, 2, 2, 'AVAILABLE');

-- Reset sequences again to be safe
SELECT setval('restaurants_id_seq', (SELECT MAX(id) FROM restaurants));
SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));
SELECT setval('restaurant_tables_id_seq', (SELECT MAX(id) FROM restaurant_tables));
