-- Inserimento Ristoranti
INSERT INTO restaurants (id, name, slug, address, description, image, category, average_price, lat, lon, owner_id) VALUES
(1, 'M** Bun', 'm-bun', 'Corso Giuseppe Siccardi 8/A, 10122 Torino Italia', 'Fast food piemontese che propone hamburger preparati al momento con ingredienti freschi e locali.', '/panino.png', 'Burgers & Fast Food', 12.0, 45.0703, 7.6869, 1001),
(2, 'Da Zero', 'da-zero', 'Via Giovanni Botero 18, 10122 Torino Italia', 'Crea una pizza originale, riconoscibile dalla qualità dei prodotti e dal forte legame con Cilento.', '/da_zero.png', 'Pizza', 20.0, 45.0710, 7.6850, 1002),
(3, 'Mollica', 'mollica', 'Piazza Madama Cristina, 2 bis, 10125 Torino Italia', 'La prima panineria i cui ingredienti provengono esclusivamente dalle terre dei piccoli produttori.', '/mollica.png', 'Burgers & Fast Food', 15.0, 45.0580, 7.6830, 1003)
ON CONFLICT (id) DO NOTHING;

-- Inserimento Menu Items
INSERT INTO menu_items (id, name, description, price, image_url, restaurant_id, category, available) VALUES
(1, 'Hamburger Classico', 'Carne bovina piemontese, lattuga, pomodoro', 8.50, '/burger.png', 1, 'Panini', true),
(2, 'Cheeseburger', 'Carne bovina, formaggio locale, salse', 9.50, '/burger.png', 1, 'Panini', true),
(3, 'Pizza Margherita', 'Pomodoro San Marzano, mozzarella di bufala', 8.00, '/pizza.png', 2, 'Pizze', true),
(4, 'Pizza Marinara', 'Pomodoro, aglio, origano', 6.50, '/pizza.png', 2, 'Pizze', true),
(5, 'Panino Salame', 'Pane artigianale, salame nostrano', 7.00, '/panino.png', 3, 'Panini', true)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to avoid primary key violation
SELECT setval('restaurants_id_seq', (SELECT MAX(id) FROM restaurants));
SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));
