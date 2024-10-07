import React, { useState } from 'react';
import { auth, firestore } from "../Components/config/config";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function AddTeam({ showAddTeam, setShowAddTeam }) {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(firestore, 'users', user.uid), {
                email,
                fullName,
                role,
                uid: user.uid
            });

            alert('Team member created successfully!');
            setFullName('');
            setEmail('');
            setPassword('');
            setRole('');
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating team member');
        }
    };



    return (
        <div className='addTask' style={{ display: showAddTeam ? 'flex' : 'none' }}>
            <div className="addTaskContainer">
                <h3>Add Team Member</h3>

                <div className="addTaskField">
                    <p>Full Name</p>
                    <input
                        type="text"
                        placeholder='Enter full name'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div className="addTaskField">
                    <p>Email</p>
                    <input
                        type="email"
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="addTaskField">
                    <p>Password</p>
                    <input
                        type="text"
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="addTaskField">
                    <p>Role:</p>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="frontend-dev">Frontend Developer</option>
                        <option value="backend-dev">Backend Developer</option>
                        <option value="full-stack-dev">Full Stack Developer</option>
                        <option value="designer">Designer</option>
                    </select>
                </div>

                <div className="addTaskBtn">
                    <button onClick={() => setShowAddTeam(false)} className="cancelBtn">Cancel</button>
                    <button onClick={handleSubmit} className="submitBtn">Submit</button>
                </div>
            </div>
        </div>
    );
}
