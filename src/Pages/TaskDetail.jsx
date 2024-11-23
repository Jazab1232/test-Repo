import React, { useContext, useMemo, useState } from 'react'
import '../styles/taskDetail.css'
import { useLocation } from 'react-router-dom';
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../Components/config/config';
import ClipLoader from "react-spinners/ClipLoader";
import { EditIcon } from '../Components/Icons.jsx';
import AddTask from '../Components/AddTask.jsx';
import AddTaskMember from '../Components/AddTaskMember.jsx';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../Components/context/AuthContext.jsx';

export default function TaskDetail() {
  const [loading, setLoading] = useState(false)
  const [showAddTeam, setShowAddTeam] = useState(false)
  const { tasks, setTasks, subtasks, projects, teamMembers, setSubtasks, ShowAddTask, setShowAddTask } = useContext(AppContext);
  const { currentUserUid } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('id');

  if (tasks.length == 0) {
    return <div className='taskDetail'>
      <p>No Task Found</p>
    </div>
  }
  let currentUserRole = teamMembers.find((member) => {
    return member.uid == currentUserUid
  })

  let currentTask = useMemo(() => {
    return tasks.find((task) => {
      return task.id == taskId
    })
  }, [tasks, taskId])


  const currentTeam = useMemo(() => {
    return currentTask.selectedTeam.map((id) => {
      const currentMember = teamMembers.find((member) => {
        return member.id == id;
      });
      return currentMember || null;
    });

  }, [currentTask, teamMembers]);

  const currentTeamId = currentTeam.map((member) => {
    return member.id
  })
  console.log('currentTaskTeam', currentTeamId);

  const currentproject = projects.find((project) => {
    return project.id == currentTask.projectId
  })

  const currentProjectTeam = currentproject.selectedTeam
  console.log('currentprojectTeam', currentProjectTeam);


  async function completeTask(newStage) {
    setLoading(true)
    try {
      const taskDoc = doc(firestore, 'tasks', taskId);
      await updateDoc(taskDoc, { stage: newStage });

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, stage: newStage };
          }
          return task;
        })
      );
      toast.success(`Task marked as ${newStage}`, {
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
      setLoading(false)
    } catch (error) {
      toast.warn('Error updating task stage', {
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
      setLoading(false)
    }
  }


  return (
    <div className='taskDetail'>
      <div className="taskDetailTop">
        <h2>Task Details</h2>
        <button className='editTaskBtn editBtn' onClick={() => { setShowAddTask(!ShowAddTask) }} style={{ display: currentUserRole.role != 'admin' ? 'none' : 'flex' }}><EditIcon /> Edit Task </button>
      </div>
      <div className="taskDetailContainer">
        <div >
          <div className="taskStatus">
            <div>
              <p style={{ textTransform: 'uppercase' }}>{currentTask.priority} PRIORITY</p>
              <p style={{ textTransform: 'capitalize' }}><span></span>{currentTask.stage}</p>
            </div>
            <p className='detailTaskTitle'>{currentTask.title}</p>
            <p><span>Created At: </span>{currentTask.startDate}</p>
          </div>
          <div className="taskTeam">
            <div className="taskTeamTop">
              <p>TASK TEAM  <span>{currentTeam.length}</span></p>
              <button className=' editBtn' onClick={() => { setShowAddTeam(!showAddTeam) }} style={{ display: currentUserRole.role != 'admin' ? 'none' : 'flex' }}><i className="fa-solid fa-plus"></i> Add Member</button>
            </div>
            <AddTaskMember
              currentProjectTeam={currentProjectTeam}
              showAddTeam={showAddTeam}
              setShowAddTeam={setShowAddTeam}
              currentTeam={currentTeamId}
              taskId={taskId}
              currentTask={currentTask}
            />
            {currentTeam.length != 0 ? (currentTeam.map((member, i) => {
              return <div key={i} className="teamMember">
                <p>{member.fullName}</p>
                <p>{member.role}</p>
              </div>
            }))
              : ''}
            <div className="completeTaskBtnContainer">
              <button className="completeTaskBtn" onClick={() => { completeTask('completed') }}>
                {loading ? (
                  <ClipLoader color="#ffffff" loading={loading} size={20} />
                ) : (
                  "Complete Task"
                )}

              </button>
            </div>
          </div>

        </div>
        <div className='taskDesc'>
          <h2>TASK DESCRIPTION</h2>
          <p>Switches are a pleasant interface for toggling a value between two states,
            and offer the same semantics and keyboard navigation as native checkbox
            elements</p>
        </div>
      </div>
      <AddTask edit={true} currentTask={currentTask} taskId={taskId} projectId={currentTask.projectId} />

    </div>

  )
}


