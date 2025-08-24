import { useState } from "react";

export default function CreateGroupModal({ users, onCreate, onClose }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Create Group</h3>
        <input placeholder="Group name" value={name} onChange={e=>setName(e.target.value)} />
        <div className="selectlist">
          {users.map(u=>(
            <label key={u._id} className="row">
              <input type="checkbox" checked={selected.includes(u._id)} onChange={()=>toggle(u._id)} />
              <span>{u.username}</span>
            </label>
          ))}
        </div>
        <div className="row gap">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={()=>onCreate(name, selected)} disabled={!name || selected.length<2}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
