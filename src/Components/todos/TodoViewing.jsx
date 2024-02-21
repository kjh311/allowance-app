import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { db } from '../../firebase/firebase';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/authContext'; 

function TodoViewing() {
  const [todos, setTodos] = useState([]);
  const [children, setChildren] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoName, setEditedTodoName] = useState('');
  const [editedTodoDescription, setEditedTodoDescription] = useState('');
  const [editedTodoMoney, setEditedTodoMoney] = useState('');
  const [editedTodoPoints, setEditedTodoPoints] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribeTodos = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Filter todos based on createdBy or assignedTo
      const filteredTodos = todosData.filter(todo => todo.createdBy === currentUser.uid || todo.assignedTo === currentUser.uid);
      setTodos(filteredTodos);
    });
  
    const unsubscribeChildren = onSnapshot(collection(db, 'children'), (snapshot) => {
      const childrenData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChildren(childrenData);
    });
  
    return () => {
      unsubscribeTodos();
      unsubscribeChildren();
    };
  }, [currentUser]); // Re-run effect when currentUser changes
  

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      console.log(`Todo with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error.message);
    }
  };

  const startEditing = (id, name, description, money, points, assignedTo) => {
    setEditingTodoId(id);
    setEditedTodoName(name);
    setEditedTodoDescription(description);
    setEditedTodoMoney(money);
    setEditedTodoPoints(points);
    setSelectedChildId(assignedTo);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTodoName('');
    setEditedTodoDescription('');
    setEditedTodoMoney('');
    setEditedTodoPoints('');
    setSelectedChildId('');
  };

  const saveEditing = async () => {
    try {
      let assignedTo = selectedChildId !== undefined ? selectedChildId : ''; // Use selectedChildId if defined, otherwise use an empty string (for Unassigned)
      await updateDoc(doc(db, 'todos', editingTodoId), {
        name: editedTodoName,
        description: editedTodoDescription,
        money: parseFloat(editedTodoMoney),
        points: parseInt(editedTodoPoints),
        assignedTo: assignedTo
      });
      console.log(`Todo with ID ${editingTodoId} updated successfully`);
      setEditingTodoId(null);
    } catch (error) {
      console.error(`Error updating todo with ID ${editingTodoId}:`, error.message);
    }
  };
  

  const getChildName = (childId) => {
    if (childId === currentUser.uid) {
      return currentUser.displayName || 'Current User';
    } else {
      const child = children.find((child) => child.id === childId);
      return child ? child.name : 'Unassigned';
    }
  };

const handleDropdownChange = (event) => {
  const selectedChildId = event.target.value;
  console.log('Selected Child ID:', selectedChildId);
  console.log('Current User ID:', currentUser.uid);

  // Check if the selected child is unassigned
  if (!selectedChildId) {
    setSelectedChildId('');
  } else if (selectedChildId === currentUser.uid) {
    setSelectedChildId(selectedChildId);
  } else {
    // Find the selected child in the children list
    const selectedChild = children.find((child) => child.userId === currentUser.uid && child.id === selectedChildId);
    console.log('Selected Child:', selectedChild);
    // Check if the selected child belongs to the current user
    if (selectedChild) {
      setSelectedChildId(selectedChildId);
    }
  }
};

  
  
  

  
  

  return (
    <div className="todo-list-container">
      {todos.map((todo) => (
        <div key={todo.id} className="todo-item border border-gray-300 p-4 mb-4 rounded-md">
          {editingTodoId === todo.id ? (
            <>
              <div>
                <input
                  type="text"
                  value={editedTodoName}
                  onChange={(e) => setEditedTodoName(e.target.value)}
                  style={{ marginBottom: '10px', border: '1px solid #ced4da', borderRadius: '4px', padding: '6px' }}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={editedTodoDescription}
                  onChange={(e) => setEditedTodoDescription(e.target.value)}
                  style={{ marginBottom: '10px', border: '1px solid #ced4da', borderRadius: '4px', padding: '6px' }}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={editedTodoMoney}
                  onChange={(e) => setEditedTodoMoney(e.target.value)}
                  style={{ marginBottom: '10px', border: '1px solid #ced4da', borderRadius: '4px', padding: '6px' }}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={editedTodoPoints}
                  onChange={(e) => setEditedTodoPoints(e.target.value)}
                  style={{ marginBottom: '10px', border: '1px solid #ced4da', borderRadius: '4px', padding: '6px' }}
                />
              </div>
              <div>
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
  {/* Add an option for the current user */}
  {currentUser && (
    <option key={currentUser.uid} value={currentUser.uid}>
      {currentUser.displayName || 'Current User'}
    </option>
  )}
</select>

              </div>
              <div>
                <Button onClick={saveEditing} variant="primary" style={{ marginRight: '5px', backgroundColor: '#007bff', borderColor: '#007bff' }}>
                  Save
                </Button>
                <Button onClick={cancelEditing} variant="secondary" style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>Name: {todo.name}</p>
              <p>Description: {todo.description}</p>
              <p>Money: ${todo.money}</p>
              <p>Points: {todo.points}</p>
              <p>Assigned To: {getChildName(todo.assignedTo)}</p>
              <div className="flex">
                <Button onClick={() => startEditing(todo.id, todo.name, todo.description, todo.money, todo.points, todo.assignedTo)} variant="primary" style={{ marginRight: '5px', backgroundColor: '#007bff', borderColor: '#007bff' }}>
                  <FaEdit className="mr-2" />
                </Button>
                <Button onClick={() => deleteTodo(todo.id)} variant="danger" style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
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
