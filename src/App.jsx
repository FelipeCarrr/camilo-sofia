import Envelope from "./components/layout/Envelope/Envelope";
import WeddingInvitation from "./components/WeddingInvitation/WeddingInvitation";
import AdminPanel from "./components/admin/AdminPanel";

import { useInvitation } from "./context/InvitationContext";

function App() {
  const { opened } = useInvitation();

  if (window.location.pathname.startsWith("/admin")) {
    return <AdminPanel />;
  }

  return <>{opened ? <WeddingInvitation /> : <Envelope />}</>;
}

export default App;