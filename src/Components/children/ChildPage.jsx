import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ChildTodoList from "../children/ChildTodoList.jsx";

function ChildPage() {
  const { id } = useParams();
  const [child, setChild] = useState(null);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        console.log("Fetching child data...");
        const childDocRef = doc(db, 'children', id);
        const docSnap = await getDoc(childDocRef);
        if (docSnap.exists()) {
          const childData = docSnap.data();
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
    <div className="flex justify-center items-center flex-col h-screen">
      <div className="w-96 px-6 py-6 text-center bg-gray-800 rounded-lg lg:mt-0 xl:px-10 mb-8">
        <div className="space-y-4 xl:space-y-6">
          <img className="mx-auto rounded-full h-36 w-36" src={child.photoURL} alt="child avatar" />
          <div className="space-y-2">
            <div className="flex justify-center items-center flex-col space-y-3 text-lg font-medium leading-6">
              <h3 className="text-white">{child.name}</h3>
            </div>
          </div>
          <div className="text-left text-white">
            <h2 className="text-lg font-bold">Child Details</h2>
            <p className="mb-2">Name: {child.name}</p>
            <p className="mb-2">Owed: ${child.owed}</p>
          </div>
        </div>
      </div>
      <ChildTodoList childId={id} jsx="true" />
    </div>
  );
}

export default ChildPage;
