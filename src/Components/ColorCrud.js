import { db } from "../firebase";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";

function ColorCrud() {
  const [colors, setColors] = useState([]);
  const colorsCollectionRef = collection(db, "color");

  //useEffect loads data when page loads
  useEffect(() => {
    const getColors = async () => {
      const data = await getDocs(colorsCollectionRef);
      setColors(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getColors();
  }, []);

  return (
    <div className="color-service-div">
      {colors.map((color, index) => {
        // Use a unique identifier for the key, for example, the index or color.id
        return (
          <div key={index}>
            <h1>Color: {color.name}</h1>
            <h1>Value: {color.value}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default ColorCrud;
