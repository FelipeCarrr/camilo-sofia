import Navbar from "../layout/Navbar/Navbar";
import Hero from "../sections/Hero/Hero";
import Countdown from "../sections/Countdown/Countdown";
import Story from "../sections/Story/Story";
import Events from "../sections/Events/Events";
import MusicPlayer from "../Common/MusicPlayer/MusicPlayer";
import Gallery from "../sections/Gallery/Gallery";
import DressCode from "../sections/DressCode/DressCode";
import RSVP from "../sections/RSVP/RSVP";
import Footer from "../layout/Footer/Footer";

export default function WeddingInvitation(){

return(

<>

<Navbar/>

<MusicPlayer />

<Hero/>

<Countdown/>

<Story />

<Events />

<Gallery />

<DressCode />

<RSVP />

<Footer />

</>

)

}
