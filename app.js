const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const connectToDb = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://deepaktirumalasetty:hello@cluster0.dnmfc.mongodb.net/MERN_PRJ?retryWrites=true&w=majority&appName=Cluster0"
        );
        console.log("---------- ✅ Database Connected ---------");
        console.log("------------------------------------------");
    } catch (err) {
        console.log("-------- ❌ Database NOT Connected -------");
        console.log("------------------------------------------");
    }
};


connectToDb();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Task = mongoose.model("Task", taskSchema);

// Get all tasks
app.get("/tasks", async (req, res) => {
    // console.log("Connected")
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
