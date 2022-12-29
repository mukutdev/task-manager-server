const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
//middleware
app.use(cors());
app.use(express.json());



//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5qu391.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const taskCollections = client.db("TaskDatabase").collection("allTasks");

        //add task api
        app.post('/addTask' , async(req , res)=>{
            const task = req.body;
            const result = await taskCollections.insertOne(task);
            res.send(result);
        })

        


    }
    finally{

    }

}
run().catch(err => console.log(err))




app.get("/", (req, res) => {
    res.send("server is up and running");
  });

  app.listen(port, () => {
    console.log("server listening on port", port);
  });
  