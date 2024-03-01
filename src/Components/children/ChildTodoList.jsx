import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

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
        const todosQuery = query(
          collection(db, "todos"),
          where("assignedTo", "==", childId)
        );
        const todosSnapshot = await getDocs(todosQuery);

        // Extract todo data from snapshot
        const todosData = todosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTodos();
  }, [childId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="child-todo-list">
      <h2 className="text-xl font-semibold mb-4">Todos Assigned to Child</h2>
      {todos.length === 0 ? (
        <p className="text-gray-600">No todos assigned to this child.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="border rounded-md border-gray-300 p-4 mb-4"
            >
              <p className="text-lg font-semibold mb-2">Name: {todo.name}</p>
              <p className="text-gray-700 mb-2">
                Description: {todo.description}
              </p>
              <p className="text-gray-700 mb-2">Money: ${todo.money}</p>
              <p className="text-gray-700 mb-2">Points: {todo.points}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChildTodoList;
