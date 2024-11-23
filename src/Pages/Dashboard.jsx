import React, { useContext } from 'react'
import '../styles/dashboard.css'
import SummaryCard from '../Components/SummaryCard'
import { AllTaskIcon, SunIcon, ClipboardCheckIcon, ProgressIcon, } from '../Components/Icons.jsx';
import ProjectCard from '../Components/ProjectCard.jsx';
import DashTaskCard from '../Components/DashTaskCard'
import { AppContext } from '../Components/context/AppContext.jsx';
import { AuthContext } from '../Components/context/AuthContext.jsx';
import { ClipLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';

export default function Dashboard() {
  const { projects, teamMembers, tasks, loading } = useContext(AppContext);
  const { currentUserUid } = useContext(AuthContext);



  const completedProjects = projects.filter((project) => {
    console.log('project', project);

    return project.IsComplete == 'completed'
  })
  const ongoingProjects = projects.filter((project) => {
    return project.IsComplete == 'ongoing'
  })

  const currenUserProjects = projects.filter((projects) => {
    return projects.selectedTeam.includes(currentUserUid)
  })
  const userCompletedProjects = completedProjects.filter((project) => {
    return project.selectedTeam.includes(currentUserUid)
  })
  const userOngoingProjects = projects.filter((project) => {
    return project.selectedTeam.includes(currentUserUid)
  })




  const currenUserTask = tasks.filter((task) => {
    return task.selectedTeam.includes(currentUserUid)
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
    <div className='dashboard' >
      {!loading && (
        <>
          <h2>DASHBOARD</h2>
          <div className="summaryBox">
            <SummaryCard
              title="TOTAL PROJECTS"
              quantity={role == 'admin' ? projects.length : currenUserProjects.length}
              prevQuantity={20}
              Icon={AllTaskIcon}
              backgroundColor={'#2C4FD8'}
            />
            <SummaryCard
              title="COMPLTED "
              quantity={role == 'admin' ? completedProjects.length : userCompletedProjects.length}
              prevQuantity={7}
              Icon={ClipboardCheckIcon}
              backgroundColor={'#37766E'}
            />
            <SummaryCard
              title="IN PROGRESS"
              quantity={role == 'admin' ? ongoingProjects.length : userOngoingProjects.length}
              prevQuantity={8}
              Icon={ProgressIcon}
              backgroundColor={'#EE9D1E'}
            />
            {/* <SummaryCard
              title="TODOS"
              quantity={role == 'admin' ? todoTask.length : currenUserTodoTask.length}
              prevQuantity={5}
              Icon={SunIcon}
              backgroundColor={'#BE245D'}
            /> */}

          </div>
          <div className="dashboardContainer">



            <div className="projectCardContainer">
              <h3>ALL PROJECTS</h3>
              <div className="dashProjectBox">
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

            </div>


            {/* <div className="taskCardContainer">
              <h3>ALL TASKS</h3>
              <div className="dashTaskBox">
                {
                  (role === 'admin' ? tasks : currenUserTask).length > 0 ? (
                    (role === 'admin' ? tasks : currenUserTask).map((data) => (
                      <DashTaskCard
                        key={data.id}
                        title={data.title}
                        id={data.id}
                        startDate={data.startDate}
                        team={data.selectedTeam?.length}
                        priority={data.priority}
                      />
                    ))
                  )
                    :
                    <p>No Task Found</p>

                }
              </div>


            </div> */}
          </div>
        </>
      )}
      {loading && (
        <div className="pageLoaderOverlay">
          <ClipLoader color="#ffffff" loading={loading} size={100} />
        </div>
      )
      }
    </div>
  )
}
