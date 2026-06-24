// // // src/api/apiService.js
// // import { db } from "../firebase";
// // import { 
// //   collection, 
// //   getDocs, 
// //   addDoc, 
// //   doc, 
// //   updateDoc, 
// //   getDoc 
// // } from "firebase/firestore";

// // /* ----------------------------- Forum APIs ----------------------------- */

// // // Get all forum threads
// // export const getForumThreads = async () => {
// //   const threadsCol = collection(db, "forum");
// //   const threadsSnapshot = await getDocs(threadsCol);
// //   return threadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // };

// // // Create a new thread
// // export const createThread = async (thread) => {
// //   const threadsCol = collection(db, "forum");
// //   const docRef = await addDoc(threadsCol, thread);
// //   return docRef.id;
// // };

// // // Get a single thread + its comments
// // export const getThread = async (id) => {
// //   const threadRef = doc(db, "forum", id);
// //   const threadSnap = await getDoc(threadRef);
// //   if (!threadSnap.exists()) return null;

// //   const commentsCol = collection(threadRef, "comments");
// //   const commentsSnap = await getDocs(commentsCol);
// //   const comments = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// //   return { id: threadSnap.id, ...threadSnap.data(), comments };
// // };

// // // Upvote a thread or comment
// // export const upvote = async (id, type = "thread") => {
// //   const ref = type === "thread" ? doc(db, "forum", id) : doc(db, "comments", id);
// //   const docSnap = await getDoc(ref);
// //   const current = docSnap.exists() && docSnap.data().upvotes ? docSnap.data().upvotes : 0;
// //   await updateDoc(ref, { upvotes: current + 1 });
// // };

// // /* -------------------------- Admin Challenge APIs -------------------------- */

// // // Create a new challenge
// // export const createChallenge = async (challenge) => {
// //   const challengesCol = collection(db, "challenges");
// //   const docRef = await addDoc(challengesCol, challenge);
// //   return docRef.id;
// // };

// // // Edit a challenge
// // export const editChallenge = async (id, data) => {
// //   const challengeRef = doc(db, "challenges", id);
// //   await updateDoc(challengeRef, data);
// // };

// // // Get list of draft challenges
// // export const getDrafts = async () => {
// //   const challengesCol = collection(db, "challenges");
// //   const snapshot = await getDocs(challengesCol);
// //   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // };

// // /* ---------------------- Notifications & Inbox APIs ---------------------- */

// // // Get notifications
// // export const getNotifications = async () => {
// //   const snapshot = await getDocs(collection(db, "notifications"));
// //   return snapshot.docs.map(doc => doc.data());
// // };

// // // Get inbox messages
// // export const getMessages = async () => {
// //   const snapshot = await getDocs(collection(db, "messages"));
// //   return snapshot.docs.map(doc => doc.data());
// // };

// // // Send a new message
// // export const sendMessage = async (message) => {
// //   await addDoc(collection(db, "messages"), message);
// // };


// // // Add comment to a thread
// // export const addComment = async (threadId, comment) => {
// //   const commentsCol = collection(db, "forum", threadId, "comments");
// //   const docRef = await addDoc(commentsCol, comment);
// //   return docRef.id;
// // };


// // /* -------------------------- Badges APIs -------------------------- */

// // // Get all badge definitions
// // export const getAllBadges = async () => {
// //   const snapshot = await getDocs(collection(db, "badges"));
// //   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // };

// // // Get badges for a specific user
// // export const getUserBadges = async (userId) => {
// //   const snapshot = await getDocs(collection(db, "userBadges"));
// //   // Filter by userId
// //   return snapshot.docs
// //     .map(doc => ({ id: doc.id, ...doc.data() }))
// //     .filter(badge => badge.userId === userId);
// // };

// // /* -------------------------- Leaderboard API -------------------------- */

// // // Get leaderboard data
// // export const getLeaderboard = async () => {
// //   const snapshot = await getDocs(collection(db, "leaderboard"));
// //   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // };







// import { db } from "../firebase";
// import { 
//   collection, 
//   getDocs, 
//   addDoc, 
//   doc, 
//   updateDoc, 
//   getDoc,
//   serverTimestamp
// } from "firebase/firestore";

