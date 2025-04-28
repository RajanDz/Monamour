import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import '../CSS/UserDetailsStyle.css';
import menPhoto from '../images/slika_muska-removebg-preview.png';
import { format, parseISO } from "date-fns";


export const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});  // inicijalizujte kao prazan objekat
    const [showRoles, setShowRoles] = useState(false);
    const [addRolesMenu, setAddRolesMenu] = useState(false);
    const [roles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [userDetailsMenu, setUserDetailsMenu] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [registrationDate, setRegistrationDate] = useState(null);
    const [lastLoginDate, setLastLoginDate] = useState(null);

    const navigate = useNavigate();

    async function fetchUserActivity() {
        try {
            const response = await fetch(`http://localhost:8080/api/userLog/${81}`,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'

            });
            if (response.ok){
                const data = await response.json();
                const formattedRegistrationDate = format(parseISO(data.registrationDate), "dd.MM.yyyy HH:mm:ss");
                setRegistrationDate(formattedRegistrationDate);
                const formattedLastLoginDate = format(parseISO(data.lastLoginDate), "dd.MM.yyyy HH:mm:ss");
                setLastLoginDate(formattedLastLoginDate);
            } else {
                console.log('Failed to fetch user activity!')
            }
        } catch (error) {
                console.log('Error happen: ', error);            
        }
    }


    async function fetchUserPhoto() {
        try {
            const response = await fetch(`http://localhost:8080/api/user/profile-image/${id}`, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include'
            });
        
            console.log("Response status:", response.status);
        
            if (response.ok) {
                const data = await response.text(); // Ovdje se očekuje JSON
                setProfilePhoto(data);
            } else {
                const errorText = await response.text(); // Vraća tekstualni odgovor (npr. HTML greška)
                console.error("Error response text:", errorText);
            }
        } catch (error) {
            console.error("There was an error loading the user:", error);
        }
    }
    async function fetchUserData() {
        try {
            const userId = parseInt(id, 10);
            
            if (isNaN(userId)) {
                console.log("Invalid user ID");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include'

            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setUserRoles(data.roles);
            } else {
                console.log("Failed to load the user details!");
            }
        } catch (error) {
            console.log("There was an error loading the user", error);
        }
    }

    async function removeRoleFromUser(userId, roleId) {
        try {
            const response = await fetch(`http://localhost:8080/api/removeRole/${userId}/${roleId}`,{
                 method: "GET",
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'

            });
            if (response.ok) {
                const data = await response.json();
                await fetchUserData(); 
            } else {
                console.log("Failed to load the user details!");
            }
        } catch (error) {
            console.log("Error happen, ", error);
        }
    }
    async function addRoleToUser(userId, roleId) {
        try {
            const response = await fetch(`http://localhost:8080/api/addRoleToUser/${userId}/${roleId}`,{
                method: "GET",
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'

            });
            if (response.ok) {
                const data = await response.json();
                await fetchUserData(); // Automatski ažuriraj podatke o korisniku
            } else {
                console.log("Failed to add a role to user!");
            }
        } catch (error) {
            console.log("Error happen, ", error);
        }
    }
    async function fetchAvailableRoles(userId) {
        try {
            const response = await fetch(`http://localhost:8080/api/availableRoles/${id}`, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include'

            })
            if (response.ok){
                const data = await response.json();
                setRoles(data);
            } else {
                console.log('Failed to load roles');
            }
        } catch (error) {   
            console.log('There was an error: ', error);
        }
    }
    const DetailItem = ({ label, value, field }) => {

        const [tempValue, setTempValue] = useState(value);
        
            async function editUserDetails() {
            try {
                const response = await fetch("http://localhost:8080/api/editUserDetails", {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: user.id,
                        [field]: tempValue,
                    }),
                    credentials: 'include'

                });
                if (response.ok){
                    const data = await response.json();
                    fetchUserData();
                    setEditingField(null)
                } else {
                    console.log("There was an error while updating details about user!")
                }
            } catch (error) {
                console.log("error happen: ", error)
            }
        }
    
        const handleCancel = () => {
            setTempValue(user[field]); // Resetuj vrednost
            setEditingField(null); // Izađi iz režima uređivanja
        };
        
        return (
            <div className="detail-item">
                {editingField === field ? (
                    <>
                        <label>{label}: </label>
                        <input
                            type="text"
                            value={tempValue} // Koristi privremenu vrednost
                            onChange={(e) => setTempValue(e.target.value)} // Ažuriraj privremeno stanje
                        />
                        <button onClick={editUserDetails}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </>
                ) : (
                    <>
                        <p>{label}: {value}</p>
                        <button
                            onClick={() => {
                                setEditingField(field); // Postavi aktivno polje za uređivanje
                                setTempValue(value); // Postavi trenutnu vrednost za uređivanje
                            }}
                        >
                            Edit
                        </button>
                    </>
                )}
            </div>
        );
    };
       
    const handleBackClick = () => {
        navigate(-1);
    }
   
    useEffect(() => {
        fetchUserData();
        fetchUserPhoto();
        fetchUserActivity();
    }, [id]);
    
    useEffect(() => {
        fetchAvailableRoles(id);
        },[userRoles]);
   
    return (
        <div>
            <div className="user-container">
                <ul className="user-details">
                    <li className="detail">
                    <div className="profile-photo">
                    {user.profileImage ? (
                     <img src={profilePhoto} alt="User" />
                     ) : (
                   <img src={menPhoto} alt="Default" />
                     )}
                    </div>
                        {user.name && <DetailItem label="Name" value={user.name} field={'name'}/>}
                        {user.lastname && <DetailItem label="Lastname" value={user.lastname} field={'lastname'} />}
                        {user.email && <DetailItem label="Email" value={user.email} field={'email'}/>}
                        {user.phoneNumber && <DetailItem label="Phone number" value={user.phoneNumber} field={'phoneNumber'}/>}
                        {user.password && <DetailItem label="Password" value={user.password} field={'password'}/>}
                    </li>
                    <div>
                        <p>Registration date: {registrationDate}</p>
                        <p>Last login date: {lastLoginDate}</p>
                    </div>
                    <li className="user-button-details">
                        <div className="user-authorization">
                            <button onClick={() => setShowRoles(!showRoles)}>Roles</button>
                        </div>
                    </li>
                </ul>
                {userDetailsMenu && (
                    <div className='edit-details'>
                        <button onClick={() => setUserDetailsMenu(!userDetailsMenu)} className='getBack-button'>Nazad</button>
                       
                    </div>
                )}
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
                                             <button onClick={() => removeRoleFromUser(id,role.id)}>Remove</button>
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
                                    {addRolesMenu &&  (
                                        <div className='roles-to-add'>
                                            {roles.length > 0 ? (
                                                 <ul className='roles-list'>
                                                 {roles.map((item) => (
                                                     <li key={item.id} className='role'>
                                                     <p>{item.name}</p>
                                                     <button onClick={() => addRoleToUser(id, item.id)}>Add</button>
                                                     </li>
                                                 ))}
                                              </ul>
                                            ):(
                                        <p className='error-roles'>Korisnik nema mogucnost na dodjelu uloga!</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
