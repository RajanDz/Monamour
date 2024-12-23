import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import '../CSS/UserDetailsStyle.css';
import menPhoto from '../images/slika_muska-removebg-preview.png';

const DetailItem = ({ label, value }) => (
    <div className="detail-item">
        <p>{label}: {value}</p>
        <button>Edit</button>
    </div>
);

export const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});  // inicijalizujte kao prazan objekat

    async function fetchUserData() {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${id}`, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                console.log(data);  // Da biste proverili podatke nakon što je korisnik učitan
            } else {
                console.log("Failed to load the user details");
            }
        } catch (error) {
            console.log("There was an error loading the user", error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [id]);  // Uverite se da pozivate API kada se promeni 'id'

    return (
        <div>
            <div className="user-container">
                <ul className="user-details">
                    <li className="detail">
                        <div className="profile-photo">
                            <img src={menPhoto} alt="User" />
                        </div>
                        {/* Provera da li su podaci učitani pre nego što ih prikažete */}
                        {user.name && <DetailItem label="Name" value={user.name} />}
                        {user.lastname && <DetailItem label="Lastname" value={user.lastname} />}
                        {user.email && <DetailItem label="Email" value={user.email} />}
                        {user.phoneNumber && <DetailItem label="Phone number" value={user.phoneNumber} />}
                    </li>
                    <li className="user-button-details">
                        <div className="user-authorization">
                            <button>Roles</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};
