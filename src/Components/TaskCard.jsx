import React, { useContext, useState } from 'react';
import '../styles/taskCard.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../Components/context/AppContext.jsx';
import AddSubTask from './AddSubTask';
import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from './config/config';
import AddTask from './AddTask';
import { AuthContext } from './context/AuthContext';

export default function TaskCard({ startDate, title, team, priority, id }) {
    const { setShowAddSubtask, setSelectedTaskId, showAddSubtask, selectedTaskId, setTasks, tasks, ShowAddTask, setShowAddTask, teamMembers } = useContext(AppContext);
    const { currentUserUid, setCurrentUserUid } = useContext(AuthContext);
    const [menuVisible, setMenuVisible] = useState(false);
    const [updateId, setupdateId] = useState(null);

    const toggleMenu = () => {
        setSelectedTaskId(id);
        setMenuVisible(!menuVisible);
    };
    const handleAddSubtaskClick = () => {
        setSelectedTaskId(id);
        setShowAddSubtask(true);

    };
    const handleEdit = () => {
        setSelectedTaskId(id)
        setupdateId(selectedTaskId)
        setShowAddTask(true)
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
        <div className='taskCard'>
            <div className="taskCardTop">
                <p><i className="fa-solid fa-angle-up"></i>{priority}</p>
                <i onClick={toggleMenu} className="fa-solid fa-ellipsis" style={{ fontSize: '13px', cursor: 'pointer' }}></i>
            </div>
            <div>
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
                <div className="subTaskDate">
                </div>
                <div className="addSubTask" >
                    <button
                        style={{ cursor: role == 'admin' ? 'pointer' : 'not-allowed' }}
                        disabled={role != 'admin' ? true : false}
                        onClick={handleAddSubtaskClick}><i className="fa-solid fa-plus"></i>ADD SUBTASK</button>
                </div>
                <div className="cardMenu" style={{ display: menuVisible ? 'flex' : 'none' }}>
                    <Link to={`/task-detail?id=${id}`} style={{ color: 'blue', textDecoration: 'none', marginBottom: '20px' }} className="cardMenuEdit" >View</Link>
                    {role == 'admin' && (
                        <button style={{ color: 'red' }} className="cardMenuDel" onClick={handleDelete}>Delete</button>
                    )}
                </div>
            </div>

            {showAddSubtask && selectedTaskId === id && (
                <AddSubTask taskId={id} />
            )}
            {ShowAddTask && updateId === id && (
                <AddTask currentId={updateId} />
            )}
        </div>
    );
}
