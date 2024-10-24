import React, { useContext } from 'react'
import '../styles/dashboard.css'
import SummaryCard from '../Components/SummaryCard'
import { AllTaskIcon, SunIcon, ClipboardCheckIcon, ProgressIcon, } from '../Components/Icons.jsx';
import ProjectCard from '../Components/ProjectCard.jsx';
import DashTaskCard from '../Components/DashTaskCard'
import { AppContext } from '../Components/context/AppContext.jsx';
import { AuthContext } from '../Components/context/AuthContext.jsx';

export default function Dashboard() {
  const { projects, teamMembers, tasks } = useContext(AppContext);
  const { currentUserUid } = useContext(AuthContext);

  const currenUserProjects = projects.filter((projects) => {
    return projects.selectedTeam.includes(currentUserUid)
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

  const currenUserProgressTask = currenUserTask.filter((task) => {
    return task.stage == 'inProgress'
  })
  const currenUserCompletedTask = currenUserTask.filter((task) => {
    return task.stage == 'completed'
  })
  const currenUserTodoTask = currenUserTask.filter((task) => {
    return task.stage == 'Todo'
  })

  const completedTask = tasks.filter((task) => {
    return task.stage == 'completed'
  })
  const progressTask = tasks.filter((task) => {
    return task.stage == 'inProgress'
  })
  const todoTask = tasks.filter((task) => {
    return task.stage == 'Todo'
  })

  return (
    <div className='dashboard' >

      <h2>DASHBOARD</h2>
      <div className="summaryBox">
        <SummaryCard
          title="TOTAL TASK"
          quantity={role == 'admin' ? tasks.length : currenUserTask.length}
          prevQuantity={20}
          Icon={AllTaskIcon}
          backgroundColor={'#2C4FD8'}
        />
        <SummaryCard
          title="COMPLTED TASK"
          quantity={role == 'admin' ? completedTask.length : currenUserCompletedTask.length}
          prevQuantity={7}
          Icon={ClipboardCheckIcon}
          backgroundColor={'#37766E'}
        />
        <SummaryCard
          title="IN PROGRESS"
          quantity={role == 'admin' ? progressTask.length : currenUserProgressTask.length}
          prevQuantity={8}
          Icon={ProgressIcon}
          backgroundColor={'#EE9D1E'}
        />
        <SummaryCard
          title="TODOS"
          quantity={role == 'admin' ? todoTask.length : currenUserTodoTask.length}
          prevQuantity={5}
          Icon={SunIcon}
          backgroundColor={'#BE245D'}
        />

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
                  />
                ))
              ) :
                <p>No Project Found</p>

            }

          </div>

        </div>




        <div className="taskCardContainer">
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


        </div>
      </div>
    </div>
  )
}
