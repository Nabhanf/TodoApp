import React, { useState } from 'react';
import CalendarView from './components/CalendarView';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm'; // Import TaskForm

const App = () => {
  const [view, setView] = useState('calendar'); // State to toggle between views

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="p-4 bg-blue-500 text-white text-center">
        <h1 className="text-3xl font-bold">Task Manager</h1>
      </header>

      {/* Navigation Buttons for Calendar, Task List, and Create Task */}
      <div className="flex justify-center my-4">
        <button
          className={`px-4 py-2 mx-2 rounded ${view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('calendar')}
        >
          Calendar View
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('list')}
        >
          Task List
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${view === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('create')}
        >
          Create Task
        </button>
      </div>

      {/* Main Content Section */}
      <main className="p-4">
        {view === 'calendar' && <CalendarView />}
        {view === 'list' && <TaskList />}
        {view === 'create' && <TaskForm />} {/* Render TaskForm when 'create' view is selected */}
      </main>
    </div>
  );
};

export default App;
