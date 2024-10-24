import React, { useContext, useState } from 'react';
import '../styles/addSubTask.css'
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from './config/config';

export default function AddSubTask({ taskId }) {
console.log(taskId);


    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stage, setStage] = useState('');
    const { subtasks, setSubtasks, setShowAddSubtask, showAddSubtask } = useContext(AppContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const subtaskId = crypto.randomUUID(); // Generate unique subtask ID
        try {
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
                return [...prev, newSubtask]; // Spread previous subtasks and add the new one
            });

            // Notify user of success
            alert('Subtask added successfully!');

            // Clear input fields after submission
            setSubtaskTitle('');
            setStartDate('');
            setEndDate('');

            // Close the subtask form
            setShowAddSubtask(false);
        } catch (error) {
            console.error('Error adding Subtask:', error);
            alert('Error adding subtask');
        }
    };

    return (
        <div className='addSubtask' style={{ display: showAddSubtask ? 'flex' : 'none' }}>
            <div className="addSubtaskContainer">
                <h3>Add Subtask</h3>
                <div className="addSubtaskTitle">
                    <p>Subtask Title</p>
                    <input
                        type="text"
                        placeholder='Add Subtask Title'
                        value={subtaskTitle}
                        onChange={(e) => setSubtaskTitle(e.target.value)}
                    />
                </div>
                <div className="addTaskStage">
                    <p>Subtask Stage:</p>
                    <select value={stage} onChange={(e) => { setStage(e.target.value) }}>
                        <option value="">Select Subtask Stage</option>
                        <option value="Todo">Todo</option>
                        <option value="inProgress">In Progress</option>
                    </select>
                </div>
                <div className="addSubtaskDate">
                    <div>
                        <p>Start Date</p>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <p>End Date</p>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="addSubtaskBtn">
                    <button onClick={() => setShowAddSubtask(false)}>Cancel</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}
