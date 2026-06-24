import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createChallenge, editChallenge } from "../../api/apiService";

const AdminChallengeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("technical");
  const [points, setPoints] = useState(100);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (id) {
      const fetchChallenge = async () => {
        try {
          const data = await editChallenge(id); 
          setTitle(data?.title || "");
          setDescription(data?.description || "");
          setDifficulty(data?.difficulty || "medium");
          setCategory(data?.category || "technical");
          setPoints(data?.points || 100);
          setTags(data?.tags || []);
        } catch (err) {
          console.error("Error loading challenge:", err);
        }
      };
      fetchChallenge();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const challengeData = {
        title,
        description,
        difficulty,
        category,
        points,
        tags
      };
      
      if (id) {
        await editChallenge(id, challengeData);
      } else {
        await createChallenge(challengeData);
      }
      navigate("/admin/challenges");
    } catch (e) {
      console.error("Error saving challenge:", e);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          {id ? "Edit Challenge" : "Create New Challenge"}
        </h1>
        <p style={styles.subtitle}>
          Design a new challenge for users to complete
        </p>
      </div>

      {/* Form Container */}
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Challenge Title Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Challenge Title</h2>
            <input
              type="text"
              value={title}
              placeholder="Enter a descriptive challenge title"
              onChange={(e) => setTitle(e.target.value)}
              style={styles.textInput}
              required
            />
          </section>

          {/* Settings Grid */}
          <div style={styles.settingsGrid}>
            {/* Difficulty Level */}
            <div style={styles.settingGroup}>
              <h2 style={styles.sectionTitle}>Difficulty Level</h2>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                style={styles.selectInput}
              >
                <option value="easy">Easy - Beginner skills</option>
                <option value="medium">Medium - Intermediate skills</option>
                <option value="hard">Hard - Advanced skills</option>
                <option value="expert">Expert - Master level</option>
              </select>
            </div>

            {/* Category */}
            <div style={styles.settingGroup}>
              <h2 style={styles.sectionTitle}>Category</h2>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={styles.selectInput}
              >
                <option value="technical">Technical - Programming</option>
                <option value="algorithm">Algorithm - Problem Solving</option>
                <option value="frontend">Frontend - UI/UX</option>
                <option value="backend">Backend - Server Side</option>
                <option value="database">Database - Data Management</option>
              </select>
            </div>

            {/* Points Reward */}
            <div style={styles.settingGroup}>
              <h2 style={styles.sectionTitle}>Points Reward</h2>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                style={styles.numberInput}
                min="1"
                max="1000"
              />
              <span style={styles.pointsLabel}>pts</span>
            </div>
          </div>

          {/* Challenge Description */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Challenge Description</h2>
            <textarea
              value={description}
              placeholder="Provide a detailed description of the challenge, including objectives, requirements, and expected outcomes..."
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              style={styles.textarea}
              required
            />
          </section>

          {/* Tags Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tags</h2>
            <div style={styles.tagsContainer}>
              <div style={styles.tagInputGroup}>
                <input
                  type="text"
                  value={newTag}
                  placeholder="Add tags (e.g., React, JavaScript)"
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={styles.tagInput}
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  style={styles.addTagButton}
                >
                  + Add
                </button>
              </div>
              <div style={styles.tagsList}>
                {tags.map((tag, index) => (
                  <div key={index} style={styles.tag}>
                    {tag}
                    <button 
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={styles.removeTagButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div style={styles.divider}></div>

          {/* Tips Section */}
          <section style={styles.tipsSection}>
            <div style={styles.tipItem}>
              <div style={styles.tipIcon}>🎯</div>
              <div style={styles.tipContent}>
                <strong>Be Clear</strong>
                <p>Provide specific objectives and success criteria</p>
              </div>
            </div>
            <div style={styles.tipItem}>
              <div style={styles.tipIcon}>⭐</div>
              <div style={styles.tipContent}>
                <strong>Set Points</strong>
                <p>Reward users appropriately for difficulty level</p>
              </div>
            </div>
            <div style={styles.tipItem}>
              <div style={styles.tipIcon}>🏷️</div>
              <div style={styles.tipContent}>
                <strong>Use Tags</strong>
                <p>Help users discover relevant challenges</p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              type="button"
              onClick={() => navigate("/admin/challenges")}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
            >
              {id ? "Update Challenge" : "Create Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#e2e8f0"
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #a855f7, #2dd4bf)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "0.5rem"
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#94a3b8"
  },
  formContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "1.5rem",
    padding: "2.5rem",
    border: "1px solid rgba(168, 85, 247, 0.2)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#f8fafc",
    background: "linear-gradient(90deg, #a855f7, #2dd4bf)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0
  },
  textInput: {
    padding: "1rem 1.5rem",
    background: "rgba(30, 41, 59, 0.5)",
    border: "2px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "0.75rem",
    color: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit"
  },
  textarea: {
    padding: "1rem 1.5rem",
    background: "rgba(30, 41, 59, 0.5)",
    border: "2px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "0.75rem",
    color: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "150px"
  },
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem"
  },
  settingGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  selectInput: {
    padding: "1rem 1.5rem",
    background: "rgba(30, 41, 59, 0.5)",
    border: "2px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "0.75rem",
    color: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    cursor: "pointer"
  },
  numberInput: {
    padding: "1rem 1.5rem",
    background: "rgba(30, 41, 59, 0.5)",
    border: "2px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "0.75rem",
    color: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    width: "100%"
  },
  pointsLabel: {
    position: "absolute",
    right: "1.5rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    fontSize: "0.875rem"
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  tagInputGroup: {
    display: "flex",
    gap: "0.5rem"
  },
  tagInput: {
    flex: 1,
    padding: "1rem 1.5rem",
    background: "rgba(30, 41, 59, 0.5)",
    border: "2px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "0.75rem",
    color: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit"
  },
  addTagButton: {
    padding: "1rem 1.5rem",
    background: "rgba(168, 85, 247, 0.2)",
    border: "2px solid rgba(168, 85, 247, 0.4)",
    borderRadius: "0.75rem",
    color: "#e2e8f0",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "500"
  },
  tagsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem"
  },
  tag: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(45, 212, 191, 0.2)",
    border: "1px solid rgba(45, 212, 191, 0.4)",
    borderRadius: "1rem",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    color: "#f8fafc"
  },
  removeTagButton: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "1.125rem",
    padding: 0,
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.2s ease"
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #a855f7, transparent)",
    margin: "1rem 0"
  },
  tipsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  tipItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    padding: "1rem",
    background: "rgba(168, 85, 247, 0.1)",
    borderRadius: "0.75rem",
    border: "1px solid rgba(168, 85, 247, 0.2)"
  },
  tipIcon: {
    fontSize: "1.5rem",
    flexShrink: 0
  },
  tipContent: {
    flex: 1
  },
  actionButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end"
  },
  cancelButton: {
    padding: "1rem 2rem",
    background: "rgba(148, 163, 184, 0.2)",
    border: "1px solid rgba(148, 163, 184, 0.3)",
    borderRadius: "0.75rem",
    color: "#94a3b8",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  submitButton: {
    padding: "1rem 2rem",
    background: "linear-gradient(90deg, #14b8a6, #8b5cf6)",
    border: "none",
    borderRadius: "0.75rem",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease"
  }
};

