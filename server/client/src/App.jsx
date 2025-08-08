import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>
    </div>
  );
}

export default App;