// /* ----------------------------- Forum APIs ----------------------------- */

// // Get all forum threads
// export const getForumThreads = async () => {
//   const threadsCol = collection(db, "forum");
//   const threadsSnapshot = await getDocs(threadsCol);
//   return threadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// // Create a new thread
// export const createThread = async (thread) => {
//   const threadsCol = collection(db, "forum");
//   const docRef = await addDoc(threadsCol, { ...thread, createdAt: serverTimestamp(), upvotes: 0 });
//   return docRef.id;
// };

// // Get a single thread + its comments
// export const getThread = async (id) => {
//   const threadRef = doc(db, "forum", id);
//   const threadSnap = await getDoc(threadRef);
//   if (!threadSnap.exists()) return null;

//   const commentsCol = collection(threadRef, "comments");
//   const commentsSnap = await getDocs(commentsCol);
//   const comments = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//   return { id: threadSnap.id, ...threadSnap.data(), comments };
// };

// // Upvote a thread or comment
// export const upvote = async (id, type = "thread") => {
//   const ref = type === "thread" ? doc(db, "forum", id) : doc(db, "comments", id);
//   const docSnap = await getDoc(ref);
//   const current = docSnap.exists() && docSnap.data().upvotes ? docSnap.data().upvotes : 0;
//   await updateDoc(ref, { upvotes: current + 1 });
// };

// // Add comment to a thread
// export const addComment = async (threadId, comment) => {
//   const commentsCol = collection(db, "forum", threadId, "comments");
//   const docRef = await addDoc(commentsCol, { ...comment, createdAt: serverTimestamp(), upvotes: 0 });
//   return docRef.id;
// };

// /* -------------------------- Admin Challenge APIs -------------------------- */

// export const createChallenge = async (challenge) => {
//   const challengesCol = collection(db, "challenges");
//   const docRef = await addDoc(challengesCol, { ...challenge, createdAt: serverTimestamp() });
//   return docRef.id;
// };

// export const editChallenge = async (id, data) => {
//   const challengeRef = doc(db, "challenges", id);
//   await updateDoc(challengeRef, data);
// };

// export const getDrafts = async () => {
//   const challengesCol = collection(db, "challenges");
//   const snapshot = await getDocs(challengesCol);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// /* ---------------------- Notifications & Inbox APIs ---------------------- */

// export const getNotifications = async () => {
//   const snapshot = await getDocs(collection(db, "notifications"));
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// export const getMessages = async () => {
//   const snapshot = await getDocs(collection(db, "messages"));
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// export const sendMessage = async (message) => {
//   await addDoc(collection(db, "messages"), { ...message, createdAt: serverTimestamp() });
// };

// /* -------------------------- Badges APIs -------------------------- */

// export const getAllBadges = async () => {
//   const snapshot = await getDocs(collection(db, "badges"));
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// export const getUserBadges = async (userId) => {
//   const snapshot = await getDocs(collection(db, "userBadges"));
//   return snapshot.docs
//     .map(doc => ({ id: doc.id, ...doc.data() }))
//     .filter(badge => badge.userId === userId);
// };

// /* -------------------------- Leaderboard API -------------------------- */

// export const getLeaderboard = async () => {
//   const snapshot = await getDocs(collection(db, "leaderboard"));
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };











// // src/api/apiService.js
// import {
//   getFirestore,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   addDoc,
//   updateDoc,
//   setDoc,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   serverTimestamp
// } from "firebase/firestore";
// import { db } from "../firebase";

// // ----------------------
// // GENERAL HELPERS
// // ----------------------
// export const makeChatId = (u1, u2) => {
//   return [u1, u2].sort().join("_");
// };

// export const ensureChatDoc = async (chatId, users) => {
//   const ref = doc(db, "chats", chatId);
//   const snap = await getDoc(ref);
//   if (!snap.exists()) {
//     await setDoc(ref, {
//       users,
//       createdAt: serverTimestamp(),
//     });
//   }
// };

// export const getChatDoc = async (chatId) => {
//   const ref = doc(db, "chats", chatId);
//   const snap = await getDoc(ref);
//   return snap.exists() ? { id: snap.id, ...snap.data() } : null;
// };

