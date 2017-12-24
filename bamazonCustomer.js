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

Second, in this file (bamazonCustomer.js) is an application that will 
1. Display all of the items available for sale. Included are the ids, names, and prices of products for sale.
2. Prompt users with two messages.
   Ask them the ID of the product they would like to buy.
   Ask how many units of the product they would like to buy.
3. The code then places the customer's order.
4. Once the order has been placed, check whether store (i.e. products table in bamazon_DB) has enough of the product to meet the customer's request.
5. If there is not enough stock, console.log "Insufficient quantity!" and do not process the order.
6. Else (there is enough quantity), update the products table.stock_quantity by the number of units in the order and
     console.log the total cost of customer's purchase (number of unitsxprice per unit).

*/

var mysql         = require("mysql");
var inquirer      = require("inquirer");
var colors        = require("colors"); //the colors npm lets us colorize console output
var markdownTable = require("markdown-table"); //markdown-table is a package that we'll use to neatly print the product table to console
var outTable      = []; //use this global to hold our products table when we want to echo it to console
var maxProducts   = 0;

/*************************************************************/
/* the following logic creates the connection to the mySQL
   database, and invokes the "start" function which, in turn,
   will start up the store product display and shopping logic*/

// First, create the connection information for the sql database
var connection    = mysql.createConnection({
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
  
  // run the start function after the connection is made to let user enter the store
  start();
});


/******************************************************************************/
/*
    formatPrice is a helper function  that makes sure that the cents
    we display are correct (e.g., 11.00 in the database comes into
    the results object as 11; similarly, 11.50 in the database comes into
    the results object as 11.5). formatPrice corrects these values by adding
    either one or two zeroes to the "cents" part of the price. Finally, it 
    prepends a "$" to the price.                                              */
/******************************************************************************/

function formatPrice(inputPrice) {
  var formattedPrice = inputPrice;
  var priceAry = inputPrice.toString().split('.');
  
  /*If the "." is omitted or does not occur in inputPrice
    the array returned contains one element consisting of the entire string.*/
  if (priceAry.length === 1) {
    //the input price was an even dollar amount
    formattedPrice += ".00";
  } else {
    var len = priceAry[1].length;
    switch (len) {
      case 1: //only one cents digit, so add a zero to the end
        formattedPrice += "0";
        break;
      case 2: //we have 2 cents digits, so we don't need to do anything
        break;
      default: //we have more than two cents digits, so we need to lop off the extras (we aren't going to round them up)
        var cents = priceAry[1].toString().substring(0,2); //0 is pos of 1st char to include, 2 is pos of 1st char not to include
        formattedPrice = priceAry[0].toString()+"."+cents;
    }
  }
    
  formattedPrice = "$"+formattedPrice;
  return formattedPrice;
  
}

/******************************************************************************/
/* The next functions (tableize, showProducts) are invoked to
    display the contents of the database's Products table. */
/******************************************************************************/

function tableize(results) {
  //Push the table header row onto outTable array 
  outTable.push(['Item ID','Product Name','Department','Price','In Stock QTY']);
  maxProducts = 0;
  for (var i = 0; i< results.length; i++) {
    //Turns each row of results into an array of strings
    
    displayPrice = formatPrice(results[i].price); // fix the "cents" part of the price, and prepend a "$"
   
    var oneRow=[results[i].id,results[i].product_name,results[i].department_name,displayPrice,results[i].stock_quantity];
    //And push each row of results onto our output table
    outTable.push(oneRow);
    maxProducts++;
  }
  showProducts();
}

function showProducts() {
  var printTable = markdownTable(outTable);
  console.log("------".cyan);
  console.log("\n-------- Products Available ---------------".magenta);
  console.log("\n"+printTable.toString()+"\n");

};

/*******************************************************************************/
/* Now, we come to the functions that do the work of starting the store display,
   and letting the user shop.*/
/********************************************************************************/


// this is the function that drives the "customer experience"
function start() {    
    isReadyToShop();
    connection.destroy;
    return;
}

/***************************************************************************/
/* Here are the shopping functions. "isReadyToShop" finds out whether the
   user wants to shop, or wants to quit shopping. If user wants to shop, 
   goShopping is called to let user enter an order. At the end of goShopping
   we make a recursive call to isReady to shop to continue the shopping 
   experience, or quit shopping.*/
/**************************************************************************/

function isReadyToShop() {
  
  inquirer.prompt ([
  {
    name: 'shopIt',
    type: 'confirm',
    message: 'Are you ready to shop?'
  }
  ]).then (function(answer){
   
    if (answer.shopIt) {
      connection.query("SELECT * FROM products",function(err,tableContents) {
      if (err) throw err;
      outTable=[];
      tableize(tableContents); // Output the current products table in a nice format to the console
      goShopping();
    });
      

    } else {
      console.log("BYE!");
      return;
    }
  });

}

/***************************************************************************/
/* The following pair of validation functions are used by the inquirer
    prompts in goShopping to validate that user has input a valid productID
    (numeric and within the range of valid productIDs) and a numeric 
    quantity to purchase.*/
/**************************************************************************/
function validateInputNum(inputNum){
  var reg = /^\d+$/;
  return reg.test(inputNum) || "input should be a number!";
}

function validateProductID(productID){

  // Note that we set maxProducts when we read in the products table from the database
  var result = productID <= maxProducts ? true : "invalid Product ID -- try again";
  return result;
}

/*************************************************************************************/
/* The goShopping function, that gets the ProductID user wants to by, as 
   well as the quantity user wishes to purchase. The productID and Quantity 
   get validated by the validate functions. If the Quantity desired is 
   greater than the quantity of product on hand, we give user an error message and 
   we don't fill order. If the Quantity desired is <= quantity of product on hand   
   we fill the order by deducting Quantity desired from quantity on hand, and tell
   user the total price.  
   At the end of goShopping we make a recursive call to isReadyToShop so that user
   can either continue the shopping or quit the app.*/
/*************************************************************************************/

function goShopping() {
  inquirer.prompt([
  {
        name: "ProductID",
        type: "input",
        message: "What is the ID of the product you would like to buy?",
        //Validate: checks whether the user typed a response
        validate: function(value) {
        // Make sure the typed value is a number and that it's within the range of valid product IDs.

          return ((validateInputNum(value))&&(validateProductID(value)));
        }
  }, 
  {
        name: "Quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            return validateInputNum(value);
        }
  }
    ]).then(function(answer) {
        var query = 'SELECT * FROM Products WHERE id=' + answer.ProductID;
        connection.query(query, function(err, res) {
          if (err) throw err;
          //no error -- let's see if we can fill the order
          if (answer.Quantity <= res[0].stock_quantity) {
            //we can fill the order
            console.log("Your order for "+answer.Quantity+" units of "+res[0].product_name+" will be filled");
            var newQTY = res[0].stock_quantity - answer.Quantity;
            var unitPrice = res[0].price; //save off cost per unit
            query = "UPDATE products SET stock_quantity=" + newQTY + " WHERE id="+answer.ProductID;
            connection.query(query, function(err, res) {
              if (err) throw err;
              purchaseTotal = formatPrice(answer.Quantity*unitPrice);
              console.log("Your total cost is "+purchaseTotal);
              isReadyToShop();
            });
          } else {
            console.log("\nSorry -- not enough stock to fill your order!\n");
            isReadyToShop();
          }
          

        })
    });
}
