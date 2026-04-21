CREATE DATABASE ecommerce;
USE ecommerce;

-- Table to store customer details

CREATE TABLE customers( id int auto_increment primary key,
name VARCHAR(100),
email VARCHAR(100),
address VARCHAR(255)
);

-- Table to store product details

CREATE TABLE products ( id int auto_increment primary key,
name VARCHAR(100),
price DECIMAL(10,2),
description TEXT
);

-- Table to store order details

create table orders ( id int auto_increment primary key,
customer_id int,
order_date date,
total_amount decimal(10,2),
foreign key (customer_id) references customers(id)
);

-- Inserting data into Customers

INSERT INTO customers (name, email, address) VALUES
('John Doe', 'john@example.com', 'New York'),
('Alice Smith', 'alice@example.com', 'California'),
('Bob Johnson', 'bob@example.com', 'Texas');

-- Inserting data into Products

INSERT INTO products (name, price, description) VALUES
('Product A', 30.00, 'Description A'),
('Product B', 20.00, 'Description B'),
('Product C', 40.00, 'Description C');

-- Inserting data into Orders

INSERT INTO orders (customer_id, order_date, total_amount) VALUES
(1, CURDATE() - INTERVAL 10 DAY, 100.00),
(2, CURDATE() - INTERVAL 20 DAY, 200.00),
(1, CURDATE() - INTERVAL 40 DAY, 150.00);

-- Retrieve all customers who have placed an order in the last 30 days.

select c.name
from customers c , orders o
where c.id = o.customer_id
and o.order_date >= curdate() - interval 30 day ;

-- Get the total amount of all orders placed by each customer.

SELECT c.name, SUM(o.total_amount)
FROM customers c, orders o
WHERE c.id = o.customer_id
GROUP BY c.name;

-- Update the price of Product C to 45.00

UPDATE products
SET price = 45.00
WHERE name = 'Product C';

-- Add a new column discount to the products table.

ALTER TABLE products
ADD discount DECIMAL(5,2);

-- Retrieve the top 3 products with the highest price

SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;

-- Get the names of customers who have ordered Product A.

SELECT DISTINCT c.name
FROM customers c, orders o, order_items oi, products p
WHERE c.id = o.customer_id
AND o.id = oi.order_id
AND oi.product_id = p.id
AND p.name = 'Product A';

-- Join the orders and customers tables to retrieve the customer's name and order date for each order. 

SELECT c.name, o.order_date
FROM customers c, orders o
WHERE c.id = o.customer_id;

-- Retrieve the orders with a total amount greater than 150.00.

SELECT *
FROM orders
WHERE total_amount > 150;

-- Normalize the database by creating a separate table for order items and updating the orders table to reference the order_items table.

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT
);

-- Retrieve the average total of all orders.

SELECT AVG(total_amount)
FROM orders;