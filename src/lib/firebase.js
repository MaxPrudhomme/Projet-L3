// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBgwQeBuSD0lOat569xV7XgdesISvxXmYI",
  authDomain: "projet-l3-88394.firebaseapp.com",
  projectId: "projet-l3-88394",
  storageBucket: "projet-l3-88394.appspot.com",
  messagingSenderId: "284215656974",
  appId: "1:284215656974:web:a43bceb9f73048f83cf25f",
  measurementId: "G-1KM5CXKNZR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);