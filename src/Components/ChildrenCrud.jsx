import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { useAuth } from "../contexts/authContext";

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
      const childToAdd = {
        name: newChildName,
        owed: parseFloat(newChildOwed),
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
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
  

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
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Add Child
        </button>
      </div>

      {children.map((child) => (
        <div key={child.id} className="child-item border border-gray-300 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            
            <div>
              {editingChildId === child.id ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter child's name"
                    value={editChildName}
                    onChange={(event) => setEditChildName(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
                  />
                  <input
                    type="number"
                    placeholder="Enter amount owed"
                    value={editChildOwed}
                    onChange={(event) => setEditChildOwed(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
                  />
                  <button
                    onClick={() => submitEdit(child.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
                  >
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
                  <button
                    onClick={() => editChild(child.id, child.name, child.owed)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
                  >
                    Edit Child
                  </button>
                  <button
                    onClick={() => deleteChild(child.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
                  >
                    Delete Child
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
