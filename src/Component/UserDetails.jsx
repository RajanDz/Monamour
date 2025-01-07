import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [showRoles, setShowRoles] = useState(false);
    const [addRolesMenu, setAddRolesMenu] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const navigate = useNavigate();

    async function fetchRoles () {
        try {
            const response = await fetch(`http://localhost:8080/api/roles`, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                },
            })
            if(response.ok){
                const data = await response.json();
                setUserRoles(data);
                console.log("Roles: ", data);
            } else {
                console.log("Failed to load roles!")
            }
        } catch (error) {
            console.log("Error happen ", error)
        }
    }
    async function fetchUserData() {
        try {
            const userId = parseInt(id, 10);
            
            if (isNaN(userId)) {
                console.log("Invalid user ID");
                return;
            }

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
                console.log("Failed to load the user details!");
            }
        } catch (error) {
            console.log("There was an error loading the user", error);
        }
    }

    const handleBackClick = () => {
        navigate(-1);
    }
    const removeRoleFromUser = (role) => {
        setUserRoles(userRoles.filter(item => item !== role))
    }
    useEffect(() => {
        fetchUserData();
    }, [id]);
    useEffect(()=>{
        fetchRoles();
    }, [userRoles]);
    // // Uverite se da pozivate API kada se promeni 'id'
    // useEffect(() => {
    //     if (user && user.roles){
    //         const roles = user.roles.map((role) => ({ id: role.id, name: role.name }));  // Vraća objekat sa id i name
    //         setUserRoles(roles);
    //     } 
    // }, [user]);
    return (
        <div>
            <div className="user-container">
                <ul className="user-details">
                    <li className="detail">
                    <div className="profile-photo">
                    {user.profileImage ? (
                     <img src={user.profileImage} alt="User" />
                     ) : (
                   <img src={menPhoto} alt="Default" />
                     )}
                    </div>
                        {/* Provera da li su podaci učitani pre nego što ih prikažete */}
                        {user.name && <DetailItem label="Name" value={user.name} />}
                        {user.lastname && <DetailItem label="Lastname" value={user.lastname} />}
                        {user.email && <DetailItem label="Email" value={user.email} />}
                        {user.phoneNumber && <DetailItem label="Phone number" value={user.phoneNumber} />}
                    </li>
                    <li className="user-button-details">
                        <div className="user-authorization">
                            <button onClick={() => setShowRoles(!showRoles)}>Roles</button>
                        </div>
                    </li>
                </ul>
                {showRoles && (
                     <div className='roles-dashboard'>
                                 <div className='title'>
                                 <button onClick={handleBackClick}>Nazad</button>
                                  <h1>Roles Manager</h1>
                                  </div>
                                  {user.roles && user.roles.length > 0 ? (
                                     <div className='user-roles'>
                                     <ul className='roles-list'>
                                         {userRoles.map((role) => (
                                             <li key={role.id} className='role-item'>
                                             <p>{role.name}</p>
                                             <button onClick={() => removeRoleFromUser(role)}>Remove</button>
                                             </li>
                                         ))}
                                     </ul>
                                     </div>
                 
                                 ): (
                                     <p>Korisnik nema odredjena prava!</p>
                                 )
                                 }
                                    <div className='roles-manager-buttons'>
                                    <button onClick={ () => setAddRolesMenu(!addRolesMenu)}>Add roles to user</button>
                                    {addRolesMenu && (
                                        <div className='roles-to-add'>
                                             <ul className='roles-list'>
                                                {userRoles.map((item) => (
                                                    <li className='role'>
                                                    <p>{item.name}</p>
                                                    <button>Add</button>
                                                    </li>
                                                ))}
                                             </ul>
                                        </div>
                                    )}
                                    </div>
                              </div>
                             )}
            </div>
        </div>
    );
};
