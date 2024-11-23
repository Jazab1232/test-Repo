import React, { useContext } from 'react'
import '../styles/completed.css'
import TaskCard from '../Components/TaskCard'
import { AppContext } from '../Components/context/AppContext.jsx';
import { AuthContext } from '../Components/context/AuthContext';

export default function completed() {
  const { teamMembers, tasks } = useContext(AppContext);
  const { currentUserUid } = useContext(AuthContext);

  const currenUserTask = tasks.filter((task) => {
    return task.selectedTeam.includes(currentUserUid)
  })
  const currenUserTodoTask = currenUserTask.filter((task) => {
    return task.stage == 'Todo'
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
  const todoTask = tasks.filter((task) => {
    return task.stage == 'Todo'
  })

  
  return (
    <div className='completed'>
      <h2>To Do</h2>
    
      <div className="completedContainer">
        {
          role !== 'admin' ? (
            currenUserTodoTask.length > 0 ? (
              currenUserTodoTask.map((data) => (
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
            todoTask.length > 0 ? (
              todoTask.map((data) => (
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
