import * as utilities from "./utilities.js";

const billTable = document.getElementById("bill_table");
const orderTable = document.getElementById("order_table");
const cardTable = document.getElementById("card_table");
const customerTable = document.getElementById("customer_table");
const transactionTable = document.getElementById("transaction_table");
const createTableBtn = document.querySelector(".createTable");
const addOrderBtn = document.getElementById("addOrder");
const deleteOrderBtn = document.getElementById("deleteOrder");
const paymentBtn = document.getElementById("payment");
const addCustomerBtn = document.getElementById("addCustomer");
const deleteCustomerBtn = document.getElementById("deleteCustomer");
const deleteAllBillsBtn = document.getElementById("deleteAllBills");
const deleteAllOrdersBtn = document.getElementById("deleteAllOrders");
const deleteAllCardsBtn = document.getElementById("deleteAllCards");
const deleteAllCustomersBtn = document.getElementById("deleteAllCustomers");
const deleteAllTransactionsBtn = document.getElementById(
  "deleteAllTransactions"
);

// Create table with foreign keys
const billTableSql = `
CREATE TABLE IF NOT EXISTS bill (
    bill_id SERIAL PRIMARY KEY,
    cust_id INTEGER REFERENCES customers(id),  -- Added foreign key to customers
    total NUMERIC(10, 2) DEFAULT 0,
    tip NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0,
    card_id VARCHAR(16) REFERENCES cards(id),  -- Added foreign key to cards
    paid BOOLEAN DEFAULT false
);

INSERT INTO bill (cust_id, total, tip, tax, card_id, paid) VALUES
(1, 120.00, 10.00, 8.00, '1234567812345678', true),
(2, 85.50, 7.00, 5.00, '2345678923456789', false),
(3, 45.00, 3.00, 2.50, '3456789034567890', true),
(4, 200.00, 20.00, 15.00, '4567890145678901', true),
(5, 60.00, 5.00, 3.50, '5678901256789012', false),
(6, 150.75, 12.50, 10.25, '6789012367890123', true),
(7, 90.00, 6.00, 5.00, '7890123478901234', false),
(8, 75.25, 8.00, 4.25, '8901234589012345', true),
(9, 110.00, 9.00, 6.00, '9012345690123456', true),
(10, 130.00, 15.00, 7.50, '0123456701234567', false);
`;

const orderTableSql = `
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER REFERENCES bill(bill_id),  -- Foreign key to bill
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

INSERT INTO orders (bill_id, name, price, quantity) VALUES
(1, 'Pasta', 12.00, 2),
(1, 'Salad', 8.00, 1),
(2, 'Burger', 10.50, 1),
(2, 'Fries', 3.00, 1),
(3, 'Pizza', 15.00, 1),
(3, 'Soda', 2.50, 1),
(4, 'Steak', 25.00, 2),
(4, 'Wine', 12.50, 1),
(5, 'Tacos', 6.00, 3),
(5, 'Beer', 4.00, 2),
(6, 'Chicken Sandwich', 10.75, 1),
(6, 'Iced Tea', 2.50, 1),
(7, 'Burrito', 8.00, 1),
(8, 'Pasta', 12.00, 2),
(9, 'Salad', 8.00, 1),
(10, 'Burger', 10.50, 1);

`;

const cardTableSql = `
CREATE TABLE IF NOT EXISTS cards (
    id CHAR(16) PRIMARY KEY,
    name VARCHAR(20),
    ex_date VARCHAR(10),
    balance NUMERIC
);

INSERT INTO cards (id, name, ex_date, balance) VALUES
('1234567812345678', 'Alice Smith', '12/25', 500.00),
('2345678923456789', 'Bob Johnson', '11/24', 250.00),
('3456789034567890', 'Charlie Brown', '01/26', 100.00),
('4567890145678901', 'David Wilson', '02/27', 300.00),
('5678901256789012', 'Eve Davis', '03/25', 150.00),
('6789012367890123', 'Frank Moore', '04/26', 400.00),
('7890123478901234', 'Grace Lee', '05/27', 200.00),
('8901234589012345', 'Hannah King', '06/25', 350.00),
('9012345690123456', 'Ivy Clark', '07/24', 450.00),
('0123456701234567', 'Jack Hall', '08/26', 600.00);

`;

const txSql = `
CREATE TABLE IF NOT EXISTS transaction (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER REFERENCES bill(bill_id),  -- Foreign key to bill
    total NUMERIC(10, 2),
    from_bankacct VARCHAR(16) REFERENCES cards(id),  -- Foreign key to cards
    tdate DATE DEFAULT CURRENT_DATE,
    business_balance NUMERIC(10, 2)
);

INSERT INTO transaction (bill_id, total, from_bankacct, tdate, business_balance) VALUES
(1, 120.00, '1234567812345678', '2024-10-01', 5000.00),
(2, 85.50, '2345678923456789', '2024-10-02', 5000.00),
(3, 45.00, '3456789034567890', '2024-10-03', 5050.00),
(4, 200.00, '4567890145678901', '2024-10-04', 5100.00),
(5, 60.00, '5678901256789012', '2024-10-05', 5150.00),
(6, 150.75, '6789012367890123', '2024-10-06', 5200.00),
(7, 90.00, '7890123478901234', '2024-10-07', 5250.00),
(8, 75.25, '8901234589012345', '2024-10-08', 5300.00),
(9, 110.00, '9012345690123456', '2024-10-09', 5350.00),
(10, 130.00, '0123456701234567', '2024-10-10', 5400.00);

`;

