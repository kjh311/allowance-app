import { db } from "../firebase/firebase";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../contexts/authContext"; // Import the useAuth hook to get the current user

function ColorCrud() {
  // Get the current user from the AuthContext
  const { currentUser } = useAuth();

  // Set state for loading colors and values in the database
  const [colors, setColors] = useState([]);

  // Set state for adding new colors and values
  const [newColor, setNewColor] = useState("");
  const [newValue, setNewValue] = useState("");

  // Set state for updating colors and values
  const [updatedColor, updateColorFromInput] = useState("");
  const [updatedValue, updateValueFromInput] = useState("");

  // Variable that points to the database collection
  const colorsCollectionRef = collection(db, "color");

  // Function to get the current user's colors
  const getUserColors = async () => {
    const colorsSnapshot = await getDocs(collection(db, "color"));
    const userColors = colorsSnapshot.docs
      .filter((doc) => doc.data().userId === currentUser.uid)
      .map((doc) => ({ ...doc.data(), id: doc.id }));
    setColors(userColors);
  };

  // Read user's colors on component mount
  useEffect(() => {
    getUserColors();
  }, [currentUser]); // Reload colors when currentUser changes

  // Create color function
  const createColor = async () => {
    try {
      // Add the new color to the Firestore database with the current user's ID
      const docRef = await addDoc(colorsCollectionRef, {
        name: newColor,
        value: newValue,
        userId: currentUser.uid,
      });

      // Update the local state immediately with the newly created color
      setColors((prevColors) => [
        ...prevColors,
        { name: newColor, value: newValue, id: docRef.id },
      ]);

      // Clear the input fields after successful creation
      setNewColor("");
      setNewValue("");

      console.log("Color created successfully");
    } catch (error) {
      console.error("Error creating color:", error);
    }
  };

  // Update color and value in Firestore and local state
  const updateColor = async (id) => {
    try {
      // Get a reference to the specific color document in Firestore
      const colorDoc = doc(db, "color", id);

      // Create an object with the new fields (name and value) to be updated
      const newFields = { name: updatedColor, value: updatedValue };

      // Update the color document in Firestore with the new fields
      await updateDoc(colorDoc, newFields);

      // Update the local state by mapping over the existing colors and replacing the updated one
      setColors((prevColors) =>
        prevColors.map((color) =>
          color.id === id
            ? { ...color, name: updatedColor, value: updatedValue }
            : color
        )
      );

      console.log(`Color with ID ${id} updated successfully`);
    } catch (error) {
      console.error(`Error updating color with ID ${id}:`, error);
    }
  };

  // Delete color function
  const deleteColor = async (id) => {
    try {
      // Get a reference to the specific color document in Firestore
      const colorDoc = doc(db, "color", id);

      // Delete the color document in Firestore
      await deleteDoc(colorDoc);

      // Update the local state by filtering out the deleted color
      setColors((prevColors) => prevColors.filter((color) => color.id !== id));

      console.log(`Color with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting color with ID ${id}:`, error);
    }
  };

  return (
    <div className="color-service-div">
      {/* Form to add a new color */}
      <div className="add-color-form rounded-lg border border-gray-300 p-4 flex flex-col items-center">
        <label htmlFor="colorInput" className="block mb-2">
          Add New Color:
        </label>
        <div className="mb-2">
          <input
            id="colorInput"
            placeholder="Color..."
            value={newColor}
            onChange={(event) => setNewColor(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            placeholder="Value..."
            value={newValue}
            onChange={(event) => setNewValue(event.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={createColor}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Add Color
        </button>
      </div>

      {/* Display existing colors */}
      {colors.map((color) => (
        <div
          key={color.id}
          className="border border-gray-300 p-4 mb-4 rounded-md"
        >
          <h1
            className="text-white py-2 px-4 rounded-md"
            style={{ backgroundColor: color.value }}
          >
            {color.name} {color.value}
          </h1>
          <div className="flex mb-2">
            <div className="flex-1 mr-2">
              <input
                placeholder="Update Color Name..."
                onChange={(event) => updateColorFromInput(event.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
              />
            </div>
            <div className="flex-1">
              <input
                placeholder="Update Value..."
                onChange={(event) => updateValueFromInput(event.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
              />
            </div>
            {/* Update button */}
            <button
              onClick={() => updateColor(color.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md ml-2"
            >
              Edit
            </button>
          </div>
          {/* Delete button */}
          <button
            onClick={() => deleteColor(color.id)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
          >
            Delete Color
          </button>
        </div>
      ))}
    </div>
  );
}

export default ColorCrud;
