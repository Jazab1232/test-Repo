import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import React, { createContext, useEffect, useState } from 'react';
import { firestore } from '../config/config';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [showAddSubtask, setShowAddSubtask] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [ShowAddTask, setShowAddTask] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    
    useEffect(() => {
        const notificationsCollection = collection(firestore, 'userNotification');
        const q = query(notificationsCollection); 
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map((doc) => doc.data());
            setNotifications(fetchedNotifications);
        });

        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'users'));
                const members = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTeamMembers(members);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };
        fetchTeamMembers();
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'tasks'));
                const taskData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLoading(false)
                setTasks(taskData);
            } catch (error) {
                console.error('Error fetching Tasks:', error);
            }
        };
        fetchProjects();
    }, []);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'projects'));
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProjects(projectsData);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };
        fetchTasks();
    }, []);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'subtasks'));
                const subtaskData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setSubtasks(subtaskData);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };
        fetchTasks();
    }, []);


    return (
        <AppContext.Provider value={{
            subtasks, setSubtasks,
            teamMembers, setTeamMembers,
            projects, setProjects,
            tasks, setTasks,
            showAddSubtask, setShowAddSubtask,
            selectedTaskId, setSelectedTaskId,
            ShowAddTask, setShowAddTask,
            loading,
            notifications, setNotifications,
            showNotifications, setShowNotifications
        }}>
            {children}
        </AppContext.Provider>
    );
};
