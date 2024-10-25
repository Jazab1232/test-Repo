import React, { useContext, useEffect, useState } from 'react'
import '../styles/addTask.css'
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from './config/config';
import { ClipLoader } from 'react-spinners';

export default function AddTask({ ShowAddTask, setShowAddTask }) {
    const [loading, setLoading] = useState(false)
    const { projects, teamMembers, tasks, setTasks, selectedTaskId } = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [priority, setPriority] = useState('');
    const [project, setProject] = useState('');
    const [stage, setStage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskId = crypto.randomUUID();
        const newTask = {
            title,
            selectedTeam,
            projectId: project,
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
            alert('Task added successfully!');
            setTitle('');
            setEndDate('');
            setProject('');
            setSelectedTeam([]);
            setPriority('');
            setStage('');
            setStartDate('');
            setShowAddTask(false);
            setLoading(false)
        } catch (error) {
            console.error('Error adding Task:', error);
            alert('Error adding Task');
        }
    };

    function handleCancel() {
        setTitle('');
        setEndDate('');
        setProject('');
        setSelectedTeam([]);
        setPriority('');
        setStage('');
        setStartDate('');
        setShowAddTask(false);
    }

    function handleTeam(e) {
        const selectedValues = [...e.target.selectedOptions].map(option => option.value);

        setSelectedTeam((prev) => {
            const updatedOptions = [...prev];
            selectedValues.forEach(value => {
                if (updatedOptions.includes(value)) {
                    const index = updatedOptions.indexOf(value);
                    updatedOptions.splice(index, 1);
                } else {
                    updatedOptions.push(value);
                }
            });
            return updatedOptions;
        });
    }


    return (
        <div className='addTask' style={{ display: ShowAddTask ? 'flex' : 'none' }}>
            <form onSubmit={handleSubmit}>
                <div className="addTaskContainer">
                    <h3>Add Task</h3>
                    <div className="addTitle">
                        <p>Add Task</p>
                        <input
                            required
                            type="text"
                            placeholder='Add Task Title'
                            value={title}
                            onChange={(e) => { setTitle(e.target.value) }} />
                    </div>
                    <div className="addTaskProject">
                        <p>Select Project</p>
                        <select
                            required
                            value={project}
                            onChange={(e) => { setProject(e.target.value) }} >
                            <option value="">Select Project</option>
                            {projects.map((project, index) => (
                                <option key={project.id} value={project.id}>{project.projectName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="addTaskMember">
                        <p>Assign Task To: </p>
                        {/* <span> {selectedTeam.join(', ')}</span> */}

                        <select
                            // multiple
                            required
                            value={selectedTeam}
                            onChange={handleTeam} >
                            <option value="">Select Team</option>
                            {teamMembers.map((member, index) => (
                                <option key={index} value={member.id}>{member.fullName}</option>
                            ))}
                        </select>

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
