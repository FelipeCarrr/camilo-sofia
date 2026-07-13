import "./Hero.css";
import wedding from "../../../config/weddingData";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { images } from "../../../config/assets";
import { FaChevronDown } from "react-icons/fa";

export default function Hero() {

    return (

        <section
            className="hero"
            id="hero"
            style={{
                backgroundImage: `url(${images.hero})`
            }}
        >

            <div className="hero-overlay">

                <motion.p
                    className="hero-small"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    NOS CASAMOS
                </motion.p>

                <div className="hero-title">

                    <div className="desktop-name">

                        <h1>{wedding.groom}</h1>

                        <div className="ampersand">&</div>

                        <h1>{wedding.bride}</h1>

                    </div>

                    <h1 className="mobile-name">

                        {wedding.groom} & {wedding.bride}

                    </h1>

                </div>

                <motion.p
                    className="hero-date"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    {wedding.displayDate}
                </motion.p>

                <motion.p
                    className="hero-quote"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    {wedding.quote}
                </motion.p>

                <Link
                    to="countdown"
                    smooth
                    duration={900}
                >

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: .95 }}
                    >
                        Descubrir Invitación
                    </motion.button>

                </Link>

                <motion.div
                    className="scroll-down"
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                        duration: 1.6,
                        repeat: Infinity
                    }}
                >
                    <FaChevronDown />
                </motion.div>

            </div>

        </section>

    );

}