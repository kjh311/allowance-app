import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase";

function UserTodosList() {
  // Define state variables
  const [userTodos, setUserTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoName, setEditedTodoName] = useState("");
  const [editedTodoDescription, setEditedTodoDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const { currentUser } = useAuth();

  // Fetch user's todos on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredTodos = todosData.filter(
        (todo) => todo.assignedTo === currentUser.uid
      );
      setUserTodos(filteredTodos);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Function to delete a todo
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      console.log(`Todo with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error.message);
    }
  };

  // Function to start editing a todo
  const startEditing = (id, name, description, completed) => {
    setEditingTodoId(id);
    setEditedTodoName(name);
    setEditedTodoDescription(description);
    setCompleted(completed);
  };

  // Function to cancel editing a todo
  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTodoName("");
    setEditedTodoDescription("");
    setCompleted(false);
  };

  // Function to save changes to a todo
  const saveEditing = async () => {
    try {
      const todoRef = doc(db, "todos", editingTodoId);
      await updateDoc(todoRef, {
        name: editedTodoName,
        description: editedTodoDescription,
        completed: completed,
      });
      console.log(`Todo with ID ${editingTodoId} updated successfully`);
      setEditingTodoId(null);
    } catch (error) {
      console.error(
        `Error updating todo with ID ${editingTodoId}:`,
        error.message
      );
    }
  };

  // Render user's todos
  return (
    <div className="user-todos-wrapper bg-white rounded-lg shadow-lg">
      <h1 className="text-lg font-semibold mb-4 text-center your-todos">
        Your Todos
      </h1>
      {userTodos.map((todo) => (
        <div
          key={todo.id}
          className={`todo-item border rounded-lg p-4 mb-4 ${
            todo.completed ? "bg-green-100" : ""
          }`}
        >
          {editingTodoId === todo.id ? (
            <div className="flex flex-col space-y-4">
              <label htmlFor="name">Update Name:</label>
              <input
                type="text"
                name="name"
                value={editedTodoName}
                onChange={(e) => setEditedTodoName(e.target.value)}
                className="form-input"
              />
              <label htmlFor="description">Update Description:</label>
              <input
                type="text"
                name="description"
                value={editedTodoDescription}
                onChange={(e) => setEditedTodoDescription(e.target.value)}
                className="form-input"
              />
              <select
                value={completed}
                onChange={(e) => setCompleted(e.target.value === "true")}
                className="form-select"
              >
                <option value="true">Completed</option>
                <option value="false">Not Completed</option>
              </select>
              <div className="flex space-x-4">
                <Button onClick={saveEditing}>Save</Button>
                <Button onClick={cancelEditing} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-center">{todo.name}</h3>
              {todo.description && (
                <p className="font-normal">{todo.description}</p>
              )}
              <p className="font-normal">
                Completed: {todo.completed ? "Yes" : "No"}
              </p>
            </div>
          )}
          <div className="space-x-4 text-center">
            <Button
              onClick={() =>
                startEditing(
                  todo.id,
                  todo.name,
                  todo.description,
                  todo.completed
                )
              }
            >
              <FaEdit />
            </Button>
            <Button onClick={() => deleteTodo(todo.id)} variant="danger">
              <FaTrash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserTodosList;
