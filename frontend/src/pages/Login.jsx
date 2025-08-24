import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login() {
  const { signin } = useAuth();
  const nav = useNavigate();
  const [emailOrUsername, setE] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signin(emailOrUsername, password);
      nav("/chats");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="card" onSubmit={submit}>
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <input placeholder="Email or Username" value={emailOrUsername} onChange={e=>setE(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setP(e.target.value)} />
        <button type="submit">Sign In</button>
        <p className="muted">No account? <Link to="/signup">Sign up</Link></p>
      </form>
    </div>
  );
}
