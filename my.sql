-- Database: charan_mobiles_db

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    condition VARCHAR(50) NOT NULL, -- Brand New, Refurbished, Used
    actual_price NUMERIC(10, 2) NOT NULL,
    offer_price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    banner_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ebills (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    item_description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PAID', -- PAID, PARTIALLY PAID, UNPAID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL
);

-- Default Settings
INSERT INTO site_settings (key, value) VALUES
('bg_color', '#0e0e11'),
('slider_enabled', 'true'),
('shop_timing', '8:00 AM - 8:00 PM (Sunday Holiday)');
