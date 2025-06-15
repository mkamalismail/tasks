import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3Yffi4Sw6SIdgfbB4PWZbxbpLcu7A5Q0",
  authDomain: "eisenhower-matrix-c0d41.firebaseapp.com",
  projectId: "eisenhower-matrix-c0d41",
  storageBucket: "eisenhower-matrix-c0d41.appspot.com",
  messagingSenderId: "704424406821",
  appId: "1:704424406821:web:c3548eb7b17d65080934cc",
  measurementId: "G-T5PP9RJJK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics
export const analytics = getAnalytics(app);