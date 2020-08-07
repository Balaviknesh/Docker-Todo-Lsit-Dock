var express = require('express');
const app = express();
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

//Socket.io
var server = app.listen(3000);
var io = require('socket.io').listen(server);
//Socket.io Listener
io.on('connection', (socket) => {
  console.log('Socket connection is live');
  socket.on('disconnect', ()=>{
    console.log("socket disconnected")
  })

});
//Mongo DB
const url = 'mongodb://mongodb:27017';
// Database Name
const dbName = 'TodoListDB';

/* POST add task. */
router.post('/addTask', function(req, res) {

  if(req){

    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to Mongo server");
      const db = client.db(dbName);
      const collection = db.collection('tasks')
      collection.insertOne({name: req.body.name, status: false}, (err, result) => {
        if(err){
          console.log("Error: "+ err.toString())
          client.close()
          res.send({status: 'fail', error: err})
        }
        else{
          console.log("New Task Added "+ result.insertedId)
          io.emit('newTask', {_id: result.insertedId, name: req.body.name, status: false});
          client.close()
          res.send({status: 'success'})


        }
      })


    });

  }
  else{
    res.send({status: 'fail', error: 'Invalid Request'})
  }

});

/* GET tasks. */
router.get('/getTasks', function(req, res) {

  if(req){

    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to Mongo server");
      const db = client.db(dbName);
      output = []
      db.collection('tasks').find().toArray((err, items) => {
        if (err){
          console.log("Error: " + err)
          client.close()
        }
        console.log("Got all tasks")
        client.close()
        res.send({result: items})
      })



    });
  }
  else{
    res.send({status: 'fail', error: 'Invalid Request'})
  }

});

/* GET clear completed tasks. */
router.get('/clearCompletedTasks', function(req, res) {

  if(req){

    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to Mongo server");
      const db = client.db(dbName);
      output = []
      db.collection('tasks').deleteMany({status: {$eq : true}}, function (err, obj){

        if(err){
          console.log('Error: ' + err.toString())
          client.close()
          res.send({status: 'fail', error: err})
        }
        else{
          console.log("Deleted objects: " + obj.result.n)
          client.close()
          res.send({status: 'success', result:obj.result.n})

        }

      });
        }
    );
  }
  else{
    res.send({status: 'fail', error: 'Invalid Request'})
  }

});

/* POST update task. */
router.post('/updateTask', function(req, res) {

  if(req){

    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      const collection = db.collection('tasks')
      console.log(req.body._status)

      collection.updateOne({_id: ObjectID(req.body._id)}, {'$set': {'status': !req.body._status}}, (err, result) => {

        if(err){
          console.log(err.toString())
          client.close()
          res.send({status: 'fail', error: err})
        }
        else{
          console.log("Task updated: " + req.body._id)
          io.emit('taskUpdate', {_id: req.body._id, status: !req.body._status});
          client.close()
          res.send({status: 'success'})

        }
      })

    });
  }
  else{
    res.send({status: 'fail', error: 'Invalid Request'})
  }

});


module.exports = router;
