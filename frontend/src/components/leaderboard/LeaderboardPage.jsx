// import React, { useEffect, useState } from "react";
// import { getLeaderboard } from "../../api/apiService";

// const LeaderboardPage = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       const data = await getLeaderboard();
//       setUsers(data);
//     };
//     fetchLeaderboard();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-4 text-purple-700">Leaderboard</h1>
//       <table className="w-full border-collapse bg-white shadow rounded">
//         <thead className="bg-teal-500 text-white">
//           <tr>
//             <th className="p-2 text-left">Rank</th>
//             <th className="p-2 text-left">User</th>
//             <th className="p-2 text-left">Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u, i) => (
//             <tr key={u.id} className="border-b hover:bg-purple-50">
//               <td className="p-2">{i + 1}</td>
//               <td className="p-2">{u.name}</td>
//               <td className="p-2">{u.score}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LeaderboardPage;


















import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../../api/apiService";

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setUsers(data);
    };
    fetchLeaderboard();
  }, []);

  // Function to determine rank badge color
  const getRankBadgeStyle = (rank) => {
    if (rank === 1) return styles.goldBadge;
    if (rank === 2) return styles.silverBadge;
    if (rank === 3) return styles.bronzeBadge;
    return styles.regularBadge;
  };

  // Function to generate trend data (you can replace with actual trend from API)
  const getTrendData = (index) => {
    const trends = ['+120', '+95', '+85', '+60', '+45', '+30', '+25', '+20', '+15', '+10'];
    return trends[index] || '+0';
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Leaderboard</h1>
        <p style={styles.subtitle}>Top performers this month</p>
      </div>

      {/* Leaderboard Table */}
      <div style={styles.tableContainer}>
        {/* Table Header */}
        <div style={styles.tableHeader}>
          <div style={styles.headerCell} className="rank">RANK</div>
          <div style={styles.headerCell} className="user">USER</div>
          <div style={styles.headerCell} className="score">SCORE</div>
          <div style={styles.headerCell} className="trend">TREND</div>
        </div>

        {/* Table Body */}
        <div style={styles.tableBody}>
          {users.length === 0 ? (
            <div style={styles.noData}>No leaderboard data available</div>
          ) : (
            users.map((user, index) => (
              <div key={user.id} style={styles.tableRow}>
                {/* Rank Column */}
                <div style={styles.rankCell}>
                  <div style={{...styles.rankBadge, ...getRankBadgeStyle(index + 1)}}>
                    {index + 1}
                  </div>
                </div>

                {/* User Column */}
                <div style={styles.userCell}>
                  <div style={styles.userAvatar}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={styles.userInfo}>
                    <div style={styles.userName}>{user.name || 'Anonymous'}</div>
                    {index === 0 && <div style={styles.championBadge}>Champion</div>}
                  </div>
                </div>

                {/* Score Column */}
                <div style={styles.scoreCell}>
                  <div style={styles.scoreValue}>{user.score || 0} pts</div>
                </div>

                {/* Trend Column */}
                <div style={styles.trendCell}>
                  <div style={styles.trendValue}>
                    <span style={styles.trendIcon}>^</span>
                    <span style={styles.trendText}>{getTrendData(index)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
  tableContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "1rem",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    overflow: "hidden"
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "80px 1fr 120px 100px",
    gap: "1rem",
    padding: "1.5rem 2rem",
    background: "rgba(168, 85, 247, 0.1)",
    borderBottom: "1px solid rgba(168, 85, 247, 0.3)",
    fontWeight: "600",
    color: "#f8fafc",
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  headerCell: {
    display: "flex",
    alignItems: "center"
  },
  tableBody: {
    padding: "1rem 0"
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "80px 1fr 120px 100px",
    gap: "1rem",
    padding: "1.5rem 2rem",
    borderBottom: "1px solid rgba(168, 85, 247, 0.1)",
    transition: "all 0.2s ease",
    alignItems: "center"
  },
  rankCell: {
    display: "flex",
    justifyContent: "center"
  },
  rankBadge: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.875rem"
  },
  goldBadge: {
    background: "linear-gradient(135deg, #fbbf24, #d97706)",
    color: "#1f2937",
    boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)"
  },
  silverBadge: {
    background: "linear-gradient(135deg, #e5e7eb, #9ca3af)",
    color: "#1f2937",
    boxShadow: "0 4px 12px rgba(229, 231, 235, 0.3)"
  },
  bronzeBadge: {
    background: "linear-gradient(135deg, #f59e0b, #b45309)",
    color: "#1f2937",
    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
  },
  regularBadge: {
    background: "rgba(168, 85, 247, 0.2)",
    color: "#e2e8f0",
    border: "1px solid rgba(168, 85, 247, 0.4)"
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  userAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: "1.125rem"
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem"
  },
  userName: {
    fontWeight: "600",
    color: "#f8fafc",
    fontSize: "1rem"
  },
  championBadge: {
    background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
    color: "#1f2937",
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  scoreCell: {
    display: "flex",
    alignItems: "center"
  },
  scoreValue: {
    fontWeight: "600",
    color: "#2dd4bf",
    fontSize: "1rem"
  },
  trendCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  trendValue: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    background: "rgba(45, 212, 191, 0.1)",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(45, 212, 191, 0.3)"
  },
  trendIcon: {
    color: "#2dd4bf",
    fontWeight: "bold"
  },
  trendText: {
    color: "#2dd4bf",
    fontWeight: "600",
    fontSize: "0.875rem"
  },
  noData: {
    textAlign: "center",
    padding: "3rem",
    color: "#94a3b8",
    fontStyle: "italic"
  }
};

// Add hover effects
Object.assign(styles.tableRow, {
  ":hover": {
    background: "rgba(168, 85, 247, 0.05)",
    transform: "translateX(4px)"
  }
});

export default LeaderboardPage;