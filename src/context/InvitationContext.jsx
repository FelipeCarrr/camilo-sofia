import { createContext, useContext, useState } from "react";

const InvitationContext = createContext();

export function InvitationProvider({ children }) {

    const [opened, setOpened] = useState(false);

    return (

        <InvitationContext.Provider

            value={{

                opened,

                setOpened

            }}

        >

            {children}

        </InvitationContext.Provider>

    );

}

export function useInvitation(){

    return useContext(InvitationContext);

}