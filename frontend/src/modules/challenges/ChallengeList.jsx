// src/modules/challenges/ChallengeList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllChallenges } from "./api";

export default function ChallengeList() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    getAllChallenges().then((data) => setChallenges(data));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Challenges</h1>

      {challenges.map((ch) => (
        <div
          key={ch.id}
          style={{
            padding: "20px",
            borderBottom: "1px solid #ddddddff",
            cursor: "pointer",
          }}
        >
          <Link to={`/challenges/${ch.id}`} style={{ textDecoration: "none" }}>
            <h2>{ch.title}</h2>
            <p>Difficulty: {ch.difficulty}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
