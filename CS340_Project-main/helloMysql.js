var express = require('express');
var mysql = require('./dbcon.js');
var cors = require('cors')

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(express.static('public'))
app.use(cors())
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', 48421);

const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function checkIfAlphaNumeric(str) {
  str = str.toString();
  for (var i = 0; i < str.length; i++) {
    console.log(str.charAt(i));
    if(!nums.includes(str.charAt(i))) {
      return true;
    }
  }
  return false;
}

function checkIfNonDate(str) {
  str = str.toString();
  var cnt = 0;
  for (var i = 0; i < str.length; i++) {
    if(str.charAt(i) === '-') {
      cnt++;
    }
  }
  return cnt !== 2;
}

//Select whole table
app.get('/Customer',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Customer', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

// Search filter on Customer
app.get('/Customer_Filtered',function(req,res,next){
  var context = {};
  var stringSearchKey = `"${req.query.searchKey}"`;
  var numericSearchKey = !checkIfAlphaNumeric(req.query.searchKey) ? req.query.searchKey : 9999999999123;

  // Union of all column searches
  mysql.pool.query(`
  SELECT * FROM Customer WHERE email = ${stringSearchKey} UNION DISTINCT 
  SELECT * FROM Customer WHERE entityName = ${stringSearchKey} UNION DISTINCT 
  SELECT * FROM Customer WHERE customerID = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Customer WHERE location = ${stringSearchKey} 
  `,
   function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

app.get('/Purchase_Order',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Purchase_Order', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

// Search filter on Purchase Order
app.get('/Purchase_Order_Filtered',function(req,res,next){
  var context = {};
  var numericSearchKey = !checkIfAlphaNumeric(req.query.searchKey) ? req.query.searchKey : 9999999999123;
  var dateSearchKey = !checkIfNonDate(req.query.searchKey) ? req.query.searchKey : '00-00-00';
  var stringSearchKey = `"${req.query.searchKey}"`;
  console.log('numericSearchKey', numericSearchKey);
  
  // Union of all column searches
  mysql.pool.query(`
  SELECT * FROM Purchase_Order WHERE customerID = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Purchase_Order WHERE purchaseOrderDate = ${dateSearchKey} UNION DISTINCT 
  SELECT * FROM Purchase_Order WHERE purchaseOrderNumber = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Purchase_Order WHERE dollarAmount = ${numericSearchKey} 
  `,
   function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

app.get('/Contract_Sales_Order',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Contract_Sales_Order', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

// Search filter on Contract Sales Order
app.get('/Contract_Sales_Order_Filtered',function(req,res,next){
  var context = {};
  var numericSearchKey = !checkIfAlphaNumeric(req.query.searchKey) ? req.query.searchKey : 999999123;
  var stringSearchKey = `"${req.query.searchKey}"`;
  console.log('numericSearchKey', numericSearchKey);
  
  // Union of all column searches
  mysql.pool.query(`
  SELECT * FROM Contract_Sales_Order WHERE customerID = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Contract_Sales_Order WHERE purchaseOrderNumber = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Contract_Sales_Order WHERE completed = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Contract_Sales_Order WHERE serviceType = ${stringSearchKey} UNION DISTINCT 
  SELECT * FROM Contract_Sales_Order WHERE dollarAmount = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Contract_Sales_Order WHERE salesOrderNumber = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Contract_Sales_Order WHERE location = ${stringSearchKey}
  `,
   function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

app.get('/Field_Service_Engineer',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Field_Service_Engineer', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

// Search filter on Field Service Engineer
app.get('/Field_Service_Engineer_Filtered',function(req,res,next){
  var context = {};
  var numericSearchKey = !checkIfAlphaNumeric(req.query.searchKey) ? req.query.searchKey : 999999123;
  var stringSearchKey = `"${req.query.searchKey}"`;
  console.log('numericSearchKey', numericSearchKey);

  // Union of all column searches
  mysql.pool.query(`
  SELECT * FROM Field_Service_Engineer WHERE supervisorID = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Field_Service_Engineer WHERE department = ${stringSearchKey} UNION DISTINCT 
  SELECT * FROM Field_Service_Engineer WHERE jobTitle = ${stringSearchKey} UNION DISTINCT 
  SELECT * FROM Field_Service_Engineer WHERE employeeID = ${numericSearchKey} 
  `,
   function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

app.get('/Field_Service_Report',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Field_Service_Report', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

// Search filter on Field Service Report
app.get('/Field_Service_Report_Filtered',function(req,res,next){
  var context = {};
  var numericSearchKey = !checkIfAlphaNumeric(req.query.searchKey) ? req.query.searchKey : 9999999999123;
  console.log('numericSearchKey', numericSearchKey);
  
  // Union of all column searches
  mysql.pool.query(`
  SELECT * FROM Field_Service_Report WHERE salesOrderNumber = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Field_Service_Report WHERE reportID = ${numericSearchKey} UNION DISTINCT 
  SELECT * FROM Field_Service_Report WHERE employeeID = ${numericSearchKey} 
  `,
   function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

//Select one item with the primary key
app.get('/get_one_Customer',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Customer WHERE customerID=?',[req.query.customerID], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

app.get('/get_one_Purchase_Order',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Purchase_Order WHERE purchaseOrderNumber=?',[req.query.purchaseOrderNumber], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

app.get('/get_one_Contract_Sales_Order',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Contract_Sales_Order WHERE salesOrderNumber=?',[req.query.salesOrderNumber], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

app.get('/get_one_Field_Service_Engineer',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Field_Service_Engineer WHERE employeeID=?',[req.query.employeeID], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

app.get('/get_one_Field_Service_Report',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Field_Service_Report WHERE reportID=?',[req.query.reportID], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
  });
});

//INSERT
app.get('/insert_Customer',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO Customer (`email`,`entityName`,`location`) VALUES (?,?,?)", [req.query.email, req.query.entityName, req.query.location], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "ID:" + result.insertId;
    res.send(context.results);

  });
});

app.get('/insert_Purchase_Order',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO Purchase_Order (`customerID`,`purchaseOrderDate`,`dollarAmount`) VALUES (?,?,?)", [req.query.customerID, req.query.purchaseOrderDate, req.query.dollarAmount], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "ID:" + result.insertId;
    res.send(context.results);

  });
});

app.get('/insert_Contract_Sales_Order',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO Contract_Sales_Order (`customerID`,`purchaseOrderNumber`,`completed`,`serviceType`,`dollarAmount`,`location`) VALUES (?,?,?,?,?,?)", [req.query.customerID, req.query.purchaseOrderNumber, req.query.completed, req.query.serviceType, req.query.dollarAmount, req.query.location], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "ID:" + result.insertId;
    res.send(context.results);

  });
});

app.get('/insert_Field_Service_Engineer',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO Field_Service_Engineer (`supervisorID`,`department`,`jobTitle`) VALUES (?,?,?)", [req.query.supervisorID, req.query.department, req.query.jobTitle], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "ID:" + result.insertId;
    res.send(context.results);

  });
});

app.get('/insert_Field_Service_Report',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO Field_Service_Report (`salesOrderNumber`,`employeeID`) VALUES (?,?)", [req.query.salesOrderNumber, req.query.employeeID], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "ID:" + result.insertId;
    res.send(context.results);

  });
});

//DELETE
app.get('/delete_Customer',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM Customer WHERE customerID=?", [req.query.customerID], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/delete_Purchase_Order',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM Purchase_Order WHERE purchaseOrderNumber=?", [req.query.purchaseOrderNumber], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/delete_Contract_Sales_Order',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM Contract_Sales_Order WHERE salesOrderNumber=?", [req.query.salesOrderNumber], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/delete_Field_Service_Engineer',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM Field_Service_Engineer WHERE employeeID=?", [req.query.employeeID], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/delete_Field_Service_Report',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM Field_Service_Report WHERE reportID=?", [req.query.reportID], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});


//UPDATE
app.get('/update_Customer',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE Customer SET email=?, entityName=?, location=? WHERE customerID=? ",
    [req.query.email, req.query.entityName, req.query.location, req.query.customerID],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/update_Purchase_Order',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE Purchase_Order SET customerID=?, purchaseOrderDate=?, dollarAmount=? WHERE purchaseOrderNumber=? ",
    [req.query.customerID, req.query.purchaseOrderDate, req.query.dollarAmount, req.query.purchaseOrderNumber],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/update_Contract_Sales_Order',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE Contract_Sales_Order SET customerID=?, purchaseOrderNumber=?, completed=?, serviceType=?, dollarAmount=?, location=? WHERE salesOrderNumber=? ",
    [req.query.customerID, req.query.purchaseOrderNumber, req.query.completed, req.query.serviceType,  req.query.dollarAmount, req.query.location, req.query.salesOrderNumber],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});


app.get('/update_Field_Service_Engineer',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE Field_Service_Engineer SET supervisorID=?, department=?, jobTitle=? WHERE employeeID=? ",
    [req.query.supervisorID, req.query.department, req.query.jobTitle, req.query.employeeID],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/update_Field_Service_Report',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE Field_Service_Report SET salesOrderNumber=?, employeeID=? WHERE reportID=? ",
    [req.query.salesOrderNumber, req.query.employeeID, req.query.reportID],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});

//RESET and CREATE
app.get('/reset_Customer',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS Customer", function(err){
	var createString = "CREATE TABLE Customer("+
	"customerID INT NOT NULL unique AUTO_INCREMENT,"+
	"email VARCHAR(255) NOT NULL,"+
	"entityName VARCHAR(255) NOT NULL,"+
	"location VARCHAR(45) NOT NULL,"+
	"PRIMARY KEY (customerID))";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.get('/reset_Purchase_Order',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS Purchase_Order", function(err){ 
    var createString = "CREATE TABLE Purchase_Order("+
    "purchaseOrderNumber INT NOT NULL unique AUTO_INCREMENT,"+
    "customerID INT NOT NULL,"+
	"purchaseOrderDate DATE NOT NULL,"+
	"dollarAmount INT NOT NULL,"+
	"PRIMARY KEY (purchaseOrderNumber),"+
	"FOREIGN KEY (customerID) REFERENCES Customer(customerID) ON DELETE CASCADE)";	
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.get('/reset_Contract_Sales_Order',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS Contract_Sales_Order", function(err){ 
    var createString = "CREATE TABLE Contract_Sales_Order("+
    "salesOrderNumber BIGINT NOT NULL unique AUTO_INCREMENT,"+
    "customerID INT NOT NULL,"+
	"purchaseOrderNumber INT NOT NULL,"+
	"completed TINYINT NOT NULL,"+
	"serviceType VARCHAR(255) NOT NULL,"+
	"dollarAmount INT,"+
	"location VARCHAR(45) NOT NULL,"+
	"PRIMARY KEY (salesOrderNumber),"+
	"FOREIGN KEY (customerID) REFERENCES Customer(customerID) ON DELETE CASCADE,"+
	"FOREIGN KEY (purchaseOrderNumber) REFERENCES Purchase_Order(purchaseOrderNumber) ON DELETE CASCADE)";	
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.get('/reset_Field_Service_Engineer',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS Field_Service_Engineer", function(err){ 
    var createString = "CREATE TABLE Field_Service_Engineer("+
    "employeeID INT NOT NULL unique AUTO_INCREMENT,"+
	"supervisorID INT NOT NULL,"+
	"department VARCHAR(255) NOT NULL,"+
	"jobTitle VARCHAR(255) NOT NULL,"+
	"PRIMARY KEY (employeeID))";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.get('/reset_Field_Service_Report',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS Field_Service_Report", function(err){ 
    var createString = "CREATE TABLE Field_Service_Report("+
    "reportID INT NOT NULL unique AUTO_INCREMENT,"+
    "salesOrderNumber BIGINT,"+
	"employeeID INT,"+
	"PRIMARY KEY (reportID),"+
	"FOREIGN KEY (salesOrderNumber) REFERENCES Contract_Sales_Order(salesOrderNumber) ON DELETE SET NULL,"+
	"FOREIGN KEY (employeeID) REFERENCES Field_Service_Engineer(employeeID) ON DELETE SET NULL)";	
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});



//Error Handler
app.use(function(req,res){
  res.status(404);
  res.send('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
