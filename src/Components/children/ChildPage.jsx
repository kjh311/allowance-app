import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from 'firebase/firestore';

function ChildPage() {
  const { id } = useParams();
  console.log("ID:", id);
  const [child, setChild] = useState(null);
  // console.log(db)



  useEffect(() => {
    const fetchChildData = async () => {
      try {
        console.log("Fetching child data...");
        const childDocRef = doc(db, 'children', id);
        const docSnap = await getDoc(childDocRef);
        if (docSnap.exists()) {
          const childData = docSnap.data();
          console.log('Retrieved Child Data:', childData);
          setChild({ id: docSnap.id, ...childData });
        } else {
          console.log('No such document found for ID:', id);
        }
      } catch (error) {
        console.error('Error getting child:', error);
      }
    };

    fetchChildData();

    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [id]); // Re-run effect when ID changes

  if (!child) {
    console.log("Child data not yet loaded...");
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Child Details</h2>
      <p>Name: {child.name}</p>
      <p>Owed: ${child.owed}</p>
      {/* <p>User ID: {child.userId}</p> */}
    </div>
  );
}

export default ChildPage;
