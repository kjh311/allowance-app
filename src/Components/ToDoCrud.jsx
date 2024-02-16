import { db } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/authContext";

function TodoCrud() {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoMoney, setNewTodoMoney] = useState("");
  const [newTodoPoints, setNewTodoPoints] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMoney, setEditMoney] = useState("");
  const [editPoints, setEditPoints] = useState("");

  const todosCollectionRef = collection(db, "todos");

  const editTodo = (id, name, description, money, points) => {
    setEditingTodoId(id);
    setEditName(name);
    setEditDescription(description);
    setEditMoney(money);
    setEditPoints(points);
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
  };

  const submitEdit = async (id) => {
    try {
      const todoToUpdate = {
        name: editName,
        description: editDescription,
        money: parseFloat(editMoney),
        points: parseInt(editPoints),
      };
      
      await updateTodo(id, todoToUpdate);
      console.log(`Todo with ID ${id} updated successfully`);

      setEditingTodoId(null);
    } catch (error) {
      console.error(`Error updating todo with ID ${id}:`, error);
    }
  };

  useEffect(() => {
    const getUserTodos = async () => {
      try {
        const todosSnapshot = await getDocs(collection(db, "todos"));
        const userTodos = todosSnapshot.docs
          .filter((doc) => doc.data().userId === currentUser.uid)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setTodos(userTodos);
      } catch (error) {
        console.error("Error fetching todos:", error.message);
      }
    };

    if (currentUser) {
      getUserTodos();
    }
  }, [currentUser]);

  const createTodo = async () => {
    try {
      const todoToAdd = {
        name: newTodoName,
        description: newTodoDescription,
        money: parseFloat(newTodoMoney),
        points: parseInt(newTodoPoints),
        userId: currentUser.uid,
      };
  
      const docRef = await addDoc(todosCollectionRef, todoToAdd);
  
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          ...todoToAdd,
          id: docRef.id,
        },
      ]);
  
      setNewTodoName("");
      setNewTodoDescription("");
      setNewTodoMoney("");
      setNewTodoPoints("");
      console.log("Todo created successfully");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const updateTodo = async (id, todoToUpdate) => {
    try {
      const todoDoc = doc(db, "todos", id);
      await updateDoc(todoDoc, todoToUpdate);

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, ...todoToUpdate } : todo))
      );

      console.log(`Todo with ID ${id} updated successfully`);
    } catch (error) {
      console.error(`Error updating todo with ID ${id}:`, error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const todoDoc = doc(db, "todos", id);
      await deleteDoc(todoDoc);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      console.log(`Todo with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error.message);
    }
  };

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
            value={newTodoName}
            onChange={(event) => setNewTodoName(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Description..."
            value={newTodoDescription}
            onChange={(event) => setNewTodoDescription(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
  
        <div className="mb-2">
          <input
            placeholder="Money..."
            value={newTodoMoney}
            onChange={(event) => setNewTodoMoney(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Points..."
            value={newTodoPoints}
            onChange={(event) => setNewTodoPoints(event.target.value)}
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
        <div key={todo.id} className="border border-gray-300 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <div>
            {editingTodoId === todo.id ? (
    <div>
        <div className="mb-2">
            <input
                type="text"
                placeholder={editName}
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
        </div>
        <div className="mb-2">
            <input
                type="text"
                placeholder={editDescription}
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
        </div>
        <div className="mb-2">
            <input
                type="number"
                placeholder={editMoney}
                value={editMoney}
                onChange={(event) => setEditMoney(event.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
        </div>
        <div className="mb-2">
            <input
                type="number"
                placeholder={editPoints}
                value={editPoints}
                onChange={(event) => setEditPoints(event.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
        </div>
        <button
            onClick={() => submitEdit(todo.id)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
        >
            Submit
        </button>
        <button
            onClick={cancelEdit}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md"
        >
            Cancel
        </button>
    </div>
) : (
                <>
                  <p>Name: {todo.name}</p>
                  <p>Description: {todo.description}</p>
                  <p>Money: ${todo.money}</p>
                  <p>Points: {todo.points}</p>
                  <button
                    onClick={() => editTodo(todo.id, todo.name, todo.description, todo.money, todo.points)}
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
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoCrud;
