const { collection, addDoc, getFirestore, doc, query, where, updateDoc, limit, getDocs, getDoc } = require("firebase/firestore");
const { app } = require("../config/firebase");

const addOrUpdate = async (collectionName, data, id = null) => {
  const db = getFirestore(app);
  if (id) {
    await updateDoc(doc(db, collectionName, id), { ...data, updatedAt: new Date().toISOString() });
    return { id, ...data };
  } else {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  }
}

const get = async (collectionName, id = null, queries = []) => {
  try {
    const db = getFirestore(app);
    if (id) {
      const saved = await getDoc(doc(db, collectionName, id));
      return { ...saved.data(), id };
    } else {
      const q = query(collection(db, collectionName), ...queries);
      const data = await getDocs(q);
      return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    }
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const addOwner = async (data, id = null) => {
  try {
    const db = getFirestore(app);
    if (id) {
      await updateDoc(doc(db, "owner", id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } else {
      const docRef = await addDoc(collection(db, "owner"), data);
      return docRef.id;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

const readOwnerByPhone = async (phone) => {
  try {
    const db = getFirestore(app);
    const q = query(collection(db, "owner"), where("phone", "==", phone), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    } else {
      return { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
    }
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const readOwner = async (id) => {
  try {
    const db = getFirestore(app);
    const docRef = doc(db, "owner", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const addEmployee = async (data, id = null) => {
  try {
    const db = getFirestore(app);
    if (id) {
      await updateDoc(doc(db, "employees", id), { ...data, updatedAt: new Date().toISOString() });
    } else {
      const docRef = await addDoc(collection(db, "employees"), data);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}

const getEmployeeById = async (id) => {
  try {
    const db = getFirestore(app);
    const docRef = doc(db, "employees", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    } else {
      return { ...docSnap.data(), id: docSnap.id };
    }
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const getEmployeeByEmail = async (email) => {
  try {
    const db = getFirestore(app);
    const q = query(collection(db, "employees"), where("email", "==", email), where("isDeleted", "==", false), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    } else {
      return { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
    }
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const getEmployeesByOwnerId = async (ownerId) => {
  try {
    const db = getFirestore(app);
    const q = query(collection(db, "employees"), where("ownerId", "==", ownerId), where("isDeleted", "==", false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const addTask = async (data, id = null) => {
  try {
    const db = getFirestore(app);
    if (id) {
      await updateDoc(doc(db, "tasks", id), { ...data, updatedAt: new Date().toISOString() });
    } else {
      const docRef = await addDoc(collection(db, "tasks"), data);
      return { id: docRef.id, ...data };
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}

const getTaskById = async (id) => {
  try {
    const db = getFirestore(app);
    const docRef = doc(db, "tasks", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id };
    }
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const getTasks = async (ownerId, employeeId, role) => {
  try {
    const db = getFirestore(app);
    let q = query(collection(db, "tasks"), where("ownerId", "==", ownerId), where("isDeleted", "==", false));

    if(role === "employee") {  
      q = query(collection(db, "tasks"), where("ownerId", "==", ownerId), where("employeeId", "==", employeeId), where("isDeleted", "==", false));
    } 

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const getEmployeeByUserName = async (userName) => {
  try {
    const db = getFirestore(app);
    const q = query(collection(db, "employees"), where("userName", "==", userName), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    } else {
      return { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
    }
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

const addMessage = async (data) => {
  try {
    const db = getFirestore(app);
    const docRef = await addDoc(collection(db, "messages"), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}

const getChats = async (userId) => {
  try {
    const db = getFirestore(app);
    const q = query(collection(db, "chats"), where("from", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error reading document: ", error);
    return null;
  }
}

module.exports = {
  addOrUpdate,
  get,
  addOwner,
  readOwner,
  readOwnerByPhone,
  addEmployee,
  getEmployeeById,
  getEmployeeByEmail,
  getEmployeesByOwnerId,
  addTask,
  getTaskById,
  getTasks,
  getEmployeeByUserName,
  addMessage,
};
