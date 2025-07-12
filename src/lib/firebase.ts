
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUVaFa6NdC0zokELyQBv_AcWPZ8BrCYp4",
  authDomain: "untethered-729b8.firebaseapp.com",
  projectId: "untethered-729b8",
  storageBucket: "untethered-729b8.firebasestorage.app",
  messagingSenderId: "1076842024445",
  appId: "1:1076842024445:web:ce9abbc1c562fde02a9d94",
  measurementId: "G-2VEFC9TPX9"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);

export { auth, app, storage };

// lib/firestore-goals.js
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, arrayUnion, getFirestore } from 'firebase/firestore';
const db = getFirestore(app);
export { db };
// Get all users (if storing users in Firestore 'users' collection)
export async function getUsers() {
  // If you use Firebase Auth only, get from auth directly.
  // Here, assuming you have a 'users' collection:
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

// Get user's goal data
export async function getUserGoal(uid: string) {
  const ref = doc(db, "goals", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
}

// Set monthly goal (if not already set)
export async function setMonthlyGoal(uid: string, monthlyGoal: string) {
  const ref = doc(db, "goals", uid);
  const snap = await getDoc(ref);
  // If monthly goal already set, don't overwrite
  if (snap.exists() && snap.data().monthlyGoal) throw new Error("Monthly goal already set.");
  // If document doesn't exist, create initial structure
  if (!snap.exists()) {
    await setDoc(ref, {
      monthlyGoal,
      weeklyGoals: [{ goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }]
    });
  } else {
    await updateDoc(ref, {
      monthlyGoal
    });
  }
}

// Add or update a weekly goal for a given weekIdx
export async function addWeeklyGoal(uid: string, weekIdx: number, goal: string) {
  const ref = doc(db, "goals", uid);
  const snap = await getDoc(ref);
  let data = snap.exists() ? snap.data() : {};
  let weeks = data.weeklyGoals || [{ goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }];
  // Make sure array is always length 4
  while (weeks.length < 4) weeks.push({ goal: "", note: "" });
  weeks[weekIdx] = { ...weeks[weekIdx], goal }; // Preserve note if exists
  await updateDoc(ref, { weeklyGoals: weeks });
}

// Add or update a weekly note for a given weekIdx
export async function updateWeeklyNote(uid: string, weekIdx: number, note: string) {
  const ref = doc(db, "goals", uid);
  const snap = await getDoc(ref);
  let data = snap.exists() ? snap.data() : {};
  let weeks = data.weeklyGoals || [{ goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }];
  // Make sure array is always length 4
  while (weeks.length < 4) weeks.push({ goal: "", note: "" });
  weeks[weekIdx] = { ...weeks[weekIdx], note }; // Preserve goal if exists
  await updateDoc(ref, { weeklyGoals: weeks });
}