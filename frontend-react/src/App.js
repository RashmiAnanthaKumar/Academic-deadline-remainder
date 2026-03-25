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
    } catch {
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
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} style={input}/>
        )}

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={input}/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={input}/>

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

  const [editId, setEditId] = useState(null);

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

  // ADD TASK
  const addTask = async () => {
    await fetch(API_TASK, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ title, description, deadline }),
    });

    resetForm();
    getTasks();
  };

  // UPDATE TASK
  const updateTask = async () => {
    await fetch(`${API_TASK}/${editId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ title, description, deadline }),
    });

    resetForm();
    getTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await fetch(`${API_TASK}/${id}`, {
      method: "DELETE"
    });
    getTasks();
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline?.substring(0,10));
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setDeadline("");
  };

  return (
    <div style={container}>
      <div style={sidebar}>
        <h2>📚 Dashboard</h2>
        <p>{role}</p>

        {role === "professor" && (
          <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={input}/>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" style={input}/>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={input}/>

            {editId ? (
              <>
                <button onClick={updateTask} style={btn}>Update Task</button>
                <button onClick={resetForm}>Cancel</button>
              </>
            ) : (
              <button onClick={addTask} style={btn}>Add Task</button>
            )}
          </>
        )}

        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>Logout</button>
      </div>

      <div style={main}>
        <h1>Tasks</h1>

        {tasks.map((task) => (
          <div key={task._id} style={taskCard}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>{new Date(task.deadline).toDateString()}</p>

            {role === "professor" && (
              <>
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* styles same as before */
const container = { display: "flex", minHeight: "100vh" };
const sidebar = { width: "250px", background: "#d8b4fe", padding: "20px" };
const main = { flex: 1, padding: "20px" };
const taskCard = { background: "white", padding: "15px", margin: "10px 0" };
const center = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" };
const card = { background: "white", padding: "30px", width: "300px" };
const input = { width: "100%", padding: "8px", margin: "10px 0" };
const btn = { width: "100%", padding: "10px", background: "#d8b4fe", border: "none" };

export default App;