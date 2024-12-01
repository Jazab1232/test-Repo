import React, { useContext, useMemo, useState } from 'react';
import '../styles/projectDetail.css';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../Components/context/AppContext.jsx';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../Components/config/config.js';
import { ClipLoader } from 'react-spinners';
import { EditIcon } from '../Components/Icons.jsx';
import AddMember from '../Components/AddMember.jsx';
import AddTask from '../Components/AddTask.jsx';
import AddProject from '../Components/AddProject.jsx';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../Components/context/AuthContext.jsx';

export default function ProjectDetail() {

    const [loading, setLoading] = useState(false)
    const [showAddTeam, setShowAddTeam] = useState(false)
    const [ShowAddProject, setShowAddProject] = useState(false)
    const { projects, teamMembers, tasks, setTasks, ShowAddTask, setShowAddTask } = useContext(AppContext);
    const { currentUserUid } = useContext(AuthContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('id');

    let currentUserRole = teamMembers.find((member) => {
        return member.uid == currentUserUid
    })


    const currentProject = useMemo(() => {
        return projects.find((project) => project.id === projectId);
    }, [projectId, projects]);


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

    async function handleDeleteTask(taskId) {

        try {
            setLoading(true)
            await deleteDoc(doc(firestore, 'tasks', taskId));
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
            toast.success('Task deleted successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            setLoading(false)
        } catch (error) {
            toast.error('Error deleting task:', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            setLoading(false)
        }
    }

    return (
        <div className='projectDetail'>
            <div className="taskDetailTop">
                <h2>Project Details</h2>
                <Link to={`/add-project?projectId=${projectId}&edit=${true}`} className='editTaskBtn editBtn' onClick={() => { setShowAddProject(!ShowAddProject) }} style={{ display: currentUserRole.role != 'admin' ? 'none' : 'flex' }} ><EditIcon /> Edit Project </Link>
            </div>
            <div className="projectDetailContainer">
                <div>
                    <div className="projectStatus">
                        <div>
                            <p style={{ textTransform: 'uppercase' }}>{currentProject.priority} priority</p>
                            <p style={{ textTransform: 'uppercase', color: 'blue', color: currentProject.IsComplete == 'completed' ? '#3663EB' : '#BE2423' }}><span style={{ backgroundColor: currentProject.IsComplete == 'completed' ? '#3663EB' : '#BE2423' }} ></span>{currentProject.IsComplete}</p>
                        </div>
                    </div>
                    {/* <input className='detailInput' type="text" value={currentProject.projectName} /> */}
                    <p className='projectDetailTitle'>{currentProject.projectName}</p>
                    <p className='projectDate'>Due date:<span> {currentProject.endDate}</span></p>

                    <div className="projectTeam" style={{ position: 'relative' }}>
                        <div className="projectTeamTop">
                            <p>PROJECT TEAM  <span>{currentTeam.length}</span></p>
                            <button onClick={() => { setShowAddTeam(!showAddTeam) }} className=' editBtn' style={{ display: currentUserRole.role != 'admin' ? 'none' : 'flex' }} ><EditIcon /> Edit Team</button>
                        </div>

                        <AddMember
                            showAddTeam={showAddTeam}
                            setShowAddTeam={setShowAddTeam}
                            currentTeam={currentTeam}
                            currentProject={currentProject}
                            projectId={projectId}
                            currentProjectTask={currentProjectTask} />

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
                            <Link to={`/add-task?projectId=${projectId}`} className='editBtn' onClick={() => { setShowAddTask(true) }} style={{ display: currentUserRole.role == 'admin' ? 'flex' : 'none' }} ><i className="fa-solid fa-plus"></i> Add Task</Link>
                        </div>
                        {currentProjectTask.map((task) => (
                            <div className="projectTaskCard" key={task.id}>
                                <div>
                                    <p>{task.startDate} / {task.endDate}</p>
                                    <span>{task.stage}</span>
                                </div>
                                <div className="projectTaskTitle">
                                    <Link
                                        className='projectTaskLink'
                                        to={`/task-detail?id=${task.id}`}>
                                        {task.title}
                                    </Link>

                                    <button
                                        style={{ display: currentUserRole.role == 'admin' ? 'inline-block' : 'none' }}
                                        className='delBtn'
                                        onClick={() => { handleDeleteTask(task.id) }}>
                                        {loading ? (
                                            <ClipLoader color="#ffffff" loading={loading} size={20} />
                                        ) : (
                                            "Delete"
                                        )}
                                    </button>
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
                    {currentProject.description != undefined
                        ? <div dangerouslySetInnerHTML={{ __html: currentProject.description }}></div>
                        : <p>This project involves creating a user-friendly task management system with features to manage projects, track tasks, and review performance. The system will be accessible for both admins and team members.</p>
                    }
                </div>
            </div>
            {/* <AddTask projectId={projectId}
                currentTeam={currentTeam} /> */}
            {/* <AddProject
                currentTeam={currentTeam}
                ShowAddProject={ShowAddProject}
                setShowAddProject={setShowAddProject}
                currentProject={currentProject}
                projectId={projectId}
                edit={true} /> */}
        </div>
    );
}
