import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThread, upvote, addComment, upvoteComment } from "../../api/apiService";

const ThreadPage = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchThread = async () => {
      const data = await getThread(threadId);
      setThread(data);
    };
    fetchThread();
  }, [threadId]);

  const handleUpvote = async () => {
    await upvote(threadId);
    const data = await getThread(threadId);
    setThread(data);
  };

  const handleCommentUpvote = async (commentId, currentUpvotes) => {
    await upvoteComment(threadId, commentId, currentUpvotes);
    const data = await getThread(threadId);
    setThread(data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    // You'll need to get current user ID - for now using placeholder
    const userId = "user123"; // Replace with actual user ID from auth
    await addComment(threadId, newComment, userId);
    
    const data = await getThread(threadId);
    setThread(data);
    setNewComment("");
  };

  if (!thread) return (
    <div style={styles.container}>
      <div style={styles.loading}>Loading...</div>
    </div>
  );

  return (
    <div style={styles.container}>
      
      {/* Thread Header */}
      <div style={styles.threadHeader}>
        <h1 style={styles.threadTitle}>{thread.title}</h1>

        <div style={styles.threadMeta}>
          <span style={styles.metaItem}>
            📅 Posted{" "}
            {thread.createdAt
              ? new Date(thread.createdAt.seconds * 1000).toLocaleDateString()
              : "Recently"}
          </span>

          <span style={styles.metaItem}>
            💬 {thread.comments ? thread.comments.length : 0} comments
          </span>
        </div>
      </div>

      {/* Thread Content */}
      <div style={styles.threadContent}>
        <p style={styles.contentText}>{thread.content}</p>
      </div>

      <div style={styles.divider}></div>

      {/* Upvote */}
      <div style={styles.upvoteSection}>
        <button onClick={handleUpvote} style={styles.upvoteButton}>
          ⬆️ Upvote <span style={styles.upvoteCount}>{thread.upvotes || 0}</span>
        </button>
      </div>

      <div style={styles.divider}></div>

      {/* Comments Section */}
      <div style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>
          Comments ({thread.comments ? thread.comments.length : 0})
        </h2>

        {/* Comments List */}
        <div style={styles.commentsList}>
          {thread.comments && thread.comments.length > 0 ? (
            thread.comments.map((comment) => (
              <div key={comment.id} style={styles.commentCard}>
                <p style={styles.commentText}>{comment.text}</p>
                <div style={styles.commentFooter}>
                  <button 
                    onClick={() => handleCommentUpvote(comment.id, comment.upvotes || 0)}
                    style={styles.commentUpvoteButton}
                  >
                    👍 {comment.upvotes || 0}
                  </button>
                  <span style={styles.commentMeta}>
                    {comment.createdAt 
                      ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString()
                      : "Recently"
                    }
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noComments}>No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Add Comment */}
        <div style={styles.addCommentSection}>
          <h3 style={styles.addCommentTitle}>Add a Comment</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            placeholder="Write your comment..."
            style={styles.commentTextarea}
          />
          <button 
            onClick={handleAddComment}
            style={styles.submitCommentButton}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a1128", // navy
    padding: "2rem",
    color: "#ffffff",
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
    color: "#00807e", // teal
    fontSize: "1.2rem",
  },
  threadHeader: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  threadTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#00807e", // teal
    marginBottom: "1rem",
  },
  threadMeta: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    marginTop: "1rem",
  },
  metaItem: {
    color: "#94a3b8",
    fontSize: "0.95rem",
  },
  threadContent: {
    backgroundColor: "rgba(15, 23, 42, 0.8)", // navyDark with transparency
    padding: "1.5rem",
    borderRadius: "1rem",
    marginBottom: "2rem",
    border: "1px solid rgba(0, 128, 126, 0.3)", // teal border
    maxWidth: "900px",
    margin: "0 auto 2rem auto",
  },
  contentText: {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "#e2e8f0",
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #00807e, transparent)", // teal
    margin: "2rem auto",
    maxWidth: "900px",
  },
  upvoteSection: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  upvoteButton: {
    padding: "0.85rem 2rem",
    background: "linear-gradient(135deg, #00807e, #8e44ad)", // teal to purple
    border: "none",
    borderRadius: "0.75rem",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "1rem",
    boxShadow: "0 4px 15px rgba(0, 128, 126, 0.3)",
  },
  upvoteCount: {
    marginLeft: "0.75rem",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    padding: "0.3rem 0.7rem",
    borderRadius: "0.4rem",
    fontWeight: "bold",
  },
  commentsSection: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  commentsTitle: {
    fontSize: "1.75rem",
    marginBottom: "1.5rem",
    color: "#8e44ad", // purple
    fontWeight: "bold",
  },
  commentsList: {
    marginBottom: "2rem",
  },
  commentCard: {
    backgroundColor: "rgba(15, 23, 42, 0.6)", // navyDark
    padding: "1.25rem",
    borderRadius: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid rgba(142, 68, 173, 0.2)", // purple border
    transition: "all 0.3s ease",
  },
  commentText: {
    marginBottom: "0.75rem",
    lineHeight: "1.6",
    color: "#e2e8f0",
  },
  commentFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.5rem",
  },
  commentUpvoteButton: {
    backgroundColor: "rgba(142, 68, 173, 0.2)", // purple with transparency
    border: "1px solid rgba(142, 68, 173, 0.4)",
    color: "#e2e8f0",
    padding: "0.4rem 0.9rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  commentMeta: {
    color: "#94a3b8",
    fontSize: "0.875rem",
  },
  noComments: {
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
    padding: "3rem",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: "0.75rem",
    border: "1px dashed rgba(0, 128, 126, 0.3)",
  },
  addCommentSection: {
    backgroundColor: "rgba(15, 23, 42, 0.8)", // navyDark
    padding: "1.5rem",
    borderRadius: "1rem",
    border: "1px solid rgba(0, 128, 126, 0.3)", // teal border
  },
  addCommentTitle: {
    marginBottom: "1rem",
    color: "#00807e", // teal
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  commentTextarea: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "rgba(10, 17, 40, 0.7)", // navy
    border: "1px solid rgba(0, 128, 126, 0.4)", // teal border
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    resize: "vertical",
    marginBottom: "1rem",
    fontSize: "1rem",
    lineHeight: "1.5",
    fontFamily: "inherit",
  },
  submitCommentButton: {
    padding: "0.85rem 2rem",
    background: "linear-gradient(135deg, #8e44ad, #00807e)", // purple to teal
    border: "none",
    borderRadius: "0.75rem",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(142, 68, 173, 0.3)",
  },
};

export default ThreadPage;