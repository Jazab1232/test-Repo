import React, { useContext } from 'react';
import '../styles/notificationTab.css';
import { AuthContext } from './context/AuthContext';
import { AppContext } from './context/AppContext';
import { Link } from 'react-router-dom';

export default function NotificationTab() {
    const { notifications, showNotifications, setShowNotifications } = useContext(AppContext);
    const { currentUserUid } = useContext(AuthContext);

    const currentUserNotification = notifications.filter((note) => {
        return note.team.includes(currentUserUid);
    });

    return (
        <div className='notificationTab' style={{ display: showNotifications ? 'block' : 'none' }}>
            {currentUserNotification.map((notification, index) => {
                return (
                    <div key={index} className="notifyMessage">
                        <Link to={`/project-detail?id=${notification.projectId}`} className='message' >{notification.message}:<span className='messageSpan'>{notification.projectName}</span></Link>
                    </div>
                );
            })}
        </div>
    );
}
