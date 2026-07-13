import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { InvitationProvider } from "./context/InvitationContext";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <InvitationProvider>

        <App />

    </InvitationProvider>

);