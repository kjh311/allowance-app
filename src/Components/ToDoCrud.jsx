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
      <div className="add-todo-form rounded-lg border border-gray-300 p-4 flex flex-col items-center">
        <label htmlFor="todoNameInput" className="block mb-2">
          Add New Todo:
        </label>
        <div className="mb-2">
          <input
            id="todoNameInput"
            placeholder="Name..."
            value={newTodoName}
            onChange={(event) => setNewTodoName(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            id="todoDescriptionInput"
            placeholder="Description..."
            value={newTodoDescription}
            onChange={(event) => setNewTodoDescription(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-2">
          <input
            id="todoMoneyInput"
            placeholder="Money..."
            value={newTodoMoney}
            onChange={(event) => setNewTodoMoney(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            id="todoPointsInput"
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
                <>
                  <div>
                    <label htmlFor="editNameInput">Name:</label>
                    <input
                      type="text"
                      id="editNameInput"
                      placeholder={todo.name}
                      value={editTodoName}
                      onChange={(event) => setEditTodoName(event.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="editDescriptionInput">Description:</label>
                    <input
                      type="text"
                      id="editDescriptionInput"
                      placeholder={todo.description}
                      value={editTodoDescription}
                      onChange={(event) => setEditTodoDescription(event.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="editMoneyInput">Money:</label>
                    <input
                      type="number"
                      id="editMoneyInput"
                      placeholder={todo.money}
                      value={editTodoMoney}
                      onChange={(event) => setEditTodoMoney(event.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="editPointsInput">Points:</label>
                    <input
                      type="number"
                      id="editPointsInput"
                      placeholder={todo.points}
                      value={editTodoPoints}
                      onChange={(event) => setEditTodoPoints(event.target.value)}
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
