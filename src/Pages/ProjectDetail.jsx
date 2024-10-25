import React, { useContext, useMemo, useState } from 'react';
import '../styles/projectDetail.css';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../Components/config/config.js';
import { ClipLoader } from 'react-spinners';

export default function ProjectDetail() {

    const [loading, setLoading] = useState(false)
    const { projects, teamMembers, tasks, setTasks } = useContext(AppContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('id');

    const currentProject = useMemo(() => {
        return projects.find((project) => project.id === projectId);
    }, [projects, projectId]);

    console.log(currentProject);

    if (currentProject.length === 0) {
        return (
            <div className='projectDetail'>
                <p>No Data Found</p>
            </div>
        );
    }

    const currentTeam = useMemo(() => {
        return currentProject.selectedTeam.map((id) => {
            return teamMembers.find((member) => member.id === id);
        });
    }, [currentProject, teamMembers]);

    const currentProjectTask = useMemo(() => {
        return tasks.filter((task) => task.projectId === projectId);
    }, [tasks, projectId]);


    const markAsDone = async (taskId, newStage) => {
        setLoading(true)
        const taskDoc = doc(firestore, 'tasks', taskId);
        await updateDoc(taskDoc, { stage: newStage });
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return { ...task, stage: newStage };
            }
            return task;
        });

        alert('Task Updated Successfully')
        setLoading(false)
        setTasks(updatedTasks);
    };

    return (
        <div className='projectDetail'>
            <h2>Project Details</h2>
            <div className="projectDetailContainer">
                <div>
                    <div className="projectStatus">
                        <div>
                            <p style={{ textTransform: 'uppercase' }}>{currentProject.priority} priority</p>
                            <p><span></span>ONGOING</p>
                        </div>
                    </div>
                    <p className='projectDetailTitle'>{currentProject.projectName}</p>
                    <p className='projectCompanyName'>{currentProject.companyName}</p>
                    <p className='projectDate'><span>Created At: </span>{currentProject.startDate}</p>
                    <div className="projectAttachment">
                        <p><span>Assets: </span>3</p>
                        <span>|</span>
                        <p><span>Tasks: </span>{currentProjectTask.length}</p>
                    </div>
                    <div className="projectTeam">
                        <p>PROJECT TEAM</p>
                        {currentTeam.map((member) => (
                            <div className="teamMember" key={member.id}>
                                <p>{member.fullName}</p>
                                <p>Administrator</p>
                            </div>
                        ))}
                    </div>
                    <div className="projectTask">
                        <div>
                            <p>TASKS</p>
                        </div>
                        {currentProjectTask.map((task) => (
                            <div className="projectTaskCard" key={task.id}>
                                <div>
                                    <p>{task.startDate}</p>
                                    <span>{task.stage}</span>
                                </div>
                                <div className="projectTaskTitle">
                                    <Link
                                        to={`/task-detail?id=${task.id}`}
                                        style={{ textDecoration: 'none', color: 'black', fontSize: '18px', fontWeight: '600' }} >
                                        {task.title}
                                    </Link>
                                </div>
                                <div className="projectTaskAddBtn">
                                    <button onClick={() => markAsDone(task.id, 'completed')}>
                                        {loading ? (
                                            <ClipLoader color="#ffffff" loading={loading} size={20} />
                                        ) : (
                                            "Mark As Done"
                                        )}
                                    </button>
                                    <button onClick={() => markAsDone(task.id, 'inProgress')}>
                                        {loading ? (
                                            <ClipLoader color="#ffffff" loading={loading} size={20} />
                                        ) : (
                                            "In Progress"
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='projectDesc'>
                    <h2>PROJECT DESCRIPTION</h2>
                    <p>This project involves creating a user-friendly task management system with features to manage projects, track tasks, and review performance. The system will be accessible for both admins and team members.</p>
                </div>
            </div>
        </div>
    );
}
