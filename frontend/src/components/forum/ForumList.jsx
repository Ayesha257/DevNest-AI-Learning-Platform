import React, { useEffect, useState } from "react";
import { getForumThreads } from "../../api/apiService";
import { Link, useNavigate } from "react-router-dom";

const ForumList = () => {
  const [threads, setThreads] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await getForumThreads();
        setThreads(data);
      } catch (err) {
        console.error("Failed to fetch threads:", err);
      }
    };
    fetchThreads();
  }, []);

  // Filter threads based on search
  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(search.toLowerCase()) ||
    thread.content.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (index) => {
    if (index === 0) return "0 hours ago";
    if (index === 1) return "5 hours ago";
    return `${index + 1} hours ago`;
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Community Forum</h1>
        <p style={styles.subtitle}>Join the conversation and share your knowledge with the community</p>
        <div style={styles.divider}></div>
      </div>

      {/* Stats and New Thread Section */}
      <div style={styles.statsSection}>
        <div style={styles.stats}>
          <h2 style={styles.statsTitle}>Active Threads</h2>
          <p style={styles.membersOnline}>1.2k Members Online</p>
        </div>
        <Link
          to="/forum/new"
          style={styles.newThreadButton}
        >
          + New Thread
        </Link>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search threads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.divider}></div>

      {/* Threads List */}
      <div style={styles.threadsContainer}>
        {filteredThreads.length === 0 ? (
          <p style={styles.noThreads}>
            {threads.length === 0 ? "No threads yet. Start a new discussion!" : "No threads match your search."}
          </p>
        ) : (
          filteredThreads.map((thread, index) => (
            <div 
              key={thread.id} 
              style={styles.threadCard}
              onClick={() => navigate(`/forum/${thread.id}`)}
            >
              {/* Thread Header */}
              <div style={styles.threadHeader}>
                <h2 style={styles.threadTitle}>{thread.title}</h2>
                <div style={styles.engagementStats}>
                  <div style={styles.engagementItem}>
                    <span style={styles.engagementIcon}>💬</span>
                    <span style={styles.engagementCount}>
                      {thread.comments ? thread.comments.length : 0}
                    </span>
                  </div>
                  <div style={styles.engagementItem}>
                    <span style={styles.engagementIcon}>👍</span>
                    <span style={styles.engagementCount}>
                      {thread.upvotes || 0}
                    </span>
                  </div>
                  <div style={styles.engagementItem}>
                    <span style={styles.engagementIcon}>🕒</span>
                    <span style={styles.engagementTime}>
                      {thread.createdAt 
                        ? new Date(thread.createdAt.seconds * 1000).toLocaleDateString()
                        : formatTime(index)
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Thread Content */}
              <p style={styles.threadContent}>
                {thread.content && thread.content.length > 120 
                  ? thread.content.slice(0, 120) + "..." 
                  : thread.content}
              </p>

              {/* Author Info */}
              <div style={styles.authorSection}>
                <div style={styles.authorDivider}></div>
                <div style={styles.authorInfo}>
                  <span style={styles.authorLabel}>By</span>
                  <span style={styles.authorName}>
                    {thread.author || "Anonymous"}
                  </span>
                </div>
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
    backgroundColor: "#0a1128", // navy
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#ffffff"
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#00807e", // teal
    marginBottom: "0.5rem"
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#94a3b8",
    marginBottom: "1.5rem"
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #00807e, transparent)", // teal
    margin: "1.5rem auto",
    maxWidth: "800px"
  },
  statsSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    maxWidth: "800px",
    margin: "0 auto 1.5rem auto"
  },
  stats: {
    display: "flex",
    alignItems: "center",
    gap: "2rem"
  },
  statsTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ffffff"
  },
  membersOnline: {
    fontSize: "0.875rem",
    color: "#8e44ad", // purple
    fontWeight: "500"
  },
  newThreadButton: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #00807e, #8e44ad)", // teal to purple
    color: "white",
    textDecoration: "none",
    borderRadius: "0.75rem",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 128, 126, 0.3)"
  },
  searchContainer: {
    maxWidth: "800px",
    margin: "0 auto 1.5rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(0, 128, 126, 0.4)", // teal border
    backgroundColor: "rgba(15, 23, 42, 0.7)", // navyDark
    color: "white",
    outline: "none",
    transition: "all 0.3s ease",
  },
  threadsContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  },
  threadCard: {
    backgroundColor: "rgba(15, 23, 42, 0.8)", // navyDark
    backdropFilter: "blur(10px)",
    borderRadius: "1rem",
    padding: "1.5rem",
    border: "1px solid rgba(142, 68, 173, 0.3)", // purple border
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  threadHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
    gap: "1rem"
  },
  threadTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#00807e", // teal
    flex: 1,
    margin: 0
  },
  engagementStats: {
    display: "flex",
    gap: "1rem",
    flexShrink: 0
  },
  engagementItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.875rem"
  },
  engagementIcon: {
    fontSize: "0.75rem"
  },
  engagementCount: {
    color: "#cbd5e1",
    fontWeight: "500"
  },
  engagementTime: {
    color: "#94a3b8",
    fontSize: "0.75rem"
  },
  threadContent: {
    color: "#cbd5e1",
    lineHeight: "1.6",
    marginBottom: "1rem",
    fontSize: "0.95rem"
  },
  authorSection: {
    marginTop: "1rem"
  },
  authorDivider: {
    height: "1px",
    background: "rgba(0, 128, 126, 0.3)", // teal
    marginBottom: "0.75rem"
  },
  authorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem"
  },
  authorLabel: {
    color: "#94a3b8"
  },
  authorName: {
    color: "#8e44ad", // purple
    fontWeight: "500"
  },
  noThreads: {
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
    fontSize: "1.125rem",
    padding: "3rem",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: "1rem",
    border: "1px dashed rgba(0, 128, 126, 0.3)"
  }
};

export default ForumList;