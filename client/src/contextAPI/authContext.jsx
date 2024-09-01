import { createContext, useContext, useEffect, useState } from "react";



export const AuthContext = createContext();

export const userAuth=()=>{
    return useContext(AuthContext)
}

export const AuthContetProvider=({children})=>{
    const [authUser , setauthUser ] = useState(JSON.parse(localStorage.getItem("plantebuy_user")) || null)
    const [authSeller , setauthSeller ] = useState(JSON.parse(localStorage.getItem("plantebuy_seller")) || null)

     // Function to check if the cookie exists
     const checkCookie = () => {
        const cookieName = "plantebuy_token";
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0] === cookieName) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!checkCookie()) {
                localStorage.removeItem("plantebuy_user");
                setauthUser(null);
            }
        }, 1000); // Check every 1 second
        return () => clearInterval(interval); // Clear interval on unmount
    }, []);

    return (
        <AuthContext.Provider value={{authUser , setauthUser, authSeller, setauthSeller}}>
            {children}
        </AuthContext.Provider>
    );
}