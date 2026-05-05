import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // UI STATE
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // TASK STATE
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "" });
  const [editId, setEditId] = useState(null);

  // SETTINGS (ACTIVE - applied)
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState("enabled");

  // SETTINGS (TEMP - draft before saving)
  const [tempTheme, setTempTheme] = useState("light");
  const [tempNotifications, setTempNotifications] = useState("enabled");

  // LOAD DATA
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);

    const storedSettings = JSON.parse(localStorage.getItem("settings"));

    if (storedSettings) {
      setTheme(storedSettings.theme);
      setNotifications(storedSettings.notifications);

      setTempTheme(storedSettings.theme);
      setTempNotifications(storedSettings.notifications);
    }
  }, []);

  // APPLY THEME (ONLY WHEN SAVED)
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // SAVE TASKS
  const saveTasks = (data) => {
    localStorage.setItem("tasks", JSON.stringify(data));
  };

  // SAVE SETTINGS (FINAL APPLY)
  const saveSettings = () => {
    setTheme(tempTheme);
    setNotifications(tempNotifications);

    localStorage.setItem(
      "settings",
      JSON.stringify({
        theme: tempTheme,
        notifications: tempNotifications,
      })
    );

    toast.success("Settings saved ✅");
    setShowSettings(false);
  };

  // OPEN SETTINGS (RESET TEMP VALUES)
  const openSettings = () => {
    setTempTheme(theme);
    setTempNotifications(notifications);
    setShowSettings(true);
  };

  // CREATE TASK
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.warn("Task cannot be empty ⚠️");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);

    setFormData({ title: "" });

    toast.success("Task Added 🎉");
  };

  // DELETE TASK
  const handleDelete = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);

    toast.error("Task Deleted 🗑️");
  };

  // EDIT
  const handleEdit = (task) => {
    setFormData({ title: task.title });
    setEditId(task.id);

    toast.info("Edit Mode Enabled ✏️");
  };

  // UPDATE
  const handleUpdate = () => {
    const updated = tasks.map((t) =>
      t.id === editId ? { ...t, title: formData.title } : t
    );

    setTasks(updated);
    saveTasks(updated);

    setFormData({ title: "" });
    setEditId(null);

    toast.success("Task Updated ✨");
  };

  // CANCEL
  const handleCancel = () => {
    setFormData({ title: "" });
    setEditId(null);

    toast.warn("Edit Cancelled");
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    toast.info("Logged out 👋");

    setTimeout(() => navigate("/"), 800);
  };

  return (
    <div className={styles.container}>

      {/* MENU */}
      <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>

        <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
          ✖
        </button>

        <div className={styles.profile}>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>

        <hr />

        <button
          className={styles.settingsBtn}
          onClick={openSettings}
        >
          ⚙️ Settings
        </button>

        <button className={styles.logoutBtn} onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {/* MAIN DASHBOARD */}
      <div className={styles.card}>

        <h1>Welcome, {user?.name}</h1>
        <p>{user?.email}</p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Enter task..."
            value={formData.title}
            onChange={(e) => setFormData({ title: e.target.value })}
          />

          {editId ? (
            <div className={styles.btnGroup}>
              <button type="button" onClick={handleUpdate}>
                Update
              </button>

              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="submit">Add Task</button>
          )}
        </form>

        {/* TASK LIST */}
        <div className={styles.list}>
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={styles.task}>
                <span>{task.title}</span>

                <div>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        <ToastContainer />
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className={styles.overlay}>
          <div className={styles.settingsModal}>

            <h2>Settings ⚙️</h2>

            <div className={styles.settingItem}>
              <label>Theme</label>
              <select
                value={tempTheme}
                onChange={(e) => setTempTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <label>Notifications</label>
              <select
                value={tempNotifications}
                onChange={(e) => setTempNotifications(e.target.value)}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            <div className={styles.settingsBtns}>
              <button onClick={saveSettings}>
                Save
              </button>

              <button onClick={() => setShowSettings(false)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}