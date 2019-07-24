-- Drop bamazon database if it curently exists

DROP DATABASE IF EXISTS bamazonDB;

-- create "bamazonDB"
CREATE DATABASE bamazonDB;

-- USE code
USE bamazonDB;

-- create table called products with columns for item_id, product_name, department_name, price, stock_quantity
CREATE TABLE products (
item_id INTEGER (11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR (50) NOT NULL,
department_name VARCHAR (50) NOT NULL,
price DECIMAL (10, 2) NOT NULL,
stock_quantity INTEGER (50) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES 
    ('MacBook', 'Technology', 4000.00, 5),
    ('Notepad', 'School', 4.99, 20),
    ('Cooler', 'Social', 39.99, 10),
    ('TV', 'Appliances', 699.99, 6),
    ('Apple Watch', 'Watches', 499.99, 65),
    ('Raybans', 'Sunglasses', 200.00, 15),
    ('Rain Jacket', 'Clothing', 100.00, 50),
    ('Jordans', 'Shoes', 349.99, 25),
    ('Call Of Duty', 'Games', 59.99, 100),
    ('Couch', 'Furniture', 499.99, 10);

SELECT * FROM products