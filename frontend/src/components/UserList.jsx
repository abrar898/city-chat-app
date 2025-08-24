
import { useState } from "react";

export default function UserList({ users, onUserClick }) {
  return (
    <div className="userlist">
      {users.map((u) => (
        <UserItem key={u._id} user={u} onUserClick={onUserClick} />
      ))}
    </div>
  );
}

function UserItem({ user, onUserClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button className="useritem" onClick={() => onUserClick(user._id)}>
      <div className="avatar">
        {user.photo && !imgError ? (
          <img
            src={user.photo}
            alt={user.username}
            className="avatar-img"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            onError={() => setImgError(true)} // fallback if image is corrupted
          />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#4a90e2",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {user.username?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="meta">
        <div className="name">{user.username}</div>
        <div className="sub">{user.about || user.role}</div>
      </div>
    </button>
  );
}
