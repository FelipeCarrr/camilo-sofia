import "./Footer.css";
import wedding from "../../../config/weddingData";
import { FaHeart } from "react-icons/fa";

export default function Footer() {

    return (

        <footer className="footer">

            <div className="footer-content">

                <p className="footer-text">

                    Gracias por acompañarnos en este momento tan especial.

                </p>

                <h2>

                    {wedding.groom} & {wedding.bride}

                </h2>

                <p className="footer-date">

                    {wedding.displayDate}

                </p>

                <FaHeart className="heart"/>

                <small>

                    Hecho con mucho amor ❤️

                </small>

            </div>

        </footer>

    );

}