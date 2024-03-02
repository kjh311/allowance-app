import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import TodoCounter from "./TodoCounter";
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
  const [userTodos, setUserTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoName, setEditedTodoName] = useState("");
  const [editedTodoDescription, setEditedTodoDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const { currentUser } = useAuth();

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

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      console.log(`Todo with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error.message);
    }
  };

  const startEditing = (id, name, description, completed) => {
    setEditingTodoId(id);
    setEditedTodoName(name);
    setEditedTodoDescription(description);
    setCompleted(completed);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTodoName("");
    setEditedTodoDescription("");
    setCompleted(false);
  };

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

  return (
    <div className="user-todos-wrapper bg-white rounded-lg shadow-lg">
      <h1 className="text-lg font-semibold mb-4 text-center your-todos">
        Your Todos <TodoCounter />
      </h1>
      {userTodos.map((todo) => (
        <div key={todo.id} className="border rounded-lg p-4 mb-4">
          {editingTodoId === todo.id ? (
            <div className="flex flex-col space-y-4">
              <label for="name">Update Name:</label>
              <input
                type="text"
                name="name"
                value={editedTodoName}
                onChange={(e) => setEditedTodoName(e.target.value)}
                className="form-input"
              />
              <label for="description">Update Description:</label>
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
            <div className="flex flex-col space-y-2">
              <p className="font-semibold">Name: {todo.name}</p>
              {todo.description && (
                <p className="font-normal">Description: {todo.description}</p>
              )}
              <p className="font-normal">
                Completed: {todo.completed ? "Yes" : "No"}
              </p>
              <div className="flex space-x-4">
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
                <Button
                  onClick={() => deleteTodo(todo.id)}
                  variant="danger"
                  className="custom-button"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserTodosList;
