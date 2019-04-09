//npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initializes the connection to sync w/ MySQL database
var connection = mysql.createConnection({
    host: "localhost",

    // My port; 3306
    port: 3306,

    // My username
    user: "root",

    // My password
    password: "",
    database: "bernyZon"
});

// Connect to server, load product once connected
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    loadProducts();
});

// brings in prod table from the db and print results to the console
function loadProducts() {
    // Selects all data from MySQL products table
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        // Draw table in the terminal w/ response
        console.table(res);

        // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
        promptCustomerForItem(res);
    });
}

// Prompt the customer for a product ID
function promptCustomerForItem(inventory) {
    // Prompts user for what they would like to purchase
    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "What would you like to purchase?",
            validate: function(val) {
                return !isNaN(val) || val.toLowerCase() === "q";
            }
        }])
        .then(function(val) {
            // Does user want to exit?
            checkIfShouldExit(val.choice);
            var choiceId = parseInt(val.choice);
            var product = checkInventory(choiceId, inventory);

            // User choice is avail and need qty# of items
            if (product) {
                // Pass product to promptCustomerForQuantity
                promptCustomerForQuantity(product);
            } else {
                // Otherwise if not in inventory, re-run loadProducts
                console.log("\nItem not available in stock.");
                loadProducts();
            }
        });
}

// Ask for product quantity
function promptCustomerForQuantity(product) {
    inquirer
        .prompt([{
            type: "input",
            name: "quantity",
            message: "How many would you like? (Q = Quit)",
            validate: function(val) {
                return val > 0 || val.toLowerCase() === "q";
            }
        }])
        .then(function(val) {
            // Does the user want to exit?
            checkIfShouldExit(val.quantity);
            var quantity = parseInt(val.quantity);

            // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
            if (quantity > product.stock_quantity) {
                console.log("\nInsufficient quantity!");
                loadProducts();
            } else {
                // Otherwise run makePurchase, give it the product information and desired quantity to purchase
                makePurchase(product, quantity);
            }
        });
}

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantity, product.item_id],
        function(err, res) {
            // Inform purchase was successful, re-run loadProducts
            console.log(
                "\nSuccessfully purchased " +
                quantity +
                " " +
                product.product_name +
                "'s!"
            );
            loadProducts();
        }
    );
}

// Does the product choice exists?
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            // product is found? return the product
            return inventory[i];
        }
    }
    // Or return null - nada - nothing
    return null;
}

// User choice to quit the app
function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
        // Log a Goodbye message and exit node process
        console.log("Adios, Goodbye, Bon-jour!");
        process.exit(0);
    }
}