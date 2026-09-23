import "./Parents.css";
import { motion } from "framer-motion";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";

const parents = [
    {
        title: "Padres de Cesar Camilo",
        names: [
            "Luis Cesar Torrado Quintero ✝",
            "Margarita Carrascal Toro",
        ],
    },
    {
        title: "Padres de Laura Sofía",
        names: [
            "Jhon Wiliam Pulido Lizcano",
            "Olga Sofía Calderon Muñoz",
        ],
    },
];

export default function Parents() {
    return (
        <section className="parents section" id="parents">
            <div className="container">
                <SectionTitle
                    title="Con la bendición de Dios"
                    subtitle="Y de nuestros padres"
                />

                <motion.div
                    className="parents-intro"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="parents-ornament" aria-hidden="true">
                        ♥
                    </span>

                    <p>
                        Con profundo amor y gratitud, nuestros padres han sido
                        parte fundamental de nuestra historia. Nos llena de
                        alegría contar con su bendición en este día tan especial.
                    </p>
                </motion.div>

                <div className="parents-grid">
                    {parents.map((parent, index) => (
                        <motion.article
                            className="parent-card"
                            key={parent.title}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: index * 0.15 }}
                        >
                            <span className="parent-card-label">
                                {parent.title}
                            </span>

                            <div className="parent-names">
                                {parent.names.map((name) => (
                                    <p key={name}>{name}</p>
                                ))}
                            </div>
                        </motion.article>
                    ))}
                </div>

                <motion.div
                    className="parents-message"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="parents-message-line" aria-hidden="true" />

                    <p>
                        Tenemos el honor de invitarte a celebrar nuestra unión
                        en matrimonio.
                    </p>

                    <span className="parents-message-heart" aria-hidden="true">
                        ♥
                    </span>
                </motion.div>
            </div>
        </section>
    );
}