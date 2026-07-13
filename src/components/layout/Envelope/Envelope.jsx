import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "./Envelope.css";
import { useInvitation } from "../../../context/InvitationContext";

export default function Envelope() {

    const { opened, setOpened } = useInvitation();

    const handleOpen = () => {

        setOpened(true);

    };

    return (

        <AnimatePresence>

            {!opened && (

                <motion.div
                    className="envelope-screen"
                    exit={{ opacity: 0 }}
                >

                    <motion.div
                        className="envelope"
                        whileHover={{ scale: 1.03 }}
                        onClick={handleOpen}
                    >

                        <div className="envelope-top"></div>

                        <div className="envelope-body">

                            <h2>Sofía & Camilo</h2>

                            <p>Haz clic para abrir</p>

                        </div>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>

    );

}