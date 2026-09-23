import "./DressCode.css";
import { FaHeart } from "react-icons/fa";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";

export default function DressCode() {

    const colors = [
        {
            name: "Rojo",
            color: "#C62828"
        },
        {
            name: "Blanco",
            color: "#FFFFFF"
        },
        {
            name: "Beige",
            color: "#D8C3A5"
        },
        {
            name: "Crema",
            color: "#FFF1D0"
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
                    subtitle="Con mucho cariño, les pedimos evitar vestir de Rojo, Blanco, Beige, Crema y tonalidades similares, ya que estos colores estarán reservados para la novia en este día tan especial."
                />

                <div className="dress-card">

                    <div className="dress-icon">
                        <FaHeart />
                    </div>

                    <h3>
                        Colores Reservados
                    </h3>

                    <div className="color-list">

                        {colors.map((item, index) => (

                            <div
                                key={index}
                                className="color-item"
                            >

                                <div
                                    className="color-circle"
                                    style={{
                                        backgroundColor: item.color
                                    }}
                                />

                                <span>
                                    {item.name}
                                </span>

                            </div>

                        ))}

                    </div>


                    <div className="thanks">

                        <FaHeart />
                        <span>
                            Gracias por hacer parte de nuestro gran día.
                        </span>

                    </div>

                </div>

            </div>

        </section>

    );

}