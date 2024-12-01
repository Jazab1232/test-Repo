import React, { useContext } from 'react';
import '../styles/profilePage.css';
import { AppContext } from '../Components/context/AppContext';
import { AuthContext } from '../Components/context/AuthContext';

const ProfilePage = () => {
    const { currentUserUid } = useContext(AuthContext);
    const { teamMembers } = useContext(AppContext);
    const currentUser = teamMembers.find((user) => user.id === currentUserUid);

    return (
        <div className="profilePage">
            <div className="profileContainer">
                <div className="profileImageWrapper">
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                        alt={`${currentUser.fullName}'s profile`}
                        className="profileImage"
                    />
                </div>
                <div className="profileDetails">
                    <h1 className="profileName">{currentUser.fullName}</h1>
                    <p className="profileRole">{currentUser.role}</p>
                    <p className="profileEmail">{currentUser.email}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
