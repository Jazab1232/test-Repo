import React, { useContext, useState } from 'react'
import '../styles/addMember2.css'
import { AppContext } from './context/AppContext';

export default function AddMember2({ setSelectedTeam, selectedTeam, currentTeam }) {
    const { projects, setProjects, teamMembers, tasks, setTasks } = useContext(AppContext);
    const [selectedMembers, setSelectedMembers] = useState(selectedTeam);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleCheckboxChange = (memberId) => {
        // Compute the updated members
        const updatedMembers = selectedMembers.includes(memberId)
            ? selectedMembers.filter((id) => id !== memberId)
            : [...selectedMembers, memberId];

        // Update both states with the same value
        setSelectedMembers(updatedMembers);
        setSelectedTeam(updatedMembers);
    };

    const membersList = currentTeam !== undefined ? currentTeam : teamMembers;

    return (
        <div className='AddMember2' >
            <button type='button' onClick={toggleDropdown} className="dropdown-toggle">
                Select Team Members {isDropdownOpen ? <i class="fa-solid fa-chevron-up"></i> : <i class="fa-solid fa-chevron-down"></i>}
            </button>
            {isDropdownOpen && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    {membersList.map((member) => (
                        <label key={member.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.id)}
                                onChange={() => handleCheckboxChange(member.id)}
                            />
                            {member.fullName}
                        </label>
                    ))}
                </div>
            )}
            {/* <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>

                <button className='addBtn' onClick={() => { setShowAddTeam(!showAddTeam) }}  >Cancel</button>
                <button className='addBtn' onClick={handleTeamEdit} >Add</button>

            </div> */}
        </div>
    )
}
