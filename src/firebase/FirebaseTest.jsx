import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

export default function FirebaseTest() {
    const [status, setStatus] = useState("Comprobando conexión...");

    useEffect(() => {
        async function testConnection() {
            try {
                await getDocs(collection(db, "invitados"));
                setStatus("Conexión con Firestore establecida correctamente.");
            } catch (error) {
                console.error("Error conectando con Firestore:", error);
                setStatus(
                    "No se pudo consultar Firestore. Revisá la configuración y las reglas."
                );
            }
        }

        testConnection();
    }, []);

    return (
        <div>
            <h2>Prueba de Firebase</h2>
            <p>{status}</p>
        </div>
    );
}