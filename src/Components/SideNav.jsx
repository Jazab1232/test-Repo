import React, { useContext } from 'react';
import '../styles/sideNav.css';
import { NavLink } from 'react-router-dom';
import { TeamIcon, DashboardIcon, ProgressIcon, TaskIcon, CheckIcon, ProjectIcon } from '../Components/Icons.jsx';

import { AppContext } from '../Components/context/AppContext.jsx';
import { AuthContext } from './context/AuthContext.jsx';

export default function SideNav() {
    const { teamMembers, setTeamMembers } = useContext(AppContext);
    const { currentUserUid, setCurrentUserUid } = useContext(AuthContext);
  
    let role;
    let currentUserRole = teamMembers.find((member) => {
      return member.uid == currentUserUid
    })
  
    if (currentUserRole && currentUserRole.role) {
      role = currentUserRole.role
    }
  
    return (
        <div className='sideNav'>
            <NavLink
                to={'/dashboard'}
                className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
            >
                {({ isActive }) => (
                    <>
                        <DashboardIcon
                            width="20px"
                            height="20px"
                            fill={isActive ? '#fff' : '#000'}
                        />
                        Dashboard
                    </>
                )}
            </NavLink>
            <NavLink
                to={'/projects'}
                className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
            >
                {({ isActive }) => (
                    <>
                        <ProjectIcon
                            width="20px"
                            height="20px"
                            fill={isActive ? '#fff' : '#000'}
                        />
                        Projects
                    </>
                )}
            </NavLink>
            {/* <NavLink
                to={'/task'}
                className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
            >
                {({ isActive }) => (
                    <>
                        <TaskIcon
                            width="20px"
                            height="20px"
                            fill={isActive ? '#fff' : '#000'}
                        />
                        Task
                    </>
                )}
            </NavLink>
            <NavLink
                to={'/completed'}
                className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
            >
                {({ isActive }) => (
                    <>
                        <CheckIcon
                            width="20px"
                            height="20px"
                            fill={isActive ? '#fff' : '#000'}
                        />
                        Completed
                    </>
                )}
            </NavLink>
            <NavLink
                to={'/in-progress'}
                className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
            >
                {({ isActive }) => (
                    <>
                        <ProgressIcon
                            width="20px"
                            height="20px"
                            fill={isActive ? '#fff' : '#000'}
                        />
                        In Progress
                    </>
                )}
            </NavLink>
            <NavLink
                to={'/todo'}
                className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
            >
                {({ isActive }) => (
                    <>
                        <ProgressIcon
                            width="20px"
                            height="20px"
                            fill={isActive ? '#fff' : '#000'}
                        />
                        To Do
                    </>
                )}
            </NavLink> */}
            <NavLink
                to={'/team'}
                style={{display:role == 'admin' ? 'flex': 'none'}}
                className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
            >
                {({ isActive }) => (
                    <>
                        <TeamIcon
                            width="20px"
                            height="20px"
                            fill={isActive ? '#fff' : '#000'}
                        />
                        Team
                    </>
                )}
            </NavLink>
        </div>
    );
}
