// src/components/tasks/Tasks.js
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase'; // Ensure your firebase setup is correct
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Tasks.css'; // Ensure you have the correct path for the CSS file

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completedTasks, setCompletedTasks] = useState(0);

  // Fetch tasks from Firebase on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        const tasksFromFirebase = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksFromFirebase);
        const completedCount = tasksFromFirebase.filter(task => task.completed).length;
        setCompletedTasks(completedCount);
      } catch (error) {
        console.error('Error fetching tasks:', error); // Added error handling
      }
    };

    fetchTasks();
  }, []);

  // Add a new task to Firestore
  const addTask = async () => {
    if (taskInput && dueDate) {
      try {
        const newTask = { task: taskInput, dueDate, completed: false };
        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        setTasks([...tasks, { id: docRef.id, ...newTask }]);
        setTaskInput(''); // Clear input
        setDueDate(''); // Clear due date
      } catch (error) {
        console.error('Error adding task:', error); // Added error handling
      }
    }
  };

  // Mark a task as completed in Firestore
  const markTaskAsCompleted = async (taskId, index) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, { completed: true });

      const updatedTasks = tasks.map((task, i) =>
        i === index ? { ...task, completed: true } : task
      );
      setTasks(updatedTasks);
      setCompletedTasks(completedTasks + 1);
    } catch (error) {
      console.error('Error updating task:', error); // Added error handling
    }
  };

  return (
    <div className="tasks-container">
      <h1>Tasks</h1>

      {/* Input for new tasks */}
      <div className="task-inputs">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task list */}
      <h2>Task List</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.id} className={task.completed ? 'completed-task' : ''}>
            <span>{task.task} - Due on {new Date(task.dueDate).toLocaleDateString()}</span>
            {!task.completed && (
              <button onClick={() => markTaskAsCompleted(task.id, index)}>
                Mark as Completed
              </button>
            )}
            {task.completed && <span> (Completed)</span>}
          </li>
        ))}
      </ul>

      {/* Task completion stats */}
      <h3>Completed Tasks: {completedTasks} / {tasks.length}</h3>

      {/* Task completion progress bar */}
      <div className="progress-bar-container">
        <h3>Task Progress</h3>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: tasks.length > 0
                ? `${(completedTasks / tasks.length) * 100}%`
                : '0%', // Handle the case where there are no tasks
            }}
          >
            {tasks.length > 0
              ? `${Math.round((completedTasks / tasks.length) * 100)}%`
              : '0%'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
