import React, { useContext, useEffect, useState } from 'react'
import '../styles/addTask.css'
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './config/config';
import { ClipLoader } from 'react-spinners';
import AddMember2 from './AddMember2.jsx';
import { Bounce, toast } from 'react-toastify';

export default function AddTask({ edit, currentTask, taskId, projectId, currentTeam }) {
    const [loading, setLoading] = useState(false)
    const { projects, teamMembers, tasks, setTasks, selectedTaskId, ShowAddTask, setShowAddTask } = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [stage, setStage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editedTask, setEditedTask] = useState(currentTask);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskId = crypto.randomUUID();
        const newTask = {
            title,
            selectedTeam,
            description,
            projectId: projectId,
            priority,
            startDate,
            stage,
            endDate,
            id: taskId
        }
        if (selectedTeam.length > 0) {
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
                setShowAddTask(false);
                setLoading(false)
            } catch (error) {
                toast.warn('Error adding Task:', error, {
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
            projectId: projectId,
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
                projectId,
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
        setLoading(false);
        setShowAddTask(false);
    }


    const todayDate = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (currentTask && Object.keys(currentTask).length !== 0) {
            setEditedTask(currentTask);
            setTitle(currentTask.title || "");
            setDescription(currentTask.description || "");
            setSelectedTeam(currentTask.selectedTeam || []);
            setPriority(currentTask.priority || "");
            setStage(currentTask.stage || "");
            setStartDate(currentTask.startDate || "");
            setEndDate(currentTask.endDate || "");
        }
    }, [currentTask, ShowAddTask]);


    return (
        <div className='addTask' style={{ display: ShowAddTask ? 'flex' : 'none' }}>
            <form onSubmit={currentTask ? handleEdit : handleSubmit}>
                <div className="addTaskContainer">
                    <h3>{edit ? 'Edit Task' : 'Add Task'} </h3>
                    <div className="addTitle">
                        <p>{edit ? 'Edit' : 'Add'} Task</p>
                        <input
                            required
                            type="text"
                            placeholder='Add Task Title'
                            value={title}
                            onChange={(e) => { setTitle(e.target.value) }} />
                    </div>
                    <div className="addTitle">
                        <p>Add description</p>
                        <input
                            required
                            type="text"
                            placeholder='Add Task description'
                            value={description}
                            onChange={(e) => { setDescription(e.target.value) }} />
                    </div>

                    <div className="addTaskMember" style={{ display: edit ? 'none' : 'inline-block' }}>
                        <p>Assign Task To: </p>
                        <AddMember2
                            setSelectedTeam={setSelectedTeam}
                            selectedTeam={selectedTeam}
                            currentTeam={currentTeam} />
                    </div>
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
                    <div className="addTaskDate">
                        <div>
                            <p>Task Date</p>
                            <input
                                required
                                type="date"
                                value={startDate}
                                min={todayDate}
                                onChange={(e) => { setStartDate(e.target.value) }} />
                        </div>
                        <div>
                            <p>End Date</p>
                            <input
                                required
                                type="date"
                                value={endDate}
                                min={todayDate}
                                onChange={(e) => { setEndDate(e.target.value) }} />
                        </div>
                    </div>
                    <div className="addTaskBtn">
                        <button onClick={handleCancel}>Cancel</button>
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
