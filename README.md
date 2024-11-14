DBS30
HOW TO RUN OUR PROGRAM
Step 1: Install dependencies:
npm install express pg body-parser cors

Step 2: Create database named "restaurant" in your localhost by using this command
"CREATE DATABASE restaurant;"

Step 3 : in config.json file, input your database user, password and port in this following format
{
"user": "",
"password": "",
"port":
}

step 4: in your terminal, run "node server.js" to run back end server side

step 5: open another terminal, run "node app.js" to run front end HTML

step 6:If the tables are empty, click on "create table" button to add example datas to tables on your local machine

step 7: In the "Add Order", enter:
Bill number: 11
Dish's name: chicken wings
Price: 12.99
-Quantity: 2
-Hit button "add order"
--> Order table and Bill table will be added new bill and new order
(1 Bill number can make multiple orders)

step 8: In the "Payment", enter:
Bill number: 11
Customer ID: 5
Tip: 7.00
Card number (search on Card Table): 6789012367890123
--> Bill table, Card table and Transaction table will be updated
