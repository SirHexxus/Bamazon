//  Global Constants and Variables
//  //  Required Modules
const mysql     = require('mysql');
const inquirer  = require('inquirer');
const dotenv    = require("dotenv").config();

//  //  Connection config data
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    database : 'bamazon',
    user     : process.env.DB_USER,
    password : process.env.DB_PASS
  });

//  //  Inquirer Questions
const questions = [
    {
        type    : 'input',
        name    : 'id',
        message : 'Which Item Would You Like To Purchase? (By Item_Id)'
    },
    {
        type    : 'input',
        name    : 'amount',
        message : 'How Many of This Item Would You Like?'
    }
]

//  //  Prettifying
const bottomBorder = "-=- =-= ".repeat(4);
//  - - - - - - - - - - - - - - -

//  Global Function Definitions

//  //  Makes query to the Database



const makeQuery = async (columns, table) => {
    
    let promise = new Promise(function(resolve, reject){
        let columnQuery = columns.join(', ');
        connection.query('SELECT ' + columnQuery + " FROM " + table, (err, res) => {
            if(err) {
                reject(err)
            }
            console.log(bottomBorder);
            for(let i = 0; i < res.length; i++) {
                for(let j = 0; j < columns.length; j++) {
                    if(columns[j] === 'price') {
                        console.log(columns[j] + ':\t\t$' + res[i][columns[j]]);
                    }
                    else {
                        console.log(columns[j] + ':\t' + res[i][columns[j]]);
                    }
                }
                console.log(bottomBorder);
            }
            resolve(res)
        })
    })

    return promise;
    
    
}

async function test(){

    //  //  Makes Query to 'products' table
    let query = [ "item_id", "product_name", "price" ];
    await makeQuery( query, "products" );
    let answers = await inquirer.prompt(questions)
    console.log( JSON.stringify(answers, null, '  ') )

}

//  - - - - - - - - - - - - - - -

//  Events/Event Listeners

//  //  Listens for Configuration Errors in `dotenv`
if(dotenv.error) throw dotenv.error;

//  //  Connects to Bamazon Database
connection.connect( (err) => {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

})

test()

//  //  Makes Query to 'products' table
/* 
let query = [ "item_id", "product_name", "price" ];
makeQuery( query, "products" );

//  //  Prompt number 1
inquirer.prompt( questions ).then( answers => {
    console.log( JSON.stringify(answers, null, '  ') )

})*/

//  //  Closes connection to Bamazon Database
connection.end( (err) => {
    if(err) throw err;
})

//  - - - - - - - - - - - - - - -

//  Instructions
/* Create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
The app should then prompt users with two messages.
   The first should ask them the ID of the product they would like to buy.
   The second message should ask how many units of the product they would like to buy.
Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
   If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
However, if your store _does_ have enough of the product, you should fulfill the customer's order.
   This means updating the SQL database to reflect the remaining quantity.
   Once the update goes through, show the customer the total cost of their purchase.
 */