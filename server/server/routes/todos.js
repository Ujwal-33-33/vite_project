const router = require('express').Router();
const Todo = require('../model/Todo');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: You must be logged in.' });
    }
};

// GET all todos for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new todo
router.post('/', isAuthenticated, async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        userId: req.user.id // Associate todo with the logged-in user
    });
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (update) a todo's completed status
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or you do not have permission.' });
        }
        todo.completed = !todo.completed;
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a todo
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
         if (!todo) {
            return res.status(404).json({ message: 'Todo not found or you do not have permission.' });
        }
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;