require('dotenv').config();
let mysql = require('mysql');
let question = require('inquirer');

let DB = mysql.createDB({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});
DB.connect(function (error) {
    if (error) {
        console.log(error);
        return;
    }
    console.log('Connected to: ' + DB.threadId);
});
let readQuery = 'SELECT * FROM products';
DB.query(readQuery, function (err, result, fields) {
    if (err) {
        console.log(err);
        return;
    }
    for (let i = 0; i < result.length; i++) {
        const res = result[i];
        console.log('\nItem ID: ' + res.item_id + '\nProduct Name: ' + res.product_name + '\nDepartment: ' + res.department_name + '\nPrice: ' + res.price + '\nStock: ' + res.stock_quantity);
    }
    question.prompt([{
        name: 'id',
        message: 'Input the ID of the item you would like to  purchace'
    },
    {
        name: 'qty',
        message: 'How many would you like?'
    }]).then(res => {
        if (isNaN(res.id) || isNaN(res.qty)) {
            console.log('Invalid ID or Quantity');
            DB.end();
            return;
        }
        if (result[(res.id - 1)].stock_quantity < res.qty) {
            console.log('Insufficent Supply ya fool');
            DB.end();
            return;
        }
        let sum = result[(res.id - 1)].price * res.qty;

        let query = 'UPDATE products SET stock_quantity = ' + (result[(res.id - 1)].stock_quantity - res.qty) + 'WHERE item_id = ' + res.id;

        DB.query(query, (err, result, fields) => {
            if (err) {
                console.log(err);
            }
            console.log('Order total: $' + sum.toFixed(2));
            DB.end(err => {
                if (err) console.log(err)
            });
        })
    })
});
