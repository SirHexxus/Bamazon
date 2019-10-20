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

//  //  Inquirer Questions and variables
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

let idNum = 0;
let numSold = 0;
let toPrompt = false;

//	//	Queries
const listItems = 'SELECT item_id, product_name, price FROM products;';

//  //  Prettifying
const bottomBorder = "-=- =-= ".repeat(4)
const clear = "\n".repeat(75)
//  - - - - - - - - - - - - - - -

//  Global Function Definitions

//  //  Makes query to the Database
const makeQuery = (query, func) => {
	connection.connect((err) => {
        if(err) {
            console.log('Connection Error:');
            console.log(err.code);
            console.log(err.fatal);
            return console.log(err);
        }
        // console.log('Connection Opened!');
	})

	connection.query(query, (err, res) => {
		if (err) {
            console.log('Query Error:');
			console.log(err.code);
			console.log(err.fatal);
			return console.log(err)
		}
        func(res);
	})

	connection.end(err => {
		if (err) {
            console.log('Connection End Error:');
			console.log(err.code);
			console.log(err.fatal);
			return console.log(err);
        }
        // console.log('Connection Closed!');
    })
}

const printList = (data) => {
	console.log(bottomBorder);
    for(let i = 0; i < data.length; i++) {
		// console.log(res[i]);
        for(let x in data[i]) {
			// console.log(x);
			// console.log(res[i][x]);
            if(x === 'price') {
                console.log(x + ':\t\t$' + data[i][x]);
            }
            else {
                console.log(x + ':\t' + data[i][x]);
            }
		}
		console.log(bottomBorder);
	}
	if(toPrompt) {
		inquirer.prompt( questions ).then( answers => {
			soldQuery( answers.id, answers.amount, data.price );
		})

	}
}

const soldQuery = (id, sold, price) => {
	connection.connect((err) => {
        if(err) {
            console.log('Connection Error:');
            console.log(err.code);
            console.log(err.fatal);
            return console.log(err);
        }
        // console.log('Connection Opened!');
	})

	let query = 'SELECT stock_quantity FROM products WHERE item_id = ' + id;
	connection.query(query, (err, res) => {
		if (err) {
            console.log('Query Error:');
			console.log(err.code);
			console.log(err.fatal);
			return console.log(err)
		}
		console.log(res);
		let toUse = compare(res.stock_quantity, sold);
		if(!toUse) {
			console.log('Sorry, we don\'t have enough of those. We only have ' + res.stock_quantity + ' remaining.');
		}
		else {
			connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[ toUse, id ], (err, res) => {
				if(err) {
					console.log('Query Error:');
					console.log(err.code);
					console.log(err.fatal);
					return console.log(err)
				}
				console.log('Final Price = $' + (sold * price));
			})
		}
	})

	connection.end(err => {
		if (err) {
            console.log('Connection End Error:');
			console.log(err.code);
			console.log(err.fatal);
			return console.log(err);
        }
        // console.log('Connection Closed!');
    })
}

const compare = (toCompare, compared) => {
	if(toCompare > compared) {
		return toCompare - compared;
	}
	else {
		return false;
	}
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

toPrompt = true;
makeQuery(listItems, printList);

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