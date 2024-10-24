import React, { useContext, useState } from 'react';
import '../styles/addProject.css';
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from './config/config';

export default function AddProject({ ShowAddProject, setShowAddProject }) {

    const [projectName, setProjectName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [priority, setPriority] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { teamMembers, setTeamMembers, projects, setProjects } = useContext(AppContext);

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectId = crypto.randomUUID();
        try {
            const newProject = {
                projectName,
                selectedTeam,
                companyName,
                priority,
                startDate,
                endDate,
                id: projectId
            }
            await setDoc(doc(firestore, 'projects', projectId), newProject);
            setProjects((prev) => {
                return [...prev, newProject]
            })
            alert('Project added successfully!');
            setProjectName('')
            setCompanyName('')
            setSelectedTeam([])
            setPriority('')
            setStartDate('')
            setEndDate('')
            setShowAddProject(false)
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Error adding Project');
        }
    };

    function handleCancel() {
        setProjectName('')
        setCompanyName('')
        setSelectedTeam([])
        setPriority('')
        setStartDate('')
        setEndDate('')
        setShowAddProject(false)
    }

    return (
        <div className='addProject' style={{ display: ShowAddProject ? 'flex' : 'none' }}>
            <div className="addProjectContainer">
                <h3>Add Project</h3>
                <div className="addTitle">
                    <p>Project Name</p>
                    <input
                        type="text"
                        placeholder='Add Project Title'
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                </div>
                <div className="addTitle">
                    <p>Company Name</p>
                    <input
                        type="text"
                        placeholder='Add Company Name'
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="addProjectMember">
                    <p>Assign Project To:</p>
                    {/* <span>{selectedTeam.join(', ')}</span> */}
                    <select

                        value={selectedTeam}
                        onChange={handleTeam}
                    >
                        <option value="">Select Team</option>
                        {teamMembers.map((member, index) => (
                            <option key={index} value={member.id}>{member.fullName}</option>
                        ))}
                    </select>
                </div>

                <div className="addProjectPriority">
                    <p>Project Priority:</p>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="">Select Priority</option>
                        <option value="very high">Very High</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div className="addProjectDate">
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

                <div className="addProjectBtn">
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}
