import '../Styles/ProfileSettings.css'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useUser } from "./UserProvider";
import { da } from 'date-fns/locale';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';

export const ProfileSettings = () => {
    const {user} = useUser()
    const [userImage, setUserImage] = useState(null);
    const [registrationDate, setRegistrationDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [newProfileImage, setNewProfileImage] = useState(null);

    const [name, setName] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);



    async function getProfileImage() {
        try {
            const response = await fetch(`http://localhost:8080/api/user/profile-image/${user.id}`, {
                method: 'GET',
                credentials: 'include',
            })
            if (response.ok){
                const data = await response.text();  // Koristi response.text() umesto response.json()
                setUserImage(data)
                console.log(data)
            } else {
                console.log('Error happen!')
            }
        } catch (error) {
            console.log('Error happen while fetching user img!', error);
        }
    }

    async function fetchUserActivity() {
        try {
            const response = await fetch(`http://localhost:8080/api/userLog/${user.id}`,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'

            });
            if (response.ok){
                const data = await response.json();
                const registrationDate = new Date(data.registrationDate);
                const formattedDate = registrationDate.toLocaleDateString('en-GB');
                setRegistrationDate(formattedDate);
                console.log('Log of user, ', data)
            } else {
                console.log('Failed to fetch user activity!')
            }
        } catch (error) {
                console.log('Error happen: ', error);            
        }
    }

    async function editUserDetails() {
        try {
            const response = await fetch('http://localhost:8080/api/editUserDetails', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                   id: user.id,
                   name: name,
                   lastname: lastname,
                   email: email,
                   password: password
                })
            })

            if (response.ok){
                const data = await response.json();
                console.log(data);
            }
            else if (response.status === 401){
                setErrorMessage("Email already exist!")
            }
            else {
                console.log("Error happen with server!")
            }
        } catch (error) {
            console.log('Error happen while trying to fetch response! ', error)
        }
    }

useEffect(() => {
    if (user){
        getProfileImage();
        fetchUserActivity();
    }
}, [user])
useEffect(() => {
    console.log("Img: ",newProfileImage)
}, [newProfileImage])
    return (
        <div>
            {user !== null ? (
            <div className="edit-profile">

            <div className='upload-photo'>
                <h1>{user.name} {user.lastname}</h1>
                <p>@{user.username}</p>
                <img src={userImage} alt="photo" />

                <input 
                type='file'
                hidden
                id='uploadImage'
                onChange={(e) => {setNewProfileImage(e.target.files[0])}}
                />

                <button 
                className='upload-new-photo'
                onClick={() => document.getElementById('uploadImage').click()}
                >Upload new photo
                </button>

                <p>Member since: {registrationDate || "We doesn't have information right now."}</p>
            </div>

            <div className='user-information'>
                <div className='input-group'>
                <p>Name</p>
                <input
                 type="text"
                 placeholder={user.name}
                 onChange={(e) => setName(e.target.value)}
                  /> 
                </div>

                <div className='input-group'>
                <p>Lastname</p>
                  <input
                 type="text"
                 placeholder={user.lastname}
                 onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
                  
                <div className='input-group'>
                    <div>
                        <p>Email address</p>
                        <input
                        type="email"
                        placeholder={user.email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        {errorMessage && (
                            <p>{errorMessage}</p>
                        )}
                    </div>
                </div>
                

                <div className='input-group'>
                   <p>Confirm Email address</p>
                        <input
                        type="email"
                        placeholder={user.email}
                         onChange={(e) => setEmail(e.target.value)}
                        />
                </div>

                    <div className='input-group'>
                        <div>
                            <p>Password</p>
                            <input
                            type="text"
                            placeholder="Type your new password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>
                    </div>
                    <div className='input-group'>
                        <p>Confirm Password</p>
                        <input
                            type="text"
                            placeholder="Confirm your password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>

                        <button 
                        onClick={() => editUserDetails()}
                        className='confirm-button'>Confirm changes</button>
                </div>
            </div>
            ): (
                <p>Error while geting user information!</p>
            )}
            
        </div>
    )
}