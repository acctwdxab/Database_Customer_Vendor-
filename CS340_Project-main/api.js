var express = require("express");
var app = express();
app.set("port", 9988);
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());
var { connection } = require("./dbcon");

const getAllQuery = "SELECT * FROM workouts";
const insertQuery = "INSERT INTO workouts (id, name, reps, weight, unit, date) VALUES (?, ?, ?, ?, ?, ?)";
const updateQuery = "UPDATE workouts SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=?";
const deleteQuery = "DELETE FROM workouts WHERE id=?";

// Establish a connection w/ SQL server
connection.connect((err) => {
    if (err) throw err;

    // Create workouts table
    connection.query("DROP TABLE IF EXISTS workouts", function(err) {
        var createString =
            "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "unit BOOLEAN," +
            "date DATE)";
        connection.query(createString, function(err) {
            if (err) {
                console.log("error in creating workouts table", err);
                return;
            }
            // Query workouts table
            connection.query("SELECT * FROM workouts", (err, rows) => {
                if (err) throw err;

                console.log("Data received from Db:");
                console.log(rows);
            });
        });
        console.log("created workouts table");
    });
    console.log("Connected!");
});

// NODE SERVER
app.listen(app.get("port"), function() {
    console.log("Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});

function getAllData(res) {
    connection.query(getAllQuery, function(err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.json({ rows });
    });
}

// INSERT
app.post("/", function(req, res, next) {
    var { name, reps, weight, unit, date, id } = req.body;
    console.log("adding row", req.body);
    connection.query(insertQuery, [id, name, reps, weight, unit, date], function(err, result) {
        if (err) {
            next(err);
            return;
        }
        getAllData(res);
    });
});

// DELETE
app.delete("/", function(req, res, next) {
    connection.query(deleteQuery, [req.body.id], function(err, result) {
        if (err) {
            next(err);
            return;
        }
        getAllData(res);
    });
});

// UPDATE
app.put("/", function(req, res, next) {
    var { name, reps, weight, unit, date, id } = req.body;
    console.log("updating row", req.body);
    connection.query(updateQuery, [name, reps, weight, unit, date, id], function(err, result) {
        if (err) {
            next(err);
            return;
        }
        getAllData(res);
    });
});

// RESET
app.get("/reset", function(req, res, next) {
    console.log("resetting table");
    connection.query("DROP TABLE IF EXISTS workouts", function(err) {
        if (err) return;
        var createString =
            "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "unit BOOLEAN)";
        connection.query(createString, function(err) {
            if (err) return;
            connection.query("SELECT * FROM workouts", (err, rows) => {
                if (err) throw err;
                console.log("Data received from Db:");
                res.send(rows);
            });
        });
    });
});