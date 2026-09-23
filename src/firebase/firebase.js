import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBS_YtbsPE2Ojfw3NB21378FNnvuyicgVM",
    authDomain: "boda-camilo-sofia.firebaseapp.com",
    projectId: "boda-camilo-sofia",
    storageBucket: "boda-camilo-sofia.firebasestorage.app",
    messagingSenderId: "696606048782",
    appId: "1:696606048782:web:9b30b1fd36384ac992f25f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;