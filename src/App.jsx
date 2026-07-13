import Envelope from "./components/layout/Envelope/Envelope";
import WeddingInvitation from "./components/WeddingInvitation/WeddingInvitation";

import { useInvitation } from "./context/InvitationContext";

function App() {

  const { opened } = useInvitation();

  return (
    <>
      {
        opened
          ? <WeddingInvitation />
          : <Envelope />
      }
    </>
  );

}

export default App;