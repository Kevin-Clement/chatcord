const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
}); 

const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(express.json());

const userRoutes = require('./routes/user');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(helmet());
app.use(cookieParser()); 
app.use(cors(corsOptions));

app.use('/auth', userRoutes);

// 406 & 415 status code middleware
app.use((req, res, next) => {
  if(!req.accepts('json')) {
    return res.status(406).json({ code: 406, message: 'Not Acceptable' });

  }

  if(req.is('json') === false) {
    return res.status(415).json({ code: 415, message: 'Unsupported Media Type' });
  }

  next();
});


mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Successful connection to MongoDB!'))
.catch(() => console.log('Failed to connect to MongoDB!'));

const PORT = process.env.PORT || 8000;
const Message = require('./models/Message');
const Room = require('./models/Room'); 
const {
  addUser, 
  removeUser, 
  getUser
} = require('./utils/users');


io.on('connection', (socket) => {
  console.log(socket.id);

  Room.find().then(result => {
      socket.emit('output-rooms', result)
  })

  socket.on('create-room', name => {
      const room = new Room({ name });
      room.save().then(result => {
          io.emit('room-created', result)
      })
  })

  socket.on('join', ({ name, room_id, user_id }) => {
      const { error, user } = addUser({
          socket_id: socket.id,
          name,
          room_id,
          user_id
      })

      socket.join(room_id);

      if (error) {
          console.log('join error', error)
      } else {
          console.log('join user', user)
      }
  })

  socket.on('sendMessage', (message, name, user_id, room_id, callback) => {
      const user = getUser(socket.id);
      console.log(user);
      const msgToStore = {
          name,
          room_id,
          user_id,
          text: message
      }
      console.log('message', msgToStore)
      const msg = new Message(msgToStore);

      msg.save().then(result => {
          io.to(room_id).emit('message', result);
          callback()
      })

  })

  socket.on('get-messages-history', room_id => {
      Message.find({ room_id }).then(result => {
          socket.emit('output-messages', result)
      })
  })

  socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      console.log(user);
  })
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));