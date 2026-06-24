import React, { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../api/apiService";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage({ text: text.trim() });
    const data = await getMessages();
    setMessages(data);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Inbox</h1>
        <div style={styles.messageCount}>
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </div>
      </div>

      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.noMessages}>No messages yet. Start a conversation!</div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} style={styles.messageBubble}>
              <div style={styles.messageText}>{msg.text}</div>
              <div style={styles.messageTime}>{formatTime(msg.createdAt)}</div>
            </div>
          ))
        )}
      </div>

      <div style={styles.inputContainer}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={styles.textInput}
          rows={3}
        />
        <button onClick={handleSend} style={styles.sendButton} disabled={!text.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "#0f172a", padding: "2rem", fontFamily: "sans-serif", color: "#e2e8f0", display: "flex", flexDirection: "column" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid rgba(168,85,247,0.3)", paddingBottom: "1rem" },
  title: { fontSize: "2rem", fontWeight: "bold", background: "linear-gradient(90deg,#a855f7,#2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 },
  messageCount: { color: "#94a3b8", fontSize: "0.875rem", fontWeight: "500" },
  messagesContainer: { flex: 1, display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem", padding: "1rem", background: "rgba(30,41,59,0.3)", borderRadius: "1rem", border: "1px solid rgba(168,85,247,0.2)", overflowY: "auto", maxHeight: "60vh" },
  messageBubble: { background: "rgba(168,85,247,0.1)", borderRadius: "1rem", padding: "1rem 1.5rem", border: "1px solid rgba(168,85,247,0.3)", maxWidth: "80%", alignSelf: "flex-start" },
  messageText: { color: "#f8fafc", fontSize: "1rem", lineHeight: "1.5", marginBottom: "0.5rem" },
  messageTime: { color: "#94a3b8", fontSize: "0.75rem", textAlign: "right" },
  noMessages: { textAlign: "center", color: "#94a3b8", fontStyle: "italic", padding: "2rem" },
  inputContainer: { background: "rgba(30,41,59,0.7)", borderRadius: "1rem", padding: "1.5rem", border: "1px solid rgba(168,85,247,0.2)", display: "flex", flexDirection: "column", gap: "1rem" },
  textInput: { width: "100%", padding: "1rem", background: "rgba(30,41,59,0.5)", border: "2px solid rgba(168,85,247,0.3)", borderRadius: "0.75rem", color: "#f8fafc", fontSize: "1rem", outline: "none" },
  sendButton: { padding: "0.75rem 2rem", background: "linear-gradient(90deg,#14b8a6,#8b5cf6)", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: "600", fontSize: "1rem", cursor: "pointer", alignSelf: "flex-end", minWidth: "120px" }
};

export default InboxPage;








