const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./views/todoRoutes');

// Load .env 
dotenv.config(); // Automatically looks for .env in the current directory

// Debug: Log environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS for frontend origins
app.use(cors({
    origin: [
      'http://localhost:5173',
      'https://probable-engine-v6rgp5v4r99hr49-5173.app.github.dev',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

app.get('/', (req, res) => {
  res.json("Abinesh's TODO Website");
});

app.use('/api/todos', todoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});