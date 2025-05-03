const ChatMessage = ({ chat }) => {
    return (
        <div className = {`message ${ChatMessage.role === "model" ? 'bot' : 'user'}-message`}>
            {chat.role === "model"}
            <p className="message-text">{chat.text} </p>
        </div>
    )
}

export default ChatMessage;