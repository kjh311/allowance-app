import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./todo.scss";
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
    <div>
      <h2>Your Todos</h2>
      {userTodos.map((todo) => (
        <div
          key={todo.id}
          className={`todo-item todo-box ${
            todo.completed ? "completed-todo" : ""
          }`}
        >
          {editingTodoId === todo.id ? (
            <>
              <input
                type="text"
                value={editedTodoName}
                onChange={(e) => setEditedTodoName(e.target.value)}
                className="todo-box"
              />
              <input
                type="text"
                value={editedTodoDescription}
                onChange={(e) => setEditedTodoDescription(e.target.value)}
                className="todo-box"
              />
              <select
                value={completed}
                onChange={(e) => setCompleted(e.target.value === "true")}
              >
                <option value="true">Completed</option>
                <option value="false">Not Completed</option>
              </select>
              <Button onClick={saveEditing}>Save</Button>
              <Button onClick={cancelEditing}>Cancel</Button>
            </>
          ) : (
            <>
              <p>Name: {todo.name}</p>
              {todo.description && <p>Description: {todo.description}</p>}
              <p>Completed: {todo.completed ? "Yes" : "No"}</p>
              <div>
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
                  className="btn-danger custom-button"
                >
                  <FaTrash />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserTodosList;
