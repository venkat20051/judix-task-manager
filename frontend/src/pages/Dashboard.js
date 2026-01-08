import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter]);

  const fetchProfile = async () => {
    const res = await api.get("/auth/profile");
    setUser(res.data);
  };

  const fetchTasks = async () => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;

    const res = await api.get("/tasks", { params });
    setTasks(res.data);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    await api.post("/tasks", { title, description });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const handleMarkComplete = async (id) => {
    await api.put(`/tasks/${id}`, { status: "completed" });
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (id) => {
    await api.put(`/tasks/${id}`, {
      title: editTitle,
      description: editDescription
    });
    cancelEdit();
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* NAVBAR */}
      <div className="bg-white/80 backdrop-blur border-b shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          TaskFlow
        </h1>

        {user && (
          <div className="relative">
            <div
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-semibold cursor-pointer shadow hover:scale-105 transition"
            >
              {user.name.charAt(0)}
            </div>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border p-4">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>

                <div className="mt-3 bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-indigo-600">
                    {user.roleTitle}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {user.bio}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-4 w-full bg-rose-500 text-white py-2 rounded-lg text-sm hover:bg-rose-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* CREATE TASK */}
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-2xl shadow p-6 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">
            Create New Task
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Add Task
          </button>
        </form>

        {/* SEARCH & FILTER */}
        <div className="bg-white rounded-2xl shadow p-5 mb-8 flex flex-col md:flex-row gap-4">
          <input
            className="flex-1 border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl p-3 text-sm md:w-48 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* TASK LIST */}
        <h2 className="text-xl font-semibold mb-6">
          Your Tasks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition relative min-h-[220px]"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${
                  task.status === "completed"
                    ? "bg-emerald-500"
                    : "bg-amber-400"
                }`}
              />

              {editTaskId === task._id ? (
                <>
                  <input
                    className="border rounded-lg p-3 w-full mb-3 text-sm"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="border rounded-lg p-3 w-full mb-4 text-sm"
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => saveEdit(task._id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 px-4 py-2 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2">
                    {task.description}
                  </p>

                  <div className="mt-6 flex justify-between items-center">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        task.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.status}
                    </span>

                    <div className="flex gap-2">
                      {task.status === "pending" && (
                        <button
                          onClick={() => handleMarkComplete(task._id)}
                          className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(task)}
                        className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
