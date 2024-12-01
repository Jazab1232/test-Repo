import React, { useContext, useEffect, useMemo, useState } from "react";
import "../styles/addProjectPage.css";
import { AppContext } from "../Components/context/AppContext.jsx";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../Components/config/config.js";
import { ClipLoader } from "react-spinners";
import AddMember2 from "../Components/AddMember2";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddProjectPage({ }) {
    const [loading, setLoading] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [IsComplete, setIsComplete] = useState("");
    // const [images, setImages] = useState(null);
    const { teamMembers, setTeamMembers, projects, setProjects } = useContext(AppContext);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');
    const edit = queryParams.get('edit');
    const navigate = useNavigate()
    const currentProject = useMemo(() => {
        return projects.find((project) => project.id === projectId);
    }, [projectId, projects]);

    console.log('currentProject', currentProject);

    useEffect(() => {
        if (currentProject && Object.keys(currentProject).length !== 0) {
            setProjectName(currentProject.projectName || "");
            setDescription(currentProject.description || "");
            setCompanyName(currentProject.companyName || "");
            setSelectedTeam(currentProject.selectedTeam || []);
            setIsComplete(currentProject.IsComplete || "");
            setPriority(currentProject.priority || "");
            setStartDate(currentProject.startDate || "");
            setEndDate(currentProject.endDate || "");
        }
    }, [currentProject]);

    const todayDate = new Date().toISOString().split("T")[0];

    const handleNotification = async (team, projectId, message, projectName) => {
        const randomId = crypto.randomUUID();
        const notification = {
            projectId,
            message,
            projectName,
            team,
            time: serverTimestamp(),
        };
        await setDoc(doc(firestore, "userNotification", randomId), notification);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectId = crypto.randomUUID();

        if (selectedTeam.length !== 0 && description.length > 0) {
            try {
                setLoading(true);
                const newProject = {
                    projectName,
                    selectedTeam,
                    companyName,
                    description,
                    priority,
                    startDate,
                    endDate,
                    IsComplete,
                    id: projectId,
                };
                await setDoc(doc(firestore, "projects", projectId), newProject);
                setProjects((prev) => [...prev, newProject]);
                handleNotification(selectedTeam, projectId, "You have been assigned a new project", projectName);
                toast.success("Project added successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    theme: "colored",
                    transition: Bounce,
                });
                resetForm();
                navigate(-1)
            } catch (error) {
                toast.error("Error adding project.", {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                });
            } finally {
                setLoading(false);
            }
        } else {
            toast.warn("Fill out all form fields", {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const updatedProject = {
            projectName,
            selectedTeam,
            companyName,
            description,
            priority,
            startDate,
            endDate,
            IsComplete,
            id: projectId,
        };
        const projectDoc = doc(firestore, "projects", projectId);
        try {
            setLoading(true);
            await updateDoc(projectDoc, updatedProject);
            setProjects((prev) => {
                const filteredProjects = prev.filter((project) => project.id !== projectId);
                return [...filteredProjects, updatedProject];
            });
            toast.success("Project updated successfully!", {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
            resetForm();
            navigate(-1)
        } catch (error) {
            toast.error("Error updating project.", {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setProjectName("");
        setCompanyName("");
        setSelectedTeam([]);
        setPriority("");
        setStartDate("");
        setIsComplete('')
        setEndDate("");
        setDescription("");
    };
    return (

        <div className="addProjectPage">
            <form onSubmit={projectId ? handleEdit : handleSubmit}>
                <div className="addProjectContainer">
                    <h3>{projectId ? "Edit Project" : "Add Project"}</h3>
                    <div className="addTitle">
                        <p>Project Name:</p>
                        <input
                            required
                            type="text"
                            placeholder="Add Project Title"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    {/* <div className="addTitle">
                        <p>Select Images:</p>
                        <input
                            required
                            multiple
                            type="file"
                            accept="image/*"
                            placeholder="Add Project Title"
                            value={projectName}
                            onChange={handleFileSelection}
                        />
                    </div> */}
                    <div className="addTitle">
                        <p>Description:</p>
                        <Editor
                            value={description}
                            apiKey="n0a6gafqn6nr414ct18m5584ixlp0vbhspqav37g0ma3w0fu"
                            init={{
                                plugins: [
                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                            }}
                            onEditorChange={(newContent) => setDescription(newContent)}
                        />

                    </div>
                    {!projectId && (
                        <div className="addProjectMember">
                            <p>Assign Project To:</p>
                            <AddMember2
                                setSelectedTeam={setSelectedTeam}
                                selectedTeam={selectedTeam}
                            />
                        </div>
                    )}
                    <div className="addTitle">
                        <p>Company Name:</p>
                        <input
                            required
                            type="text"
                            placeholder="Add Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div className="addProjectSelect">
                        <div className="addProjectPriority">
                            <p>Project Priority:</p>
                            <select
                                required
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value='' >Select Priority</option>
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
                                {edit && (<option value="completed">Completed</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="addProjectDate">
                        <div>
                            <p>Start Date:</p>
                            <input
                                required
                                type="date"
                                value={startDate}
                                min={todayDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <p>End Date:</p>
                            <input
                                required
                                type="date"
                                value={endDate}
                                min={startDate || todayDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="addProjectBtn" style={{ background: 'white' }}>
                        <button type="button" onClick={resetForm}>
                            Reset
                        </button>
                        <button type="submit">
                            {loading ? <ClipLoader color="#fff" size={20} /> : "Submit"}
                        </button>
                    </div>
                </div>
            </form>
        </div>

    );
}
