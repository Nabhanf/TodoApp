import React, { useState, useEffect } from "react";
import api from "../api"; 

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(""); 
  const [search, setSearch] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null); 

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/v2/tasks/`, {
        params: {
          status: filter,
          search: search,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };


  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await api.patch(`/v2/tasks/${taskId}/`, {
        status: newStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: response.data.status } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/v2/tasks/${editingTask.id}/`, editingTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id ? response.data : task
        )
      );
      setEditingTask(null); 
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };


  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/v2/tasks/${taskId}/`);

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };


  useEffect(() => {
    fetchTasks();
  }, [filter, search]);

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Task List</h1>


      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <label className="mr-2 font-medium">Filter by Status:</label>
          <select
            className="border rounded px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center w-full sm:w-auto">
          <input
            type="text"
            className="border rounded-l px-3 py-2 w-full sm:w-auto"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            onClick={fetchTasks}
          >
            Search
          </button>
        </div>
      </div>


      {loading ? (
        <p className="text-center">Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Due Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{task.title}</td>
                <td className="px-4 py-2 border">{task.description || "N/A"}</td>
                <td className="px-4 py-2 border">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      task.status === "Pending"
                        ? "bg-red-100 text-red-500"
                        : task.status === "In Progress"
                        ? "bg-blue-100 text-blue-500"
                        : "bg-green-100 text-green-500"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-2 border">{task.due_date}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => setEditingTask(task)} 
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)} 
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-red-500">No tasks found.</p>
      )}


      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editingTask.description || ""}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editingTask.due_date}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, due_date: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)} 
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