// // ----------------------
// // USER LIST
// // ----------------------
// export const getAllUsers = async () => {
//   const q = query(collection(db, "users"));
//   const snap = await getDocs(q);
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// // ----------------------
// // USER CHATS LIST
// // ----------------------
// export const getUserChats = async (userId) => {
//   const q = query(
//     collection(db, "chats"),
//     where("users", "array-contains", userId)
//   );
//   const snap = await getDocs(q);
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// // ----------------------
// // CHAT MESSAGES
// // ----------------------
// export const getChatMessages = async (chatId) => {
//   const msgsRef = collection(db, "chats", chatId, "messages");
//   const q = query(msgsRef, orderBy("createdAt"));
//   const snap = await getDocs(q);
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// export const subscribeToChatMessages = (chatId, callback) => {
//   const msgsRef = collection(db, "chats", chatId, "messages");
//   const q = query(msgsRef, orderBy("createdAt"));

//   return onSnapshot(q, (snap) => {
//     const messages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     callback(messages);
//   });
// };

// export const sendChatMessage = async (chatId, text, senderId) => {
//   const msgsRef = collection(db, "chats", chatId, "messages");
//   await addDoc(msgsRef, {
//     text,
//     senderId,
//     createdAt: serverTimestamp(),
//   });
// };

// // ----------------------
// // FORUM
// // ----------------------
// export const getForumThreads = async () => {
//   const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
//   const snap = await getDocs(q);
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// export const createThread = async (data) => {
//   await addDoc(collection(db, "threads"), {
//     ...data,
//     createdAt: serverTimestamp(),
//     upvotes: 0,
//     comments: []
//   });
// };

// // In src/api/apiService.js - UPDATE THESE FUNCTIONS:

// export const getThread = async (id) => {
//   const ref = doc(db, "threads", id);
//   const snap = await getDoc(ref);
//   if (!snap.exists()) return null;
  
//   const threadData = { id: snap.id, ...snap.data() };
  
//   // Get comments from subcollection
//   const commentsRef = collection(db, "threads", id, "comments");
//   const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
//   const commentsSnap = await getDocs(commentsQuery);
//   const comments = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  
//   return { ...threadData, comments };
// };

// export const addComment = async (threadId, text, userId) => {
//   const commentsRef = collection(db, "threads", threadId, "comments");
//   await addDoc(commentsRef, {
//     text,
//     userId,
//     upvotes: 0,
//     createdAt: serverTimestamp(),
//   });
// };

// export const upvoteComment = async (threadId, commentId, currentUpvotes) => {
//   const commentRef = doc(db, "threads", threadId, "comments", commentId);
//   await updateDoc(commentRef, {
//     upvotes: currentUpvotes + 1,
//   });
// };
// // ----------------------
// // CHALLENGES (ADMIN)
// // ----------------------
// export const getDrafts = async () => {
//   const snap = await getDocs(collection(db, "drafts"));
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// export const createChallenge = async (data) => {
//   await addDoc(collection(db, "drafts"), data);
// };

// export const editChallenge = async (id, data) => {
//   await updateDoc(doc(db, "drafts", id), data);
// };

// // ----------------------
// // LEADERBOARD
// // ----------------------
// export const getLeaderboard = async () => {
//   const q = query(collection(db, "leaderboard"), orderBy("score", "desc"));
//   const snap = await getDocs(q);
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// // ----------------------
// // BADGES
// // ----------------------
// export const getAllBadges = async () => {
//   const snap = await getDocs(collection(db, "badges"));
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// export const getUserBadges = async (userId) => {
//   const q = query(
//     collection(db, "userBadges"),
//     where("userId", "==", userId)
//   );
//   const snap = await getDocs(q);
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// // ----------------------
// // NOTIFICATIONS
// // ----------------------
// export const getNotifications = async (userId) => {
//   const q = query(
//     collection(db, "notifications"),
//     where("userId", "==", userId)
//   );
//   const snap = await getDocs(q);
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// // ----------------------
// // INBOX MESSAGES (OLD)
// // ----------------------
// export const getMessages = async () => {
//   const q = query(collection(db, "messages"), orderBy("createdAt"));
//   const snap = await getDocs(q);
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// };

