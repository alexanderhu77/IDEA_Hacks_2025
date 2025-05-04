import Markdown from 'react-markdown';

const ChatMessage = ({ chat }) => {
    return (
        <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
            {chat.role === "model"}
            <p className="message-text">
                <Markdown>
                    {chat.text}
                </Markdown>
            </p>
        </div>
    )
}

export default ChatMessage;
