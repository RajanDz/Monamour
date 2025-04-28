import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const userLogin = (userData) => {
        setUser(userData);
    }

    async function getUserFromCookie() {
        try {
            const response = await fetch(`http://localhost:8080/auth/getUsernameFromTokenFromCookie`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                const data = await response.json();
                setUser(data);
                console.log("User details: ", data);
                return data;
            } else {
                console.log('Failed to fetch username from token!');
            }
        } catch (error) {
            console.log('Error happen ', error);
        }
    }
    return (
        <UserContext.Provider value={{ user, userLogin , getUserFromCookie}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
