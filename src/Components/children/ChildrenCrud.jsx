import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';


function ChildCrud() {
  const { currentUser } = useAuth();
  const [children, setChildren] = useState([]);
  const [newChildName, setNewChildName] = useState("");
  const [newChildOwed, setNewChildOwed] = useState("");
  const [editingChildId, setEditingChildId] = useState(null);
  const [editChildName, setEditChildName] = useState("");
  const [editChildOwed, setEditChildOwed] = useState("");

  const childrenCollectionRef = collection(db, "children");

  const editChild = (id, name, owed) => {
    setEditingChildId(id);
    setEditChildName(name);
    setEditChildOwed(owed);
  };

  const cancelEdit = () => {
    setEditingChildId(null);
  };

  const submitEdit = async (id) => {
    try {
      const childDocRef = doc(childrenCollectionRef, id);
      await updateDoc(childDocRef, {
        name: editChildName,
        owed: parseFloat(editChildOwed)
      });
      console.log(`Child with ID ${id} updated successfully`);
      setEditingChildId(null);
    } catch (error) {
      console.error(`Error updating child with ID ${id}:`, error);
    }
  };

  const createChild = async () => {
    try {
      const owed = newChildOwed === "" ? 0 : parseFloat(newChildOwed); // Set default to 0 if empty
      const childToAdd = {
        name: newChildName,
        owed: owed,
        userId: currentUser.uid
      };
  
      const docRef = await addDoc(childrenCollectionRef, childToAdd);
      console.log("Child created successfully with ID:", docRef.id);
      setNewChildName("");
      setNewChildOwed("");
    } catch (error) {
      console.error("Error creating child:", error);
    }
  };
  

  const deleteChild = async (id) => {
    try {
      const childDocRef = doc(childrenCollectionRef, id);
      await deleteDoc(childDocRef);
      console.log(`Child with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting child with ID ${id}:`, error);
    }
  };

  useEffect(() => {
    console.log("Reading children data from database...");
    const unsubscribe = onSnapshot(childrenCollectionRef, (querySnapshot) => {
      const loadedChildren = [];
      querySnapshot.forEach((doc) => {
        loadedChildren.push({ id: doc.id, ...doc.data() });
      });
      setChildren(loadedChildren);
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <div className="child-service-div">
      <div className="add-child-form rounded-lg border border-gray-300 p-4 mb-4 flex flex-col items-center">
        <h1>Create new Child</h1>
        <label htmlFor="childNameInput" className="block mb-2">
          Child Name:
        </label>
        <input
          id="childNameInput"
          placeholder="Enter child's name"
          value={newChildName}
          onChange={(event) => setNewChildName(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="childOwedInput" className="block mb-2">
          Amount Owed:
        </label>
        <input
          id="childOwedInput"
          placeholder="Enter amount owed"
          value={newChildOwed}
          onChange={(event) => setNewChildOwed(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
        />
        <button
          onClick={createChild}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full flex items-center"
        >
          <FaPlus className="mr-2" /> 
        </button>

      </div>

      {children.map((child) => (
        <div key={child.id} className="child-item border border-gray-300 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <div>
            {editingChildId === child.id ? (
  <>
    {/* Edit input fields */}
    <div className="mb-2">
      <input
        type="text"
        placeholder="Enter child's name"
        value={editChildName}
        onChange={(event) => setEditChildName(event.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
      />
    </div>
    <div className="mb-2">
      <input
        type="number"
        placeholder="Enter amount owed"
        value={editChildOwed}
        onChange={(event) => setEditChildOwed(event.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
      />
    </div>
    {/* Buttons with icons */}
    <button
      onClick={() => submitEdit(child.id)}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
    >
      <FaEdit className="mr-2" /> {/* Edit icon */}
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
    <p>Name: {child.name}</p>
    <p>Owed: ${child.owed}</p>
    <div>
    <Link to={`/child/${child.id}`} className="text-blue-500 hover:underline mr-2">View Details</Link>
    </div>
    {/* Buttons with icons */}
    <button
      onClick={() => editChild(child.id, child.name, child.owed)}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
    >
      <FaEdit className="mr-2" /> {/* Edit icon */}
     
    </button>
    <button
      onClick={() => deleteChild(child.id)}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
    >
      <FaTrash className="mr-2" /> {/* Delete icon */}
      
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

export default ChildCrud;
