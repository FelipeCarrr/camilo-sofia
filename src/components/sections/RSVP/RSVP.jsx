import "./RSVP.css";
import { useState } from "react";
import { FaWhatsapp, FaMinus, FaPlus } from "react-icons/fa";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";

export default function RSVP() {

    const [name, setName] = useState("");
    const [attendance, setAttendance] = useState(true);
    const [guests, setGuests] = useState(1);

    const phone = "573001112233"; // CAMBIAR POR EL NÚMERO REAL

    const increaseGuests = () => {

        if (guests < 10) {
            setGuests(guests + 1);
        }

    };

    const decreaseGuests = () => {

        if (guests > 1) {
            setGuests(guests - 1);
        }

    };

    const sendWhatsApp = () => {

        if (name.trim() === "") {

            alert("Por favor escribe tu nombre.");

            return;

        }

        const message = `Hola.

Mi nombre es ${name}.

${attendance ? "Confirmo que asistiré a la boda." : "Lamentablemente no podré asistir."}

Número de asistentes: ${guests}

Muchas gracias.`;

        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            "_blank"
        );

    };

    return (

        <section
            className="rsvp"
            id="rsvp"
        >

            <div className="container">

                <SectionTitle
                    title="Confirma tu asistencia"
                    subtitle="Nos ayudaría mucho que confirmaras tu asistencia antes del gran día."
                />

                <div className="rsvp-card">

                    <input
                        type="text"
                        placeholder="Escribe tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="attendance-buttons">

                        <button
                            className={attendance ? "option active" : "option"}
                            onClick={() => setAttendance(true)}
                        >

                            Sí asistiré

                        </button>

                        <button
                            className={!attendance ? "option active" : "option"}
                            onClick={() => setAttendance(false)}
                        >

                            No podré asistir

                        </button>

                    </div>

                    <div className="guest-counter">

                        <label>

                            Número de asistentes

                        </label>

                        <div className="counter">

                            <button onClick={decreaseGuests}>

                                <FaMinus />

                            </button>

                            <span>

                                {guests}

                            </span>

                            <button onClick={increaseGuests}>

                                <FaPlus />

                            </button>

                        </div>

                    </div>

                    <button
                        className="whatsapp-btn"
                        onClick={sendWhatsApp}
                    >

                        <FaWhatsapp />

                        Confirmar por WhatsApp

                    </button>

                </div>

            </div>

        </section>

    );

}