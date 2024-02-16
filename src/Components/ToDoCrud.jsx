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

  // State variables for edit inputs
  const [editTodoName, setEditTodoName] = useState("");
  const [editTodoDescription, setEditTodoDescription] = useState("");
  const [editTodoMoney, setEditTodoMoney] = useState("");
  const [editTodoPoints, setEditTodoPoints] = useState("");

  const todosCollectionRef = collection(db, "todos");

  const editTodo = (id, name, description, money, points) => {
    setEditingTodoId(id);
    setEditTodoName(name);
    setEditTodoDescription(description);
    setEditTodoMoney(money);
    setEditTodoPoints(points);
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
  };

  const submitEdit = async (id) => {
    try {
      const todoToUpdate = {
        name: editTodoName || "",
        description: editTodoDescription || "",
        money: parseFloat(editTodoMoney) || 0,
        points: parseInt(editTodoPoints) || 0,
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
        money: newTodoMoney === "" ? 0 : parseFloat(newTodoMoney),
        points: newTodoPoints === "" ? 0 : parseInt(newTodoPoints),
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
      <div className="add-todo-form rounded-lg border border-gray-300 p-4 mb-4 flex flex-col items-center">
        <h1>Create new TODO</h1>
        <label htmlFor="todoNameInput" className="block mb-2">
          Todo Name:
        </label>
        <input
          id="todoNameInput"
          placeholder="Enter todo name"
          value={newTodoName}
          onChange={(event) => setNewTodoName(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="todoDescriptionInput" className="block mb-2">
          Description:
        </label>
        <input
          id="todoDescriptionInput"
          placeholder="Enter description"
          value={newTodoDescription}
          onChange={(event) => setNewTodoDescription(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="todoMoneyInput" className="block mb-2">
          Money:
        </label>
        <input
          id="todoMoneyInput"
          placeholder="Enter amount of money"
          value={newTodoMoney}
          onChange={(event) => setNewTodoMoney(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="todoPointsInput" className="block mb-2">
          Points:
        </label>
        <input
          id="todoPointsInput"
          placeholder="Enter amount of points"
          value={newTodoPoints}
          onChange={(event) => setNewTodoPoints(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <button
          onClick={createTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Add Todo
        </button>
      </div>

      {todos.map((todo) => (
        <div key={todo.id} className="todo-item border border-gray-300 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <div>
              {editingTodoId === todo.id ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter todo name"
                    value={editTodoName}
                    onChange={(event) => setEditTodoName(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={editTodoDescription}
                    onChange={(event) => setEditTodoDescription(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
                  />
                  <input
                    type="number"
                    placeholder="Enter amount of money"
                    value={editTodoMoney}
                    onChange={(event) => setEditTodoMoney(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
                  />
                  <input
                    type="number"
                    placeholder="Enter amount of points"
                    value={editTodoPoints}
                    onChange={(event) => setEditTodoPoints(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
                  />
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
                </>
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
