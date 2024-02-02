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

  // useEffect makes the data render when the page loads
  useEffect(() => {
    const getColors = async () => {
      const data = await getDocs(colorsCollectionRef);
      setColors(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getColors();
    // Ensure that the colorsCollectionRef is in the dependency array,
    // this causes the changes to be auto rendered on update
  }, [colorsCollectionRef]);

  //   Limit Real-time Updates to Specific Documents:
  // If you only need real-time updates for specific documents,
  // you can set up listeners for those documents individually
  // rather than the entire collection. This way, changes to other
  // documents won't trigger unnecessary reads.
  useEffect(() => {
    const unsubscribeListeners = colors.map((color) => {
      const colorDocRef = doc(db, "color", color.id);
      return onSnapshot(colorDocRef, (snapshot) => {
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
      });
    });

    return () => {
      unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [colors]);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(colorsCollectionRef, (snapshot) => {
  //     setColors(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   });

  //   return () => unsubscribe(); // Cleanup the listener when the component unmounts
  // }, [colorsCollectionRef]);

  //create color in database. Send value from input to useState variables to this function:
  const createColor = async () => {
    await addDoc(colorsCollectionRef, { name: newColor, value: newValue });
  };

  //update color and value
  const updateColor = async (id) => {
    //"doc" helps get a specific color along with the id
    const colorDoc = doc(db, "color", id);
    // console.log(updatedColor, updatedValue);
    const newFields = { name: updatedColor, value: updatedValue };
    await updateDoc(colorDoc, newFields);
  };

  //delete color function
  const deleteColor = async (id) => {
    //"doc" helps get a specific color along with the id
    const colorDoc = doc(db, "color", id);
    await deleteDoc(colorDoc);
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
                updateColorFromInput(event.target.value);
              }}
            />
            <input
              placeholder="Update Value..."
              onChange={(event) => {
                updateValueFromInput(event.target.value);
              }}
            />
            {/* update button */}
            <button onClick={() => updateColor(color.id)}>Edit:</button>
            <br />
            {/* delete button */}
            <button
              onClick={() => {
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
