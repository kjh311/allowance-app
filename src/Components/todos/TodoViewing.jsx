import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { db } from '../../firebase/firebase';

function TodoViewing() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    console.log("Reading todos data from database...");
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Todos data read:");
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, []);

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      console.log(`Todo with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error.message);
    }
  };

  return (
    <div className="todo-list-container">
      {todos.map(todo => (
        <div key={todo.id} className="todo-item border border-gray-300 p-4 mb-4 rounded-md">
          <p>Name: {todo.name}</p>
          <p>Description: {todo.description}</p>
          <p>Money: ${todo.money}</p>
          <p>Points: {todo.points}</p>
          <div className="flex">
            <button
              onClick={() => console.log("Edit todo")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
            >
              <FaEdit className="mr-2" /> {/* Edit icon */}
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
            >
              <FaTrash className="mr-2" /> {/* Delete icon */}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoViewing;
