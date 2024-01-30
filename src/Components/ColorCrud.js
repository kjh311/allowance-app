import { db } from "../firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
// import { Form, Button } from "react-bootstrap";

function ColorCrud() {
  //set state for loading colors and values in database
  const [colors, setColors] = useState([]);

  //set state for adding new colors and values
  const [newColor, setNewColor] = useState("");
  const [newValue, setNewValue] = useState("");

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

  return (
    <div className="color-service-div">
      <input
        placeholder="Color..."
        onChange={(event) => {
          setNewColor(event.target.value);
        }}
      />

      <input
        placeholder="Value..."
        onChange={(event) => {
          setNewValue(event.target.value);
        }}
      />

      <button onClick={createColor} className="add-button">
        Add Color
      </button>

      {colors.map((color, id) => {
        // Use a unique identifier for the key, for example, the index or color.id
        return (
          <div key={color.id}>
            <h1 style={{ backgroundColor: color.value }}>
              Color: {color.name}
            </h1>
          </div>
        );
      })}
    </div>
  );
}

export default ColorCrud;
