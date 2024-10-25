import React, { useContext, useState } from 'react'
import '../styles/dashTaskCard.css'
import '../styles/cardMenu.css'
import { Link } from 'react-router-dom'
import { AppContext } from '../Components/context/AppContext.jsx';
import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from './config/config';
import { AuthContext } from './context/AuthContext.jsx';

export default function TaskCard({ startDate, title, priority, team, id }) {
    const { setSelectedTaskId, selectedTaskId, tasks, setTasks, teamMembers } = useContext(AppContext);
    const { currentUserUid, setCurrentUserUid } = useContext(AuthContext);
    const [menuVisible, setMenuVisible] = useState(false);

    let role;
    let currentUserRole = teamMembers.find((member) => {
        return member.uid == currentUserUid
    })

    if (currentUserRole && currentUserRole.role) {
        role = currentUserRole.role
    } else {
        console.log('Role is undefined or object not loaded');
    }

    const toggleMenu = () => {
        setSelectedTaskId(id);
        console.log(selectedTaskId);

        setMenuVisible(!menuVisible);
    };

    async function handleDelete() {

        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            try {
                await deleteDoc(doc(firestore, 'tasks', selectedTaskId));

                setTasks((prevTasks) => prevTasks.filter(task => task.id !== selectedTaskId));

                alert('Task deleted successfully!');
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Error deleting task');
            }
        }

    }
    return (
        <div className='dashTaskCard'>
            <div className="taskCardTop">
                <p> <i className="fa-solid fa-angle-up"></i>{priority}</p>
                <i onClick={toggleMenu} className="fa-solid fa-ellipsis" style={{ fontSize: '13px', cursor: 'pointer' }}></i>
            </div>
            <div >
                <Link to={`/task-detail?id=${id}`} className='cardTitle'> <span></span>{title}</Link>
                <div className="cardDate">
                    <p>{startDate}</p>
                </div>
            </div>
            <div className="cardExtraInfo">
                <p><i className="fa-regular fa-message"></i>{team}</p>
                <p><i className="fa-solid fa-paperclip"></i>3</p>
                <p><i className="fa-solid fa-list-ul"></i>1/2</p>
            </div>
            <div className="subTask">
                <p className='subTaskTitle'>SubTask</p>
                <div className="subTaskDate">
                    <p>14-Mar-2024</p>
                </div>
                <div className="addSubTask">
                    <p ><i className="fa-solid fa-plus"></i>ADD SUBTASK</p>
                </div>
                <div className="cardMenu" style={{ display: menuVisible ? 'flex' : 'none' }}>
                    <Link to={`/task-detail?id=${id}`} style={{ color: 'blue', textDecoration: 'none', marginBottom: '20px' }} className="cardMenuEdit" >View</Link>
                    {role == 'admin' && (
                        <button style={{ color: 'red' }} className="cardMenuDel" onClick={handleDelete}>Delete</button>
                    )}
                </div>
            </div>
        </div>
    )
}
