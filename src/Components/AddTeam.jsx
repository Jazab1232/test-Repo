import React, { useContext, useState } from 'react';
import { auth, firestore } from "../Components/config/config";
import { createUserWithEmailAndPassword, signInWithCustomToken, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AppContext } from './context/AppContext';
import { ClipLoader } from 'react-spinners';
import { AuthContext } from './context/AuthContext';

export default function AddTeam({ showAddTeam, setShowAddTeam }) {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const { teamMembers, setTeamMembers } = useContext(AppContext);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const newMember = {
                email,
                fullName,
                role,
                uid: user.uid
            }
            await setDoc(doc(firestore, 'users', user.uid), newMember);
            setTeamMembers((prev) => {
                return [...prev, newMember]
            })

            alert('Team member created successfully!');
            setFullName('');
            setEmail('');
            setPassword('');
            setRole('');
            setLoading(false)
            setShowAddTeam(false)
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating team member');
        }
    };

    return (
        <div className='addTask' style={{ display: showAddTeam ? 'flex' : 'none' }}>
            <form onSubmit={handleSubmit}>
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
                        <button type='submit' className="submitBtn"> {loading ? (
                            <ClipLoader color="#ffffff" loading={loading} size={20} />
                        ) : (
                            "Submit"
                        )}</button>
                    </div>
                </div>
            </form>
        </div>
    );
}