import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

export default function Signup() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    city: "",
    about: "Available",
    photo: "",
  });
  const [err, setErr] = useState("");

  const onChange = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      nav("/chats");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="card" onSubmit={submit}>
        <h2>Sign up</h2>
        {err && <div className="error">{err}</div>}
        <input placeholder="Username" value={form.username} onChange={e=>onChange("username", e.target.value)} />
        <input placeholder="Email" value={form.email} onChange={e=>onChange("email", e.target.value)} />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>onChange("password", e.target.value)} />
        <input placeholder="City" value={form.city} onChange={e=>onChange("city", e.target.value)} />
        <select value={form.role} onChange={e=>onChange("role", e.target.value)}>
          {["student","tutor","plumber","editor","web developer","admin"].map(r=> <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={form.about} onChange={e=>onChange("about", e.target.value)}>
          {["Available","Busy","Sleeping","At work","In class","Battery about to die","Can’t talk, WhatsApp only","At the gym","On vacation","Custom"].map(r=> <option key={r} value={r}>{r}</option>)}
        </select>
          {/* Option 2: File upload */}
  {/* Option 2: File upload */}
{/* Option 2: File upload */}
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update form state with photo as Base64 string
        setForm((prevForm) => ({
          ...prevForm,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }}
/>


        <button type="submit">Create account</button>
        <p className="muted">Have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
