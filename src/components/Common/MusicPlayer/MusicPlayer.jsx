import "./MusicPlayer.css";

import { useEffect, useRef, useState } from "react";

import { FaPause, FaPlay } from "react-icons/fa";

import { BsMusicNoteBeamed } from "react-icons/bs";

import { useInvitation } from "../../../context/InvitationContext";

import music from "../../../assets/music/wedding.mp3";

export default function MusicPlayer() {

    const { opened } = useInvitation();

    const audioRef = useRef(null);

    const [playing, setPlaying] = useState(false);

    useEffect(() => {

        if (opened && audioRef.current) {

            audioRef.current.volume = 0;

            audioRef.current.play()
                .then(() => {

                    setPlaying(true);

                    let volume = 0;

                    const fade = setInterval(() => {

                        volume += 0.05;

                        if (volume >= 1) {

                            volume = 1;

                            clearInterval(fade);

                        }

                        audioRef.current.volume = volume;

                    }, 120);

                })
                .catch(() => {});

        }

    }, [opened]);

    const toggleMusic = () => {

        if (playing) {

            audioRef.current.pause();

            setPlaying(false);

        } else {

            audioRef.current.play();

            setPlaying(true);

        }

    };

    return (

        <>

            <audio
                ref={audioRef}
                src={music}
                loop
            />

            {

                opened && (

                    <div className="music-player">

                        <div className={playing ? "music-disc spinning" : "music-disc"}>

                            <BsMusicNoteBeamed/>

                        </div>

                        <div className="music-info">

                            <h4>Nuestra Canción</h4>

                            <p>Reproduciendo...</p>

                        </div>

                        <button onClick={toggleMusic}>

                            {

                                playing

                                    ?

                                    <FaPause/>

                                    :

                                    <FaPlay/>

                            }

                        </button>

                    </div>

                )

            }

        </>

    );

}