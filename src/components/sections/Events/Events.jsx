import "./Events.css";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";
import wedding from "../../../config/weddingData";
import { FaChurch } from "react-icons/fa";
import { GiChampagneCork } from "react-icons/gi";
import { MdLocationOn } from "react-icons/md";
import { motion } from "framer-motion";

export default function Events() {

    const cards = [

        {
            icon: <FaChurch />,
            ...wedding.church
        },

        {
            icon: <GiChampagneCork />,
            ...wedding.reception
        }

    ];

    return (

        <section
            className="events section"
            id="events"
        >

            <div className="container">

                <SectionTitle

                    title="Nuestro Gran Día"

                    subtitle="Nos encantará compartir este momento tan especial contigo."

                />

                <div className="events-grid">

                    {

                        cards.map((event,index)=>(

                            <motion.div

                                key={index}

                                className="event-card"

                                initial={{opacity:0,y:60}}

                                whileInView={{opacity:1,y:0}}

                                viewport={{once:true}}

                            >

                                <div className="event-icon">

                                    {event.icon}

                                </div>

                                <h3>

                                    {event.title}

                                </h3>

                                <h4>

                                    {event.place}

                                </h4>

                                <p>

                                    {event.time}

                                </p>

                                <div className="location">

                                    <MdLocationOn/>

                                    <span>

                                        {event.address}

                                    </span>

                                </div>

                                <a

                                    href={event.maps}

                                    target="_blank"

                                    rel="noreferrer"

                                    className="btn-primary"

                                >

                                    Cómo llegar

                                </a>

                            </motion.div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}