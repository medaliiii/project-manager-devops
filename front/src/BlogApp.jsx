import { useState } from "react";

function BlogApp() {
  const [posts] = useState([
    {
      id: 1,
      title: "Introduction à React",
      content: "React est une librairie…",
      category: "React",
      date: "2023-10-01",
    },
    {
      id: 2,
      title: "Pourquoi utiliser Node.js ?",
      content: "Node.js permet…",
      category: "Backend",
      date: "2023-09-25",
    },
    {
      id: 3,
      title: "Comprendre useEffect",
      content: "useEffect est utilisé…",
      category: "React",
      date: "2023-10-12",
    },
  ]);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  const filtered = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "recent"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📰 Blog Interactif</h1>

      <input
        type="text"
        placeholder="Rechercher un article..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "300px", padding: "8px", marginBottom: "20px" }}
      />

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        style={{ padding: "8px", marginLeft: "10px" }}
      >
        <option value="recent">Plus récents</option>
        <option value="old">Plus anciens</option>
      </select>

      <div style={{ marginTop: "20px" }}>
        {sorted.map((post) => (
          <div
            key={post.id}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            <h2>{post.title}</h2>
            <p style={{ color: "gray" }}>{post.date}</p>
            <p>{post.content}</p>
            <span
              style={{
                backgroundColor: "#3498db",
                color: "white",
                padding: "4px 8px",
                borderRadius: "3px",
                fontSize: "12px",
              }}
            >
              {post.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogApp;
