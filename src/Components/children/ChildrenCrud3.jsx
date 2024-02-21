import { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import ChildViewing from "./ChildViewing";

function ChildCrud() {
  const { currentUser } = useAuth();
  const [newChildName, setNewChildName] = useState("");
  const [newChildOwed, setNewChildOwed] = useState("");

  const childrenCollectionRef = collection(db, "children");

  const createChild = async () => {
    try {
      const owed = newChildOwed === "" ? 0 : parseFloat(newChildOwed); // Set default to 0 if empty
      const childToAdd = {
        name: newChildName,
        owed: owed,
        userId: currentUser.uid
      };
  
      await addDoc(childrenCollectionRef, childToAdd);
      console.log("Child created successfully");
      setNewChildName("");
      setNewChildOwed("");
    } catch (error) {
      console.error("Error creating child:", error);
    }
  };

  const triggerUpdate = () => {
    // Function to trigger update in ChildViewing component
    console.log("Triggering update in ChildViewing component");
  };

  return (
    <div>
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
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md px-4 py-2"
        >
          Create Child
        </button>
      </div>
      <ChildViewing triggerUpdate={triggerUpdate} />
    </div>
  );
}

export default ChildCrud;
