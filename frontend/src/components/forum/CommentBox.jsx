// import React, { useState } from "react";
// import { addComment, getThread } from "../../api/apiService";

// const CommentBox = ({ threadId, comments, setThread }) => {
//   const [text, setText] = useState("");

//   const handleComment = async () => {
//     if (!text.trim()) return;

//     try {
//       await addComment(threadId, text);
//       const data = await getThread(threadId);
//       setThread(data);
//       setText("");
//     } catch (err) {
//       console.error("Failed to add comment:", err);
//     }
//   };

//   return (
//     <div className="mt-10 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">

//       {/* Header */}
//       <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-purple-400 text-transparent bg-clip-text">
//         Comments
//       </h2>

//       {/* Comments List */}
//       <div className="space-y-3 mb-4">
//         {comments.length === 0 ? (
//           <p className="text-gray-300 italic">No comments yet. Be the first!</p>
//         ) : (
//           comments.map((c, i) => (
//             <div
//               key={i}
//               className="p-4 bg-white/20 border border-white/30 backdrop-blur-md rounded-xl 
//                          shadow hover:bg-white/30 transition-all duration-300"
//             >
//               <p className="text-white">{c}</p>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Textarea */}
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         rows={3}
//         placeholder="Write a comment..."
//         className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/30 
//                    backdrop-blur-md focus:ring-2 focus:ring-teal-400 outline-none 
//                    placeholder-gray-400"
//       />

//       {/* Submit Button */}
//       <button
//         onClick={handleComment}
//         className="mt-4 px-6 py-2 rounded-xl text-white font-semibold shadow-lg
//                    bg-gradient-to-r from-purple-600 to-teal-500
//                    hover:scale-105 hover:shadow-xl transition-all duration-300"
//       >
//         Add Comment
//       </button>
//     </div>
//   );
// };

// export default CommentBox;


































import React, { useState } from "react";
import { addComment, upvoteComment, getThread } from "../../api/apiService";

const CommentBox = ({ threadId, comments, setThread }) => {
  const [text, setText] = useState("");

  const handleComment = async () => {
    if (!text.trim()) return;
    await addComment(threadId, text);

    const updated = await getThread(threadId);
    setThread(updated);
    setText("");
  };

  const handleUpvoteComment = async (index) => {
    await upvoteComment(threadId, index);
    const updated = await getThread(threadId);
    setThread(updated);
  };

  return (
    <div>
      <h2>Comments</h2>

      {comments.length === 0 && <p>No comments yet.</p>}

      {comments.map((c, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <p>{c.text}</p>

          <button onClick={() => handleUpvoteComment(i)}>
            👍 {c.upvotes}
          </button>
        </div>
      ))}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment"
      />

      <button onClick={handleComment}>Add Comment</button>
    </div>
  );
};

export default CommentBox;
