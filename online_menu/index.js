const express = require ("express");
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
  database: "online_menuu",
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


  app.get("/get_all", (req, res) => {
    const query = "SELECT * FROM categories";
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
  
  app.get("/getitemsbycat_id/:cat_id", (req, res)=>{
    const ajay = req.params.cat_id;
    const query = "SELECT items.* FROM items, categories WHERE categories.cat_id = ? AND categories.cat_id = items.cat_id";
    connection.query(query, [ajay], (err, result) => {
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
  })

app.get("/get_all_items", (req, res) => {
  const query = "SELECT * FROM items";
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


app.post("/add_items", (req, res) => {
    const item_name = req.body.item_name;
    const query = "INSERT INTO `items` (item_name) VALUES (?)";
    connection.query(query, [item_name], (err, result) => {
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

  app.put("/update_items/:item_id", (req, res) => {
    const xyz = req.params.item_id;
    const item_name = req.body.item_name;
    const item_id = req.body.item_id;
   
    const query ="UPDATE items SET item_name = ?, item_id =? WHERE item_id=?";
    connection.query(query, [item_name, item_id, xyz],
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
            msg: "data updated",
            data: result,
          });
        }
      }
    );
  });

  app.delete("/delete_items/:item_id", (req, res) =>{
    const ajay = req.params.item_id;
    const query = "DELETE FROM items WHERE item_id = ?";
    connection.query(query, [ajay], (err, result) =>{
      if (err) {
        res.status(500).send({
          success: false,
          msg: err.sqlMessage,
          data: [],
        });
      } else {
        res.status(200).send({
          success: true,
          msg: "data updated",
          data: result,
        });
      }
    }
  );
});

app.get('/getitemsbycatid/:cat_id',  (req, res) =>{
  const cat_id  = req.params.cat_id;
  const query = "SELECT items.* FROM items, categories WHERE categories.cat_id = ? AND  categories.cat_id = items.cat_id;"
  connection.query(query, [cat_id], (err, result) =>{
    if(err){
      res.status(500).send({
        success : false,
        msg : 'server error',
        data : []
      })
    }else{
      res.status(200).send({
        success : true,
        msg : "data get",
        data : result
      })
    }
  })
} )

  const port = 2030;
  app.listen(port);