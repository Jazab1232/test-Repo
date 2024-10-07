import React, { useContext, useMemo } from 'react';
import '../styles/projectDetail.css';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../Components/config/AppContext';

export default function ProjectDetail() {
    const { projects, teamMembers, tasks, setTasks } = useContext(AppContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('id');

    const currentProject = useMemo(() => {
        return projects.filter((project) => project.id === projectId);
    }, [projects, projectId]);

    if (currentProject.length === 0) {
        return (
            <div className='projectDetail'>
                <p>No Data Found</p>
            </div>
        );
    }

    const currentTeam = useMemo(() => {
        return currentProject[0].selectedTeam.map((id) => {
            return teamMembers.find((member) => member.id === id);
        });
    }, [currentProject, teamMembers]);

    const currentProjectTask = useMemo(() => {
        return tasks.filter((task) => task.projectId === projectId);
    }, [tasks, projectId]);

    const markAsDone = (taskId, stage) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return { ...task, stage: stage }; // Update the stage to the passed value
            }
            return task;
        });
        setTasks(updatedTasks); // Update the tasks in context
    };

    return (
        <div className='projectDetail'>
            <h2>Project Details</h2>
            <div className="projectDetailContainer">
                <div>
                    <div className="projectStatus">
                        <div>
                            <p>{currentProject[0].priority}</p>
                            <p><span></span>ONGOING</p>
                        </div>
                    </div>
                    <p className='projectDetailTitle'>{currentProject[0].projectName}</p>
                    <p className='projectCompanyName'>{currentProject[0].companyName}</p>
                    <p className='projectDate'><span>Created At: </span>{currentProject[0].startDate}</p>
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
                                    <p>{task.title}</p>
                                </div>
                                <div className="projectTaskAddBtn">
                                    <button onClick={() => markAsDone(task.id, 'completed')}>Mark As Done</button>
                                    <button onClick={() => markAsDone(task.id, 'inProgress')}>In Progress</button>
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
