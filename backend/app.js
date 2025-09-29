require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require("socket.io");
const { receiveMessage } = require('./services/chatService');

const app = express();
const server = require('http').createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  }
});

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/owners', require('./routes/ownerRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

const PORT = process.env.PORT || 3000;
server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  receiveMessage(socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
