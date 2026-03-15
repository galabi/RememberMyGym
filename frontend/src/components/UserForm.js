import React, { useState } from 'react';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const UserForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        username: '',
        password: '',
        birth_date: '',
        gender: 'male'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Adjust URL if your server runs on a different port
            const response = await axios.post(`${API_BASE_URL}/api/users`, formData);
            alert('User created successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Create New User</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required /><br/>
                <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required /><br/>
                <input type="text" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required /><br/>
                <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required /><br/>
                <input type="date" onChange={(e) => setFormData({...formData, birth_date: e.target.value})} /><br/>
                <select onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select><br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default UserForm;