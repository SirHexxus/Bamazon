//  Global Constants and Variables
//  //  Required Modules
const mysql = require("mysql")
const inquirer = require("inquirer")
const dotenv = require("dotenv").config()

//  //  Connection config data
const connection = mysql.createConnection({
	multipleStatements: true,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: "bamazon",
	user: process.env.DB_USER,
	password: process.env.DB_PASS
})

//  //  Inquirer Questions
const questions = [
	{
		type: "input",
		name: "id",
		message: "Which Item Would You Like To Purchase? (By Item_Id)"
	},
	{
		type: "input",
		name: "amount",
		message: "How Many of This Item Would You Like?"
	}
]

//  //  Global Variables
let holding

//  //  Prettifying
const bottomBorder = "-=- =-= ".repeat(4)
const clear = "\n".repeat(75)
//  - - - - - - - - - - - - - - -

//  Global Function Definitions

//  //  Makes query to the Database
const makeQuery = (query) => {
	connection.connect((err) => {
        if(err) {
            console.log('Connection Error:');
            console.log(err.code);
            console.log(err.fatal);
            console.log(err);
        }
        console.log('Connection Opened!');
	})

	connection.query(query, (err, res) => {
		if (err) {
            console.log('Query Error:');
			console.log(err.code);
			console.log(err.fatal);
			console.log(err)
		}
		console.log('Here are the results!\n' + JSON.stringify(res));
	})

	connection.end(err => {
		if (err) {
            console.log('Connection End Error:');
			console.log(err.code);
			console.log(err.fatal);
			console.log(err);
        }
        console.log('Connection Closed!');
    })
    
    return holding;
}

// const getProducts = async (columns, table) => {

//     let promise = new Promise(function(resolve, reject){
//         let columnQuery = columns.join(', ');
//         connection.query('SELECT ' + columnQuery + " FROM " + table + ";", (err, res) => {
//             if(err) {
//                 reject(err)
//             }
//             console.log(bottomBorder);
//             for(let i = 0; i < res.length; i++) {
//                 for(let j = 0; j < columns.length; j++) {
//                     if(columns[j] === 'price') {
//                         console.log(columns[j] + ':\t\t$' + res[i][columns[j]]);
//                     }
//                     else {
//                         console.log(columns[j] + ':\t' + res[i][columns[j]]);
//                     }
//                 }
//                 console.log(bottomBorder);
//             }
//             resolve(res)
//         })
//     })

//     return promise;

// }

// const updateStock = (table, id, num) => {
//     connection.connect(function(err) {
//         console.log(err.code);
//         console.log(err.fatal);
//         console.log(err);
//       });

//     connection.query('SELECT stock_quantity FROM ' + table + ' WHERE item_id = ?', [id], (err, res) => {
//         if(err) {
//             console.log(err.code);
//             console.log(err.fatal);
//             return console.log(err);
//         }
//         holding = res;
//         console.log('This is holding: ' + JSON.stringify(holding[0]));
//     })

//     if(holding.stock_quantity > num) {
//         let number = holding.stock_quantity - num;
//         connection.query('UPDATE ' + table + ' SET stock_quantity = ? WHERE item_id = ?',[ number, id ], (err, res) => {
//             if(err) {
//                 console.log(err.code);
//                 console.log(err.fatal);
//                 return console.log(err);
//             }
//             return res;
//         })
//     }
// }

// async function test(){

//     //  //  Makes Query to 'products' table
//     let query = [ "item_id", "product_name", "price" ];
//     await getProducts( query, "products" );
//     let answers = await inquirer.prompt(questions);
//     console.log(clear + bottomBorder);
//     console.log( JSON.stringify( updateStock('products', answers.id, answers.amount) ) );

// }

//  - - - - - - - - - - - - - - -

//  Events/Event Listeners

//  //  Listens for Configuration Errors in `dotenv`
if (dotenv.error) {
    console.log(dotenv.error);
}

//  //  Connects to Bamazon Database
// connection.connect(err => {
// 	if (err) {
// 		console.error("error connecting: " + err.stack)
// 		return
// 	}
// })

makeQuery('SELECT * FROM products;');

//  //  Makes Query to 'products' table
/* 
let query = [ "item_id", "product_name", "price" ];
getProducts( query, "products" );


inquirer.prompt( questions ).then( answers => {
    console.log( JSON.stringify(answers, null, '  ') )

})*/

//  //  Closes connection to Bamazon Database
/* connection.end( (err) => {
    if(err) throw err;
}) */

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