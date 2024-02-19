import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

function ChildTodoList({ childId }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query todos where assignedTo field matches the childId
        const todosQuery = query(collection(db, 'todos'), where('assignedTo', '==', childId));
        const todosSnapshot = await getDocs(todosQuery);

        // Extract todo data from snapshot
        const todosData = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTodos(todosData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTodos();
  }, [childId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="child-todo-list">
      <h2 style={{ fontSize: 'larger', textDecoration: 'underline' }}>Todos Assigned to Child</h2>
      {todos.length === 0 ? (
        <p>No todos assigned to this child.</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id} style={{ borderRadius: '8px', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p>Name: {todo.name}</p>
              <p>Description: {todo.description}</p>
              <p>Money: ${todo.money}</p>
              <p>Points: {todo.points}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChildTodoList;
