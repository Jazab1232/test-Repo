import React, { useContext, useState } from 'react'
import '../styles/addMember.css'
import { AppContext } from './context/AppContext';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './config/config';

export default function AddMember({ showAddTeam, taskId, setShowAddTeam, currentTeam, currentTask,currentProjectTeam, projectId }) {
    const { projects, setProjects, teamMembers, tasks, setTasks } = useContext(AppContext);
    const [selectedTaskMembers, setSelectedTaskMembers] = useState(currentTeam);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    console.log('currentTeam', currentTeam);

    const TeamForTask = teamMembers.filter((member) =>
        currentProjectTeam.includes(member.id)
    );
    // console.log('TeamForTask', TeamForTask);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleCheckboxChange = (memberId) => {
        setSelectedTaskMembers((prevState) =>
            prevState.includes(memberId)
                ? prevState.filter((id) => id !== memberId)
                : [...prevState, memberId]
        );
    };

    const handleTeamEdit = async () => {
        const TaskData = doc(firestore, "tasks", taskId);

        try {
            await updateDoc(TaskData, { selectedTeam: selectedTaskMembers });
            setTasks((prev) => {
                const remainingtask = prev.filter((task) => {
                    return task.id != taskId
                })
                return [...remainingtask, { ...currentTask, selectedTeam: selectedTaskMembers }]
            })
            alert('Team member edited successfully');
            setShowAddTeam(false)
        } catch (error) {
            console.error('Error editing team members:', error);
            alert('Failed to edit team member');
        }
    };



    return (
        <div className='addMember' style={{ display: showAddTeam ? "block" : 'none' }}>
            <h3 style={{ marginBottom: '10px' }}>Add a member</h3>
            <button type='button' onClick={toggleDropdown} className="dropdown-toggle" id='dropdownToggle'>
                Select Team Members {isDropdownOpen ? <i class="fa-solid fa-chevron-up"></i> : <i class="fa-solid fa-chevron-down"></i>}
            </button>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    {TeamForTask.map((member) => (
                        <label key={member.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedTaskMembers.includes(member.id)}
                                onChange={() => handleCheckboxChange(member.id)}
                            />
                            {member.fullName}
                        </label>
                    ))}
                </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>

                <button className='addBtn' onClick={() => { setShowAddTeam(!showAddTeam) }}  >Cancel</button>
                <button className='addBtn' onClick={handleTeamEdit} >Edit</button>

            </div>
        </div>
    )
}
