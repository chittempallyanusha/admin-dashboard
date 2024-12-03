const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Initialize database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, role TEXT, status TEXT)");
  db.run("CREATE TABLE roles (id INTEGER PRIMARY KEY, name TEXT, permissions TEXT)");
});

// Mock Data
db.serialize(() => {
  db.run("INSERT INTO users (name, email, role, status) VALUES ('Admin User', 'admin@example.com', 'Admin', 'Active')");
  db.run("INSERT INTO roles (name, permissions) VALUES ('Admin', 'Read,Write,Delete')");
});

// CRUD Endpoints
app.get('/users', (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    res.json(rows);
  });
});

app.post('/users', (req, res) => {
  const { name, email, role, status } = req.body;
  db.run("INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)", [name, email, role, status]);
  res.status(201).send("User added");
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;
  db.run("UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?", [name, email, role, status, id]);
  res.send("User updated");
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id = ?", [id]);
  res.send("User deleted");
});

app.get('/roles', (req, res) => {
  db.all("SELECT * FROM roles", (err, rows) => {
    res.json(rows);
  });
});

app.post('/roles', (req, res) => {
  const { name, permissions } = req.body;
  db.run("INSERT INTO roles (name, permissions) VALUES (?, ?)", [name, permissions]);
  res.status(201).send("Role added");
});

app.put('/roles/:id', (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  db.run("UPDATE roles SET name = ?, permissions = ? WHERE id = ?", [name, permissions, id]);
  res.send("Role updated");
});

app.delete('/roles/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM roles WHERE id = ?", [id]);
  res.send("Role deleted");
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
