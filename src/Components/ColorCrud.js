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

  // useEffect makes the data render when the page loads
  useEffect(() => {
    const getColors = async () => {
      try {
        // Log before the read
        logReadEvent("getDocs", "color");

        const data = await getDocs(collection(db, "color"));

        // Log after the read
        logReadEvent("getDocsSuccess", "color");

        setColors(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getColors();
  }, []); // Empty dependency array, runs only once when the component mounts

  useEffect(() => {
    const unsubscribeListeners = colors.map((color) => {
      const colorDocRef = doc(db, "color", color.id);
      return onSnapshot(colorDocRef, (snapshot) => {
        console.log(`Read event for color ${color.id} started`);

        setColors((prevColors) => {
          const updatedColors = [...prevColors];
          const updatedColorIndex = updatedColors.findIndex(
            (c) => c.id === color.id
          );
          if (updatedColorIndex !== -1) {
            updatedColors[updatedColorIndex] = {
              ...snapshot.data(),
              id: snapshot.id,
            };
          }
          return updatedColors;
        });

        console.log(`Read event for color ${color.id} completed`);
      });
    });

    return () => {
      unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, []); // Empty dependency array, runs only once when the component mounts

  //hopefully this will automatically render the newly created color
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

  //update color and value
  const updateColor = async (id) => {
    console.log(`Updating color with id ${id} started`);

    try {
      const colorDoc = doc(db, "color", id);
      const newFields = { name: updatedColor, value: updatedValue };
      await updateDoc(colorDoc, newFields);

      // Update the local state by mapping over the existing colors and replacing the updated one
      setColors((prevColors) =>
        prevColors.map((color) =>
          color.id === id
            ? { ...color, name: updatedColor, value: updatedValue }
            : color
        )
      );

      console.log(`Updating color with id ${id} completed successfully`);
    } catch (error) {
      console.error(`Error updating color with id ${id}:`, error);
    }
  };

  //delete color function
  const deleteColor = async (id) => {
    console.log(`Deleting color with id ${id} started`);

    try {
      const colorDoc = doc(db, "color", id);
      await deleteDoc(colorDoc);

      // Update the local state by filtering out the deleted color
      setColors((prevColors) => prevColors.filter((color) => color.id !== id));

      console.log(`Deleting color with id ${id} completed successfully`);
    } catch (error) {
      console.error(`Error deleting color with id ${id}:`, error);
    }
  };

  return (
    <div className="color-service-div">
      <div className="add-color-form">
        <label htmlFor="colorInput">Add New Color:</label>
        <br />
        <input
          id="colorInput"
          placeholder="Color..."
          onChange={(event) => {
            setNewColor(event.target.value);
          }}
        />

        <br />

        <input
          placeholder="Value..."
          onChange={(event) => {
            setNewValue(event.target.value);
          }}
        />
        <br />

        <button onClick={createColor} className="add-button">
          Add Color
        </button>
      </div>

      {colors.map((color, id) => {
        // Use a unique identifier for the key, for example, the index or color.id
        return (
          <div key={color.id}>
            <h1 style={{ backgroundColor: color.value }}>
              {color.name} {color.value}
            </h1>
            <input
              placeholder="Update Color Name..."
              onChange={(event) => {
                console.log(
                  `Updating color name input for color with id ${color.id}`
                );
                updateColorFromInput(event.target.value);
              }}
            />
            <input
              placeholder="Update Value..."
              onChange={(event) => {
                console.log(
                  `Updating color value input for color with id ${color.id}`
                );
                updateValueFromInput(event.target.value);
              }}
            />
            {/* update button */}
            <button
              onClick={() => {
                console.log(
                  `Update button clicked for color with id ${color.id}`
                );
                updateColor(color.id);
              }}
            >
              Edit
            </button>
            <br />
            {/* delete button */}
            <button
              onClick={() => {
                console.log(
                  `Delete button clicked for color with id ${color.id}`
                );
                deleteColor(color.id);
              }}
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
