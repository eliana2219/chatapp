const express = require("express")
const http = require("http")

const {Server} = require("socket.io")

const app = express()

const server = http.createServer(app);

const io = new Server(server)
app.use(express.static('public'))

app.get((req,res)=>{
    console.log(res)
})

io.on('connection',(socket)=>{
    console.log('user connected:', socket.id)

    socket.on('sendmessage',(data)=>{
        console.log(data);

        io.emit('recievemessage', data);
    })

    socket.on("disconnect",()=>{
        console.log('user disconnected:',socket.id);
        io.emit("isoffline",)
    })

    socket.on("online",(data)=>{
        io.emit("isonline",data)
    })
});

server.listen("4000",()=>{
    console.log("server connected on port 4000")
})