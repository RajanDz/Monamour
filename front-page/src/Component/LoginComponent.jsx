import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';
import image from '../gallery/slika2.jpg';
import { useUser } from './UserProvider';
import { useEffect, useState } from 'react';
import { da } from 'date-fns/locale';



export const LoginComponent = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [user, setUser] = useState(null);
    const  {userLogin,getUserFromCookie} = useUser();

async function handleLogin(username, password) {
    try {
        const response = await fetch('http://localhost:8080/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: "include", 
        });

        if (response.ok) {
            const data = await response.json();
            const userData = await getUserFromCookie();
            if (userData){
                userLogin(userData)
                console.log("Login successful:", data);
                navigate('/');
            }
        } else {
            console.error("Login failed:");
        }
    } catch (error) {
        console.error("Network or server error:", error);
    }
}

    return (
        <div className='login-wrapper'>
            <div className='login-box'>
                <div className='login-image'>
                    <img src={image} alt="Login Visual" />
                </div>
                <div className='login-form'>
                    <div className='input-group'>
                        <label>Username</label>
                        <input 
                            className='input-field'
                            type="text" 
                            placeholder='Unesite email'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className='input-group'>
                        <label>Lozinka</label>
                        <input 
                            className='input-field'
                            type="password" 
                            placeholder='Unesite lozinku'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                    onClick={() => handleLogin(username,password)}
                    className='login-button'>Sign in</button>
                </div>
            </div>
        </div>  
    );
}
