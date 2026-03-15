import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = 'https://remembermygym-api.onrender.com';

const UserList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('${API_BASE_URL}/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h3>User List</h3>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.full_name} - {user.email} ({user.username})
                    </li>
                ))}
            </ul>
            <button onClick={fetchUsers}>Refresh List</button>
        </div>
    );
};

export default UserList;