// Add hover effects
Object.assign(styles.textInput, {
  ":hover": {
    borderColor: "rgba(168, 85, 247, 0.5)"
  },
  ":focus": {
    borderColor: "#2dd4bf",
    boxShadow: "0 0 0 3px rgba(45, 212, 191, 0.2)"
  }
});

Object.assign(styles.textarea, {
  ":hover": {
    borderColor: "rgba(168, 85, 247, 0.5)"
  },
  ":focus": {
    borderColor: "#a855f7",
    boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.2)"
  }
});

Object.assign(styles.selectInput, {
  ":hover": {
    borderColor: "rgba(168, 85, 247, 0.5)"
  },
  ":focus": {
    borderColor: "#2dd4bf",
    boxShadow: "0 0 0 3px rgba(45, 212, 191, 0.2)"
  }
});

Object.assign(styles.addTagButton, {
  ":hover": {
    background: "rgba(168, 85, 247, 0.3)",
    transform: "translateY(-1px)"
  }
});

Object.assign(styles.removeTagButton, {
  ":hover": {
    background: "rgba(239, 68, 68, 0.2)",
    color: "#fca5a5"
  }
});

Object.assign(styles.cancelButton, {
  ":hover": {
    background: "rgba(148, 163, 184, 0.3)",
    transform: "translateY(-1px)"
  }
});

Object.assign(styles.submitButton, {
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)"
  }
});

export default AdminChallengeEditor;