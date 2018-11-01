require('dotenv').config();
let mysql = require('mysql');
let question = require('inquirer');

let DB = mysql.createConnection({
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
        let resloop = result[i];
        console.log('\nItem Number: ' + i + '\nItem ID: ' + resloop.item_id + '\nProduct Name: ' + resloop.product_name + '\nDepartment: ' + resloop.department_name + '\nPrice: ' + resloop.price + '\nStock: ' + resloop.stock_quantity);
    }
    question.prompt([{
        name: 'item_id',
        message: 'Input the number of the item you would like to purchace'
    },
    {
        name: 'qty',
        message: 'How many would you like?'
    }]).then(res => {
        if (isNaN(res.item_id) || isNaN(res.qty)) {
            console.log('Invalid ID or Quantity');
            DB.end();
            return;
        }
        if (result[res.item_id].stock_quantity < res.qty) {
            console.log('Insufficent Supply ya fool');
            DB.end();
            return;
        }
        let sum = result[res.item_id].price * res.qty;

        let change = 'UPDATE products SET stock_quantity = ' + (result[res.item_id].stock_quantity - res.qty) + ' WHERE item_id = ' + result[res.item_id].item_id;

        DB.query(change, (err, result, fields) => {
            if (err) {
                console.log(result[res.item_id].stock_quantity);
                console.log(err);
                console.log('QUERY STRING: ' + change);
            }
            console.log('Order total: $' + sum.toFixed(2));
            DB.end(err => {
                if (err) console.log(err)
            });
        })
    })
});
