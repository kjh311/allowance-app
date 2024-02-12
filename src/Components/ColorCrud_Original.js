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

// import { getAuth } from "firebase/auth";

function ColorCrud() {
  //set state for loading colors and values in database
  const [colors, setColors] = useState([]);

  //set state for adding new colors and values
  const [newColor, setNewColor] = useState("");
  const [newValue, setNewValue] = useState("");

  //set state for updating colors and values
  const [updatedColor, updateColorFromInput] = useState("");
  const [updatedValue, updateValueFromInput] = useState("");

  //variable that points to database collection
  const colorsCollectionRef = collection(db, "color");

  // Log function to log read events
  const logReadEvent = (eventType, collectionPath) => {
    console.log(`Read event: ${eventType} in collection ${collectionPath}`);
  };

  //READ
  useEffect(() => {
    // const userId = getAuth.currentUser.uid;
    // console.log(getAuth.currentUser);
    // Define an asynchronous function to fetch colors data
    const getColors = async () => {
      try {
        // Log before the read operation
        logReadEvent("getDocs", "color");

        // Fetch data from the "color" collection in the database
        const data = await getDocs(collection(db, "color"));

        // Log after the read operation is successful
        logReadEvent("getDocsSuccess", "color");

        // Update the local state with the fetched data, mapping over each document
        setColors(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        // Log an error message if there's an issue fetching data
        console.error("Error fetching data:", error);
      }
    };

    // Call the getColors function when the component mounts (runs once)
    getColors();
  }, []); // Empty dependency array, runs only once when the component mounts

  //used to help with the update
  // This useEffect sets up real-time listeners for each color in the colors state.
  // For each color, it subscribes to the onSnapshot event, triggering when the color document is updated in Firestore.
  // It logs a read event when the snapshot event starts and completes.
  // When a snapshot is received, it updates the local state (colors) with the new data.
  // The returned cleanup function unsubscribes all listeners when the component unmounts or when the colors state changes.
  // These useEffect functions work together to fetch initial data on mount and set up real-time listeners for continuous updates.
  // useEffect hook to set up listeners for color document changes
  useEffect(() => {
    // Map over the colors array and set up listeners for each color document

    const unsubscribeListeners = colors.map((color) => {
      // Create a reference to the specific color document in the database
      const colorDocRef = doc(db, "color", color.id);

      // Set up a listener for changes to the color document
      return onSnapshot(colorDocRef, (snapshot) => {
        // Log that the read event for the color has started
        console.log(`Read event for color ${color.id} started`);

        // Update the local state by creating a new array with the updated color
        setColors((prevColors) => {
          const updatedColors = [...prevColors];

          // Find the index of the updated color in the array
          const updatedColorIndex = updatedColors.findIndex(
            (c) => c.id === color.id
          );

          // If the color is found, update it with the latest data from the snapshot
          if (updatedColorIndex !== -1) {
            updatedColors[updatedColorIndex] = {
              ...snapshot.data(),
              id: snapshot.id,
            };
          }

          // Return the updated array of colors
          return updatedColors;
        });

        // Log that the read event for the color has completed
        console.log(`Read event for color ${color.id} completed`);
      });
    });

    // Clean up: Unsubscribe from all the color document listeners when the component unmounts
    return () => {
      unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, []); // Empty dependency array, runs only once when the component mounts

  //CREATE
  const createColor = async () => {
    try {
      // Add the new color to the Firestore database
      const docRef = await addDoc(colorsCollectionRef, {
        name: newColor,
        value: newValue,
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

  // UPDATE color and value in Firestore and local state
  const updateColor = async (id) => {
    // Log a message indicating the start of the update process
    console.log(`Updating color with id ${id} started`);

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

      // Log a message indicating the successful completion of the update
      console.log(`Updating color with id ${id} completed successfully`);
    } catch (error) {
      // Log an error message if there is an error during the update process
      console.error(`Error updating color with id ${id}:`, error);
    }
  };

  //DELETE color function
  const deleteColor = async (id) => {
    // Log a message indicating the start of the delete process
    console.log(`Deleting color with id ${id} started`);

    try {
      // Get a reference to the specific color document in Firestore
      const colorDoc = doc(db, "color", id);

      // Delete the color document in Firestore
      await deleteDoc(colorDoc);

      // Update the local state by filtering out the deleted color
      setColors((prevColors) => prevColors.filter((color) => color.id !== id));

      // Log a message indicating the successful completion of the delete
      console.log(`Deleting color with id ${id} completed successfully`);
    } catch (error) {
      // Log an error message if there is an error during the delete process
      console.error(`Error deleting color with id ${id}:`, error);
    }
  };

  return (
    <div className="color-service-div">
      <div className="add-color-form rounded-lg border border-gray-300 p-4 flex flex-col items-center">
        <label htmlFor="colorInput" className="block mb-2">
          Add New Color:
        </label>
        <div className="mb-2">
          <input
            id="colorInput"
            placeholder="Color..."
            onChange={(event) => {
              setNewColor(event.target.value);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-2">
          <input
            placeholder="Value..."
            onChange={(event) => {
              setNewValue(event.target.value);
            }}
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

      {colors.map((color, id) => {
        // Use a unique identifier for the key, for example, the index or color.id
        return (
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
                  onChange={(event) => {
                    console.log(
                      `Updating color name input for color with id ${color.id}`
                    );
                    updateColorFromInput(event.target.value);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              <div className="flex-1">
                <input
                  placeholder="Update Value..."
                  onChange={(event) => {
                    console.log(
                      `Updating color value input for color with id ${color.id}`
                    );
                    updateValueFromInput(event.target.value);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              {/* update button */}
              <button
                onClick={() => {
                  console.log(
                    `Update button clicked for color with id ${color.id}`
                  );
                  updateColor(color.id);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md ml-2"
              >
                Edit
              </button>
            </div>
            {/* delete button */}
            <button
              onClick={() => {
                console.log(
                  `Delete button clicked for color with id ${color.id}`
                );
                deleteColor(color.id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
            >
              Delete Color
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ColorCrud;
