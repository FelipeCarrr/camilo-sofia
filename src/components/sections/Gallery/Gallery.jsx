import "./Gallery.css";

import { useState } from "react";

import SectionTitle from "../../Common/SectionTitle/SectionTitle";

import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";

import img1 from "../../../assets/images/gallery1.jpg";
import img2 from "../../../assets/images/gallery2.jpg";
import img3 from "../../../assets/images/gallery3.jpg";
import img4 from "../../../assets/images/gallery4.jpg";
import img5 from "../../../assets/images/gallery5.jpg";
import img6 from "../../../assets/images/gallery6.jpg";

const images = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6
];

export default function Gallery(){

    const [index,setIndex]=useState(-1);

    return(

        <section
            id="gallery"
            className="gallery section"
        >

            <div className="container">

                <SectionTitle

                    title="Nuestros Momentos"

                    subtitle="Algunos recuerdos que guardaremos para siempre."

                />

                <div className="gallery-grid">

                    {

                        images.map((image,i)=>(

                            <div

                                key={i}

                                className="gallery-item"

                                onClick={()=>setIndex(i)}

                            >

                                <img

                                    src={image}

                                    alt="gallery"

                                />

                            </div>

                        ))

                    }

                </div>

            </div>

            <Lightbox

                open={index>=0}

                close={()=>setIndex(-1)}

                slides={images.map(image=>({src:image}))}

                index={index}

            />

        </section>

    )

}