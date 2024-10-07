import React, { useContext } from 'react'
import '../styles/completed.css'
import TaskCard from '../Components/TaskCard'
import { AppContext } from '../Components/config/AppContext';
import { AuthContext } from '../Components/context/AuthContext';

export default function completed() {

  const { projects, teamMembers, tasks, setTasks } = useContext(AppContext);
  const { currentUserUid } = useContext(AuthContext);

  const currenUserTask = tasks.filter((task) => {
    return task.selectedTeam.includes(currentUserUid)
  })
  const currenUserProgressTask = currenUserTask.filter((task) => {
    return task.stage == 'inProgress'
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
  const progressTask = tasks.filter((task) => {
    return task.stage == 'inProgress'
  })

  return (
    <div className='completed'>
      <h2>In Progress</h2>
      <div className="taskHeader">
        <p><span style={{ backgroundColor: '#EE9D1E' }}></span>In Progress</p>
        <i class="fa-solid fa-plus"></i>
      </div>
      <div className="completedContainer">
        {
          role !== 'admin' ? (
            currenUserProgressTask.length > 0 ? (
              currenUserProgressTask.map((data) => (
                <TaskCard
                  key={data.id}
                  title={data.title}
                  id={data.id}
                  startDate={data.startDate}
                  team={data.selectedTeam?.length}
                  priority={data.priority}
                />
              ))
            ) : (
              <p>No Task Found</p>
            )
          ) : (
            progressTask.length > 0 ? (
              progressTask.map((data) => (
                <TaskCard
                  key={data.id}
                  title={data.title}
                  id={data.id}
                  startDate={data.startDate}
                  team={data.selectedTeam?.length}
                  priority={data.priority}
                />
              ))
            ) : (
              <p>No Task Found</p>
            )
          )
        }
      </div>
    </div>
  )
}
