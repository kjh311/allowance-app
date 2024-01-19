import { db } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const colorCollectionRef = collection(db, "color");

class ColorService {
  getColor = (id) => {
    const ColorDoc = doc(db, "color", id);
    return getDoc(ColorDoc);
  };

  getAllColors = () => {
    return getDocs(ColorsCollectionRef);
  };

  //   addTasks = (newTask) => {
  //     return addDoc(tasksCollectionRef, newTask);
  //   };

  //   updateTask = (id, updatedTask) => {
  //     const taskDoc = doc(db, "tasks", id);
  //     return updateDoc(taskDoc, updatedTask);
  //   };

  //   deleteTask = (id) => {
  //     const taskDoc = doc(db, "tasks", id);
  //     return deleteDoc(taskDoc);
  //   };
}

export default new ColorService();
