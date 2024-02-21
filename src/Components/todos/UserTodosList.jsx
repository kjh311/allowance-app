import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';
import "./todo.scss";

function UserTodosList() {
  const [userTodos, setUserTodos] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        if (!currentUser || !currentUser.uid) {
          console.log('No currentUser found or currentUser uid is undefined');
          return;
        }

        const q = query(collection(db, 'todos'), where('assignedTo', '==', currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const todosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('User Todos:', todosData);
          setUserTodos(todosData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user todos:', error);
      }
    };

    fetchUserTodos();
  }, [currentUser]);

  return (
    <div className="user-todos-list">
      <h2>Your Todos</h2>
      {userTodos.map(todo => (
        <div key={todo.id} className="todo-box">
          <div className="todo-item">
            <p><strong>Name:</strong> {todo.name}</p>
            <p><strong>Description:</strong> {todo.description}</p>
            <p><strong>Money:</strong> ${todo.money}</p>
            <p><strong>Points:</strong> {todo.points}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserTodosList;
