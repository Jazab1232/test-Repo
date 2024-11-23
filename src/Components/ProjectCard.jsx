import React, { useContext, useState } from 'react'
import '../styles/projectCard.css'
import { Link } from 'react-router-dom';
import { AppContext } from '../Components/context/AppContext.jsx';
import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from './config/config.js';
import { AuthContext } from './context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

export default function ProjectCard({ projectName, priority, dueDate, companyName, width, id }) {

    const { setSelectedTaskId, selectedTaskId, projects, setProjects, teamMembers } = useContext(AppContext);
    const { currentUserUid, setCurrentUserUid } = useContext(AuthContext);
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false)

    const toggleMenu = () => {
        setSelectedTaskId(id);
        setMenuVisible(!menuVisible);
    };

    async function deleteProject(id) {

        try {
            setLoading(true)
            await deleteDoc(doc(firestore, 'projects', id));
            setProjects((prevTasks) => prevTasks.filter(task => task.id !== id));
            toast.success('Project deleted successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setLoading(false)
        } catch (error) {
            toast.success('Error deleting Project', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setLoading(false)
        }

    }
    let role;
    let currentUserRole = teamMembers.find((member) => {
        return member.uid == currentUserUid
    })

    if (currentUserRole && currentUserRole.role) {
        role = currentUserRole.role
    } else {
        console.log('Role is undefined or object not loaded');
    }

    return (
        <div className='projectCard' style={{ width: width }}>
            <div className="projectCardHead">
                <Link to={`/project-detail?id=${id}`} className="projectName">
                    <p  >{projectName}</p>
                    <p >{companyName ? companyName : 'Unknown'}</p>
                </Link>
                <i onClick={toggleMenu} className="fa-solid fa-ellipsis" style={{ fontSize: '14px', cursor: 'pointer' }}></i>
            </div>
            <div className="projectStatus">
                <p style={{ margin: '0' }}>In Progress</p>
                <p style={{ margin: '0', textTransform: 'uppercase' }}><span></span>{priority}</p>
            </div>
            <div className="projectTask">
                <p><span>Task Done:</span>3/5</p>
                <input type="range" defaultValue={80} />
            </div>
            <div className="projectDueDate">
                <p>Due Date: {dueDate}</p>
            </div>
            {/* <div className="addTaskBtn">
                <p><i className="fa-solid fa-plus" style={{ marginRight: '10px' }} ></i>ADD TASK</p>
            </div> */}
            <div className="cardMenu" style={{ display: menuVisible ? 'flex' : 'none' }}>
                {/* <button style={{ color: 'blue' }} className="cardMenuEdit">View</button> */}
                {role == 'admin' && (
                    <button style={{ color: 'red' }} className="cardMenuDel" onClick={() => { deleteProject(id) }}>
                        {loading ? (
                            <ClipLoader color="red" loading={loading} size={20} />
                        ) : (
                            "Delete"
                        )}</button>
                )}
            </div>
        </div>
    )
}
