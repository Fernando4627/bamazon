-- create database bamazon;
select * from products;
create table products(
item_id integer unique not null,
product_name varchar(100) not null,
department_name varchar(100) not null,
price integer not null,
stock_quantity integer not null,
primary key (item_id)
);