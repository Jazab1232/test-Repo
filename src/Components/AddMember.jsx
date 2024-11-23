import React, { useContext, useState } from 'react'
import '../styles/addMember.css'
import { AppContext } from './context/AppContext';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './config/config';
import { Bounce, toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

export default function AddMember({ showAddTeam, setShowAddTeam, currentTeam, currentProject, projectId, currentProjectTask }) {
    const { projects, setProjects, teamMembers, tasks, setTasks } = useContext(AppContext);
    const [selectedMembers, setSelectedMembers] = useState(currentProject.selectedTeam);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleCheckboxChange = (memberId) => {
        if (currentProject.selectedTeam.includes(memberId)) {
            const isMemberInTasks = currentProjectTask.find(
                (task) => task.selectedTeam.includes(memberId)
            );
            if (isMemberInTasks) {
                toast.error('Cannot remove member. They are assigned to one or more tasks.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Bounce,
                });
                return;
            }
        }
        setSelectedMembers((prevState) =>
            prevState.includes(memberId)
                ? prevState.filter((id) => id !== memberId)
                : [...prevState, memberId]
        );
    };

    const handleTeamEdit = async () => {
        setLoading(true)
        const projectData = doc(firestore, "projects", projectId);

        try {
            await updateDoc(projectData, { selectedTeam: selectedMembers });
            setProjects((prev) => {
                const remainingProject = prev.filter((project) => {
                    return project.id != projectId
                })
                return [...remainingProject, { ...currentProject, selectedTeam: selectedMembers }]
            })
            toast.success('Team  updated successfully', {
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
            setShowAddTeam(false)
        } catch (error) {
            toast.warn('Error updating team :', error, {
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
            setShowAddTeam(false)
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
                    {teamMembers.map((member) => (
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
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>

                <button className='addBtn' onClick={() => { setShowAddTeam(!showAddTeam) }}  >Cancel</button>
                <button className='addBtn' onClick={handleTeamEdit} >
                    {loading ? (
                        <ClipLoader color="#ffffff" loading={loading} size={20} />
                    ) : (
                        "Edit"
                    )}</button>

            </div>
        </div >
    )
}
