import React, { useContext, useMemo, useState } from 'react';
import '../styles/projectDetail.css';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../Components/config/config.js';
import { ClipLoader } from 'react-spinners';
import { EditIcon } from '../Components/Icons.jsx';
import AddMember from '../Components/AddMember.jsx';
import AddTask from '../Components/AddTask.jsx';
import AddProject from '../Components/AddProject.jsx';

export default function ProjectDetail() {

    const [loading, setLoading] = useState(false)
    const [showAddTeam, setShowAddTeam] = useState(false)
    const [ShowAddProject, setShowAddProject] = useState(false)
    const { projects, teamMembers, tasks, setTasks, ShowAddTask, setShowAddTask } = useContext(AppContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('id');


    const currentProject = useMemo(() => {
        return projects.find((project) => project.id === projectId);
    }, [projectId, projects]);


    console.log('currentProject', currentProject);
    // if (currentProject.length === 0) {
    //     return (
    //         <div className='projectDetail'>
    //             <p>No Data Found</p>
    //         </div>
    //     );
    // }

    const currentTeam = useMemo(() => {
        return currentProject.selectedTeam.map((id) => {
            return teamMembers.find((member) => member.id === id);
        });
    }, [currentProject, teamMembers]);

    const currentProjectTask = useMemo(() => {
        return tasks.filter((task) => task.projectId === projectId);
    }, [tasks, projectId]);


    // const markAsDone = async (taskId, newStage) => {
    //     setLoading(true)
    //     const taskDoc = doc(firestore, 'tasks', taskId);
    //     await updateDoc(taskDoc, { stage: newStage });
    //     const updatedTasks = tasks.map((task) => {
    //         if (task.id === taskId) {
    //             return { ...task, stage: newStage };
    //         }
    //         return task;
    //     });

    //     alert('Task Updated Successfully')
    //     setLoading(false)
    //     setTasks(updatedTasks);
    // };

    return (
        <div className='projectDetail'>
            <div className="taskDetailTop">
                <h2>Project Details</h2>
                <button className='editTaskBtn editBtn' onClick={() => { setShowAddProject(!ShowAddProject) }}><EditIcon /> Edit Project </button>
            </div>
            <div className="projectDetailContainer">
                <div>
                    <div className="projectStatus">
                        <div>
                            <p style={{ textTransform: 'uppercase' }}>{currentProject.priority} priority</p>
                            <p><span></span>ONGOING</p>
                        </div>
                    </div>
                    {/* <input className='detailInput' type="text" value={currentProject.projectName} /> */}
                    <p className='projectDetailTitle'>{currentProject.projectName}</p>
                    <p className='projectDate'><span>Created At: </span>{currentProject.startDate}</p>

                    <div className="projectTeam" style={{ position: 'relative' }}>
                        <div className="projectTeamTop">
                            <p>PROJECT TEAM  <span>{currentTeam.length}</span></p>
                            <button onClick={() => { setShowAddTeam(!showAddTeam) }} className=' editBtn'><EditIcon /> Edit Team</button>
                        </div>

                        <AddMember
                            showAddTeam={showAddTeam}
                            setShowAddTeam={setShowAddTeam}
                            currentTeam={currentTeam}
                            currentProject={currentProject}
                            projectId={projectId} />

                        {currentTeam.map((member) => (
                            <div className="teamMember" key={member.id}>
                                <p>{member.fullName}</p>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                    <div className="projectTask">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>TASKS <span>{currentProjectTask.length}</span></p>
                            <button className='editBtn' onClick={() => { setShowAddTask(true) }}><i className="fa-solid fa-plus"></i> Add Task</button>
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
                                {/* <div className="projectTaskAddBtn">
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
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='projectDesc'>
                    <h2>PROJECT DESCRIPTION</h2>
                    <p>This project involves creating a user-friendly task management system with features to manage projects, track tasks, and review performance. The system will be accessible for both admins and team members.</p>
                </div>
            </div>
            <AddTask projectId={projectId}
                currentTeam={currentTeam} />
            <AddProject
                currentTeam={currentTeam}
                ShowAddProject={ShowAddProject}
                setShowAddProject={setShowAddProject}
                currentProject={currentProject}
                projectId={projectId}
                edit={true} />

        </div>
    );
}
