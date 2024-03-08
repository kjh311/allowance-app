// // import React, { useState, useEffect } from "react";
// // import { Button, Container, Table } from "react-bootstrap";
// // import { db } from "../../firebase/firebase";
// // import {
// //   collection,
// //   onSnapshot,
// //   doc,
// //   updateDoc,
// //   deleteDoc,
// //   getDoc,
// // } from "firebase/firestore";
// // import { useAuth } from "../../contexts/authContext";
// // import { FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
// // import { IoIosCloseCircle } from "react-icons/io";
// // import "./Share.scss";

// // function SharedViewing() {
// //   const { currentUser } = useAuth();
// //   const [sharedData, setSharedData] = useState([]);
// //   const [editEmail, setEditEmail] = useState("");
// //   const [editId, setEditId] = useState("");
// //   const [editMode, setEditMode] = useState(false);

// //   const getUserEmail = async (userId) => {
// //     const userDoc = await getDoc(doc(db, "users", userId));
// //     if (userDoc.exists()) {
// //       const userData = userDoc.data();
// //       const userEmail = userData.displayName || userData.email;
// //       console.log(userEmail);
// //       return userEmail;
// //     }
// //     return null;
// //   };

// //   useEffect(() => {
// //     console.log("currentUser:", currentUser);

// //     const unsubscribe = onSnapshot(
// //       collection(db, "sharedData"),
// //       (querySnapshot) => {
// //         querySnapshot.forEach((doc) => {
// //           const data = doc.data();
// //           if (data.userId === currentUser.uid) {
// //             if (data.email === currentUser.email) {
// //               console.log("Email:", data.email);
// //               console.log("Sender Email:", data.senderEmail);
// //             } else if (data.senderEmail === currentUser.email) {
// //               console.log("Email:", data.senderEmail);
// //               console.log("Sender Email:", data.email);
// //             }
// //           }
// //         });
// //       }
// //     );

// //     return () => unsubscribe();
// //   }, [currentUser]);

// //   useEffect(() => {
// //     const fetchSharedWithEmails = async () => {
// //       const updatedSharedData = await Promise.all(
// //         sharedData.map(async (data) => {
// //           if (data.sharingWith && data.sharingWith.length > 0) {
// //             const sharedWithEmails = await Promise.all(
// //               data.sharingWith.map(async (userId) => {
// //                 const userEmail = await getUserEmail(userId);
// //                 return userEmail;
// //               })
// //             );
// //             return { ...data, sharedWithEmails };
// //           }
// //           return data;
// //         })
// //       );
// //       setSharedData(updatedSharedData);
// //     };

// //     fetchSharedWithEmails();
// //   }, [sharedData]);

// import React, { useState, useEffect } from "react";
// import { db } from "../../firebase/firebase";
// import { collection, onSnapshot } from "firebase/firestore";
// import { useAuth } from "../../contexts/authContext";
// import { Button, Container, Table } from "react-bootstrap";

// function SharedViewing() {
//   const { currentUser } = useAuth();
//   const [sharedData, setSharedData] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       collection(db, "sharedData"),
//       (querySnapshot) => {
//         const loadedSharedData = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           loadedSharedData.push({ id: doc.id, ...data });
//         });
//         setSharedData(loadedSharedData);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (currentUser && currentUser.email) {
//       console.log("Current User Email:", currentUser.email);
//       sharedData.forEach((data) => {
//         if (
//           data.email === currentUser.email ||
//           data.senderEmail === currentUser.email
//         ) {
//           console.log("Email:", data.email);
//           console.log("Sender Email:", data.senderEmail);
//         }
//       });
//     }
//   }, [currentUser, sharedData]);

//   const handleEdit = (email, id) => {
//     setEditEmail(email);
//     setEditId(id);
//     setEditMode(true);
//   };

//   // const handleUpdate = async () => {
//   //   try {
//   //     await updateDoc(doc(db, "sharedData", editId), { email: editEmail });
//   //     setEditEmail("");
//   //     setEditId("");
//   //     setEditMode(false);
//   //   } catch (error) {
//   //     console.error("Error updating email:", error);
//   //   }
//   // };

