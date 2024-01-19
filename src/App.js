import "./Styles/App.scss";
import Crud from "./Components/Crud";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [colors, setColors] = useState([]);
  const colorsCollectionRef = collection(db, "color");

  useEffect(() => {
    const getColors = async () => {
      const data = await getDocs(colorsCollectionRef);
      console.log(data);
    };

    getColors();
  }, []);
  return (
    <div className="App">
      <Crud />
    </div>
  );
}

export default App;
