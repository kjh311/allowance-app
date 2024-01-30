import { db } from "../firebase";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
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

  //useEffect loads data when page loads
  useEffect(() => {
    const getColors = async () => {
      const data = await getDocs(colorsCollectionRef);
      setColors(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      //temp to make sure data is loading correctly
      console.log(data);
    };

    getColors();
  }, []);

  //create color in database. Send value from input to useState variables to this function:
  const createColor = async () => {
    await addDoc(colorsCollectionRef, { name: newColor, value: newValue });
  };

  //update color and value
  const updateColor = async (id) => {
    const colorDoc = doc(db, "color", id);
    console.log(updatedColor, updatedValue);
    const newFields = { name: updatedColor, value: updatedValue };
    await updateDoc(colorDoc, newFields);
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

            <button onClick={() => updateColor(color.id)}>Edit:</button>
          </div>
        );
      })}
    </div>
  );
}

export default ColorCrud;
