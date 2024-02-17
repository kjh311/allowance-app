import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FaEdit, FaTrash } from 'react-icons/fa';

function ChildViewing() {
  const [children, setChildren] = useState([]);
  const [editingChildId, setEditingChildId] = useState(null);
  const [editChildName, setEditChildName] = useState("");
  const [editChildOwed, setEditChildOwed] = useState("");

  useEffect(() => {
    console.log("Reading children data from database...");
    const childrenCollectionRef = collection(db, "children");
    const unsubscribe = onSnapshot(childrenCollectionRef, (querySnapshot) => {
      const loadedChildren = [];
      querySnapshot.forEach((doc) => {
        loadedChildren.push({ id: doc.id, ...doc.data() });
      });
      setChildren(loadedChildren);
    });
  
    return () => unsubscribe();
  }, []);

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
      const childDocRef = doc(db, "children", id);
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

  const deleteChild = async (id) => {
    try {
      await deleteDoc(doc(db, "children", id));
      console.log(`Child with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting child with ID ${id}:`, error);
    }
  };

  return (
    <div className="child-service-div">
      {children.map((child) => (
        <div key={child.id} className="child-item border border-gray-300 p-4 mb-4 rounded-md">
          <p>Name: {child.name}</p>
          <p>Owed: ${child.owed}</p>
          <div className="flex flex-col"> {/* Ensure inputs are displayed vertically */}
            {editingChildId === child.id ? (
              <>
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
                <div className="flex"> {/* Button container */}
                  <button
                    onClick={() => submitEdit(child.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
                  >
                    <FaEdit className="mr-2" />
                    Submit
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
              <button
  onClick={() => editChild(child.id, child.name, child.owed)}
  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full flex items-center justify-center mr-2"
>
  <FaEdit />
</button>
<button
  onClick={() => deleteChild(child.id)}
  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-full flex items-center justify-center"
>
  <FaTrash />
</button>

              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
  
}

export default ChildViewing;
