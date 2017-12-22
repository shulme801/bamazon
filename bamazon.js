var mysql        = require("mysql");
var inquirer     = require("inquirer");
var markdownTable = require("markdown-table");
var outTable     = []; //use this guy to hold our products table when we want to echo it to console

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
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

