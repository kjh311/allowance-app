import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { db } from '../../firebase/firebase';
import { Button } from 'react-bootstrap';

function TodoViewing() {
  const [todos, setTodos] = useState([]);
  const [children, setChildren] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoName, setEditedTodoName] = useState('');
  const [editedTodoDescription, setEditedTodoDescription] = useState('');
  const [editedTodoMoney, setEditedTodoMoney] = useState('');
  const [editedTodoPoints, setEditedTodoPoints] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');

  useEffect(() => {
    const unsubscribeTodos = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTodos(todosData);
    });

    const unsubscribeChildren = onSnapshot(collection(db, 'children'), (snapshot) => {
      const childrenData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChildren(childrenData);
    });

    return () => {
      unsubscribeTodos();
      unsubscribeChildren();
    };
  }, []);

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
      await updateDoc(doc(db, 'todos', editingTodoId), {
        name: editedTodoName,
        description: editedTodoDescription,
        money: parseFloat(editedTodoMoney),
        points: parseInt(editedTodoPoints),
        assignedTo: selectedChildId
      });
      console.log(`Todo with ID ${editingTodoId} updated successfully`);
      setEditingTodoId(null); // Reset editing state after saving
    } catch (error) {
      console.error(`Error updating todo with ID ${editingTodoId}:`, error.message);
    }
  };

  const getChildName = (childId) => {
    const child = children.find((child) => child.id === childId);
    return child ? child.name : 'Unassigned';
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
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  style={{ marginBottom: '10px', border: '1px solid #ced4da', borderRadius: '4px', padding: '6px' }}
                >
                  <option value="">Unassigned</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
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
                  <FaEdit className="mr-2" /> {/* Edit icon */}
                </Button>
                <Button onClick={() => deleteTodo(todo.id)} variant="danger" style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
                  <FaTrash className="mr-2" /> {/* Delete icon */}
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
