const users = []; // simple temporary storage

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ name, email, password, role });

  res.json({ message: "Registered successfully" });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: "dummy-token",
    role: user.role,
    name: user.name
  });
};