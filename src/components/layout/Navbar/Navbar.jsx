import "./Navbar.css";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {

        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    useEffect(() => {

        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };

    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (

        <>

            <nav className={scrolled ? "navbar active" : "navbar"}>

                <div className="logo">

                    Camilo <span>&</span> Sofía

                </div>

                <ul className="desktop-menu">

                    <li><a href="#hero">Inicio</a></li>

                    <li><a href="#countdown">Fecha</a></li>

                    <li><a href="#story">Historia</a></li>

                    <li><a href="#events">Evento</a></li>

                    <li><a href="#gallery">Galería</a></li>

                    <li><a href="#rsvp">RSVP</a></li>

                </ul>

                <button
                    className="menu-button"
                    onClick={() => setMenuOpen(true)}
                >

                    <FaBars />

                </button>

            </nav>

            {menuOpen && (

                <>

                    <div
                        className="menu-backdrop"
                        onClick={closeMenu}
                    ></div>

                    <aside className="mobile-menu">

                        <button
                            className="close-menu"
                            onClick={closeMenu}
                        >

                            <FaTimes />

                        </button>

                        <h2>

                            Sofía <span>&</span> Camilo

                        </h2>

                        <nav>

                            <a href="#hero" onClick={closeMenu}>Inicio</a>

                            <a href="#countdown" onClick={closeMenu}>Fecha</a>

                            <a href="#story" onClick={closeMenu}>Historia</a>

                            <a href="#events" onClick={closeMenu}>Evento</a>

                            <a href="#gallery" onClick={closeMenu}>Galería</a>

                            <a href="#rsvp" onClick={closeMenu}>RSVP</a>

                        </nav>

                    </aside>

                </>

            )}

        </>

    );

}