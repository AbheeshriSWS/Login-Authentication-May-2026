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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 🔹 Validation function
  const validate = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = `${name === "identifier" ? "Email or Username" : "Password"} is required`;
    } else {
      if (name === "password" && value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  // 🔹 Handle change with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    validate(name, value); // realtime validation
  };

  const handleLogin = () => {
    // 🔹 Final validation check
    let newErrors = {};

    if (!form.identifier.trim()) {
      newErrors.identifier = "Email or Username is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

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
      setErrors({
        general: "Invalid credentials"
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Welcome Back</h2>
        <p className={styles.subtitle}>Login to continue</p>

        <div className={styles.customInput}>
          {/* Identifier */}
          <input
            name="identifier"
            className={styles.input}
            placeholder="Email or Username"
            value={form.identifier}
            onChange={handleChange}
          />
          {errors.identifier && (
            <p className={styles.error}>{errors.identifier}</p>
          )}

          {/* Password */}
          <input
            type="password"
            name="password"
            className={styles.input}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password}</p>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <p className={styles.error}>{errors.general}</p>
        )}

        <button className={styles.button} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}