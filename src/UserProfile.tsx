import React, { useState } from "react";

// --- Intentional SAST issues below, for scanner testing only ---

// 1. Hardcoded secret (should trigger hardcoded-secret detection)
const API_KEY = "sk_live_51H8xJ2kQwErTyUiOpAsDfGhJkLzXcVbNm";

interface UserProfileProps {
  userId: string;
  bio: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, bio }) => {
  const [query, setQuery] = useState("");

  // 2. XSS sink: rendering unsanitized HTML from a prop
  const renderBio = () => {
    return { __html: bio };
  };

  // 3. SQL Injection pattern: string concatenation into a query
  const buildUserQuery = (id: string) => {
    const sql = "SELECT * FROM users WHERE id = '" + id + "'";
    return sql;
  };

  // 4. Use of eval on user-influenced input
  const runDynamicFilter = (expression: string) => {
    // eslint-disable-next-line no-eval
    return eval(expression);
  };

  // 5. Insecure randomness used in a security-sensitive context
  const generateSessionToken = () => {
    return Math.random().toString(36).substring(2);
  };

  // 6. Fetching a user-controlled URL without validation (SSRF-prone pattern)
  const fetchRemoteAvatar = async (url: string) => {
    const response = await fetch(url);
    return response.blob();
  };

  return (
    <div>
      <h2>User Profile: {userId}</h2>
      <div dangerouslySetInnerHTML={renderBio()} />
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => console.log(buildUserQuery(query))}>
        Search
      </button>
      <button onClick={() => runDynamicFilter(query)}>Run Filter</button>
      <p>Session: {generateSessionToken()}</p>
      <p>API Key in use: {API_KEY}</p>
    </div>
  );
};

export default UserProfile;
