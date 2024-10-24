import React, { useContext } from 'react'
import '../styles/taskDetail.css'
import { useLocation } from 'react-router-dom';
import { AppContext } from '../Components/context/AppContext.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../Components/config/config';

export default function TaskDetail() {

  const { tasks, setTasks, subtasks, projects, teamMembers, setSubtasks } = useContext(AppContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('id');

  if (tasks.length == 0) {
    return <div className='taskDetail'>
      <p>No Task Found</p>
    </div>
  }

  let currentTask = tasks.find((task) => {
    return task.id == taskId
  })
  const currentSubtasks = subtasks.filter((sub) => {
    return sub.taskId == taskId
  })
  const currentTeam = currentTask.selectedTeam.map((id) => {
    const currentMember = teamMembers.find((member) => {
      return member.id == id;
    });
    return currentMember;
  });


  const updateSubtaskStage = async (subtaskId, newStage) => {
    try {
      const subtaskDoc = doc(firestore, 'subtasks', subtaskId);
      await updateDoc(subtaskDoc, { stage: newStage }); // Update stage in Firestore

      // Update the local state with the new stage
      setSubtasks(prevSubtasks => prevSubtasks.map(sub => {
        if (sub.id === subtaskId) {
          return { ...sub, stage: newStage };
        }
        return sub;
      }));

      alert(`Subtask marked as ${newStage}`);
    } catch (error) {
      console.error('Error updating subtask stage:', error);
      alert('Error updating subtask stage');
    }
  };

  async function completeTask(newStage) {
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
      alert(`Task marked as ${newStage}`);
    } catch (error) {
      console.error('Error updating task stage:', error);
      alert('Error updating task stage');
    }
  }



  return (
    <div className='taskDetail'>
      <h2>Task Details</h2>
      <div className="taskDetailContainer">
        <div >
          <div className="taskStatus">
            <div>
              <p style={{ textTransform: 'uppercase' }}>{currentTask.priority} PRIORITY</p>
              <p><span></span>{currentTask.stage}</p>
            </div>
            <p className='detailTaskTitle'>{currentTask.title}</p>
            <p><span>Created At: </span>{currentTask.startDate}</p>
          </div>
          <div className="taskAttachement">
            <p><span>Team: </span>{currentTeam.length}</p>
            <span>|</span>
            <p><span>Sub-Task: </span>{currentSubtasks.length}</p>
          </div>
          <div className="taskTeam">
            <p>TASK TEAM</p>
            {currentTeam.map((member, i) => {
              return <div key={i} className="teamMember">
                <p>{member.fullName}</p>
                <p>{member.role}</p>
              </div>
            })}
            <div className="completeTaskBtnContainer">
              <button className="completeTaskBtn" onClick={() => { completeTask('completed') }}>
                Complete Task
              </button>
            </div>
          </div>
          <div className="subTask">
            <div>
              <p>SUB TASK </p>
              <span style={{ opacity: '1' }}>50.00%</span>
            </div>
            {currentSubtasks.map((sub) => {
              return <div className="subTaskCard">
                <div>
                  <p style={{ fontSize: '14px' }}>Created at: {sub.startDate}</p>
                  <span>{sub.stage}</span>
                </div>
                <div className="subtaskTitle">
                  <p>{sub.subtaskTitle}</p>
                </div>
                <div className="subTaskAddBtn">
                  <button onClick={() => updateSubtaskStage(sub.id, 'Completed')}>Mark As Done</button>
                  <button onClick={() => updateSubtaskStage(sub.id, 'In Progress')}>In Progress</button>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className='taskDesc'>
          <h2>TASK DESCRIPTION</h2>
          <p>Switches are a pleasant interface for toggling a value between two states,
            and offer the same semantics and keyboard navigation as native checkbox
            elements</p>
        </div>
      </div>
    </div>
  )
}
