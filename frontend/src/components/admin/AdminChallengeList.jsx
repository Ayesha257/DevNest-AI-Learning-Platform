import React, { useEffect, useState } from "react";
import { getDrafts } from "../../api/apiService";
import { Link } from "react-router-dom";

const AdminChallengeList = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getDrafts();
        setChallenges(data || []);
      } catch (err) {
        console.error("Error loading challenges:", err);
      }
    };
    fetchDrafts();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Challenges</h1>
        <Link
          to="/admin/challenge/new"
          style={styles.newButton}
        >
          + New Challenge
        </Link>
      </div>

      <div style={styles.divider}></div>

      {/* Challenges List */}
      <div style={styles.challengesList}>
        {challenges.length === 0 ? (
          <div style={styles.noChallenges}>
            No challenges found.
          </div>
        ) : (
          challenges.map((challenge) => (
            <div key={challenge.id} style={styles.challengeCard}>
              {/* Challenge Header */}
              <div style={styles.challengeHeader}>
                <h2 style={styles.challengeTitle}>{challenge.title}</h2>
                <div style={styles.actionButtons}>
                  <Link
                    to={`/admin/challenge/${challenge.id}/edit`}
                    style={styles.editButton}
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/challenges/${challenge.id}`}
                    style={styles.viewButton}
                  >
                    View
                  </Link>
                </div>
              </div>

              {/* Challenge Description */}
              <p style={styles.challengeDescription}>
                {challenge.description?.slice(0, 120) || "No description available"}...
              </p>

              {/* Challenge Metadata */}
              <div style={styles.challengeMeta}>
                <span style={styles.metaItem}>
                  Difficulty: {challenge.difficulty || 'Not set'}
                </span>
                <span style={styles.metaItem}>
                  Points: {challenge.points || 0}
                </span>
                <span style={styles.metaItem}>
                  Category: {challenge.category || 'General'}
                </span>
              </div>
            </div>
          ))
        )}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #a855f7, #2dd4bf)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0
  },
  newButton: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(90deg, #14b8a6, #8b5cf6)",
    color: "white",
    textDecoration: "none",
    borderRadius: "0.75rem",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #a855f7, transparent)",
    margin: "1.5rem 0"
  },
  challengesList: {
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  },
  challengeCard: {
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "1rem",
    padding: "1.5rem",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    transition: "all 0.3s ease"
  },
  challengeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
    gap: "1rem"
  },
  challengeTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#f8fafc",
    margin: 0,
    flex: 1
  },
  actionButtons: {
    display: "flex",
    gap: "0.5rem",
    flexShrink: 0
  },
  editButton: {
    padding: "0.5rem 1rem",
    background: "rgba(45, 212, 191, 0.2)",
    border: "1px solid rgba(45, 212, 191, 0.4)",
    borderRadius: "0.5rem",
    color: "#2dd4bf",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s ease"
  },
  viewButton: {
    padding: "0.5rem 1rem",
    background: "rgba(168, 85, 247, 0.2)",
    border: "1px solid rgba(168, 85, 247, 0.4)",
    borderRadius: "0.5rem",
    color: "#a855f7",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s ease"
  },
  challengeDescription: {
    color: "#cbd5e1",
    lineHeight: "1.6",
    marginBottom: "1rem",
    fontSize: "0.95rem"
  },
  challengeMeta: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap"
  },
  metaItem: {
    color: "#94a3b8",
    fontSize: "0.875rem",
    fontWeight: "500"
  },
  noChallenges: {
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
    padding: "3rem",
    fontSize: "1.125rem"
  }
};

// Add hover effects
Object.assign(styles.newButton, {
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)"
  }
});

Object.assign(styles.challengeCard, {
  ":hover": {
    borderColor: "rgba(168, 85, 247, 0.4)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)"
  }
});

Object.assign(styles.editButton, {
  ":hover": {
    background: "rgba(45, 212, 191, 0.3)",
    transform: "translateY(-1px)"
  }
});

Object.assign(styles.viewButton, {
  ":hover": {
    background: "rgba(168, 85, 247, 0.3)",
    transform: "translateY(-1px)"
  }
});

export default AdminChallengeList;