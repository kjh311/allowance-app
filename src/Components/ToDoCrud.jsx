import { db } from "../firebase/firebase";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../contexts/authContext";

function TodoCrud() {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMoney, setNewMoney] = useState(0);
  const [newPoints, setNewPoints] = useState(0);

  const todosCollectionRef = collection(db, "todos");

  useEffect(() => {
    const getUserTodos = async () => {
      try {
        const todosSnapshot = await getDocs(collection(db, "todos"));
        const userTodos = todosSnapshot.docs
          .filter((doc) => doc.data().userId === currentUser.uid)
          .map((doc) => ({ id: doc.id, ...doc.data() })); // Include all properties of the todo
        setTodos(userTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    

    if (currentUser) {
      getUserTodos();
    }
  }, [currentUser]);

  const createTodo = async () => {
    try {
      const docRef = await addDoc(todosCollectionRef, {
        name: newTodo,
        description: newDescription || "",
        money: newMoney || 0,
        points: newPoints || 0,
        userId: currentUser.uid,
      });

      setTodos((prevTodos) => [
        ...prevTodos,
        {
          name: newTodo,
          description: newDescription || "",
          money: newMoney || 0,
          points: newPoints || 0,
          id: docRef.id,
        },
      ]);

      setNewTodo("");
      setNewDescription("");
      setNewMoney(0);
      setNewPoints(0);
      console.log("Todo created successfully");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const updateTodo = async (id, newName, newDescription, newMoney, newPoints) => {
    try {
      const todoDoc = doc(db, "todos", id);
      await updateDoc(todoDoc, {
        name: newName,
        description: newDescription,
        money: newMoney,
        points: newPoints
      });
  
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, name: newName, description: newDescription, money: newMoney, points: newPoints } : todo
        )
      );
  
      console.log(`Todo with ID ${id} updated successfully`);
    } catch (error) {
      console.error(`Error updating todo with ID ${id}:`, error);
    }
  };
  

  const deleteTodo = async (id) => {
    try {
      const todoDoc = doc(db, "todos", id);
      await deleteDoc(todoDoc);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      console.log(`Todo with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error);
    }
  };

// Define the editTodo function with the correct arguments
const editTodo = async (id, newName, newDescription, newMoney, newPoints) => {
  try {
    // Update the todo with new values
    await updateTodo(id, newName, newDescription, newMoney, newPoints);
    console.log(`Todo with ID ${id} updated successfully`);
  } catch (error) {
    console.error(`Error updating todo with ID ${id}:`, error);
  }
};

// Inside the component, use editTodo when the Edit button is clicked
<button
  onClick={() => editTodo(todo.id, todo.name, todo.description, todo.money, todo.points)}
  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
>
  Edit Todo
</button>

  
  

  return (
    <div className="todo-service-div">
      <div className="add-todo-form rounded-lg border border-gray-300 p-4 flex flex-col items-center">
        <label htmlFor="todoInput" className="block mb-2">
          Add New Todo:
        </label>
        <div className="mb-2">
          <input
            id="todoInput"
            placeholder="Todo..."
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Description..."
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Money..."
            value={newMoney}
            onChange={(event) => setNewMoney(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Points..."
            value={newPoints}
            onChange={(event) => setNewPoints(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={createTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Add Todo
        </button>
      </div>

      {todos.map((todo) => (
  <div
    key={todo.id}
    className="border border-gray-300 p-4 mb-4 rounded-md"
  >
    <div className="flex items-center">
      <div>
        <p>Name: {todo.name}</p>
        <p>Description: {todo.description}</p>
        <p>Money: ${todo.money}</p>
        <p>Points: {todo.points}</p>
      </div>
    </div>
    <div>
      <button
        onClick={() => editTodo(todo.id)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
      >
        Edit Todo
      </button>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
      >
        Delete Todo
      </button>
    </div>
  </div>
))}


    </div>
  );
}

export default TodoCrud;
