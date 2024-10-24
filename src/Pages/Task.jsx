import React, { useContext, useState } from 'react';
import '../styles/task.css';
import TaskCard from '../Components/TaskCard';
import AddTask from '../Components/AddTask';
import { AppContext } from '../Components/context/AppContext.jsx';
import { AuthContext } from '../Components/context/AuthContext';

export default function Task() {
    const { tasks, ShowAddTask, setShowAddTask, teamMembers, setTeamMembers } = useContext(AppContext);

    const { currentUserUid, setCurrentUserUid } = useContext(AuthContext);

    const currenUserTask = tasks.filter((task) => {
        return task.selectedTeam.includes(currentUserUid)
    })
    console.log(currenUserTask);
    
    let role;
    let currentUserRole = teamMembers.find((member) => {
        return member.uid == currentUserUid
    })

    if (currentUserRole && currentUserRole.role) {
        role = currentUserRole.role
    } else {
        console.log('Role is undefined or object not loaded');
    }


    function handleAddtask() {
        setShowAddTask(true)
    }



    return (
        <div className='task'>
            <div className='addtaskBtn'>
                <h2> Tasks </h2>
                <p style={{ display: role == 'admin' ? 'flex' : 'none' }} onClick={handleAddtask} ><i className="fa-solid fa-plus"></i> Add Task</p>
            </div>
            <div className="taskHeaderTop">
                <div className="taskHeader">
                    <p><span style={{ backgroundColor: '#3663EB' }}></span>Todo</p>
                    <i className="fa-solid fa-plus"></i>
                </div>
                <div className="taskHeader">
                    <p><span style={{ backgroundColor: '#CA8A16' }}></span>In Progress</p>
                    <i className="fa-solid fa-plus"></i>
                </div>
                <div className="taskHeader">
                    <p><span style={{ backgroundColor: '#4EA44B' }}></span>Completed</p>
                    <i className="fa-solid fa-plus"></i>
                </div>
            </div>
            <div className="taskContainer">
                {
                    role !== 'admin' ? (
                        currenUserTask.length > 0 ? (
                            currenUserTask.map((data) => (
                                <TaskCard
                                    key={data.id}
                                    title={data.title}
                                    id={data.id}
                                    startDate={data.startDate}
                                    team={data.selectedTeam?.length}
                                    priority={data.priority}
                                />
                            ))
                        ) : (
                            <p>No Task Found</p>
                        )
                    ) : (
                        tasks.length > 0 ? (
                            tasks.map((data) => (
                                <TaskCard
                                    key={data.id}
                                    title={data.title}
                                    id={data.id}
                                    startDate={data.startDate}
                                    team={data.selectedTeam?.length}
                                    priority={data.priority}
                                />
                            ))
                        ) : (
                            <p>No Task Found</p>
                        )
                    )
                }
            </div>
            <AddTask ShowAddTask={ShowAddTask} setShowAddTask={setShowAddTask} />
        </div>
    );
}
