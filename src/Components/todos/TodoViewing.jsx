import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase";

function TodoViewing() {
  const [todos, setTodos] = useState([]);
  const [children, setChildren] = useState([]);
  const [sharingWithIds, setSharingWithIds] = useState([]); // Define sharingWithIds state
  const [sharingWithChildren, setSharingWithChildren] = useState([]); //
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoName, setEditedTodoName] = useState("");
  const [editedTodoDescription, setEditedTodoDescription] = useState("");
  const [editedTodoMoney, setEditedTodoMoney] = useState("");
  const [editedTodoPoints, setEditedTodoPoints] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [completed, setCompleted] = useState(false); // New state for completed
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSharingWithIds = async () => {
      try {
        // Fetch the sharingWith field for the current user
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        const sharingWithIds = userData.sharingWith || [];

        // Fetch displayName and children for each user in sharingWithIds
        const sharingWithDataPromises = sharingWithIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, "users", userId));
          const userData = userDoc.data();

          // Fetch children of the user
          const childrenSnapshot = await getDocs(
            query(collection(db, "children"), where("userId", "==", userId))
          );
          const childrenData = childrenSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return {
            id: userId,
            displayName: userData.displayName,
            children: childrenData,
          };
        });

        // Resolve all promises
        const sharingWithData = await Promise.all(sharingWithDataPromises);

        // Set state with id, displayName, and children
        setSharingWithIds(sharingWithData);

        // Extract and set children data separately
        const allChildrenData = sharingWithData.reduce(
          (acc, curr) => [...acc, ...curr.children],
          []
        );
        setSharingWithChildren(allChildrenData);
      } catch (error) {
        console.error("Error fetching sharingWith ids:", error);
      }
    };

    // Call the function when the component mounts or when currentUser changes
    fetchSharingWithIds();

    const unsubscribeTodos = onSnapshot(collection(db, "todos"), (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Filter todos based on sharedUsers
      const filteredTodos = todosData.filter(
        (todo) => todo.sharedUsers && todo.sharedUsers.includes(currentUser.uid)
      );
      setTodos(filteredTodos);
    });

    // Fetch children
    const unsubscribeChildren = onSnapshot(
      collection(db, "children"),
      (snapshot) => {
        const childrenData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChildren(childrenData);
      }
    );

    return () => {
      unsubscribeTodos();
      unsubscribeChildren();
    };
  }, [currentUser]); // Re-run effect when currentUser changes

  const deleteTodo = async (id) => {
    try {
      // Delete the todo document
      await deleteDoc(doc(db, "todos", id));
      console.log(`Todo with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error.message);
    }
  };

  const startEditing = (
    id,
    name,
    description,
    money,
    points,
    assignedTo,
    completed
  ) => {
    setEditingTodoId(id);
    setEditedTodoName(name);
    setEditedTodoDescription(description);
    setEditedTodoMoney(money);
    setEditedTodoPoints(points);
    setSelectedChildId(assignedTo);
    setCompleted(completed); // Set initial value for completed
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTodoName("");
    setEditedTodoDescription("");
    setEditedTodoMoney("");
    setEditedTodoPoints("");
    setSelectedChildId("");
    setCompleted(false); // Reset completed to false
  };

  const saveEditing = async () => {
    try {
      let assignedTo = selectedChildId !== undefined ? selectedChildId : ""; // Use selectedChildId if defined, otherwise use an empty string (for Unassigned)
      const todoRef = doc(db, "todos", editingTodoId);
      const todoDoc = await getDoc(todoRef);
      const todoData = todoDoc.data();

      // Check if the completion status changed
      if (completed !== todoData.completed) {
        if (completed && assignedTo) {
          // Adding money if completed and assigned to a child
          const childRef = doc(db, "children", assignedTo);
          const childDoc = await getDoc(childRef);
          if (childDoc.exists()) {
            const childData = childDoc.data();
            const updatedMoney = childData.money + parseFloat(editedTodoMoney);
            const updatedPoints = childData.points + parseInt(editedTodoPoints);
            await Promise.all([
              updateDoc(childRef, { money: updatedMoney }),
              updateDoc(childRef, { points: updatedPoints }),
            ]);
            console.log(
              `Child with ID ${assignedTo} updated with money: ${updatedMoney} and points: ${updatedPoints}`
            );
          } else {
            console.error(`Child with ID ${assignedTo} not found`);
          }
        } else if (!completed && todoData.assignedTo) {
          // Subtracting money if not completed and assigned to a child
          const childRef = doc(db, "children", todoData.assignedTo);
          const childDoc = await getDoc(childRef);
          if (childDoc.exists()) {
            const childData = childDoc.data();
            const updatedMoney = childData.money - parseFloat(todoData.money);
            const updatedPoints = childData.points - parseInt(todoData.points);
            await Promise.all([
              updateDoc(childRef, { money: updatedMoney }),
              updateDoc(childRef, { points: updatedPoints }),
            ]);
            console.log(
              `Child with ID ${todoData.assignedTo} updated with money: ${updatedMoney} and points: ${updatedPoints}`
            );
          } else {
            console.error(`Child with ID ${todoData.assignedTo} not found`);
          }
        }
      }

      // Update todo
      await updateDoc(todoRef, {
        name: editedTodoName,
        description: editedTodoDescription,
        money: parseFloat(editedTodoMoney) || 0, // Parse as float or default to 0
        points: parseInt(editedTodoPoints) || 0, // Parse as integer or default to 0
        assignedTo: assignedTo,
        completed: completed,
        sharedUsers: todoData.sharedUsers,
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

  const getChildName = (childId) => {
    if (childId === currentUser.uid) {
      return currentUser.displayName || "Current User";
    } else {
      // Check if the childId belongs to another user in the sharingWith list
      const sharedUser = sharingWithIds.find((user) => user.id === childId);
      if (sharedUser) {
        return sharedUser.displayName || "Sharing With User";
      } else {
        // Find the child in the children list
        const child = children.find((child) => child.id === childId);
        return child ? child.name : "Unassigned";
      }
    }
  };

  const handleDropdownChange = (event) => {
    const selectedChildId = event.target.value;
    console.log("Selected Child ID:", selectedChildId);
    console.log("Current User ID:", currentUser.uid);

    // Check if the selected child is unassigned
    if (!selectedChildId) {
      setSelectedChildId("");
    } else if (selectedChildId === currentUser.uid) {
      setSelectedChildId(selectedChildId);
    } else {
      // Find the selected child in the children list
      const selectedChild = children.find(
        (child) => child.id === selectedChildId
      );
      console.log("Selected Child:", selectedChild);
      // Check if the selected child belongs to the current user
      if (selectedChild && selectedChild.userId === currentUser.uid) {
        setSelectedChildId(selectedChildId);
      } else {
        // Check if the selected child belongs to a user in sharingWithIds
        const sharedUserChild = sharingWithChildren.find(
          (child) => child.id === selectedChildId
        );
        console.log("Shared User Child:", sharedUserChild);
        if (sharedUserChild) {
          setSelectedChildId(selectedChildId);
        } else {
          // If not found, set selectedChildId to the user ID
          setSelectedChildId(selectedChildId);
        }
      }
    }
  };

  if (todos.length === 0) {
    return <div>No Todos</div>;
  }

  return (
    <div className="todo-list-container">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`todo-item border border-gray-300 p-4 mb-4 rounded-md ${
            todo.completed ? "completed-todo" : ""
          }`}
        >
          {editingTodoId === todo.id ? (
            <>
              <div>
                <p>Name:</p>
                <input
                  type="text"
                  value={editedTodoName}
                  onChange={(e) => setEditedTodoName(e.target.value)}
                  style={{
                    marginBottom: "10px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                />
              </div>
              <div>
                <p>Description:</p>
                <input
                  type="text"
                  value={editedTodoDescription}
                  onChange={(e) => setEditedTodoDescription(e.target.value)}
                  style={{
                    marginBottom: "10px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                />
              </div>
              <div>
                <p>$$:</p>
                <input
                  type="text"
                  value={editedTodoMoney}
                  onChange={(e) => setEditedTodoMoney(e.target.value)}
                  style={{
                    marginBottom: "10px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                />
              </div>
              <div>
                <p>Points:</p>
                <input
                  type="text"
                  value={editedTodoPoints}
                  onChange={(e) => setEditedTodoPoints(e.target.value)}
                  style={{
                    marginBottom: "10px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                />
              </div>
              <div>
                <p>Completed:</p>
                <select
                  value={completed}
                  onChange={(e) => setCompleted(e.target.value === "true")}
                  style={{
                    marginBottom: "10px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <p>Assigned to:</p>
                <select
                  id="assigneeDropdown"
                  value={selectedChildId}
                  onChange={handleDropdownChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
                >
                  <option value="">Unassigned</option>
                  {children
                    .filter((child) => child.userId === currentUser.uid) // Filter children based on userId
                    .map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}

                  {/*children of user's sharingWith */}
                  {sharingWithChildren.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}

                  <option disabled>Current User:</option>
                  {currentUser && (
                    <option key={currentUser.uid} value={currentUser.uid}>
                      {currentUser.displayName || "Current User"}
                    </option>
                  )}

                  <option disabled>Sharing With:</option>
                  {sharingWithIds.map((shareduser) => (
                    <option key={shareduser.id} value={shareduser.id}>
                      {shareduser.displayName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Button
                  onClick={saveEditing}
                  variant="primary"
                  style={{
                    marginRight: "5px",
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={cancelEditing}
                  variant="secondary"
                  style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>Name: {todo.name}</p>
              {todo.description ? <p>Description: {todo.description}</p> : null}
              {todo.money ? <p>Money: ${todo.money}</p> : null}
              {todo.points ? <p>Points: {todo.points}</p> : null}
              <p>Completed: {todo.completed ? "Yes" : "No"}</p>{" "}
              {/* Display completed status */}
              <p>Assigned To: {getChildName(todo.assignedTo)}</p>
              <p>Created By: {todo.createdBy}</p>
              <div className="flex">
                <Button
                  onClick={() =>
                    startEditing(
                      todo.id,
                      todo.name,
                      todo.description,
                      todo.money,
                      todo.points,
                      todo.assignedTo,
                      todo.completed
                    )
                  }
                  variant="primary"
                  style={{
                    marginRight: "5px",
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                  }}
                >
                  <FaEdit className="mr-2" />
                </Button>
                <Button
                  onClick={() => deleteTodo(todo.id)}
                  variant="danger"
                  style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                >
                  <FaTrash className="mr-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TodoViewing;
