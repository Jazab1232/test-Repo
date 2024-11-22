import React, { useContext, useState } from 'react'
import '../styles/project.css'
import ProjectCard from '../Components/ProjectCard.jsx';
import AddProject from '../Components/AddProject.jsx';
import { AppContext } from '../Components/context/AppContext.jsx';
import { AuthContext } from '../Components/context/AuthContext.jsx';

export default function Projects() {
    const [ShowAddProject, setShowAddProject] = useState(false)
    const { projects, teamMembers } = useContext(AppContext);
    const { currentUserUid, setCurrentUserUid } = useContext(AuthContext);
    const currenUserProjects = projects.filter((projects) => {
        return projects.selectedTeam.includes(currentUserUid)
    })


    let role;
    let currentUserRole = teamMembers.find((member) => {
        return member.uid == currentUserUid
    })

    if (currentUserRole && currentUserRole.role) {
        role = currentUserRole.role
    } else {
        console.log('Role is undefined or object not loaded');
    }

    return (
        <div className='projects'>
            <div className='addtaskBtn'>
                <h2> Projects </h2>
                <p style={{ display: role == 'admin' ? 'flex' : 'none' }} onClick={() => { setShowAddProject(true) }} ><i className="fa-solid fa-plus"></i> Add Project</p>
            </div>
            {/* <div className="taskHeader">
                <p><span style={{ backgroundColor: '#3663EB' }}></span>Projects</p>
                <i className="fa-solid fa-plus"></i>
            </div> */}
            <div className="projectsContainer">
                {
                    (role === 'admin' ? projects : currenUserProjects).length > 0 ? (
                        (role === 'admin' ? projects : currenUserProjects).map((data) => (
                            <ProjectCard
                                key={data.id}
                                id={data.id}
                                projectName={data.projectName}
                                companyName={data.companyName}
                                priority={data.priority}
                                dueDate={data.endDate}
                                width={'32%'}
                            />
                        ))
                    ) :
                        <p>No Project Found</p>

                }

            </div>
            <AddProject ShowAddProject={ShowAddProject} setShowAddProject={setShowAddProject} />
        </div>
    )
}
