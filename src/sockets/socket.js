const socketIO = require('socket.io');

const setupSocket = (server) => {
    const io = socketIO(server);

    let count = 0;
    io.on('connection', (socket)=>{
        console.log("a user connected...");

        count++;
        socket.emit('broadcast', {message: "hey, welcome!!!"});
        socket.broadcast.emit('broadcast', {message: `${count} users connected`});

        socket.on('disconnet', ()=>{
            console.log("a user disconnected...");
            count--;
            io.sockets.emit('broadcast', ()=> {message: `${count} user's connected`});
        });
    });
}

module.exports = setupSocket;