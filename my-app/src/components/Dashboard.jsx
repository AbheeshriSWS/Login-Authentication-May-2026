import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Welcome, {user?.name}</h1>

        <div className={styles.info}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Username:</strong> {user?.username}</p>
        </div>

        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}