//   // const handleDelete = async (id) => {
//   //   try {
//   //     await deleteDoc(doc(db, "sharedData", id));
//   //   } catch (error) {
//   //     console.error("Error deleting email:", error);
//   //   }
//   // };

//   // const getStatusIcon = (data) => {
//   //   if (data.asked && data.shareAllow) {
//   //     return <FaCheckCircle className="text-green-500 check-mark" />;
//   //   } else if (data.asked && !data.shareAllow) {
//   //     return <IoIosCloseCircle className="text-red-500" />;
//   //   } else {
//   //     return "Pending";
//   //   }
//   // };

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-4">
//         Those who are allowed to share your data:
//       </h2>
//       <Table responsive striped bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Email</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sharedData.map((data, index) => (
//             <tr key={data.id}>
//               <td>{index + 1}</td>
//               <td>
//                 {editMode && data.id === editId ? (
//                   <input
//                     type="text"
//                     value={editEmail}
//                     onChange={(e) => setEditEmail(e.target.value)}
//                     className="form-control"
//                   />
//                 ) : (
//                   <>
//                     {data.sharingWith &&
//                       data.sharingWith.length > 0 &&
//                       data.sharingWith.map((userId) => (
//                         <div key={userId}>{getUserEmail(userId)}</div>
//                       ))}
//                   </>
//                 )}
//               </td>
//               <td>{getStatusIcon(data)}</td>
//               <td>
//                 {editMode && data.id === editId ? (
//                   <Button
//                     variant="success"
//                     onClick={handleUpdate}
//                     className="mr-2"
//                   >
//                     Save
//                   </Button>
//                 ) : (
//                   <>
//                     <Button
//                       variant="primary"
//                       onClick={() => handleEdit(data.email, data.id)}
//                       disabled={editMode}
//                       className="mr-2"
//                     >
//                       <FaEdit />
//                     </Button>
//                     <Button
//                       variant="danger"
//                       onClick={() => handleDelete(data.id)}
//                       disabled={editMode}
//                     >
//                       <FaTrash />
//                     </Button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// }

// export default SharedViewing;

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
  updateDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { Table, Button } from "react-bootstrap";
import { FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

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

  const handleDeleteSharedData = async (id, index) => {
    const confirmed = window.confirm("Stop sharing data with this user?");
    if (confirmed) {
      try {
        // Find the sharedData document
        const sharedDoc = await getDoc(doc(db, "sharedData", id));
        const sharedData = sharedDoc.data();

        // Determine whether the other user's email is in the "email" or "senderEmail" field
        const otherUserEmail =
          sharedData.email === currentUser.email
            ? sharedData.senderEmail
            : sharedData.email;

        // Find the other user's id in the users collection
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", otherUserEmail)
        );
        const userSnapshot = await getDocs(userQuery);
        let otherUserId = null;
        userSnapshot.forEach((doc) => {
          otherUserId = doc.id;
        });

        if (otherUserId) {
          // Remove otherUserId from currentUser's sharingWith field
          await updateDoc(doc(db, "users", currentUser.uid), {
            sharingWith: arrayRemove(otherUserId),
          });

          // Remove sharedData id from sharedUsers field in other user's document
          await updateDoc(doc(db, "users", otherUserId), {
            sharedUsers: arrayRemove(id),
          });

          // Finally, delete sharedData document
          await deleteDoc(doc(db, "sharedData", id));
        } else {
          console.log("Other user not found");
        }
      } catch (error) {
        console.error("Error deleting shared data:", error);
      }
    }
  };

  const getStatusIcon = (data) => {
    if (data.asked && data.shareAllow) {
      return <FaCheckCircle className="text-green-500 check-mark" />;
    } else if (data.asked && !data.shareAllow) {
      return <IoIosCloseCircle className="text-red-500" />;
    } else {
      return "Pending";
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
            <th>Status</th>
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
              <td>{getStatusIcon(data)}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteSharedData(data.id, index)}
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
