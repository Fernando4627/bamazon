var mysql = require('mysql');
var question = require('inquirer');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fernja46',
    database: 'bamazon'
});
connection.connect(function (error) {
    if (error) {
        console.log(error);
        return;
    }
    console.log('Connected to: ' + connection.threadId);
    selectAll();

    connection.end();
});
function selectAll(){
    console.log('your connected');
    let readQuery = 'SELECT * FROM products';
    connection.query(readQuery, function(err, q1){
        if(err){
            console.log(err);
            return;
        }
        for (let i = 0; i < q1.length; i++) {
            const res = q1[i];
            console.log( '\nItem ID: ' +res.item_id +'\nProduct Name: ' +res.product_name +'\nDepartment: ' +res.department_name +'\nPrice: ' +res.price +'\nStock: ' +res.stock_quantity); 
        }
       
    });
};