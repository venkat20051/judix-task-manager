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
      <div className="bg-white/80 backdrop-blur border-b shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          TaskFlow
        </h1>

        {user && (
          <div className="relative">
            <div
              onClick={() => setShowProfile(!showProfile)}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold cursor-pointer shadow hover:scale-110 transition-transform duration-200"
            >
              {user.name.charAt(0)}
            </div>

            {showProfile && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-xl border p-4 animate-fade-in">
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
                  className="mt-4 w-full bg-gradient-to-r from-rose-500 to-red-600 text-white py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* CREATE TASK */}
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-3xl shadow p-10 mb-12 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-semibold mb-6">
            Create New Task
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="border rounded-2xl p-4 text-base focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="border rounded-2xl p-4 text-base focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-10 py-3 rounded-full font-medium hover:scale-105 transition-transform"
          >
            Add Task
          </button>
        </form>

        {/* SEARCH & FILTER */}
        <div className="bg-white rounded-3xl shadow p-8 mb-12 flex flex-col md:flex-row gap-6 hover:shadow-lg transition">
          <input
            className="flex-1 border rounded-2xl p-4 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-2xl p-4 w-full md:w-56 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* TASK LIST */}
        <h2 className="text-3xl font-semibold mb-10">
          Your Tasks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-3xl p-10 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative min-h-[300px]"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl p-1 ${
                  task.status === "completed"
                    ? "bg-emerald-500"
                    : "bg-amber-400"
                }`}
              />

              {editTaskId === task._id ? (
                <>
                  <input
                    className="border rounded-xl p-4 w-full mb-4"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="border rounded-xl p-4 w-full mb-5"
                    rows={3}
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
                  />

                  <div className="flex gap-4">
                    <button
                      onClick={() => saveEdit(task._id)}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:scale-105 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 px-6 py-2 rounded-full hover:scale-105 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-2xl text-gray-800">
                    {task.title}
                  </h3>

                  <p className="text-base text-gray-600 mt-5 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="mt-10 flex justify-between items-center">
                    <span
                      className={`text-sm font-semibold px-5 py-2 rounded-full ${
                        task.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.status}
                    </span>

                    <div className="flex gap-3">
                      {task.status === "pending" && (
                        <button
                          onClick={() =>
                            handleMarkComplete(task._id)
                          }
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full transition"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(task)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteTask(task._id)
                        }
                        className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full transition"
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
