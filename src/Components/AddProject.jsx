import React, { useContext, useEffect, useState } from 'react';
import '../styles/addProject.css';
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './config/config';
import { ClipLoader } from 'react-spinners';
import AddMember2 from './AddMember2.jsx';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProject({ ShowAddProject, setShowAddProject, currentProject, projectId, currentTeam, edit }) {
    const [loading, setLoading] = useState(false)
    const [projectName, setProjectName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [IsComplete, setIsComplete] = useState('');
    const [editedProject, setEditedProject] = useState(currentProject);
    const { teamMembers, setTeamMembers, projects, setProjects } = useContext(AppContext);


    useEffect(() => {
        if (currentProject && Object.keys(currentProject).length !== 0) {
            setEditedProject(currentProject);
            setProjectName(currentProject.projectName || "");
            setDescription(currentProject.description || "");
            setCompanyName(currentProject.companyName || "");
            setSelectedTeam(currentProject.selectedTeam || []);
            setIsComplete(currentProject.IsComplete || "");
            setPriority(currentProject.priority || "");
            setStartDate(currentProject.startDate || "");
            setEndDate(currentProject.endDate || "");
        }
    }, [currentProject, ShowAddProject]);

    const handleNotification = (async (team, projectId, message, projectName) => {
        const randomId = crypto.randomUUID()
        const notification = {
            projectId,
            message,
            projectName,
            team,
            time: serverTimestamp(),
        }
        await setDoc(doc(firestore, 'userNotification', randomId), {
            projectId,
            message,
            projectName,
            team,
            time: serverTimestamp(),
        });
        console.log('Member notify successfully');
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectId = crypto.randomUUID();

        if (selectedTeam.length != 0) {
            try {
                setLoading(true)
                const newProject = {
                    projectName,
                    selectedTeam,
                    companyName,
                    description,
                    priority,
                    startDate,
                    endDate,
                    id: projectId
                }
                await setDoc(doc(firestore, 'projects', projectId), newProject);
                setProjects((prev) => {
                    return [...prev, newProject]
                })
                handleNotification(selectedTeam, projectId, `You have assigned  a new Project`, projectName)
                toast.success('Project added successfully!', {
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
                setProjectName('')
                setCompanyName('')
                setSelectedTeam([])
                setPriority('')
                setStartDate('')
                setStartDate('')
                setDescription('')
                setEndDate('')
                setLoading(false)
                setShowAddProject(false)
            } catch (error) {
                toast.warn('Error adding project', {
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
        const newProject = {
            projectName,
            selectedTeam,
            companyName,
            description,
            priority,
            startDate,
            endDate,
            IsComplete,
            id: projectId
        }
        const projectData = doc(firestore, "projects", projectId);
        try {
            setLoading(true)
            await updateDoc(projectData, {
                projectName,
                selectedTeam,
                companyName,
                description,
                priority,
                startDate,
                endDate,
                IsComplete,
                id: projectId
            });
            setProjects((prev) => {
                const updatedProject = prev.filter((project) => {
                    return project.id != projectId
                })
                return [...updatedProject, newProject]
            })
            toast.success('Project updated successfully!', {
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
            setProjectName('')
            setCompanyName('')
            setSelectedTeam([])
            setPriority('')
            setStartDate('')
            setDescription('')
            setEndDate('')
            setLoading(false)
            setShowAddProject(false)
        } catch (error) {
            toast.warn('Error updating project:', error, {
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


    function handleCancel() {
        setProjectName('')
        setCompanyName('')
        setSelectedTeam([])
        setPriority('')
        setStartDate('')
        setEndDate('')
        setDescription('')
        setLoading(false)
        setShowAddProject(false)
    }

    useEffect(() => {
        if (ShowAddProject) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [ShowAddProject]);

    const todayDate = new Date().toISOString().split("T")[0];
    

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
                        <p>Add description</p>
                        <input
                            required
                            type="text"
                            placeholder='Add project description'
                            value={description}
                            onChange={(e) => { setDescription(e.target.value) }} />
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
                    <div className="addProjectPriority">
                        <p>Project Stage:</p>
                        <select
                            id="projectStage"
                            name="projectStage"
                            required
                            value={IsComplete}
                            onChange={(e) => setIsComplete(e.target.value)}
                        >
                            <option value="">Select Stage</option>
                            <option value="ongoing">On going</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="addProjectDate">
                        <div>
                            <p>Start Date</p>
                            <input
                                required
                                type="date"
                                value={startDate}
                                min={todayDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <p>End Date</p>
                            <input
                                required
                                type="date"
                                value={endDate}
                                min={todayDate}
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
