import "./SectionTitle.css";

export default function SectionTitle({ title, subtitle }) {

    return (

        <div className="section-title">

            <h2 className="title">

                {title}

            </h2>

            {

                subtitle && (

                    <p className="subtitle">

                        {subtitle}

                    </p>

                )

            }

        </div>

    );

}