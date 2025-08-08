const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    // Reference to the user who created the todo
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user', // This must match the model name we gave to mongoose.model() for the User
        required: true
    }
});

const Todo = mongoose.model('todo', todoSchema);
module.exports = Todo;