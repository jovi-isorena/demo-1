const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidv4} = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',(req, res)=>{
    // res.redirect(`/${uuidv4()}`)
    res.render('index');
})

app.get('/newroom', (req, res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/joinroom', (req, res)=>{
    // console.log(req.params.roomid);
    res.redirect(`/${req.query.roomid}`);
})

app.get('/:room', (req, res)=>{
    res.render('room', {roomid: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomid, userid) => {
        socket.join(roomid);
        socket.to(roomid).emit('user-connected', userid);
        
        socket.on('disconnect', ()=>{
            socket.to(roomid).emit('user-disconnected', userid)
        })
    })
})

server.listen(3000);