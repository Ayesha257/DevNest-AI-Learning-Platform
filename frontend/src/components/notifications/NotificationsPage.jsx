import React, { useEffect, useState } from "react";
import { getNotifications } from "../../api/apiService";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "unread", "read"

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  // Filter notifications based on selection
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Format time function
  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    return notificationDate.toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Notifications</h1>
        <div style={styles.unreadBadge}>
          You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        <button
          style={{
            ...styles.tab,
            ...(filter === "all" ? styles.activeTab : {})
          }}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          style={{
            ...styles.tab,
            ...(filter === "unread" ? styles.activeTab : {})
          }}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
        <button
          style={{
            ...styles.tab,
            ...(filter === "read" ? styles.activeTab : {})
          }}
          onClick={() => setFilter("read")}
        >
          Read
        </button>
      </div>

      <div style={styles.divider}></div>

      {/* Notifications List */}
      <div style={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <div style={styles.noNotifications}>
            <div style={styles.noNotificationsIcon}>🔔</div>
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <div 
              key={notification.id || index} 
              style={{
                ...styles.notificationCard,
                ...(!notification.read ? styles.unreadCard : {})
              }}
            >
              {/* Notification Dot for Unread */}
              {!notification.read && <div style={styles.unreadDot}></div>}
              
              {/* Notification Content */}
              <div style={styles.notificationContent}>
                <div style={styles.notificationMessage}>
                  {notification.message || notification.title || 'New notification'}
                </div>
                <div style={styles.notificationTime}>
                  {formatTime(notification.createdAt || notification.timestamp)}
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
    marginBottom: "2rem",
    textAlign: "center"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#00807e", // teal
    marginBottom: "0.5rem"
  },
  unreadBadge: {
    color: "#94a3b8",
    fontSize: "1rem",
    fontWeight: "500"
  },
  filterTabs: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "1.5rem"
  },
  tab: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "rgba(15, 23, 42, 0.6)", // navyDark
    border: "1px solid rgba(142, 68, 173, 0.3)", // purple border
    borderRadius: "0.75rem",
    color: "#e2e8f0",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "0.875rem"
  },
  activeTab: {
    background: "linear-gradient(135deg, #8e44ad, #00807e)", // purple to teal
    borderColor: "rgba(0, 128, 126, 0.5)",
    color: "white",
    boxShadow: "0 4px 15px rgba(0, 128, 126, 0.3)"
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #00807e, transparent)", // teal
    margin: "1.5rem auto",
    maxWidth: "600px"
  },
  notificationsList: {
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  notificationCard: {
    backgroundColor: "rgba(15, 23, 42, 0.8)", // navyDark
    backdropFilter: "blur(10px)",
    borderRadius: "1rem",
    padding: "1.5rem",
    border: "1px solid rgba(142, 68, 173, 0.3)", // purple border
    transition: "all 0.3s ease",
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem"
  },
  unreadCard: {
    borderColor: "rgba(0, 128, 126, 0.5)", // teal border
    backgroundColor: "rgba(0, 128, 126, 0.08)", // teal tint
    boxShadow: "0 0 20px rgba(0, 128, 126, 0.1)"
  },
  unreadDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#00807e", // teal
    flexShrink: 0,
    marginTop: "0.5rem",
    boxShadow: "0 0 10px rgba(0, 128, 126, 0.5)"
  },
  notificationContent: {
    flex: 1
  },
  notificationMessage: {
    color: "#f8fafc",
    fontSize: "1rem",
    fontWeight: "600",
    lineHeight: "1.5",
    marginBottom: "0.5rem"
  },
  notificationTime: {
    color: "#94a3b8",
    fontSize: "0.875rem",
    fontWeight: "500"
  },
  noNotifications: {
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
    padding: "3rem",
    fontSize: "1.125rem",
    backgroundColor: "rgba(15, 23, 42, 0.5)", // navyDark
    borderRadius: "1rem",
    border: "1px dashed rgba(0, 128, 126, 0.3)" // teal border
  },
  noNotificationsIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
    opacity: 0.5
  }
};

export default NotificationsPage;