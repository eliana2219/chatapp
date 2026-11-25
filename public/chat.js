import { fetchsingleuser, fetchuser, sessionID, updateUser } from "./module.js";

if (!sessionID) {
    document.location.href = "index.html"
} else {
    console.log(sessionID);

}

let chatlistcontainer = document.querySelector(".chatlistcontainer")

async function displayusers(id) {
    const data = await fetchuser()

    const filtereddata = data.filter(user => user.id != sessionID)

    filtereddata.forEach(element => {
        chatlistcontainer.innerHTML += `
        <div class="chatlist" data-userid="${element.id}">
                    <img src="img/54b19ada-d53e-4ee9-8882-9dfed1bf1396.jpg" alt="">
                    <div>
                        <div class="chatlistusername">
                           ${element.email}
                        </div>
                        <div class="sidebardescription">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, ex.
                        </div>
                    </div>
                </div>
        `
    });
}

displayusers()

const socket = io("http://localhost:4000");

socket.on("connect", () => {
    console.log("connected successfully")
    console.log("socket id: ", socket.id)
})

socket.emit("online", { id: sessionID })

socket.on("isonline", async (data) => {
    let onlineusers = await fetchuser()
    onlineusers = onlineusers.filter(user => user.isonline != false)
    const mydata = await fetchsingleuser(data.id)

    let updateusers = await updateUser(data.id, true)
    let isonline = false
    for (const user in onlineusers) { if (onlineusers[user].id != sessionID) { isonline = true } }
    !(isonline) ? onlineusers.push(mydata) : console.log("not online");
    
    console.log(onlineusers, mydata)
})

let messageform = document.querySelector("#chatinput")

console.log(messageform);

function submitform() {
    let message = messageform.textinput.value
    socket.emit("sendmessage", { message, id: sessionID })
    messageform.textinput.value = ""
}
messageform.onsubmit = (e) => {
    e.preventDefault();
    submitform()
}

document.onkeydown = (e) => {
    if (e.key == "enter") {
        submitform()
    }

}

let chatbody = document.querySelector(".mainchatbody")
socket.on("recievemessage", (message) => {
    if (message.id != sessionID) {
        chatbody.innerHTML += `<div class="reciever">
                    <div class="msg">
                        ${message.message}
                    </div>
                </div>`
    } else {
        chatbody.innerHTML += `<div class="sender">
                    <div class="msg">
                        ${message.message}
                    </div>
                </div>`
    }

})
socket.on("disconnect", () => {
    console.log(`user: ${socket.id} disconnected`)
})