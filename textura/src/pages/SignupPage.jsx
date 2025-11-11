import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import "../styles/Auth.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, user } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔄 Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") checkPasswordStrength(value);
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const checkPasswordStrength = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;
    const mediumRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{6,}$/;

    if (strongRegex.test(password)) setPasswordStrength("Strong ✅");
    else if (mediumRegex.test(password)) setPasswordStrength("Medium ⚠️");
    else setPasswordStrength("Weak ❌");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields!");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (result.success) {
      setError("");
      navigate("/"); // ✅ Redirect to home
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="login-section">
        <div className="login-box">
          <h2>Create Account</h2>
          <p className="subtitle">Join the fun world of fashion 🎨</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {form.password && (
              <p
                className={`password-strength ${
                  passwordStrength.includes("Strong")
                    ? "strong"
                    : passwordStrength.includes("Medium")
                    ? "medium"
                    : "weak"
                }`}
              >
                {passwordStrength}
              </p>
            )}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <button type="submit">Sign Up</button>
          </form>

          <p className="redirect-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
