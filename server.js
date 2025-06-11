const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
// const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000

console.log('Starting server...');
console.log('Current directory:', __dirname);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    throw err;
  }
});
// my-server/server.js

// === File Path to JSON DB ===
const usersFile = path.join(__dirname, 'users.json');
console.log('Users file path:', usersFile);

// Initialize users.json if it doesn't exist
if (!fs.existsSync(usersFile)) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
    console.log('✅ Created users.json file');
  } catch (error) {
    console.error('❌ Error creating users.json:', error);
  }
} else {
  console.log('✅ users.json file exists');
}

// Helper function to read users
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    const users = JSON.parse(data);
    console.log(`📖 Read ${users.length} users from file`);
    return users;
  } catch (error) {
    console.error('❌ Error reading users file:', error);
    return [];
  }
};

// Helper function to write users
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    console.log(`💾 Wrote ${users.length} users to file`);
    return true;
  } catch (error) {
    console.error('❌ Error writing users file:', error);
    return false;
  }
};

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('📡 Test endpoint hit');
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// ======= API: Signup =======
app.post('/api/signup', (req, res) => {
  console.log('📝 Signup request received');
  console.log('Request body:', req.body);
  
  const { username, password, email, firstName, image } = req.body;

  // Validate required fields
  if (!username || !password || !email || !firstName) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ 
      message: 'Missing required fields: username, password, email, firstName',
      received: { username: !!username, password: !!password, email: !!email, firstName: !!firstName }
    });
  }

  // Load existing users
  const users = readUsers();
  console.log(`Current users count: ${users.length}`);

  // Check if user exists (by username or email)
  const userExists = users.find((u) => u.username === username || u.email === email);
  if (userExists) {
    const reason = userExists.username === username ? 'Username already exists' : 'Email already exists';
    console.log(`❌ User exists: ${reason}`);
    return res.status(400).json({ message: reason });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    password, // Note: In production, hash this password
    email,
    firstName,
    image: image || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  
  // Write users back to file
  if (writeUsers(users)) {
    console.log('✅ New user created:', { id: newUser.id, username: newUser.username, email: newUser.email });
    res.status(201).json({ 
      message: 'User registered successfully', 
      firstName: newUser.firstName,
      image: newUser.image,
      id: newUser.id
    });
  } else {
    console.log('❌ Failed to save user');
    res.status(500).json({ message: 'Error saving user data' });
  }
});

// ======= API: Login =======
app.post('/api/login', (req, res) => {
  console.log('🔐 Login request received');
  console.log('Request body:', req.body);
  
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    console.log('❌ Missing credentials');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = readUsers();
  console.log(`Checking against ${users.length} users`);

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    console.log('❌ Login failed for username:', username);
    // Log all usernames for debugging (remove in production)
    console.log('Available usernames:', users.map(u => u.username));
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  console.log('✅ Login successful for user:', user.username);
  
  // Return user data
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    image: user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  });
});

// ======= API: Get all users (for debugging) =======
app.get('/api/users', (req, res) => {
  console.log('👥 Get users request');
  const users = readUsers();
  // Don't send passwords in response
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

// ======= API: Clear all users (for debugging) =======
app.delete('/api/users', (req, res) => {
  console.log('🗑️ Clear users request');
  if (writeUsers([])) {
    res.json({ message: 'All users cleared' });
  } else {
    res.status(500).json({ message: 'Error clearing users' });
  }
});

// ========= ESP32 Sensor Handling =========
let sensorData = {};
app.post('/data', (req, res) => {
  sensorData = req.body;
  console.log("📊 Received sensor data:", sensorData);
  res.json({ status: "success", received: sensorData });
});

app.get('/data', (req, res) => {
  res.json(sensorData);
});

// ========= Serve Frontend (This should be LAST) =========
// app.get('*', (req, res) => {
//   console.log('🌐 Serving frontend for:', req.path);
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Users file location: ${usersFile}`);
  console.log(`📂 Static files served from: ${path.join(__dirname, 'public')}`);
  console.log(`🔍 Test the server: http://localhost:${PORT}/api/test`);
});