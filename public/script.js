const socket = io('http://localhost:3000')



socket.on('user-connec',(uname)=>{
    remsg(`${uname} joined`)
})



socket.on('chat-message', (data) => {
    remsg(`${data.name}: ${data.msg}`)  
})
socket.on('user-connected', name => {
    remsg(`${name} connected`)
})
socket.on('user-disconnected', name => {
    remsg(`${name} disconnected`)
})


function sendMessage() {
    var messageInput = document.getElementById('msginput');
    var messageOutput = document.getElementById('msgs');

    if (messageInput.value.trim() !== '') {
        var message = document.createElement('div');
        message.className = 'message sent-message';
        message.textContent = `you: ${messageInput.value}`;
        messageOutput.appendChild(message);

        const msg = messageInput.value;
        socket.emit('send-chat-message',msg);

        // Clear the input field after sending a message
        messageInput.value = '';

        // Scroll to the bottom of the chat output
        messageOutput.scrollTop = messageOutput.scrollHeight;
    }
}


var send = document.getElementById('send');

msginput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        send.click();
    }
});



function remsg(msg){
    var messageOutput = document.getElementById('msgs');
    const remsg = document.createElement('div')
    remsg.className = 'message get-message';
    remsg.innerText = msg
    messageOutput.append(remsg)
    messageOutput.scrollTop = messageOutput.scrollHeight;
}

