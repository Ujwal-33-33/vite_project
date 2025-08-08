import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Set axios to send credentials (cookies) with every request
axios.defaults.withCredentials = true;

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:3000';

    useEffect(() => {
        const fetchUserAndTodos = async () => {
            try {
                // Check if user is authenticated
                const userRes = await axios.get(`${API_BASE_URL}/api/user`);
                setUser(userRes.data.user);

                // If authenticated, fetch todos
                const todosRes = await axios.get(`${API_BASE_URL}/api/todos`);
                setTodos(todosRes.data);

            } catch (error) {
                console.error('Authentication check failed:', error);
                navigate('/login'); // Redirect to login if not authenticated
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndTodos();
    }, [navigate]);

    const addTodo = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const res = await axios.post(`${API_BASE_URL}/api/todos`, { text });
            setTodos([...todos, res.data]);
            setText('');
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const toggleTodo = async (id) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/api/todos/${id}`);
            setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/todos/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${API_BASE_URL}/auth/logout`);
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Your Todos</h1>
                    <p className="text-gray-400">Welcome, {user?.username}!</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Logout
                </button>
            </div>

            <form onSubmit={addTodo} className="flex mb-8">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a new todo..."
                    className="bg-gray-800 text-white w-full p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-r-lg transition duration-300"
                >
                    Add
                </button>
            </form>

            <ul className="space-y-3">
                {todos.map(todo => (
                    <li
                        key={todo._id}
                        className={`flex items-center justify-between p-4 rounded-lg transition duration-300 ${
                            todo.completed ? 'bg-gray-800 text-gray-500' : 'bg-gray-700'
                        }`}
                    >
                        <span
                            onClick={() => toggleTodo(todo._id)}
                            className={`cursor-pointer ${todo.completed ? 'line-through' : ''}`}
                        >
                            {todo.text}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo._id)}
                            className="text-gray-500 hover:text-red-500 transition duration-300"
                        >
                            &times;
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;