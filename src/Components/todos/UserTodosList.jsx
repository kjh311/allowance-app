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
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase";
import "./todo.scss";
import DatePicker from "react-datepicker";
import "./Calendar.scss";

function UserTodosList() {
  const today = new Date();
  const [todos, setTodos] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
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
  const [loading, setLoading] = useState(true);
  const [selectedDueDate, setSelectedDueDate] = useState(null);

  // Sort todos based on dueDate and completed status
  const sortedTodos = [...todos]
    .filter((todo) => todo.assignedTo === currentUser.uid) // Filter todos by assignedTo field
    .sort((a, b) => {
      // Compare due dates, treating null or undefined as the maximum value
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31");
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31");

      // Compare due dates
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // If due dates are equal, prioritize completed todos at the bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      // If both have the same due date and completion status, maintain their order
      return 0;
    })
    .sort((a, b) => {
      // Ensure completed todos are always placed at the bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

  const isOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  const isDueSoon = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return due < new Date(now.getTime() + oneWeek) && due > now;
  };

  const isDueInAMonth = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    return (
      due < new Date(now.getTime() + oneMonth) &&
      due > new Date(now.getTime() + oneWeek)
    );
  };

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
            email: userData.email,
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
        console.error(
          "Error fetching sharingWith ids (userTodoList): (userTodoList)",
          error
        );
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
        setLoading(false);
      }
    );

    setSelectedDueDate(dueDate);

    return () => {
      unsubscribeTodos();
      unsubscribeChildren();
    };
  }, [currentUser, dueDate]);

  const deleteTodo = async (id) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this todo?"
      );
      if (confirmation) {
        await deleteDoc(doc(db, "todos", id));
        console.log(`Todo with ID ${id} deleted successfully (userTodoList)`);
      }
    } catch (error) {
      console.error(
        `Error deleting todo with ID ${id}:  (userTodoList)`,
        error.message
      );
    }
  };

  const startEditing = (
    id,
    name,
    description,
    money,
    points,
    assignedTo,
    completed,
    dueDate
  ) => {
    setEditingTodoId(id);
    setEditedTodoName(name);
    setEditedTodoDescription(description);
    setEditedTodoMoney(money);
    setEditedTodoPoints(points);
    setSelectedChildId(assignedTo);
    // Update selectedDueDate based on the dueDate of the todo item being edited
    setSelectedDueDate(dueDate ? new Date(dueDate) : null);
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
            console
              .log
              // `Child with ID ${assignedTo} updated with money: ${updatedMoney} and points: ${updatedPoints}`
              ();
          } else {
            console.error(
              `Child with ID ${assignedTo} not found  (userTodoList)`
            );
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
              `Child with ID ${todoData.assignedTo} updated with money: ${updatedMoney} and points: ${updatedPoints}  (userTodoList)`
            );
          } else {
            console.error(
              `Child with ID ${todoData.assignedTo} not found (userTodoList)`
            );
          }
        }
      }

      // Format the dueDate
      // Format the dueDate
      const formattedDueDate = selectedDueDate
        ? selectedDueDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : null;

      await updateDoc(todoRef, {
        name: editedTodoName,
        description: editedTodoDescription,
        money: parseFloat(editedTodoMoney) || 0,
        points: parseInt(editedTodoPoints) || 0,
        assignedTo: assignedTo,
        completed: completed,
        sharedUsers: todoData.sharedUsers,
        dueDate: formattedDueDate, // Update the dueDate directly
      });

      console.log(
        `Todo with ID ${editingTodoId} updated successfully (userTodoList)`
      );
      setEditingTodoId(null);
    } catch (error) {
      console.error(
        `Error updating todo with ID ${editingTodoId}: (userTodoList)`,
        error.message
      );
    }
  };

  const getChildName = (childId) => {
    if (childId === currentUser.uid) {
      return currentUser.displayName || currentUser.email || "Current User";
    } else {
      const sharedUser = sharingWithIds.find((user) => user.id === childId);
      if (sharedUser) {
        return (
          sharedUser.displayName || sharedUser.email || "Sharing With User"
        );
      } else {
        const child = children.find((child) => child.id === childId);
        return child ? child.name : "Unassigned";
      }
    }
  };

  const handleDropdownChange = (event) => {
    const selectedChildId = event.target.value;
    console.log("Selected Child ID: (userTodoList)", selectedChildId);
    console.log("Current User ID: (userTodoList)", currentUser.uid);

    if (!selectedChildId) {
      setSelectedChildId("");
    } else if (selectedChildId === currentUser.uid) {
      setSelectedChildId(selectedChildId);
    } else {
      const selectedChild = children.find(
        (child) => child.id === selectedChildId
      );
      console.log("Selected Child: (userTodoList)", selectedChild);
      if (selectedChild && selectedChild.userId === currentUser.uid) {
        setSelectedChildId(selectedChildId);
      } else {
        const sharedUserChild = sharingWithChildren.find(
          (child) => child.id === selectedChildId
        );
        console.log("Shared User Child: (userTodoList)", sharedUserChild);
        if (sharedUserChild) {
          setSelectedChildId(selectedChildId);
        } else {
          setSelectedChildId(selectedChildId);
        }
      }
    }
  };

  // if (loading) {
  //   return <div className="text-center loading-message ">LOADING...</div>;
  // }

  // console.log("Todos: (userTodoList)", todos);

  if (todos.length === 0) {
    return <div>No Todos</div>;
  }

  return (
    <div className="todo-list-container   rounded-lg shadow-lg">
      {sortedTodos.map((todo) => (
        <div
          key={todo.id}
          className={`todo-item border border-gray-300 p-4 mb-4 rounded-md 
    ${todo.completed ? "bg-green-100" : ""}
    ${
      todo.completed
        ? ""
        : todo.dueDate && isOverdue(todo.dueDate)
        ? "red-background"
        : ""
    }
    ${
      todo.completed
        ? ""
        : todo.dueDate && isDueSoon(todo.dueDate)
        ? "orange-background"
        : ""
    }
    ${
      todo.completed
        ? ""
        : todo.dueDate && isDueInAMonth(todo.dueDate)
        ? "bg-yellow-100"
        : ""
    }
  `}
        >
          {editingTodoId === todo.id ? (
            <>
              <div>
                <p>Name:</p>
                <input
                  type="text"
                  value={editedTodoName}
                  onChange={(e) => setEditedTodoName(e.target.value)}
                  className="input-style w-100"
                />
              </div>
              <div>
                <p>Description:</p>
                <input
                  type="text"
                  value={editedTodoDescription}
                  onChange={(e) => setEditedTodoDescription(e.target.value)}
                  className="input-style w-100"
                />
              </div>
              <div>
                <p>$$:</p>
                <input
                  type="text"
                  value={editedTodoMoney}
                  onChange={(e) => setEditedTodoMoney(e.target.value)}
                  className="input-style w-100"
                />
              </div>
              <div>
                <p>Points:</p>
                <input
                  type="text"
                  value={editedTodoPoints}
                  onChange={(e) => setEditedTodoPoints(e.target.value)}
                  className="input-style w-100"
                />
              </div>
              <div>
                <div>
                  <p>Due Date:</p>
                  {todo.dueDate !== null && (
                    <div>
                      <DatePicker
                        selected={selectedDueDate}
                        onChange={(date) => setSelectedDueDate(date)}
                        className="input-style w-100"
                      />
                      <label>
                        <input
                          className="radio-button"
                          type="radio"
                          value=""
                          onChange={() => setSelectedDueDate(null)} // Ensure selectedDueDate is set to null
                        />
                        Remove Due Date
                      </label>
                    </div>
                  )}

                  {todo.dueDate === null && ( // Check if todo.dueDate is null
                    <div>
                      <DatePicker
                        selected={selectedDueDate}
                        onChange={(date) => setSelectedDueDate(date)}
                        className="input-style w-100"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* <div>
                <p>Completed:</p>
                <select
                  value={completed}
                  onChange={(e) => setCompleted(e.target.value === "true")}
                  className="input-style w-100"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div> */}
              <div>
                <p>Assigned to:</p>
                <select
                  id="assigneeDropdown"
                  value={selectedChildId}
                  onChange={handleDropdownChange}
                  className="input-style w-100"
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
                        {currentUser.displayName ||
                          currentUser.email ||
                          "Current User"}
                      </option>
                    )}
                  </optgroup>
                  <optgroup label="Current User:">
                    {currentUser && (
                      <option key={currentUser.uid} value={currentUser.uid}>
                        {currentUser.displayName ||
                          currentUser.email ||
                          "Current User"}
                      </option>
                    )}
                  </optgroup>
                </select>
              </div>
              <br />
              <div className="space-x-4 text-center">
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
              <Container className="todo-viewing-container">
                <Row>
                  <div className="checkmark-icon-div">
                    {todo.completed ? (
                      <IoIosCheckmarkCircle className="checkmark-icon" />
                    ) : null}
                  </div>
                  <div className="due-status-div text-right">
                    {todo.dueDate &&
                    !todo.completed &&
                    isOverdue(todo.dueDate) ? (
                      <div className="due-status-wrapper">
                        <strong>OVERDUE!!</strong>
                      </div>
                    ) : null}
                    {todo.dueDate &&
                    !todo.completed &&
                    isDueInAMonth(todo.dueDate) &&
                    !isDueSoon(todo.dueDate) ? (
                      <div className="due-status-wrapper">
                        <strong>Due this Month</strong>
                      </div>
                    ) : null}
                    {todo.dueDate &&
                    !todo.completed &&
                    isDueSoon(todo.dueDate) ? (
                      <div className="due-status-wrapper">
                        <strong>Due this Week!</strong>
                      </div>
                    ) : null}
                  </div>

                  <div className="text-center">
                    <h3 className="text-center todo-name">"{todo.name}"</h3>
                  </div>

                  {todo.description ? (
                    <div md={6} lg={4} xl={3}>
                      <p className="text-center">
                        <span className="todo-card-p">Description:</span>
                        {<br />} {todo.description}
                      </p>
                    </div>
                  ) : null}

                  {todo.money ? (
                    <Col md={6} lg={4} xl={3}>
                      <p className="text-center">
                        <span className="todo-card-p">Money:</span>
                        {<br />} ${todo.money.toFixed(2)}
                      </p>
                    </Col>
                  ) : null}

                  {todo.points ? (
                    <Col md={6} lg={4} xl={3}>
                      <p className="text-center">
                        <span className="todo-card-p">Points:</span>
                        {<br />} {todo.points}
                      </p>
                    </Col>
                  ) : null}

                  <Col md={6} lg={4} xl={3}>
                    <p className="text-center">
                      <span className="todo-card-p">Due Date:</span>
                      <br />
                      {todo.dueDate
                        ? new Date(todo.dueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No Due Date"}
                    </p>
                  </Col>

                  {/* <Col md={6} lg={4} xl={3}>
                    <p className="text-center">
                      <span className="todo-card-p">Completed:</span>
                      {<br />} {todo.completed ? "Yes" : "No"}
                    </p>{" "}
                  </Col> */}
                  <Col md={6} lg={4} xl={3}>
                    <p className="text-center">
                      <span className="todo-card-p">Assigned To:</span>
                      {<br />} {getChildName(todo.assignedTo)}
                    </p>
                  </Col>
                  <Col md={6} lg={4} xl={3}>
                    <p className="text-center">
                      <span className="todo-card-p">Created By:</span>
                      {<br />} {todo.createdBy}
                    </p>
                  </Col>
                </Row>
              </Container>
              <div className="space-x-4 text-center edit-delete-div">
                <Button
                  className="  justify-content-center"
                  onClick={() =>
                    startEditing(
                      todo.id,
                      todo.name,
                      todo.description,
                      todo.money,
                      todo.points,
                      todo.assignedTo,
                      todo.completed,
                      todo.dueDate || null // Pass null if todo.dueDate is false or undefined
                    )
                  }
                  variant="primary"
                >
                  <FaEdit />
                </Button>

                <Button
                  className=" "
                  onClick={() => deleteTodo(todo.id)}
                  variant="danger"
                >
                  <FaTrash />
                </Button>
                {todo.completed ? (
                  <Button
                    className="incomplete-button"
                    onClick={async () => {
                      const confirmation = window.confirm(
                        "Mark this todo as Incomplete?"
                      );
                      if (confirmation) {
                        try {
                          await updateDoc(doc(db, "todos", todo.id), {
                            completed: false,
                          });
                          console.log(
                            `Todo with ID ${todo.id} marked as incomplete (userTodoList)`
                          );
                        } catch (error) {
                          console.error(
                            `Error marking todo with ID ${todo.id} as incomplete: (userTodoList)`,
                            error
                          );
                        }
                      }
                    }}
                    variant="warning" // Change the variant to warning for "Mark as Incomplete" button
                  >
                    Mark as Incomplete
                  </Button>
                ) : (
                  <Button
                    className=" "
                    onClick={async () => {
                      const confirmation = window.confirm(
                        "Mark this todo as done?"
                      );
                      if (confirmation) {
                        try {
                          await updateDoc(doc(db, "todos", todo.id), {
                            completed: true,
                          });
                          console.log(
                            `Todo with ID ${todo.id} marked as completed (userTodoList)`
                          );
                        } catch (error) {
                          console.error(
                            `Error marking todo with ID ${todo.id} as completed: (userTodoList)`,
                            error
                          );
                        }
                      }
                    }}
                    variant="success"
                  >
                    Mark as Done
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserTodosList;
