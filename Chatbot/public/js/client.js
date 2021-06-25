const socket = io();

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");
let send = document.getElementById('send');
appendMessage("I am Siya, Happy to help", "incoming");
textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        sendMessage(e.target.value)
    }
});

send.addEventListener('click', () => {
    sendMessage(textarea.value)
})

function sendMessage(message) {
    let msg = message.trim();

    // Append

    appendMessage(msg, "outgoing");

    textarea.value = "";
    scrollToBotton();

    // Send to server
    socket.emit("message", msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement("div")
    let className = type
    mainDiv.classList.add(className, "message");

    let markup = `  
        <p>${msg}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

socket.on("message", (msg) => {
    appendMessage(msg, "incoming");
    scrollToBotton();
})

function scrollToBotton() {
    messageArea.scrollTop = messageArea.scrollHeight;
}