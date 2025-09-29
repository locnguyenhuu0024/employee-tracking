const { where } = require("firebase/firestore");
const { getTasks, addOrUpdate, get } = require("../services/firebaseService");

// CRUD TASK
const createTask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }

    if (!req.body) {
      return res.status(400).json({ status: 'error', message: 'Missing request body' });
    }

    const data = { 
      ...req.body, 
      ownerId: req.user.id, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(), 
      isDeleted: false, 
      employeeId: req.body?.employee?.id ? req.body?.employee?.id : null,
    };

    const task = await addOrUpdate("tasks", data);
    res.status(200).json({ status: 'ok', message: 'Create task successfully', data: task });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Create task failed' });
  }
};

const readTask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }

    const { id } = req.params;

    const task = await get("tasks", id);
    if (!task) {
      return res.status(400).json({ status: 'error', message: 'Task not found' });
    }

    res.status(200).json({ status: 'ok', message: 'Read task successfully', data: task });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Read task failed' });
  }
};

const updateTask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }

    if (!req.body) {
      return res.status(400).json({ status: 'error', message: 'Missing request body' });
    }

    const { id } = req.params;

    const task = await get("tasks", id);
    if (!task) {
      return res.status(400).json({ status: 'error', message: 'Task not found' });
    }

    if(req.user.role === 'employee' && task.employeeId !== req.user.id) {
      return res.status(400).json({ status: 'error', message: 'You do not have permission to update task' });
    }

    if(req.user.role === 'owner' && task.ownerId !== req.user.id) {
      return res.status(400).json({ status: 'error', message: 'You do not have permission to update task' });
    }

    if(req.user.role === 'employee') {
      delete req.body.isDeleted;
    }
    const data = { ...task,...req.body, updatedAt: new Date().toISOString() };

    await addOrUpdate("tasks", data, id);
    res.status(200).json({ status: 'ok', message: 'Update task successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Update task failed' });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }

    if(req.user.role === 'employee') {
      return res.status(400).json({ status: 'error', message: 'You do not have permission to delete task' });
    }

    const { id } = req.params;

    const task = await get("tasks", id);
    if (!task) {
      return res.status(400).json({ status: 'error', message: 'Task not found' });
    }

    await addOrUpdate("tasks", { ...task, isDeleted: true, updatedAt: new Date().toISOString() }, id);
    res.status(200).json({ status: 'ok', message: 'Delete task successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Delete task failed' });
  }
};

const readTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }
    let tasks = []
    if(req.user.role === "owner") {
      const query = [where("ownerId", "==", req.user.id), where("isDeleted", "==", false)]
      tasks = await get("tasks", null, query);
    } else if(req.user.role === "employee") {
      const query = [where("ownerId", "==", req.user.ownerId), where("employeeId", "==", req.user.id), where("isDeleted", "==", false)]
      tasks = await get("tasks", null, query);
    }
    res.status(200).json({ status: 'ok', message: 'Read tasks successfully', data: tasks });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Read tasks failed' });
  }
}

module.exports = { createTask, readTask, updateTask, deleteTask, readTasks };
