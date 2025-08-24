import { useState, useRef, useEffect } from "react";

export default function ThreeDotMenu({ onCreateGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(()=> {
    const h = (e)=> { if(!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("click", h);
    return ()=>document.removeEventListener("click", h);
  },[]);
  return (
    <div className="menu" ref={ref}>
      <button className="icon" onClick={()=>setOpen(o=>!o)}>⋮</button>
      {open && (
        <div className="dropdown">
          <button onClick={()=>{ setOpen(false); onCreateGroup(); }}>Create group</button>
        </div>
      )}
    </div>
  );
}
