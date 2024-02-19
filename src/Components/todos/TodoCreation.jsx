import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, getDoc, updateDoc, arrayUnion, getDocs, doc } from 'firebase/firestore';

import { db } from '../../firebase/firebase';

function TodoCreation() {
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoMoney, setNewTodoMoney] = useState("");
  const [newTodoPoints, setNewTodoPoints] = useState("");
  const [selectedChildId, setSelectedChildId] = useState(""); // New state for selected child ID

  // Fetch children data from Firestore
  const [children, setChildren] = useState([]);
  useEffect(() => {
    const fetchChildren = async () => {
      const childrenQuery = query(collection(db, "children"));
      const childrenSnapshot = await getDocs(childrenQuery);
      const childrenData = childrenSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChildren(childrenData);
    };
    fetchChildren();
  }, []);

  const createTodo = async () => {
    try {
      const todoToAdd = {
        name: newTodoName,
        description: newTodoDescription,
        money: newTodoMoney === "" ? 0 : parseFloat(newTodoMoney),
        points: newTodoPoints === "" ? 0 : parseInt(newTodoPoints),
        assignedTo: selectedChildId // Set the assignedTo field to the ID of the selected child
      };
  
      if (selectedChildId) {
        // Add the todo to the todos collection
        const newTodoRef = await addDoc(collection(db, "todos"), todoToAdd);
        const newTodoId = newTodoRef.id;
  
        // Update the child document to include a reference to the new todo
        const childDocRef = doc(db, "children", selectedChildId);
        await updateDoc(childDocRef, {
          todos: arrayUnion(newTodoId) // Add the new todo ID to the todos array
        });
      } else {
        // Add the todo directly to the todos collection without updating any child document
        await addDoc(collection(db, "todos"), todoToAdd);
      }
  
      setNewTodoName("");
      setNewTodoDescription("");
      setNewTodoMoney("");
      setNewTodoPoints("");
      console.log("Todo created successfully");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };
  

  // Function to handle dropdown selection
  const handleDropdownChange = (event) => {
    setSelectedChildId(event.target.value); // Update selected child ID
  };

  // useEffect to log selectedChildId
  useEffect(() => {
    console.log("Selected child ID:", selectedChildId);
  }, [selectedChildId]);

  return (
    <div className="create-todo-container">
      <div className="add-todo-form rounded-lg border border-gray-300 p-4 mb-4">
        <h1>Create new TODO</h1>
        <label htmlFor="todoNameInput" className="block mb-2">Todo Name:</label>
        <input
          id="todoNameInput"
          placeholder="Enter todo name"
          value={newTodoName}
          onChange={(event) => setNewTodoName(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="todoDescriptionInput" className="block mb-2">Description:</label>
        <input
          id="todoDescriptionInput"
          placeholder="Enter description"
          value={newTodoDescription}
          onChange={(event) => setNewTodoDescription(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="todoMoneyInput" className="block mb-2">Amount of Money:</label>
        <input
          id="todoMoneyInput"
          placeholder="Enter amount of money"
          value={newTodoMoney}
          onChange={(event) => setNewTodoMoney(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="todoPointsInput" className="block mb-2">Amount of Points:</label>
        <input
          id="todoPointsInput"
          placeholder="Enter amount of points"
          value={newTodoPoints}
          onChange={(event) => setNewTodoPoints(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        {/* Dropdown menu for assigning todos to a child */}
        <label htmlFor="childDropdown" className="block mb-2">Assign to child:</label>
        <select
          id="childDropdown"
          value={selectedChildId}
          onChange={handleDropdownChange} // Call handleDropdownChange when selection changes
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        >
          <option value="">Unassigned</option>
          {children.map(child => (
            <option key={child.id} value={child.id}>{child.name}</option>
          ))}
        </select>
        <br/>
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
