
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
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, getFirestore } from 'firebase/firestore';
const db = getFirestore(app);
export { db };
// Get all users (if storing users in Firestore 'users' collection)
export async function getUsers() {
  // If you use Firebase Auth only, get from auth directly.
  // Here, assuming you have a 'users' collection:
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

// Get user's goal data for a specific month/year
export async function getUserGoal(uid: string, monthYear?: string) {
  const monthKey = monthYear || getCurrentMonthYear();
  const docId = `${uid}_${monthKey.replace('/', '_')}`;
  const ref = doc(db, "goals", docId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data();
  } else {
    // Return default structure for empty months
    return {
      monthlyGoal: undefined,
      weeklyGoals: [
        { goal: "", note: "" },
        { goal: "", note: "" },
        { goal: "", note: "" },
        { goal: "", note: "" }
      ]
    };
  }
}

// Get current month/year in MM/YYYY format
export function getCurrentMonthYear(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}/${year}`;
}

// Get all available months for a user
export async function getUserMonths(uid: string) {
  const userGoalsRef = collection(db, "goals");
  const snap = await getDocs(userGoalsRef);
  const months = snap.docs
    .filter(doc => doc.id.startsWith(`${uid}_`))
    .map(doc => doc.id.replace(`${uid}_`, '').replace('_', '/'))
    .sort((a, b) => {
      // Sort by date (newest first)
      const [monthA, yearA] = a.split('/');
      const [monthB, yearB] = b.split('/');
      const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1);
      const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1);
      return dateB.getTime() - dateA.getTime();
    });
  return months;
}

// Set monthly goal (if not already set)
export async function setMonthlyGoal(uid: string, monthlyGoal: string, monthYear?: string) {
  const monthKey = monthYear || getCurrentMonthYear();
  const docId = `${uid}_${monthKey.replace('/', '_')}`;
  const ref = doc(db, "goals", docId);
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
export async function addWeeklyGoal(uid: string, weekIdx: number, goal: string, monthYear?: string) {
  const monthKey = monthYear || getCurrentMonthYear();
  const docId = `${uid}_${monthKey.replace('/', '_')}`;
  const ref = doc(db, "goals", docId);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  const weeks = data.weeklyGoals || [{ goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }];
  // Make sure array is always length 4
  while (weeks.length < 4) weeks.push({ goal: "", note: "" });
  weeks[weekIdx] = { ...weeks[weekIdx], goal }; // Preserve note if exists
  await updateDoc(ref, { weeklyGoals: weeks });
}

// Add or update a weekly note for a given weekIdx
export async function updateWeeklyNote(uid: string, weekIdx: number, note: string, monthYear?: string) {
  const monthKey = monthYear || getCurrentMonthYear();
  const docId = `${uid}_${monthKey.replace('/', '_')}`;
  const ref = doc(db, "goals", docId);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  const weeks = data.weeklyGoals || [{ goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }, { goal: "", note: "" }];
  // Make sure array is always length 4
  while (weeks.length < 4) weeks.push({ goal: "", note: "" });
  weeks[weekIdx] = { ...weeks[weekIdx], note }; // Preserve goal if exists
  await updateDoc(ref, { weeklyGoals: weeks });
}