import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  getDoc,
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
  const [sharingWithUsers, setSharingWithUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchChildrenAndSharingWithUsers = async () => {
      try {
        if (!currentUser) return;

        // Fetch children of the current user
        const childrenQuery = query(
          collection(db, "children"),
          where("userId", "==", currentUser.uid)
        );
        const childrenSnapshot = await getDocs(childrenQuery);
        const childrenData = childrenSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch users listed under the sharingWith field
        const currentUserRef = doc(db, "users", currentUser.uid);
        const currentUserDoc = await getDoc(currentUserRef);
        const sharingWithIds = currentUserDoc.data().sharingWith || [];
        const sharingWithUsersData = [];

        // Retrieve users listed under sharingWith field
        for (const userId of sharingWithIds) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            sharingWithUsersData.push({
              id: userId,
              ...userDoc.data(),
            });
          }
        }

        // Combine children and users listed under sharingWith into a single array
        const allChildren = [...childrenData, ...sharingWithUsersData];

        setChildren(allChildren);
        setSharingWithUsers(sharingWithUsersData);
      } catch (error) {
        console.error("Error fetching children and sharingWith users:", error);
      }
    };

    fetchChildrenAndSharingWithUsers();
  }, [currentUser]);

  const createTodo = async () => {
    try {
      const createdBy = currentUser.displayName || currentUser.email;

      // Determine assignedTo based on selectedAssignee
      let assignedTo = "";
      if (selectedAssignee) {
        assignedTo = selectedAssignee;
      } else {
        // If "Unassigned" is selected, keep assignedTo as an empty string
        assignedTo = "";
      }

      // Ensure only user IDs are included in sharedUsers
      const filteredSharingWithIds = sharingWithUsers
        .filter((user) => user.id !== currentUser.uid)
        .map((user) => user.id);

      const sharedUsers = [currentUser.uid, ...filteredSharingWithIds];

      const todoToAdd = {
        name: newTodoName,
        description: newTodoDescription,
        money: newTodoMoney === "" ? 0 : parseFloat(newTodoMoney),
        points: newTodoPoints === "" ? 0 : parseInt(newTodoPoints),
        assignedTo: assignedTo,
        completed: false,
        sharedUsers: sharedUsers,
        userId: currentUser.uid,
        createdBy: createdBy,
      };

      await addDoc(collection(db, "todos"), todoToAdd);
      setNewTodoName("");
      setNewTodoDescription("");
      setNewTodoMoney("");
      setNewTodoPoints("");
      console.log("Todo created successfully");
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
          {children
            .filter((child) => child.name) // Filter out children without a valid name
            .map((child) => (
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
          <optgroup label="Sharing With">
            {sharingWithUsers
              .filter((user) => user.displayName || user.email) // Filter out users without a valid displayName or email
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName || user.email}
                </option>
              ))}
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
