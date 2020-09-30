import Chat from './Chat'

const socket = io();
const chat = new Chat()

function scrolling(){
    let chat = document.querySelector('.chat__body')

    chat.scrollTop = chat.scrollHeight
}

document.body.append(chat.view)

chat.addEventListener("send", (message) => {
    message = message.trim()

    if (!message) {
        return
    }

    if (message.startsWith("/setname ")) {
        const split = message.split(" ")
        const name = split[1].slice(0, 10)
        
        socket.emit("setname", name)
        chat.clearInput()
        return
    }
    
    socket.emit("message", message);
    chat.clearInput()
})

socket.on("message", data => {
    chat.addMessage(data)
    scrolling()
})
