import '../Styles/Login.css';
import image from '../gallery/slika2.jpg';

export const LoginComponent = () => {
    return (
        <div className='login-wrapper'>
            <div className='login-box'>
                <div className='login-image'>
                    <img src={image} alt="Login Visual" />
                </div>
                <div className='login-form'>
                    <div className='input-group'>
                        <label>Email</label>
                        <input 
                            className='input-field'
                            type="text" 
                            placeholder='Unesite email'
                        />
                    </div>

                    <div className='input-group'>
                        <label>Lozinka</label>
                        <input 
                            className='input-field'
                            type="password" 
                            placeholder='Unesite lozinku'
                        />
                    </div>

                    <button className='login-button'>Sign in</button>
                </div>
            </div>
        </div>  
    );
}
