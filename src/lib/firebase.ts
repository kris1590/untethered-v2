
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

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

export { auth, app };