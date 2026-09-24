import { motion } from "framer-motion";
import { FaEnvelopeOpenText, FaHeart } from "react-icons/fa";
import "./Gift.css";

export default function Gift() {
    return (
        <section className="gift-section" id="gift">
            <div className="gift-decoration gift-decoration-left">✦</div>
            <div className="gift-decoration gift-decoration-right">✧</div>

            <motion.div
                className="gift-container"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className="gift-icon-wrapper"
                    initial={{ scale: 0.8, rotate: -8 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <FaEnvelopeOpenText className="gift-icon" />
                </motion.div>

                <p className="gift-eyebrow">UN DETALLE DE AMOR</p>

                <h2 className="gift-title">Lluvia de sobres</h2>

                <div className="gift-divider">
                    <span />
                    <FaHeart />
                    <span />
                </div>

                <p className="gift-message">
                    El mejor regalo es compartir este día tan especial con
                    ustedes y contar con su cariño.
                </p>

                <p className="gift-closing">
                    Con mucho amor,
                </p>

                <p className="gift-names">Cesar Camilo y Laura Sofía</p>
            </motion.div>
        </section>
    );
}