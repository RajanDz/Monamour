import { useEffect, useState } from 'react'
import { useUser } from './UserContext'
import '../CSS/Login.css'
import backroundImage from '../images/MONAMOUR.png'
import { useNavigate } from 'react-router-dom'
import { da } from 'date-fns/locale'
export const LoginComponent = () => {

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const { loginUser } = useUser();
    const [errorMessage,setErrorMessage] = useState("");
    const navigate = useNavigate();
    const handleInputChange = (event) => {
        setUsername(event.target.value);
    }

    const handleInputPassword = (event) => {
        setPassword(event.target.value);
    }

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
    
            const data = await response.json();
            if (response.ok) {
                console.log("Login successful:", data);
                loginUser({
                    id: data.id,
                    username: data.username,
                    roles: data.roles
                })
                navigate('/');
            } else {
                setErrorMessage("Invalid credentials. Please try again.");
                console.error("Login failed:", data.message);
            }
        } catch (error) {
            setErrorMessage("Network or server error. Please try again later.");
            console.error("Network or server error:", error);
        }
    }
    
    const handleSubmit = (event) => {
        event.preventDefault(); // Zaustavlja podrazumevano ponašanje dugmeta
        handleLogin(username, password); // Poziva asinhronu funkciju handleLogin
    };

    useEffect(() => {
        console.log("Test: ",loginUser.id)
    },)
    return (
        <div className="login-page">
            <img src={backroundImage} alt="Monamour" />
            <div className='login-form'>
                <h1>Login</h1>
                <input type="text"
                placeholder='username'
                value={username}
                onChange={(e) => handleInputChange(e)}
                />

                <input type="password"
                placeholder='password'
                value={password}
                onChange={(e) => handleInputPassword(e)}
                />
                <button onClick={handleSubmit}>Potvrdi</button>
                {errorMessage && (
                <div className='error-message'>{errorMessage}</div>
            )}
            </div>
            
        </div>
    )
}