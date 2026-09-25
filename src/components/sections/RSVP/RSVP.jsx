import "./RSVP.css";

import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";

import {
    FaWhatsapp,
    FaMinus,
    FaPlus,
    FaCheck,
    FaTimes,
    FaHeart,
} from "react-icons/fa";

import SectionTitle from "../../Common/SectionTitle/SectionTitle";
import { db } from "../../../firebase/firebase";

export default function RSVP() {
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [attendance, setAttendance] = useState(true);
    const [guests, setGuests] = useState(1);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [savedAttendance, setSavedAttendance] = useState(null);
    const [savedGuests, setSavedGuests] = useState(0);

    const phone = "573143016235";
    const token = new URLSearchParams(window.location.search).get("invitacion");

    useEffect(() => {
        async function loadInvitation() {
            setLoading(true);
            setError("");

            if (!token) {
                setInvitation(null);
                setError(
                    "Para confirmar tu asistencia, necesitás ingresar desde el enlace de tu invitación."
                );
                setLoading(false);
                return;
            }

            try {
                const invitationRef = doc(db, "invitados", token);
                const snapshot = await getDoc(invitationRef);

                if (!snapshot.exists()) {
                    setInvitation(null);
                    setError(
                        "No encontramos esta invitación. Verificá que el enlace sea correcto."
                    );
                    return;
                }

                const data = snapshot.data();

                if (data.token !== token) {
                    setInvitation(null);
                    setError("El enlace de esta invitación no es válido.");
                    return;
                }

                setInvitation({
                    id: snapshot.id,
                    ...data,
                });

                setName(data.nombreRespuesta || data.nombre || "");

                setGuests(
                    Math.max(
                        1,
                        Math.min(
                            Number(data.asistentesConfirmados) || 1,
                            Number(data.cupos) || 1
                        )
                    )
                );

                setAttendance(data.confirmacion !== "no_asistira");
            } catch (err) {
                console.error("Error consultando invitación:", err);

                setError(
                    "No pudimos cargar tu invitación. Intentá nuevamente más tarde."
                );
            } finally {
                setLoading(false);
            }
        }

        loadInvitation();
    }, [token]);

    const increaseGuests = () => {
        const maxGuests = Number(invitation?.cupos) || 1;

        if (guests < maxGuests) {
            setGuests((current) => current + 1);
        }
    };

    const decreaseGuests = () => {
        if (guests > 1) {
            setGuests((current) => current - 1);
        }
    };

    const sendWhatsApp = async () => {
        if (!invitation) return;

        if (name.trim() === "") {
            setError("Por favor, escribí el nombre de quien responde.");
            return;
        }

        if (attendance && (guests < 1 || guests > Number(invitation.cupos))) {
            setError(
                `Esta invitación permite confirmar entre 1 y ${invitation.cupos} asistentes.`
            );
            return;
        }

        setSaving(true);
        setError("");

        // Abrimos la ventana antes de la operación asíncrona para reducir
        // la posibilidad de que el navegador bloquee WhatsApp.
        const whatsappWindow = window.open("about:blank", "_blank");

        try {
            const invitationRef = doc(db, "invitados", invitation.id);
            const confirmedGuests = attendance ? guests : 0;

            await updateDoc(invitationRef, {
                confirmacion: attendance ? "confirmada" : "no_asistira",
                asistentesConfirmados: confirmedGuests,
                nombreRespuesta: name.trim(),
                respondedAt: serverTimestamp(),
            });

            const message = attendance
                ? `*CONFIRMACIÓN DE ASISTENCIA*

━━━━━━━━━━━━━━━━━━━━

*Boda de Camilo y Sofía*
24 de octubre de 2026

Hola, Camilo y Sofía.

La invitación está a nombre de *${invitation.nombre}*.

Mi nombre es *${name.trim()}* y con mucha alegría les confirmo que:

*¡Sí asistiré a su boda!*

*Número de asistentes:* ${confirmedGuests}
${confirmedGuests === 1
                    ? "Asistiré en solitario."
                    : `Asistiremos ${confirmedGuests} personas.`}

Me alegra mucho poder acompañarlos en este día tan especial.

¡Nos vemos pronto!

Con cariño,
*${name.trim()}*

━━━━━━━━━━━━━━━━━━━━
*Camilo y Sofía*
Gracias por hacernos parte de este momento tan especial.`
                : `*CONFIRMACIÓN DE ASISTENCIA*

━━━━━━━━━━━━━━━━━━━━

*Boda de Camilo y Sofía*
24 de octubre de 2026

Hola, Camilo y Sofía.

La invitación está a nombre de *${invitation.nombre}*.

Mi nombre es *${name.trim()}* y quiero contarles que:

*Lamentablemente no podré asistir a su boda.*

Aunque me hubiera encantado acompañarlos, les deseo de todo corazón una celebración llena de amor y felicidad.

Que esta nueva etapa de sus vidas esté llena de momentos inolvidables.

Con cariño,
*${name.trim()}*

━━━━━━━━━━━━━━━━━━━━
*Camilo y Sofía*
Gracias por hacernos parte de este momento tan especial.`;

            const whatsappUrl =
                `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            setSavedAttendance(attendance);
            setSavedGuests(confirmedGuests);
            setSubmitted(true);

            if (whatsappWindow) {
                whatsappWindow.location.href = whatsappUrl;
            } else {
                window.location.href = whatsappUrl;
            }
        } catch (err) {
            console.error("Error guardando confirmación:", err);

            if (whatsappWindow) {
                whatsappWindow.close();
            }

            setError(
                "No se pudo guardar tu respuesta. Revisá tu conexión e intentá nuevamente."
            );
        } finally {
            setSaving(false);
        }
    };

    const resetConfirmation = () => {
        setSubmitted(false);
        setError("");
    };

    return (
        <section className="rsvp" id="rsvp">
            <div className="rsvp-container">
                <SectionTitle
                    title="Confirma tu asistencia"
                    subtitle="Nos ayudaría mucho que confirmaras tu asistencia antes del gran día."
                />

                <div className="rsvp-card">
                    <div className="rsvp-card-decoration rsvp-decoration-top" />
                    <div className="rsvp-card-decoration rsvp-decoration-bottom" />

                    <div className="rsvp-card-inner">
                        <div className="rsvp-card-heading">
                            <span className="rsvp-card-kicker">
                                Cesar Camilo <span>&</span> Laura Sofía
                            </span>

                            <div className="rsvp-heading-divider">
                                <span />
                                <FaHeart />
                                <span />
                            </div>

                            <h3>
                                {submitted
                                    ? "¡Gracias por responder!"
                                    : "¿Nos acompañarás?"}
                            </h3>

                            <p>
                                {submitted
                                    ? "Tu respuesta es muy importante para nosotros."
                                    : "Nos hace mucha ilusión compartir este día contigo."}
                            </p>
                        </div>

                        {loading ? (
                            <div className="rsvp-loading">
                                <span className="rsvp-loading-spinner" />
                                <p>Preparando tu invitación...</p>
                            </div>
                        ) : !invitation ? (
                            <div className="rsvp-state-message rsvp-error-state">
                                <span className="rsvp-state-icon">
                                    <FaTimes />
                                </span>
                                <h4>No encontramos tu invitación</h4>
                                <p>{error}</p>
                            </div>
                        ) : submitted ? (
                            <div className="rsvp-thank-you">
                                <div className="rsvp-success-icon">
                                    <FaHeart />
                                </div>

                                <span className="rsvp-thank-you-overline">
                                    Cesar Camilo &amp; Laura Sofía
                                </span>

                                <h4>
                                    {savedAttendance
                                        ? "¡Nos vemos pronto!"
                                        : "Te vamos a extrañar"}
                                </h4>

                                <p className="rsvp-thank-you-message">
                                    {savedAttendance
                                        ? `Gracias, ${name.trim()}, por confirmar tu asistencia. Nos alegra muchísimo que puedas acompañarnos en este momento tan especial.`
                                        : `Gracias, ${name.trim()}, por tomarte el tiempo de responder. Aunque no puedas acompañarnos, te tendremos presente con mucho cariño.`}
                                </p>

                                {savedAttendance && (
                                    <div className="rsvp-confirmation-summary">
                                        <span>Asistencia confirmada</span>
                                        <strong>
                                            {savedGuests}{" "}
                                            {savedGuests === 1
                                                ? "persona"
                                                : "personas"}
                                        </strong>
                                    </div>
                                )}

                                <div className="rsvp-thank-you-note">
                                    <span>24 · 10 · 2026</span>
                                    <p>Un día especial, compartido con personas especiales.</p>
                                </div>

                                <button
                                    type="button"
                                    className="rsvp-edit-button"
                                    onClick={resetConfirmation}
                                >
                                    Modificar mi respuesta
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="rsvp-invitation-info">
                                    <span className="rsvp-info-label">
                                        Esta invitación es para
                                    </span>

                                    <h4>{invitation.nombre}</h4>

                                    <div className="rsvp-info-line">
                                        <span />
                                    </div>

                                    <p>
                                        {invitation.cupos}{" "}
                                        {Number(invitation.cupos) === 1
                                            ? "cupo reservado"
                                            : "cupos reservados"}
                                    </p>
                                </div>

                                <div className="rsvp-form">
                                    <label
                                        className="rsvp-field-label"
                                        htmlFor="rsvp-name"
                                    >
                                        Nombre de quien responde
                                    </label>

                                    <input
                                        id="rsvp-name"
                                        className="rsvp-name-input"
                                        type="text"
                                        placeholder="Escribe tu nombre completo"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        autoComplete="name"
                                    />

                                    <span className="rsvp-field-label attendance-label">
                                        ¿Podrás acompañarnos?
                                    </span>

                                    <div
                                        className="attendance-buttons"
                                        role="group"
                                        aria-label="Confirma tu asistencia"
                                    >
                                        <button
                                            type="button"
                                            className={
                                                attendance
                                                    ? "option active"
                                                    : "option"
                                            }
                                            onClick={() => {
                                                setAttendance(true);
                                                setError("");
                                            }}
                                            aria-pressed={attendance}
                                        >
                                            <span className="option-icon">
                                                <FaCheck />
                                            </span>

                                            <span>Sí asistiré</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                !attendance
                                                    ? "option active"
                                                    : "option"
                                            }
                                            onClick={() => {
                                                setAttendance(false);
                                                setError("");
                                            }}
                                            aria-pressed={!attendance}
                                        >
                                            <span className="option-icon">
                                                <FaTimes />
                                            </span>

                                            <span>No podré asistir</span>
                                        </button>
                                    </div>

                                    <div
                                        className={`guest-counter ${
                                            !attendance
                                                ? "guest-counter-disabled"
                                                : ""
                                        }`}
                                    >
                                        <div className="guest-counter-copy">
                                            <label htmlFor="guest-count">
                                                Número de asistentes
                                            </label>

                                            <small>
                                                {attendance
                                                    ? `Incluyéndote a ti · Máximo ${invitation.cupos}`
                                                    : "No necesitas indicar asistentes"}
                                            </small>
                                        </div>

                                        <div className="counter">
                                            <button
                                                type="button"
                                                onClick={decreaseGuests}
                                                disabled={
                                                    !attendance || guests <= 1
                                                }
                                                aria-label="Restar asistente"
                                            >
                                                <FaMinus />
                                            </button>

                                            <output
                                                id="guest-count"
                                                aria-live="polite"
                                            >
                                                {attendance ? guests : "—"}
                                            </output>

                                            <button
                                                type="button"
                                                onClick={increaseGuests}
                                                disabled={
                                                    !attendance ||
                                                    guests >=
                                                        Number(invitation.cupos)
                                                }
                                                aria-label="Sumar asistente"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="rsvp-inline-error">
                                            <FaTimes />
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        className="whatsapp-btn"
                                        onClick={sendWhatsApp}
                                        disabled={saving}
                                    >
                                        <FaWhatsapp />

                                        <span>
                                            {saving
                                                ? "Guardando respuesta..."
                                                : "Confirmar por WhatsApp"}
                                        </span>
                                    </button>

                                    <p className="rsvp-footnote">
                                        Tu respuesta nos ayudará a preparar cada detalle.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
