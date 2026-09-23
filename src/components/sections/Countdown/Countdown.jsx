import Countdown from "react-countdown";
import "./Countdown.css";
import wedding from "../../../config/weddingData";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";

export default function CountdownSection() {

    const renderer = ({ days, hours, minutes, seconds }) => (

        <div className="counter-grid">

            <div className="counter-card">
                <span>{days}</span>
                <p>Días</p>
            </div>

            <div className="counter-card">
                <span>{hours}</span>
                <p>Horas</p>
            </div>

            <div className="counter-card">
                <span>{minutes}</span>
                <p>Minutos</p>
            </div>

            <div className="counter-card">
                <span>{seconds}</span>
                <p>Segundos</p>
            </div>

        </div>

    );

    return (

        <section
            id="countdown"
            className="countdown"
        >

            <SectionTitle
                title="Faltan..."
                subtitle="Cada segundo nos acerca al momento en que uniremos nuestras vidas para siempre."
            />

            <Countdown

                date={new Date(wedding.weddingDate)}

                renderer={renderer}

            />

            <p className="count-message">

                Para celebrar el comienzo de nuestra nueva historia.

            </p>

        </section>

    );

}