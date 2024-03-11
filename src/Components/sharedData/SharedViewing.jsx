import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { Table, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

function SharedViewing() {
  const { currentUser } = useAuth();
  const [sharedData, setSharedData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "sharedData"),
      (querySnapshot) => {
        const loadedSharedData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loadedSharedData.push({ id: doc.id, ...data });
        });
        setSharedData(loadedSharedData);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDeleteSharedData = async (id) => {
    const confirmed = window.confirm("Stop sharing data with this user?");
    if (confirmed) {
      try {
        // Find the sharedData document
        const sharedDoc = await getDoc(doc(db, "sharedData", id));
        const sharedData = sharedDoc.data();

        // Determine the current user's email and the other user's email
        let currentUserEmail, otherUserEmail;
        if (sharedData.email === currentUser.email) {
          currentUserEmail = sharedData.email;
          otherUserEmail = sharedData.senderEmail;
        } else if (sharedData.senderEmail === currentUser.email) {
          currentUserEmail = sharedData.senderEmail;
          otherUserEmail = sharedData.email;
        } else {
          console.error("Current user not found in sharedData");
          return;
        }

        // Find the ids for both users in the users collection
        const currentUserQuery = query(
          collection(db, "users"),
          where("email", "==", currentUserEmail)
        );
        const currentUserSnapshot = await getDocs(currentUserQuery);
        const otherUserQuery = query(
          collection(db, "users"),
          where("email", "==", otherUserEmail)
        );
        const otherUserSnapshot = await getDocs(otherUserQuery);

        let currentUserId, otherUserId;
        currentUserSnapshot.forEach((doc) => {
          currentUserId = doc.id;
        });
        otherUserSnapshot.forEach((doc) => {
          otherUserId = doc.id;
        });

        if (!currentUserId || !otherUserId) {
          console.error("One or both users not found in users collection");
          return;
        }

        // Remove otherUserId from current user's sharingWith field
        await updateDoc(doc(db, "users", currentUserId), {
          sharingWith: arrayRemove(otherUserId),
        });

        // Remove currentUserId from other user's sharingWith field
        await updateDoc(doc(db, "users", otherUserId), {
          sharingWith: arrayRemove(currentUserId),
        });

        // Loop through children collection to remove other user's id from sharedUsers field
        const childrenQueryCurrentUser = query(
          collection(db, "children"),
          where("userId", "==", currentUserId)
        );
        const childrenSnapshotCurrentUser = await getDocs(
          childrenQueryCurrentUser
        );
        childrenSnapshotCurrentUser.forEach(async (childDoc) => {
          const childData = childDoc.data();
          await updateDoc(doc(db, "children", childDoc.id), {
            sharedUsers: arrayRemove(otherUserId),
          });
        });

        const childrenQueryOtherUser = query(
          collection(db, "children"),
          where("userId", "==", otherUserId)
        );
        const childrenSnapshotOtherUser = await getDocs(childrenQueryOtherUser);
        childrenSnapshotOtherUser.forEach(async (childDoc) => {
          const childData = childDoc.data();
          await updateDoc(doc(db, "children", childDoc.id), {
            sharedUsers: arrayRemove(currentUserId),
          });
        });

        // Loop through todos collection to remove other user's id from sharedUsers field
        const todosQueryCurrentUser = query(
          collection(db, "todos"),
          where("userId", "==", currentUserId)
        );
        const todosSnapshotCurrentUser = await getDocs(todosQueryCurrentUser);
        todosSnapshotCurrentUser.forEach(async (todoDoc) => {
          const todoData = todoDoc.data();
          await updateDoc(doc(db, "todos", todoDoc.id), {
            sharedUsers: arrayRemove(otherUserId),
          });
        });

        const todosQueryOtherUser = query(
          collection(db, "todos"),
          where("userId", "==", otherUserId)
        );
        const todosSnapshotOtherUser = await getDocs(todosQueryOtherUser);
        todosSnapshotOtherUser.forEach(async (todoDoc) => {
          const todoData = todoDoc.data();
          await updateDoc(doc(db, "todos", todoDoc.id), {
            sharedUsers: arrayRemove(currentUserId),
          });
        });

        // Finally, delete sharedData document
        await deleteDoc(doc(db, "sharedData", id));
      } catch (error) {
        console.error("Error deleting shared data:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Those who are allowed to share your data:
      </h2>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sharedData.map((data, index) => (
            <tr key={data.id}>
              <td>{index + 1}</td>
              <td>
                {currentUser.email === data.email
                  ? data.senderEmail
                  : data.email}
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteSharedData(data.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default SharedViewing;
