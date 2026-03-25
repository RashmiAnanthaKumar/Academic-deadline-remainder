import React, { useEffect, useState } from "react";

const BASE_URL = "https://academic-deadline-remainder-production.up.railway.app";

const API_TASK = `${BASE_URL}/api/tasks`;
const API_AUTH = `${BASE_URL}/api/auth`;
const API_SUBMIT = `${BASE_URL}/api/submissions`;

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleAuth = async () => {
    try {
      const url = isLogin ? "/login" : "/register";

      const body = isLogin
        ? { email, password }
        : { name, email, password, role };

      const res = await fetch(API_AUTH + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (isLogin) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("name", data.name);
          window.location.reload();
        } else {
          alert(data.message);
        }
      } else {
        alert("Registered! Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  if (localStorage.getItem("token")) {
    return <Dashboard />;
  }

  return (
    <div style={center}>
      <div style={card}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} style={input} />
        )}

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={input} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={input} />

        {!isLogin && (
          <select onChange={(e) => setRole(e.target.value)} style={input}>
            <option value="student">Student</option>
            <option value="professor">Professor</option>
          </select>
        )}

        <button onClick={handleAuth} style={btn}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
          {isLogin ? "Create account" : "Already have account?"}
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const role = localStorage.getItem("role");

  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const [messages, setMessages] = useState({});
  const [files, setFiles] = useState({});

  const getTasks = async () => {
    const res = await fetch(API_TASK);
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  const getSubmissions = async () => {
    const res = await fetch(API_SUBMIT);
    const data = await res.json();
    setSubmissions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    getTasks();
    getSubmissions();
  }, []);

  // ✅ ADD TASK (RESTORED)
  const addTask = async () => {
    await fetch(API_TASK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, deadline }),
    });

    setTitle("");
    setDescription("");
    setDeadline("");

    getTasks();
  };

  // ✅ SUBMIT TASK WITH FILE
  const submitTask = async (taskId) => {
    const formData = new FormData();

    formData.append("taskId", taskId);
    formData.append("studentName", localStorage.getItem("name"));
    formData.append("message", messages[taskId] || "Done");

    if (files[taskId]) {
      formData.append("file", files[taskId]);
    }

    await fetch(API_SUBMIT, {
      method: "POST",
      body: formData,
    });

    alert("Submitted!");
    getSubmissions();
  };

  return (
    <div style={container}>
      <div style={sidebar}>
        <h2>📚 Dashboard</h2>
        <p>{role}</p>

        {/* ✅ PROFESSOR CREATE TASK UI */}
        {role === "professor" && (
          <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={input} />
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" style={input} />
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={input} />
            <button onClick={addTask} style={btn}>Add Task</button>
          </>
        )}

        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>
          Logout
        </button>
      </div>

      <div style={main}>
        <h1>Tasks</h1>

        {tasks.map((task) => (
          <div key={task._id} style={taskCard}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {task.deadline && <p>{new Date(task.deadline).toDateString()}</p>}

            {role === "student" && (
              <>
                <input
                  placeholder="Message"
                  onChange={(e) =>
                    setMessages({ ...messages, [task._id]: e.target.value })
                  }
                  style={input}
                />

                <input
                  type="file"
                  onChange={(e) =>
                    setFiles({ ...files, [task._id]: e.target.files[0] })
                  }
                />

                <button onClick={() => submitTask(task._id)}>Submit</button>
              </>
            )}
          </div>
        ))}

        {role === "professor" && (
          <>
            <h2>Submissions</h2>
            {submissions.map((s, i) => (
              <div key={i} style={taskCard}>
                <p><b>Student:</b> {s.studentName}</p>
                <p><b>Message:</b> {s.message}</p>

                {/* ✅ FIXED FILE LINK (VERY IMPORTANT) */}
                {s.file && (
                  <a
                    href={`${BASE_URL}/uploads/${s.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📎 View File
                  </a>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* STYLES */
const container = { display: "flex", minHeight: "100vh", background: "#f3f4f6" };
const sidebar = { width: "250px", background: "#d8b4fe", padding: "20px" };
const main = { flex: 1, padding: "20px", background: "#fdf2f8" };
const taskCard = { background: "white", padding: "15px", margin: "10px 0", borderRadius: "12px" };
const center = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" };
const card = { background: "white", padding: "30px", borderRadius: "12px", width: "300px" };
const input = { width: "100%", padding: "8px", margin: "10px 0" };
const btn = { width: "100%", padding: "10px", background: "#d8b4fe", border: "none" };

export default App;