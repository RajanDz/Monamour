import { useState } from 'react'
import { useUser } from './UserContext'
import '../CSS/Login.css'
import backroundImage from '../images/MONAMOUR.png'
import { useNavigate } from 'react-router-dom'
export const LoginComponent = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const { loginUser } = useUser();
    const navigate = useNavigate();
    const handleInputChange = (event) => {
        setEmail(event.target.value);
    }

    const handleInputPassword = (event) => {
        setPassword(event.target.value);
    }

    async function handleLogin(email,password) {
        try {
            const response = await fetch('http://localhost:8080/api/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email,password}),
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Login successful:", data);
                loginUser(data)
                navigate('/')
                return data; // Vraća podatke o korisniku
            } else {
                console.error("Login failed:", data.message);
            }
        } catch (error) {
            console.error("Network or server error:", error);
        }
    } 
    const handleSubmit = (event) => {
        event.preventDefault(); // Zaustavlja podrazumevano ponašanje dugmeta
        handleLogin(email, password); // Poziva asinhronu funkciju handleLogin
    };
    return (
        <div className="login-page">
            <img src={backroundImage} alt="Monamour" />
            <div className='login-form'>
                <h1>Login</h1>
                <input type="text"
                placeholder='email'
                value={email}
                onChange={(e) => handleInputChange(e)}
                />

                <input type="password"
                placeholder='password'
                value={password}
                onChange={(e) => handleInputPassword(e)}
                />
                <button onClick={handleSubmit}>Potvrdi</button>
            </div>
        </div>
    )
}