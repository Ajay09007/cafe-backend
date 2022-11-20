const express = require("express");
const app = express();
const port = 3000;

const jwt = require("jsonwebtoken");
var cors = require("cors");
app.use(cors());

var bodyParser = require("body-parser");
app.use(bodyParser.json());

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "schoolbackend_db",
});

connection.connect();
const jwtpass = "lhdkugskdhhsdggasshlaoikndjksgujdnsdshhlddhdhahalalha";

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query =
    "SELECT * FROM staffs WHERE username LIKE ? AND password LIKE ? ";
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        msg: "server error",
        data: [],
      });
    } else {
      if (result.length) {
        try {
          const token = jwt.sign({ user: result[0] }, jwtpass, {
            expiresIn: "1d",
          });
          res.status(200).send({
            success: true,
            msg: "Login Success",
            data: token,
          });
        } catch (err) {
          console.log(err);
          res.status(500).send({
            success: false,
            msg: "server error",
            data: [],
          });
        }
      } else {
        res.status(404).send({
          success: false,
          msg: "Wrong username and password.",
          data: [],
        });
      }
    }
  });
});

app.get("/get_all_students", (req, res) => {
  const token = req.headers["token"];
  console.log(token);
  try {
    const decoded = jwt.verify(token, jwtpass);
    const query = "SELECT * FROM students";
    connection.query(query, (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          msg: "server error",
          data: [],
        });
      } else {
        res.status(200).send({
          success: true,
          msg: "Success",
          data: result,
        });
      }
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Login Again",
      data: [],
    });
  }
});

app.get("/get_my_classrooms", (req, res) => {
    const token = req.headers["token"];
    // console.log(token);
    try {
      const decoded = jwt.verify(token, jwtpass);
      const staff_id =decoded.user.id;
      const query = "SELECT * FROM classroom WHERE staff_id= ?";
      connection.query(query, [staff_id], (err, result) => {
        if (err) {
          res.status(500).send({
            success: false,  
            msg: "server error",
            data: [],
          });
        } else {
          res.status(200).send({
            success: true,
            msg: "Success",
            data: result,
          });
        }
      });
    } catch (err) {
      res.status(401).send({
        success: false,
        msg: "Login Again",
        data: [],
      });
    }
  });


  app.post('/add_staff', (req, res) => {
    const token = req.headers['token'];
    
    try {
      const decoded = jwt.verify(token, jwtpass);
      const role = decoded.user.staff_role;
      console.log(30, decoded);
        if (role === "headmaster") {
            const staff_name = req.body.staff_name;
            const staff_role = req.body.staff_role;
            const username = req.body.username;
            const password = req.body.password;
            const query = "INSERT INTO staffs (staff_id, staff_name, staff_role, username, password) VALUES (NULL, ?, ?, ?, ?)";
            connection.query(query, [staff_name, staff_role, username, password], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        success: false,
                        msg: "server error",
                        data: []
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        msg: "Success",
                        data: result
                    })
                }
            });
        } else {
            res.status(401).send({
                success: false,
                msg: "You are not authorized",
                data: []
            })
        }
    } catch (err) {
        res.status(401).send({
            success: false,
            msg: "Login Again",
            data: []
        })
    }
})



app.listen(port, () => {
  console.log(`Example app listening on ${port}`);
});