const customerSql = `
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    phone VARCHAR(10),
    membership_point INTEGER DEFAULT 0  -- Fixed DEFAULT syntax
);

INSERT INTO customers (name, phone, membership_point) VALUES
('Alice Smith', '1234567890', 100),
('Bob Johnson', '2345678901', 50),
('Charlie Brown', '3456789012', 30),
('David Wilson', '4567890123', 75),
('Eve Davis', '5678901234', 60),
('Frank Moore', '6789012345', 45),
('Grace Lee', '7890123456', 90),
('Hannah King', '8901234567', 20),
('Ivy Clark', '9012345678', 110),
('Jack Hall', '0123456789', 80);
`;

const displayAllTables = function () {
  customerTable.style.display = "block";
  cardTable.style.display = "block";
  billTable.style.display = "block";
  orderTable.style.display = "block";
  transactionTable.style.display = "block";
};

window.onload = async function () {
  await utilities.fetchCustomers();
  await utilities.fetchCards();
  await utilities.fetchBill();
  await utilities.fetchOrders();
  await utilities.fetchTransaction();
  displayAllTables();
};

async function createTable(sql) {
  try {
    const response = await fetch("http://localhost:3000/createtable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }), // Ensure the body is correctly formatted
    });

    if (!response.ok) {
      // Check for error response status
      console.error("Server error:", response.status, response.statusText);
      const errorResponse = await response.json(); // Parse the error body
      console.error("Error details:", errorResponse.error);
      utilities.displayWarning(errorResponse.error);
      return;
    }

    const result = await response.json(); // Parse the response as JSON
    console.log("Table creation result:", result);
  } catch (error) {
    console.error("Error creating table:", error); // Catch any network or parsing errors
  }
}

createTableBtn.addEventListener("click", async () => {
  if (customerTable.style.display != "block") {
    await createTable(customerSql);
    await utilities.fetchCustomers();

    await createTable(cardTableSql);
    await utilities.fetchCards();

    await createTable(billTableSql);
    await utilities.fetchBill();

    await createTable(orderTableSql);
    await utilities.fetchOrders();

    await createTable(txSql);
    await utilities.fetchTransaction();

    displayAllTables();
  }
});

// billCreateBtn.addEventListener("click", () => {
//   createTable(billTableSql);
//   utilities.fetchBill();
//   billTable.style.display = "block";
//   billCreateBtn.style.display = "none";
// });
// orderCreateBtn.addEventListener("click", () => {
//   createTable(orderTableSql);
//   utilities.fetchOrders();
//   orderTable.style.display = "block";
//   orderCreateBtn.style.display = "none";
// });

// cardCreateBtn.addEventListener("click", () => {
//   createTable(cardTableSql);
//   utilities.fetchCards();
//   cardTable.style.display = "block";
//   cardCreateBtn.style.display = "none";
// });

// customerCreateBtn.addEventListener("click", () => {
//   createTable(customerSql);
//   utilities.fetchCustomers();
//   customerTable.style.display = "block";
//   customerCreateBtn.style.display = "none";
// });

// transactionCreateBtn.addEventListener("click", () => {
//   createTable(txSql);
//   utilities.fetchTransaction();
//   transactionTable.style.display = "block";
//   transactionCreateBtn.style.display = "none";
// });

addOrderBtn.addEventListener("click", async () => {
  await utilities.addOrders();
});
deleteOrderBtn.addEventListener("click", async () => {
  await utilities.deleteOrders();
});
paymentBtn.addEventListener("click", async () => {
  await utilities.payment();
});
addCustomerBtn.addEventListener("click", async () => {
  await utilities.addCustomer();
});
deleteCustomerBtn.addEventListener("click", async () => {
  await utilities.deleteCustomer();
});

deleteAllBillsBtn.addEventListener("click", async () => {
  await utilities.deleteAllBills();
  await utilities.fetchBill();
});
deleteAllOrdersBtn.addEventListener("click", async () => {
  await utilities.deleteAllOrders();
  await utilities.fetchOrders();
});
deleteAllCardsBtn.addEventListener("click", async () => {
  await utilities.deleteAllCards();
  await utilities.fetchCards();
});
deleteAllCustomersBtn.addEventListener("click", async () => {
  await utilities.deleteAllCustomers();
  await utilities.fetchCustomers();
});
deleteAllTransactionsBtn.addEventListener("click", async () => {
  await utilities.deleteAllTransactions();
  await utilities.fetchTransaction();
});
