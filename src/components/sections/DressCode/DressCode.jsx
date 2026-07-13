import "./DressCode.css";
import { FaFemale } from "react-icons/fa";
import { IoColorPalette } from "react-icons/io5";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";

export default function DressCode() {

    const colors = [
        {
            name: "Blanco",
            color: "#FFFFFF"
        },
        {
            name: "Marfil",
            color: "#F8F4E8"
        },
        {
            name: "Champagne",
            color: "#E8D7B7"
        }
    ];

    return (

        <section
            className="dresscode"
            id="dresscode"
        >

            <div className="container">

                <SectionTitle
                    title="Reserva de Color"
                    subtitle="Con mucho cariño queremos pedirte que estos colores queden reservados para la novia en este día tan especial."
                />

                <div className="dress-card">

                    <div className="dress-icon">

                        <FaFemale />

                    </div>

                    <h3>

                        Colores Reservados

                    </h3>

                    <p>

                        Agradecemos evitar prendas en estos tonos.

                    </p>

                    <div className="color-list">

                        {

                            colors.map((item,index)=>(

                                <div
                                    key={index}
                                    className="color-item"
                                >

                                    <div
                                        className="color-circle"
                                        style={{
                                            background:item.color
                                        }}
                                    ></div>

                                    <span>

                                        {item.name}

                                    </span>

                                </div>

                            ))

                        }

                    </div>

                    <div className="thanks">

                        <IoColorPalette />

                        <span>

                            Gracias por hacer parte de nuestro gran día.

                        </span>

                    </div>

                </div>

            </div>

        </section>

    );

}