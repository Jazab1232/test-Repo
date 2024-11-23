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
    // const [project, setProject] = useState('');
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
            projectId: projectId,
            priority,
            startDate,
            stage,
            endDate,
            id: taskId
        }
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
    };
    const handleEdit = async (e) => {
        e.preventDefault();
        const newTask = {
            title,
            selectedTeam,
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
            setShowAddTask(false);
            setLoading(false);

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
        setShowAddTask(false);
    }


    useEffect(() => {
        if (currentTask && Object.keys(currentTask).length !== 0) {
            setEditedTask(currentTask);
            setTitle(currentTask.title || "");
            // setProject(currentTask.projectId || "");
            setSelectedTeam(currentTask.selectedTeam || []);
            setPriority(currentTask.priority || "");
            setStage(currentTask.stage || "");
            setStartDate(currentTask.startDate || "");
            setEndDate(currentTask.endDate || "");
        }
    }, [currentTask]);


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
                                onChange={(e) => { setStartDate(e.target.value) }} />
                        </div>
                        <div>
                            <p>End Date</p>
                            <input
                                required
                                type="date"
                                value={endDate}
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
