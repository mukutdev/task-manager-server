const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        //getting task based on incomplete or completed task

    app.get("/allTask",  async (req, res) => {
        const email = req.query.email;
        // const query = {};
        const status = req.query.status;
        const tasks = await taskCollections.find({$and : [{email : email} , {status : status}]}).toArray();
        res.send(tasks);
      });

      // delete api
      app.delete("/allTask/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const task = await taskCollections.deleteOne(query)
        res.send(task);
      });

      //update task
      app.put("/allTask/:id" , async(req , res)=>{
        const {id} = req.params
        const taskData = req.body
        console.log(taskData);
        const updatedTask = await taskCollections.updateOne({_id : ObjectId(id)} , {$set : taskData})
        res.send(updatedTask)
     
      })

      // mark completed
      app.put("/allTask/update/:id" , async(req , res)=>{
        const id = req.params.id
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
              status : { status: status === 'incomplete' ? 'complete' : 'incomplete' }
            },
          };
          const result = await taskCollections.updateOne(
            filter,
            updatedDoc,
            options
          );
          res.send(result);

      })

      //get task count
      app.get('/allTask/count' , async(req , res)=>{
           
        const email = req.query.email
           //get total task count
           const totalTask = await taskCollections.count({email : email})
           //get total completed task
           const completedTask = await taskCollections.count({email : email , status : "completed"})
           //get total incomplete task 
           const incompleteTask = await taskCollections.count({email : email , status : "incomplete"})

           res.send({
            totalTask,
            completedTask,
            incompleteTask
           })

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
  