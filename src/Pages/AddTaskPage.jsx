import React, { useContext, useEffect, useMemo, useState } from 'react'
import '../styles/addTaskPage.css'
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../Components/config/config.js';
import { ClipLoader } from 'react-spinners';
import AddMember2 from '../Components/AddMember2.jsx';
import { Bounce, toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AddTaskPage({ }) {
    const [loading, setLoading] = useState(false)
    const { projects, tasks, setTasks, ShowAddTask, setShowAddTask } = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [stage, setStage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('taskId');
    const projectId = queryParams.get('projectId');
    const navigate = useNavigate()


    const currentTask = useMemo(() => {
        if (taskId) {
            return tasks.find((task) => task.id === taskId);
        }
    }, [taskId, tasks, location]);

    const currentProject = useMemo(() => {
        if (projectId) {
            return projects.find((project) => project.id === projectId);
        }
    }, [projectId, projects, location]);

    console.log(taskId, currentTask);
    console.log(projectId, currentProject);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskId = crypto.randomUUID();
        const newTask = {
            title,
            selectedTeam,
            description,
            projectId,
            priority,
            startDate,
            stage,
            endDate,
            id: taskId
        }
        if (selectedTeam.length > 0 && description.length > 0) {
            try {
                setLoading(true)
                await setDoc(doc(firestore, 'tasks', taskId), newTask);
                setTasks((prev) => {
                    return [...prev, newTask]
                })
                toast.success('Task added successfully!', {
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
                setTitle('');
                setEndDate('');
                setSelectedTeam([]);
                setPriority('');
                setStage('');
                setStartDate('');
                setDescription('')
                setLoading(false)
                navigate(-1)
            } catch (error) {
                console.log(error);

                toast.warn(`Error adding Task: ${error.message}`, {
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
        } else {
            toast.warn('Fill out all form fields', {
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
        }
    };
    const handleEdit = async (e) => {
        e.preventDefault();
        const newTask = {
            title,
            selectedTeam,
            description,
            projectId: currentTask.projectId,
            priority,
            startDate,
            stage,
            endDate,
            id: taskId
        };

        try {
            const TaskData = doc(firestore, "tasks", taskId);
            setLoading(true);
            await updateDoc(TaskData, {
                title,
                selectedTeam,
                projectId: currentTask.projectId,
                priority,
                description,
                startDate,
                stage,
                endDate,
                id: taskId
            });

            setTasks((prev) => {
                return prev.map((task) =>
                    task.id === taskId ? { ...task, ...newTask } : task
                );
            });
            toast.success('Task Updated successfully!', {
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

            setTitle('');
            setEndDate('');
            setSelectedTeam([]);
            setPriority('');
            setStage('');
            setStartDate('');
            setDescription('');
            setShowAddTask(false);
            setLoading(false);
            navigate(-1)
        } catch (error) {
            toast.error('Error adding Task:', error, {
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
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    function handleCancel() {
        setTitle('');
        setEndDate('');
        setSelectedTeam([]);
        setPriority('');
        setStage('');
        setStartDate('');
        setDescription('');
    }

    useEffect(() => {
        if (currentTask && Object.keys(currentTask).length !== 0) {
            setTitle(currentTask.title || "");
            setDescription(currentTask.description || "");
            setSelectedTeam(currentTask.selectedTeam || []);
            setPriority(currentTask.priority || "");
            setStage(currentTask.stage || "");
            setStartDate(currentTask.startDate || "");
            setEndDate(currentTask.endDate || "");
        }
    }, [currentTask]);



    const todayDate = new Date().toISOString().split("T")[0];


    return (
        <div className='addTask' style={{ display: ShowAddTask ? 'flex' : 'none' }}>
            <form onSubmit={currentTask ? handleEdit : handleSubmit}>
                <div className="addTaskContainer">
                    <h3>{currentTask ? 'Edit Task' : 'Add Task'} </h3>
                    <div className="addTitle">
                        <p>{currentTask ? 'Edit' : 'Add'} Task: </p>
                        <input
                            required
                            type="text"
                            placeholder='Add Task Title'
                            value={title}
                            onChange={(e) => { setTitle(e.target.value) }} />
                    </div>
                    <div className="addTitle">
                        <p>Add description:</p>
                        <Editor
                            apiKey="n0a6gafqn6nr414ct18m5584ixlp0vbhspqav37g0ma3w0fu"
                            value={description}
                            init={{
                                plugins: [
                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                            }}
                            onEditorChange={(newContent) => setDescription(newContent)}
                        />
                    </div>

                    <div className="addTaskMember" style={{ display: currentTask ? 'none' : 'inline-block' }}>
                        <p>Assign Task To: </p>
                        <AddMember2
                            setSelectedTeam={setSelectedTeam}
                            selectedTeam={selectedTeam}
                            currentProject={currentProject}
                        />
                    </div>
                    <div className='addTaskSelect'>
                        <div className="addTaskStage">
                            <p>Task Stage:</p>
                            <select
                                required
                                value={stage}
                                onChange={(e) => { setStage(e.target.value) }}>
                                <option value="">Select Task Stage</option>
                                <option value="Todo">Todo</option>
                                <option value="inProgress">In Progress</option>
                            </select>
                        </div>
                        <div className="addTaskPriority">
                            <p>Task Priority:</p>
                            <select
                                required
                                value={priority}
                                onChange={(e) => { setPriority(e.target.value) }} >
                                <option value="">Select Priority</option>
                                <option value="very high">Very High</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div className="addTaskDate">
                        <div>
                            <p>Task Date</p>
                            <input
                                required
                                type="date"
                                value={startDate}
                                min={taskId ? startDate : todayDate}
                                onChange={(e) => { setStartDate(e.target.value) }} />
                        </div>
                        <div>
                            <p>End Date</p>
                            <input
                                required
                                type="date"
                                value={endDate}
                                min={taskId ? startDate : todayDate}
                                onChange={(e) => { setEndDate(e.target.value) }} />
                        </div>
                    </div>
                    <div className="addTaskBtn">
                        <button onClick={handleCancel}>Reset</button>
                        <button type='submit'>
                            {loading ? (
                                <ClipLoader color="#ffffff" loading={loading} size={20} />
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
