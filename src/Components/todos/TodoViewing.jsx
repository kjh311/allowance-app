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
  const [sharingWithIds, setSharingWithIds] = useState([]);
  const [sharingWithChildren, setSharingWithChildren] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoName, setEditedTodoName] = useState("");
  const [editedTodoDescription, setEditedTodoDescription] = useState("");
  const [editedTodoMoney, setEditedTodoMoney] = useState("");
  const [editedTodoPoints, setEditedTodoPoints] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [completed, setCompleted] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSharingWithIds = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        const sharingWithIds = userData.sharingWith || [];

        const sharingWithDataPromises = sharingWithIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, "users", userId));
          const userData = userDoc.data();

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

        const sharingWithData = await Promise.all(sharingWithDataPromises);

        setSharingWithIds(sharingWithData);

        const allChildrenData = sharingWithData.reduce(
          (acc, curr) => [...acc, ...curr.children],
          []
        );
        setSharingWithChildren(allChildrenData);
      } catch (error) {
        console.error("Error fetching sharingWith ids:", error);
      }
    };

    fetchSharingWithIds();

    const unsubscribeTodos = onSnapshot(collection(db, "todos"), (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredTodos = todosData.filter(
        (todo) => todo.sharedUsers && todo.sharedUsers.includes(currentUser.uid)
      );
      setTodos(filteredTodos);
    });

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
  }, [currentUser]);

  const deleteTodo = async (id) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this todo?"
      );
      if (confirmation) {
        await deleteDoc(doc(db, "todos", id));
        console.log(`Todo with ID ${id} deleted successfully`);
      }
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
    setCompleted(completed);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTodoName("");
    setEditedTodoDescription("");
    setEditedTodoMoney("");
    setEditedTodoPoints("");
    setSelectedChildId("");
    setCompleted(false);
  };

  const saveEditing = async () => {
    try {
      let assignedTo = selectedChildId !== undefined ? selectedChildId : "";
      const todoRef = doc(db, "todos", editingTodoId);
      const todoDoc = await getDoc(todoRef);
      const todoData = todoDoc.data();

      if (completed !== todoData.completed) {
        if (completed && assignedTo) {
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

      await updateDoc(todoRef, {
        name: editedTodoName,
        description: editedTodoDescription,
        money: parseFloat(editedTodoMoney) || 0,
        points: parseInt(editedTodoPoints) || 0,
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
      const sharedUser = sharingWithIds.find((user) => user.id === childId);
      if (sharedUser) {
        return sharedUser.displayName || "Sharing With User";
      } else {
        const child = children.find((child) => child.id === childId);
        return child ? child.name : "Unassigned";
      }
    }
  };

  const handleDropdownChange = (event) => {
    const selectedChildId = event.target.value;
    console.log("Selected Child ID:", selectedChildId);
    console.log("Current User ID:", currentUser.uid);

    if (!selectedChildId) {
      setSelectedChildId("");
    } else if (selectedChildId === currentUser.uid) {
      setSelectedChildId(selectedChildId);
    } else {
      const selectedChild = children.find(
        (child) => child.id === selectedChildId
      );
      console.log("Selected Child:", selectedChild);
      if (selectedChild && selectedChild.userId === currentUser.uid) {
        setSelectedChildId(selectedChildId);
      } else {
        const sharedUserChild = sharingWithChildren.find(
          (child) => child.id === selectedChildId
        );
        console.log("Shared User Child:", sharedUserChild);
        if (sharedUserChild) {
          setSelectedChildId(selectedChildId);
        } else {
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
            todo.completed ? "bg-green-100" : ""
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
                  className="input-style"
                />
              </div>
              <div>
                <p>Description:</p>
                <input
                  type="text"
                  value={editedTodoDescription}
                  onChange={(e) => setEditedTodoDescription(e.target.value)}
                  className="input-style"
                />
              </div>
              <div>
                <p>$$:</p>
                <input
                  type="text"
                  value={editedTodoMoney}
                  onChange={(e) => setEditedTodoMoney(e.target.value)}
                  className="input-style"
                />
              </div>
              <div>
                <p>Points:</p>
                <input
                  type="text"
                  value={editedTodoPoints}
                  onChange={(e) => setEditedTodoPoints(e.target.value)}
                  className="input-style"
                />
              </div>
              <div>
                <p>Completed:</p>
                <select
                  value={completed}
                  onChange={(e) => setCompleted(e.target.value === "true")}
                  className="input-style"
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
                  className="input-style"
                >
                  <option value="">Unassigned</option>
                  <optgroup label="Children:">
                    {children
                      .filter((child) => child.userId === currentUser.uid)
                      .map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    {sharingWithChildren.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Current User:">
                    {currentUser && (
                      <option key={currentUser.uid} value={currentUser.uid}>
                        {currentUser.displayName || "Current User"}
                      </option>
                    )}
                  </optgroup>
                  <optgroup label="Sharing With:">
                    {sharingWithIds.map((shareduser) => (
                      <option key={shareduser.id} value={shareduser.id}>
                        {shareduser.displayName}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <Button onClick={saveEditing} variant="primary">
                  Save
                </Button>
                <Button onClick={cancelEditing} variant="secondary">
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
                >
                  <FaEdit className="mr-2" />
                </Button>
                <Button onClick={() => deleteTodo(todo.id)} variant="danger">
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
