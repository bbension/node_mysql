CREATE DATABASE bernyZon;

USE bernyZon;

CREATE TABLE products
(
    item_id INT
    AUTO_INCREMENT NOT NULL,
product_name VARCHAR
    (50) NOT NULL,
department_name VARCHAR
    (50) NOT NULL,
price DECIMAL
    (10,2) NOT NULL,
stock_quantity INT
    (10) NOT NULL,
primary key
    (item_id)
);

    SELECT *
    FROM products;

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("Charmin", "Toilet Trees", 2.99, 550),
        ("Colgate", "Toilet Trees", 9.99, 200),
        ("Diapers", "Baby Care", 39.99, 100),
        ("Wipes", "Baby Care", 11.00, 500),
        ("Captain Crunch", "Groceries", 4.25, 50),
        ("Yogurt", "Groceries", 2.50, 45),
        ("Rice", "Groceries", 9.99, 50),
        ("Beans", "Groceries", 1.50, 75),
        ("Milk", "Groceries", 5.50, 60),
        ("Eggs", "Groceries", 4.95, 50);





