import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createThread } from "../../api/apiService";

const NewThreadForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createThread({ title, content, createdAt: new Date() });
      navigate("/forum");
    } catch (err) {
      console.error("Failed to create thread:", err);
      alert("Error creating thread. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Thread</h1>
        <p style={styles.subtitle}>Share your thoughts with the community</p>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Title Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Thread Title</label>
            <input
              type="text"
              placeholder="Enter an engaging title for your thread..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Content Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Thread Content</label>
            <textarea
              placeholder="Share your thoughts, ideas, or questions in detail..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              style={styles.textarea}
              required
            />
            <p style={styles.tip}>
              💡 Be clear and descriptive to get the best responses
            </p>
          </div>

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>
              Create Thread
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/forum")}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div style={styles.tipsContainer}>
        <div style={styles.tipCard}>
          <div style={styles.tipIcon}>💡</div>
          <h3 style={styles.tipTitle}>Be Specific</h3>
          <p style={styles.tipText}>Clear titles help others find your thread</p>
        </div>
        <div style={styles.tipCard}>
          <div style={styles.tipIcon}>🎯</div>
          <h3 style={styles.tipTitle}>Stay Focused</h3>
          <p style={styles.tipText}>Keep your thread on a single topic</p>
        </div>
        <div style={styles.tipCard}>
          <div style={styles.tipIcon}>✨</div>
          <h3 style={styles.tipTitle}>Be Respectful</h3>
          <p style={styles.tipText}>Foster positive discussions</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a1128", // navy
    padding: "3rem 1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#00807e", // teal
    marginBottom: "1rem"
  },
  subtitle: {
    color: "#d1d5db",
    fontSize: "1.125rem"
  },
  formContainer: {
    maxWidth: "56rem",
    margin: "0 auto",
    backgroundColor: "rgba(15, 23, 42, 0.9)", // navyDark
    borderRadius: "1rem",
    border: "1px solid rgba(0, 128, 126, 0.3)", // teal border
    overflow: "hidden",
    position: "relative"
  },
  form: {
    padding: "2rem"
  },
  inputGroup: {
    marginBottom: "2rem"
  },
  label: {
    display: "block",
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#8e44ad", // purple
    marginBottom: "0.5rem"
  },
  input: {
    width: "100%",
    padding: "1rem 1.5rem",
    fontSize: "1.125rem",
    borderRadius: "0.75rem",
    border: "2px solid rgba(0, 128, 126, 0.4)", // teal border
    backgroundColor: "rgba(10, 17, 40, 0.6)", // navy
    color: "white",
    outline: "none",
    transition: "all 0.3s ease"
  },
  textarea: {
    width: "100%",
    padding: "1rem 1.5rem",
    fontSize: "1.125rem",
    borderRadius: "0.75rem",
    border: "2px solid rgba(142, 68, 173, 0.4)", // purple border
    backgroundColor: "rgba(10, 17, 40, 0.6)", // navy
    color: "white",
    outline: "none",
    resize: "vertical",
    transition: "all 0.3s ease",
    fontFamily: "inherit"
  },
  tip: {
    color: "#9ca3af",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    paddingTop: "1.5rem"
  },
  submitButton: {
    flex: 1,
    padding: "1rem 2rem",
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #00807e, #8e44ad)", // teal to purple
    border: "none",
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 128, 126, 0.3)"
  },
  cancelButton: {
    padding: "1rem 2rem",
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#d1d5db",
    backgroundColor: "rgba(15, 23, 42, 0.7)", // navyDark
    border: "2px solid rgba(142, 68, 173, 0.4)", // purple border
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  tipsContainer: {
    maxWidth: "56rem",
    margin: "2rem auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem"
  },
  tipCard: {
    backgroundColor: "rgba(15, 23, 42, 0.6)", // navyDark
    backdropFilter: "blur(8px)",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    border: "1px solid rgba(0, 128, 126, 0.3)", // teal border
    textAlign: "center",
    transition: "all 0.3s ease"
  },
  tipIcon: {
    fontSize: "2rem",
    marginBottom: "0.5rem"
  },
  tipTitle: {
    color: "#00807e", // teal
    fontWeight: "600",
    marginBottom: "0.5rem",
    fontSize: "1rem"
  },
  tipText: {
    color: "#9ca3af",
    fontSize: "0.875rem"
  }
};

export default NewThreadForm;