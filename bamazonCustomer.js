/* Project Instructions (what this code does)

First, look at the bamazon.sql file. In it is the SQL to do the following
1. Create a MySQL Database called bamazon. 
2. Create a table inside of that database called products.
3. Add the following columns to the products table
    item_id (unique id for each product)
    product_name (Name of product)
    department_name
    price (cost to customer)
    stock_quantity (how much of the product is available in stores)
4.  Populate this database with around 10 different products. I made this a "nautical-themed" store -- products for the active boat captain.

Second, in this file ()

Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.
Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
However, if your store does have enough of the product, you should fulfill the customer's order.
This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.


*/

var mysql        = require("mysql");
var inquirer     = require("inquirer");
var markdownTable = require("markdown-table"); //markdown-table is a package that we'll use to neatly print the product table to console
var outTable     = []; //use this global to hold our products table when we want to echo it to console

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // null password
  password: "",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  
  // run the start function after the connection is made to prompt the user
  start();
});

function tableize(results) {
  //Push the table header row onto outTable array 
  outTable.push(['Item ID','Product Name','Department','Price','In Stock QTY']);
  for (var i = 0; i< results.length; i++) {
    //Turn each row of results into an array of strings
    var oneRow=[results[i].id,results[i].product_name,results[i].department_name,results[i].price,results[i].stock_quantity];
    //And push each row of results onto our output table
    outTable.push(oneRow);
  }
  
  var printTable = markdownTable(outTable);
  console.log("\n"+printTable.toString()+"\n");
}


// function which prompts the user for what action they should take
function start() {
  // First, echo the available products to the console
  connection.query("SELECT * FROM products",function(err,res) {
    if (err) throw err;
  
    tableize(res); // Output the products table in a nice format to the console
    
  connection.end();
  });
}

