DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) default 0.00,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);


insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Nikon Binoculars", "Nautical", 599.99,20);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Astra Sextant", "Nautical", 359.99,18);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Anchor", "Nautical", 359.99,25);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("XL Captain Awesome T-Shirt", "Clothing", 9.99,3);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Sperry Topsiders Size 13", "Clothing", 59.99,13);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Pistachio Ice Cream", "Food", 3.99,5);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Ribeye Steak -- 12 oz", "Food", 11.00,5);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Big Smelly Cigar", "Nautical", 5.99,12);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Compass", "Nautical", 249.99,3);

SELECT * FROM products;