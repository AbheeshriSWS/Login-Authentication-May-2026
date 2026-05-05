import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const users = [
  {
    username: "john123",
    email: "john@gmail.com",
    password: "123456",
    name: "John Doe"
  },
  {
    username: "hey123",
    email: "hey@gmail.com",
    password: "123456",
    name: "Hey"
  },
  {
    username: "hello123",
    email: "hello@gmail.com",
    password: "123456",
    name: "Hello"
  }
];

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = () => {
  const foundUser = users.find(
    (u) =>
      (form.identifier === u.email ||
        form.identifier === u.username) &&
      form.password === u.password
  );

  if (foundUser) {
    localStorage.setItem("user", JSON.stringify(foundUser));
    navigate("/dashboard");
  } else {
    alert("Invalid credentials");
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Welcome Back</h2>
        <p className={styles.subtitle}>Login to continue</p>

        <div className={styles.customInput}>
          <input
            className={styles.input}
            placeholder="Email or Username"
            onChange={(e) =>
              setForm({ ...form, identifier: e.target.value })
            }
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button className={styles.button} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}