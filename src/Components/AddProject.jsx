import React, { useContext, useEffect, useState } from 'react';
import '../styles/addProject.css';
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './config/config';
import { ClipLoader } from 'react-spinners';
import AddMember2 from './AddMember2.jsx';

export default function AddProject({ ShowAddProject, setShowAddProject, currentProject, projectId, currentTeam, edit }) {
    const [loading, setLoading] = useState(false)
    const [projectName, setProjectName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [priority, setPriority] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editedProject, setEditedProject] = useState(currentProject);

    const { teamMembers, setTeamMembers, projects, setProjects } = useContext(AppContext);

    console.log(selectedTeam);

    useEffect(() => {
        if (currentProject && Object.keys(currentProject).length !== 0) {
            setEditedProject(currentProject);
            setProjectName(currentProject.projectName || "");
            setCompanyName(currentProject.companyName || "");
            setSelectedTeam(currentProject.selectedTeam || []);
            setPriority(currentProject.priority || "");
            setStartDate(currentProject.startDate || "");
            setEndDate(currentProject.endDate || "");
        }
    }, [currentProject]);
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
            setLoading(true)
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
            setLoading(false)
            setShowAddProject(false)
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Error adding Project');
        }
    };
    console.log(projects);


    const handleEdit = async (e) => {
        e.preventDefault();
        const newProject = {
            projectName,
            selectedTeam,
            companyName,
            priority,
            startDate,
            endDate,
            id: projectId
        }
        const projectData = doc(firestore, "projects", projectId);
        try {
            setLoading(true)
            await updateDoc(projectData, {
                projectName,
                selectedTeam,
                companyName,
                priority,
                startDate,
                endDate,
                id: projectId
            });
            setProjects((prev) => {
                const updatedProject = prev.filter((project) => {
                    return project.id != projectId
                })
                return [...updatedProject, newProject]
            })
            console.log('projects', projects);

            alert('Project updated successfully!');
            setProjectName('')
            setCompanyName('')
            setSelectedTeam([])
            setPriority('')
            setStartDate('')
            setEndDate('')
            setLoading(false)
            setShowAddProject(false)
        } catch (error) {
            console.error('Error updating project:', error);
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    // useEffect(() => {
    //     document.body.style.overflow = "hidden";
    //     return () => {
    //         document.body.style.overflow = "auto";
    //     };
    // }, []);

    return (
        <div className='addProject' style={{ display: ShowAddProject ? 'flex' : 'none' }}>
            <form onSubmit={currentProject ? handleEdit : handleSubmit}>
                <div className="addProjectContainer">
                    <h3>Add Project</h3>
                    <div className="addTitle">
                        <p>Project Name</p>
                        <input
                            required
                            type="text"
                            placeholder='Add Project Title'
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    <div className="addTitle">
                        <p>Company Name</p>
                        <input
                            required
                            type="text"
                            placeholder='Add Company Name'
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className="addProjectMember" style={{ display: edit ? 'none' : 'inline-block' }}>
                        <p>Assign Project To:</p>
                        <AddMember2
                            setSelectedTeam={setSelectedTeam}
                            currentTeam={currentTeam}
                            selectedTeam={selectedTeam} />

                    </div>

                    <div className="addProjectPriority">
                        <p>Project Priority:</p>
                        <select
                            required
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

                    <div className="addProjectBtn">
                        <button onClick={handleCancel}>Cancel</button>
                        <button type='submit' > {loading ? (
                            <ClipLoader color="#ffffff" loading={loading} size={20} />
                        ) : (
                            "Submit"
                        )}</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
