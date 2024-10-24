import React, { useContext } from 'react'
import '../styles/completed.css'
import TaskCard from '../Components/TaskCard'
import { AppContext } from '../Components/context/AppContext.jsx';
import { AuthContext } from '../Components/context/AuthContext';

export default function completed() {
  const { tasks,teamMembers } = useContext(AppContext);
  const { currentUserUid } = useContext(AuthContext);

  const currenUserTask = tasks.filter((task) => {
    return task.selectedTeam.includes(currentUserUid)
  })
  const currenUserCompletedTask = currenUserTask.filter((task) => {
    return task.stage == 'completed'
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

  const completedTask = tasks.filter((task) => {
    return task.stage == 'completed'
  })
  
  return (
    <div className='completed'>
      <h2>Completed</h2>
      {/* <div className="taskHeader">
        <p><span style={{ backgroundColor: '#37766E' }}></span>Completed</p>
        <i class="fa-solid fa-plus"></i>
      </div> */}
      <div className="completedContainer">
        {
          role !== 'admin' ? (
            currenUserCompletedTask.length > 0 ? (
              currenUserCompletedTask.map((data) => (
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
            completedTask.length > 0 ? (
              completedTask.map((data) => (
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
