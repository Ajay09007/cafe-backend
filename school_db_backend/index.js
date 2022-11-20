const express = require("express");
const app = express();

const bodyparser = require("body-parser");
app.use(bodyparser.json());

const cors = require("cors");
app.use(cors());

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "school_db",
});

connection.connect((err) => {   
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/get_all_students", (req, res) => {
  const query = "SELECT * FROM students";
  connection.query(query, (err, result) => {
    if (err) {
      console.log("server error");
      res.status(500).send({
        success: false,
        msg: "Server Error",
        data: [],
      });
    } else {
      console.log("succesfully...");
      res.send({
        success: true,
        msg: "succesfully...",
        data: result,
      });
    }
  });
});

app.get("/get_all_std", (req, res) => {
  const query = "SELECT * FROM std";
  connection.query(query, (err, result) => {
    if (err) {
      console.log("server error");
      res.status(501).send({
        success: false,
        msg: err.sqlMessage,
        data: [],
      });
    } else {
      console.log(res);
      res.send({
        success: true,
        msg: "data get successfully",
        data: result,
      });
    }
  });
});

app.post("/add_std", (req, res) => {
  const class_name = req.body.class_name;
  const query = "INSERT INTO `std` (class_name) VALUES (?)";
  connection.query(query, [class_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(501).send({
        success: false,
        msg: "server error",
        data: [],
      });
    } else {
      console.log(res);
      res.status(200).send({
        success: true,
        msg: "DATA FETCHES SUCCESSFULLY",
        data: result,
      });
    }
  });
});

app.get("/get_students_by_std_id/:std_id", (req, res) => {
  console.log("Hello");
  const std_id = req.params.std_id;
  const query =
    "SELECT students.student_name, std.* FROM students, std WHERE students.std_id= ? AND students.std_id = std.std_id";
  connection.query(query, [std_id], (err, result) => {
    console.log(err);
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        msg: "server error",
        data: [],
      });
    } else {
      res.send({
        success: true,
        msg: "success",
        data: result,
      });
    }
  });
});

app.post("/add_students", (req, res) => {
  const student_name = req.body.student_name;
  const std_id = req.body.std_id;
  const roll_no = req.body.roll_no;
  const gender = req.body.gender;

  const query =
    "INSERT INTO students(student_name, std_id, roll_no, gender) VALUES(?,?,?,?)";
  connection.query(
    query,
    [student_name, std_id, roll_no, gender],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          success: false,
          msg: "server error",
          data: [],
        });
      } else {
        res.status(201).send({
          success: true,
          msg: "data fetched successfully",
          data: result,
        });
      }
    }
  );
});

app.put("/update_students/:id", (req, res) => {
  const xyz = req.params.id;
  const student_name = req.body.student_name;
  const std_id = req.body.std_id;
  const roll_no = req.body.roll_no;
  const gender = req.body.gender;
  const query =
    "UPDATE students SET student_name = ?, std_id =?,  roll_no = ?, gender = ? WHERE std_id=?";
  connection.query(
    query,
    [student_name, std_id, roll_no, gender, xyz],
    (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          msg: err.sqlMessage,
          data: [],
        });
      } else {
        res.status(200).send({
          success: true,
          msg: "data aupdated",
          data: result,
        });
      }
    }
  );
});

app.delete("/delete_students/:id", (req, res) => {
  const std_id = req.params.id;
  const query = "DELETE FROM students WHERE std_id = ?";
  connection.query(query, [std_id], (err, result) => {
    if (err) {
      res.status(500).send({
        success: false,
        msg: "server error",
        data: [],
      });
    } else {
      res.status(201).send({
        success: true,
        msg: "done",
        data: result.affectedRows,
      });
    }
  });
});

app.put("/done_admission/:id", (req, res) => {
  const xyz = req.params.id;
  const admission = req.body.admission;
  const query = "UPDATE std SET admission = ? WHERE std_id =?";
  connection.query(query, [admission, xyz], (err, result) => {
    if (err) {
      res.status(500).send({
        success: false,
        msg: "server error",
        data: [],
      });
    } else {
      res.status(201).send({
        success: true,
        msg: "done",
        data: result.affectedRows,
      });
    }
  });
});

const port = 4050;
app.listen(port);
