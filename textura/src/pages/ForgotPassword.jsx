import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Forgot.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setMsg("Please enter your registered email address!");
      return;
    }
    setMsg("If this email exists, password reset link has been sent.");
  };

  return (
    <div className="auth-wrapper">
      <div className="login-section">
        <div className="login-box">
          <h2>Forgot Password?</h2>
          <p className="subtitle">We’ll send you a reset link</p>

          {msg && <p className="error">{msg}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Send Reset Link</button>
          </form>

          <p className="redirect-text">
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

