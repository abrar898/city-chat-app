import { useRef, useState } from "react";

export default function MessageInput({ onSend, onFile }) {
  const [text, setText] = useState("");
  const fileRef = useRef();

  const send = () => {
    onSend(text);
    setText("");
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) onFile?.(f);
    e.target.value = null;
  };

  return (
    <div className="msginput">
      <button className="icon" onClick={()=>fileRef.current.click()}>📎</button>
      <input
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder="Type a message"
        onKeyDown={(e)=>{ if (e.key === "Enter") send(); }}
      />
      <button className="send" onClick={send}>Send</button>
      <input ref={fileRef} style={{ display:"none" }} type="file" onChange={onPick}
             accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip" />
    </div>
  );
}
