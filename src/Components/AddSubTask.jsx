import React, { useContext, useState } from 'react';
import '../styles/addSubTask.css'
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from './config/config';
import { ClipLoader } from 'react-spinners';

export default function AddSubTask({ taskId }) {
    const [loading, setLoading] = useState(false)
    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stage, setStage] = useState('');
    const { subtasks, setSubtasks, setShowAddSubtask, showAddSubtask } = useContext(AppContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const subtaskId = crypto.randomUUID(); // Generate unique subtask ID
        try {
            setLoading(true)
            const newSubtask = {
                subtaskTitle,
                startDate,
                endDate,
                taskId,
                stage,
                id: subtaskId
            };
            await setDoc(doc(firestore, 'subtasks', subtaskId), newSubtask);
            setSubtasks((prev) => {
                return [...prev, newSubtask];
            });
            alert('Subtask added successfully!');
            setLoading(false)
            setSubtaskTitle('');
            setStartDate('');
            setEndDate('');
            setShowAddSubtask(false);
        } catch (error) {
            console.error('Error adding Subtask:', error);
            alert('Error adding subtask');
        }
    };

    return (
        <div className='addSubtask' style={{ display: showAddSubtask ? 'flex' : 'none' }}>
            <form onSubmit={handleSubmit}>
                <div className="addSubtaskContainer">
                    <h3>Add Subtask</h3>
                    <div className="addSubtaskTitle">
                        <p>Subtask Title</p>
                        <input
                            required
                            type="text"
                            placeholder='Add Subtask Title'
                            value={subtaskTitle}
                            onChange={(e) => setSubtaskTitle(e.target.value)}
                        />
                    </div>
                    <div className="addTaskStage">
                        <p>Subtask Stage:</p>
                        <select
                            required
                            value={stage}
                            onChange={(e) => { setStage(e.target.value) }}>
                            <option value="">Select Subtask Stage</option>
                            <option value="Todo">Todo</option>
                            <option value="inProgress">In Progress</option>
                        </select>
                    </div>
                    <div className="addSubtaskDate">
                        <div>
                            <p>Start Date</p>
                            <input
                                required
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <p>End Date</p>
                            <input
                                required
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="addSubtaskBtn">
                        <button onClick={() => setShowAddSubtask(false)}>Cancel</button>
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
    );
}
