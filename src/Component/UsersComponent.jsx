import { useEffect, useState } from 'react'
import '../CSS/UsersComponentStyle.css'
import { useUser } from './UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { da, tr } from 'date-fns/locale';

export const UsersComponent = () => {
    const {user} = useUser();
    const [inputId, setInputId] = useState(null);
    const [inputSearch, setInputSearch] = useState("");
    const [usersFetchresult, setUserFetchResult] = useState([]);
    const [users,setUsers] = useState([]);
    const navigate = useNavigate();



    async function fetchAllUsers() {
        try{
            const response = await fetch('http://localhost:8080/api/users',{
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                },
                credentials:'include'
            });
            if (response.ok){
                const data = await response.json();
                const sortedUsers = data.sort((a,b) => b.id - a.id);
                setUsers(sortedUsers);
            } else {
                console.log('Error while fetching users!');
            }
        } catch(error){
            console.log('Error happen: ', error);
        }
    }

    async function fetchUsersByFilters() {
        const formData = new FormData();
            if (inputId !== null){
                formData.append('userId', inputId);
            } 
             if (inputSearch !== null){
                formData.append('filter', inputSearch);
            }

        try {
            const response = await fetch('http://localhost:8080/api/findUsersByFilter', {
                method: 'POST',
                body: formData,
                credentials:'include'

            });
            if (response.ok){
                const data = await response.json();
                setUserFetchResult(data);
                console.log("Users: ", data);
            } else {
                console.log("Error while fetching data of users!");
            }
        } catch (error) {
            console.log("Error happen: ", error);
        }
    }
    useEffect(() => {
        if (!user){
            navigate('/login')
        } 
            fetchAllUsers();
            console.log(users);
    },[])
    return(
        <div className='users-container'>
            <div className='users-search'>
                <input 
                type="number"
                placeholder='Insert id of user'
                value={inputId}
                min={"1"}
                onChange={(e) => setInputId(e.target.value)}
                />
                

                <input 
                type="text"
                placeholder='Insert any of user details'
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                />
                <button 
                onClick={() => fetchUsersByFilters()}
                className='submit-search'>Submit</button>
            </div>
            {usersFetchresult.length < 1 ? (
                 <div className='list-of-users'>
                 <table>
                     <thead>
                         <tr>
                             <th>Id</th>
                             <th>Name</th>
                             <th>Lastname</th>
                             <th>email</th>
                         </tr>
                     </thead>
                     <tbody>
                         {users.map((user,index) => (
                             <tr 
                             className='table-element'
                             onClick={() => navigate(`/user/${user.id}`)} 
                             key={index}>
                                 <td>{user.id}</td>
                                 <td>{user.name}</td>
                                 <td>{user.lastname}</td>
                                 <td>{user.email}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
            ): (
                <div>
                    <table>
                     <thead>
                         <tr>
                             <th>Id</th>
                             <th>Name</th>
                             <th>Lastname</th>
                             <th>email</th>
                         </tr>
                     </thead>
                     <tbody>
                         {usersFetchresult.map((user,index) => (
                             <tr 
                             className='table-element'
                             onClick={() => navigate(`/user/${user.id}`)} 
                             key={index}>
                                 <td>{user.id}</td>
                                 <td>{user.name}</td>
                                 <td>{user.lastname}</td>
                                 <td>{user.email}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                </div>
            )};
        </div>
    )
}