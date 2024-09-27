const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DB;

//Allow api to accept json data
app.use(express.json());

//Connect to database
mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

//allow cross origin
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

//Import model
const Task = require('./Models/task.js');

// Defined routes
// Create a new task
app.post('/tasks', async (req, res) => {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({   
   message: err.message   
   });
    }
  });
  
  // Retrieve all tasks
  app.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message   
   });
    }
  });
  
  // Retrieve a single task by ID
  app.get('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (err) {
      res.status(500).json({ message:   
   err.message });
    }
  });
  
  // Update a task
  app.put('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!task)   
   {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a task   
  
  app.delete('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({   
   message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message   
   });
    }
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});