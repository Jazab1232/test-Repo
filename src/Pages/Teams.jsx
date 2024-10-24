import React, { useContext, useState } from 'react'
import '../styles/teams.css'
import AddTeam from '../Components/AddTeam'
import { AppContext } from '../Components/context/AppContext.jsx';
import { AuthContext } from '../Components/context/AuthContext';

export default function Teams() {
  const [showAddTeam, setShowAddTeam] = useState(false);
  const { teamMembers, setTeamMembers } = useContext(AppContext);

  return (
    <div className='teams'>
      <div className="teamHeader">
        <h2>Teams</h2>
        <p onClick={() => { setShowAddTeam(true) }}> <i className="fa-solid fa-plus"></i>Add a Member</p>
      </div>
      <div className="teamContainer">
        <table className="teamsTable">
          <thead>
            <tr>
              <th>SR No.</th>
              <th>Fullname</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>

            {teamMembers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No team members available.
                </td>
              </tr>
            ) : (
              teamMembers.map((data, index) => (
                <tr key={data.id}>
                  <td>{index + 1}</td>
                  <td>{data.fullName}</td>
                  <td>{data.email}</td>
                  <td>{data.role}</td>
                  <td >
                    <p className='teamBtn'>
                      <button className='editBtn'>Edit</button>
                      <button className='delBtn'>Delete</button>
                    </p>
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
      <AddTeam showAddTeam={showAddTeam} setShowAddTeam={setShowAddTeam} />
    </div>
  )
}
