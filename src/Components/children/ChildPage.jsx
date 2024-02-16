import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase';

function ChildPage() {
  const { id } = useParams();
  console.log("ID:", id);
  const [child, setChild] = useState(null);

  useEffect(() => {
    const getChild = async () => {
      try {
        const docRef = await db.collection('children').doc(id).get();
        if (docRef.exists()) {
          const childData = docRef.data();
          console.log('Retrieved Child Data:', childData);
          setChild({ id: docRef.id, ...childData });
        } else {
          console.log('No such document found for ID:', id);
        }
      } catch (error) {
        console.error('Error getting child:', error);
      }
    };

    getChild();

    // Clean up function
    return () => {
      // Any cleanup code here
    };
  }, [id]);

  if (!child) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Child Details</h2>
      <p>Name: {child.name}</p>
      <p>Owed: ${child.owed}</p>
      <p>User ID: {child.userId}</p>
    </div>
  );
}

export default ChildPage;
