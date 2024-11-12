import { createContext, useContext, useState } from "react"

 const UserContext = createContext();
 
 export const UserProvider = ({children}) => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));

    const [user, setUser] = useState(storedUser || null);

    const loginUser = (userData) => {
        setUser(userData); // Umesto da setuješ ceo objekat, setuješ samo korisnika
        // Čuvaj korisnika u localStorage
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <UserContext.Provider value={{user,loginUser}}>
            {children}
        </UserContext.Provider>
    )
 }
 export const useUser = () => useContext(UserContext);