// export const sendMessage = async (data) => {
//   await addDoc(collection(db, "messages"), {
//     ...data,
//     createdAt: serverTimestamp(),
//   });
// };

// src/api/apiService.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// ----------------------
// GENERAL HELPERS
// ----------------------
export const makeChatId = (u1, u2) => {
  return [u1, u2].sort().join("_");
};

export const ensureChatDoc = async (chatId, users) => {
  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      users,
      createdAt: serverTimestamp(),
    });
  }
};

export const getChatDoc = async (chatId) => {
  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ----------------------
// USER LIST
// ----------------------
export const getAllUsers = async () => {
  const q = query(collection(db, "users"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ----------------------
// USER CHATS LIST
// ----------------------
export const getUserChats = async (userId) => {
  const q = query(
    collection(db, "chats"),
    where("users", "array-contains", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ----------------------
// CHAT MESSAGES
// ----------------------
export const getChatMessages = async (chatId) => {
  const msgsRef = collection(db, "chats", chatId, "messages");
  const q = query(msgsRef, orderBy("createdAt"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToChatMessages = (chatId, callback) => {
  const msgsRef = collection(db, "chats", chatId, "messages");
  const q = query(msgsRef, orderBy("createdAt"));

  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

export const sendChatMessage = async (chatId, text, senderId) => {
  const msgsRef = collection(db, "chats", chatId, "messages");
  await addDoc(msgsRef, {
    text,
    senderId,
    createdAt: serverTimestamp(),
  });
};

// ----------------------
// FORUM
// ----------------------
export const getForumThreads = async () => {
  const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const createThread = async (data) => {
  await addDoc(collection(db, "threads"), {
    ...data,
    createdAt: serverTimestamp(),
    upvotes: 0,
    comments: []
  });
};

export const getThread = async (id) => {
  const ref = doc(db, "threads", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  
  const threadData = { id: snap.id, ...snap.data() };
  
  // Get comments from subcollection
  const commentsRef = collection(db, "threads", id, "comments");
  const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
  const commentsSnap = await getDocs(commentsQuery);
  const comments = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  return { ...threadData, comments };
};

export const addComment = async (threadId, text, userId) => {
  const commentsRef = collection(db, "threads", threadId, "comments");
  await addDoc(commentsRef, {
    text,
    userId,
    upvotes: 0,
    createdAt: serverTimestamp(),
  });
};

// ADD THIS FUNCTION - FORUM UP VOTE
export const upvote = async (threadId) => {
  const ref = doc(db, "threads", threadId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const current = snap.data().upvotes || 0;
  await updateDoc(ref, { upvotes: current + 1 });
};

export const upvoteComment = async (threadId, commentId, currentUpvotes) => {
  const commentRef = doc(db, "threads", threadId, "comments", commentId);
  await updateDoc(commentRef, {
    upvotes: currentUpvotes + 1,
  });
};

// ----------------------
// CHALLENGES (ADMIN)
// ----------------------
export const getDrafts = async () => {
  const snap = await getDocs(collection(db, "drafts"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const createChallenge = async (data) => {
  await addDoc(collection(db, "drafts"), data);
};

export const editChallenge = async (id, data) => {
  await updateDoc(doc(db, "drafts", id), data);
};

// ----------------------
// LEADERBOARD
// ----------------------
export const getLeaderboard = async () => {
  const q = query(collection(db, "leaderboard"), orderBy("score", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ----------------------
// BADGES
// ----------------------
export const getAllBadges = async () => {
  const snap = await getDocs(collection(db, "badges"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getUserBadges = async (userId) => {
  const q = query(
    collection(db, "userBadges"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ----------------------
// NOTIFICATIONS
// ----------------------
export const getNotifications = async (userId) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ----------------------
// INBOX MESSAGES (OLD)
// ----------------------
export const getMessages = async () => {
  const q = query(collection(db, "messages"), orderBy("createdAt"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const sendMessage = async (data) => {
  await addDoc(collection(db, "messages"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};