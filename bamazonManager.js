// Required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

// MySQL connection parameters
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'rootroot',
	database: 'bamazonDB'
});

// promptManagerAction function will present menu options to the manager and trigger appropriate logic
function promptManagerAction() {

	// Prompts the manager to select an option
	inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (val) {
				if (val === 'View Products for Sale') {
					return 'sale';
				} else if (val === 'View Low Inventory') {
					return 'lowInventory';
				} else if (val === 'Add to Inventory') {
					return 'addInventory';
				} else if (val === 'Add New Product') {
					return 'newProduct';
				} else {
					console.log('ERROR: Unsupported operation!');
					exit(1);
				}
			}
		}
	]).then(function(input) {
		// Triggers the appropriate action based on the user input
		if (input.option ==='sale') {
			displayInventory();
		} else if (input.option === 'lowInventory') {
			displayLowInventory();
		} else if (input.option === 'addInventory') {
			addInventory();
		} else if (input.option === 'newProduct') {
			createNewProduct();
		} else {
			console.log('ERROR: Unsupported operation!');
			exit(1);
		}
	})
}

// displayInventory function will retrieve the current inventory from the database and output it to the console.
function displayInventory() {

	// Constructs the database query string.
	queryStr = 'SELECT * FROM products';

	// Creates the database query.
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

        console.log('...................\n');
        console.log('Existing Inventory: ');
        console.log('\n...................\n');
        console.log("---------------------------------------------------------------------------------------------------\n");

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  |  ';
			strOut += 'Product Name: ' + data[i].product_name + '  |  ';
			strOut += 'Department: ' + data[i].department_name + '  |  ';
			strOut += 'Price: $' + data[i].price + '  |  ';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

			console.log(strOut);
		}

          console.log("---------------------------------------------------------------------------------------------------\n");
		promptManagerAction();
	})
}

// displayLowInventory function will display a list of products with the available quantity less than 10.
function displayLowInventory() {

	// Constructs the database query string.
	queryStr = 'SELECT * FROM products WHERE stock_quantity < 20';

	// Creates the database query.
	connection.query(queryStr, function(err, data) {
		if (err) throw err;
        console.log('\n...............................');
		console.log('Low Inventory Items (UNDER 20): ');
        console.log('...............................\n');
        console.log("---------------------------------------------------------------------------------------------------\n");        

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  |  ';
			strOut += 'Product Name: ' + data[i].product_name + '  |  ';
			strOut += 'Department: ' + data[i].department_name + '  |  ';
			strOut += 'Price: $' + data[i].price + '  |  ';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

			console.log(strOut);
		}

        console.log("---------------------------------------------------------------------------------------------------\n");
		promptManagerAction();
	})
}

// validateInteger function makes sure that the user is supplying only positive integers for their inputs.
function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

// validateNumeric function makes sure that the user is supplying only positive numbers for their inputs.
function validateNumeric(value) {
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}

// addInventory function will guilde a user in adding additional quantify to an existing item.
function addInventory() {

	// Prompts the user to select an item.
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID for stock_count update.',
			validate: validateInteger,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?',
			validate: validateInteger,
			filter: Number
		}
	]).then(function(input) {
		// console.log('Manager has selected: \n    item_id = '  + input.item_id + '\n    additional quantity = ' + input.quantity);
		var item = input.item_id;
        var addQuantity = input.quantity;
        
        // Query db to confirm that the given item ID exists.
        // Also determines the current stock count.
		var queryStr = 'SELECT * FROM products WHERE ?';

        // Creates the database query.
		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
                console.log("######################################################");
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                console.log("######################################################");
				addInventory();
                } 
            else {
				var productData = data[0];
				// console.log('productData = ' + JSON.stringify(productData));
				// console.log('productData.stock_quantity = ' + productData.stock_quantity);
				console.log('Updating Inventory...');

				// Constructs the updating query string.
				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;

				// Update the inventory based off user input.
				connection.query(updateQueryStr, function(err, data) {
                    if (err) throw err;
                    console.log("---------------------------------------------------------------------------------------------------\n");
					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
                    console.log("---------------------------------------------------------------------------------------------------\n");

					promptManagerAction();
				})
			}
		})
	})
}

// createNewProduct function will guide the user in adding a new product to the inventory.
function createNewProduct() {
	// console.log('___ENTER createNewProduct___');

	// Prompt the user to enter information about the new product.
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit?',
			validate: validateNumeric
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?',
			validate: validateInteger
        }
        
	]).then(function(input) {
		// console.log('input: ' + JSON.stringify(input));
		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									        'department_name = ' + input.department_name + '\n' +  
									        'price = ' + input.price + '\n' +  
									        'stock_quantity = ' + input.stock_quantity);

		// Creates the insertion query string.
		var queryStr = 'INSERT INTO products SET ?';

		// Adds the new product to the database.
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			// Ends the database connection.
			connection.end();
		});
	})
}

// runBamazon function executes the main application.
function runBamazon() {
	// Prompt manager for input.
	promptManagerAction();
}

runBamazon();