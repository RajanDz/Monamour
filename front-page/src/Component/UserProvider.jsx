import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(storedUser || null);

    const userLogin = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    return (
        <UserContext.Provider value={{ user, userLogin }}>
            {children}
        </UserContext.Provider>
    );
};

// ✅ Ovo je bitno! Ako fali – javiće grešku
export const useUser = () => useContext(UserContext);
