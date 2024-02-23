import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  getDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

function TodoCreation() {
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoMoney, setNewTodoMoney] = useState("");
  const [newTodoPoints, setNewTodoPoints] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [children, setChildren] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        if (!currentUser) return; // If no user is logged in, return early

        const childrenQuery = query(
          collection(db, "children"),
          where("userId", "==", currentUser.uid)
        );
        const childrenSnapshot = await getDocs(childrenQuery);
        const childrenData = childrenSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChildren(childrenData);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };
    fetchChildren();
  }, [currentUser]); // Re-run effect when currentUser changes

  const createTodo = async () => {
    try {
      // Fetch sharingWith field from the current user's document
      const currentUserRef = doc(db, "users", currentUser.uid);
      const currentUserDoc = await getDoc(currentUserRef);
      const currentUserData = currentUserDoc.data();
      const sharingWithIds = currentUserData.sharingWith || [];

      // Ensure the todos field exists for the current user
      if (!currentUserData.todos) {
        await updateDoc(currentUserRef, { todos: [] });
      }

      // Add sharingWith IDs to the sharedUsers field of the new todo
      const todoToAdd = {
        name: newTodoName,
        description: newTodoDescription,
        money: newTodoMoney === "" ? 0 : parseFloat(newTodoMoney),
        points: newTodoPoints === "" ? 0 : parseInt(newTodoPoints),
        assignedTo: selectedAssignee,
        completed: false, // Add the completed field and set it to false
        sharedUsers: [currentUser.uid, ...sharingWithIds], // Add current user and sharingWith IDs to sharedUsers
      };

      if (selectedAssignee) {
        const newTodoRef = await addDoc(collection(db, "todos"), todoToAdd);
        const newTodoId = newTodoRef.id;

        // Update the todos field of the current user by adding the new todo ID
        await updateDoc(currentUserRef, {
          todos: arrayUnion(newTodoId),
        });

        setNewTodoName("");
        setNewTodoDescription("");
        setNewTodoMoney("");
        setNewTodoPoints("");
        console.log("Todo created successfully");

        // Optionally, update the selectedAssignee's todo list here
        // based on your application logic
      } else {
        const newTodoRef = await addDoc(collection(db, "todos"), todoToAdd);
        const newTodoId = newTodoRef.id;

        // Update the todos field of the current user by adding the new todo ID
        await updateDoc(currentUserRef, {
          todos: arrayUnion(newTodoId),
        });

        setNewTodoName("");
        setNewTodoDescription("");
        setNewTodoMoney("");
        setNewTodoPoints("");
        console.log("Todo created successfully");
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedAssignee(event.target.value);
  };

  return (
    <div className="create-todo-container">
      <div className="add-todo-form rounded-lg border border-gray-300 p-4 mb-4">
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
          Amount of Money:
        </label>
        <input
          id="todoMoneyInput"
          placeholder="Enter amount of money"
          value={newTodoMoney}
          onChange={(event) => setNewTodoMoney(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="todoPointsInput" className="block mb-2">
          Amount of Points:
        </label>
        <input
          id="todoPointsInput"
          placeholder="Enter amount of points"
          value={newTodoPoints}
          onChange={(event) => setNewTodoPoints(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        {/* Dropdown menu */}
        <label htmlFor="assigneeDropdown" className="block mb-2">
          Assign to:
        </label>
        <select
          id="assigneeDropdown"
          value={selectedAssignee}
          onChange={handleDropdownChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        >
          <option value="">Unassigned</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
          <optgroup label="Current User">
            {currentUser && (
              <option key={currentUser.uid} value={currentUser.uid}>
                {currentUser.displayName}
              </option>
            )}
          </optgroup>
        </select>
        <br />
        <button
          onClick={createTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}

export default TodoCreation;
