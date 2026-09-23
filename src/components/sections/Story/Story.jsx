import "./Story.css";
import { motion } from "framer-motion";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";

const history = [

    {
        icon: "❤️",
        title: "Todo comenzó",
        text: "Dos caminos se cruzaron en el momento perfecto. Sin imaginarlo, aquel encuentro sería el inicio de una hermosa historia de amor."
    },

    {
        icon: "💍",
        title: "El compromiso",
        text: "Después de compartir sueños, aventuras y momentos inolvidables, decidimos dar el paso más importante de nuestras vidas."
    },

    {
        icon: "🤍",
        title: "Nuestro gran día",
        text: "Ahora queremos celebrar contigo el comienzo de un nuevo capítulo, rodeados del cariño de quienes más amamos."
    }

];

export default function Story() {

    return (

        <section
            className="story section"
            id="story"
        >

            <div className="container">

                <SectionTitle

                    title="Nuestra Historia"

                    subtitle="Cada historia de amor es hermosa, pero creemos que la nuestra es nuestra favorita."

                />

                <div className="timeline">

                    {

                        history.map((item, index) => (

                            <motion.div

                                key={index}

                                className="timeline-item"

                                initial={{ opacity:0, y:70 }}

                                whileInView={{ opacity:1, y:0 }}

                                viewport={{ once:true }}

                                transition={{ duration:.8 }}

                            >

                                <div className="timeline-icon">

                                    {item.icon}

                                </div>

                                <h3>

                                    {item.title}

                                </h3>

                                <p>

                                    {item.text}

                                </p>

                            </motion.div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}