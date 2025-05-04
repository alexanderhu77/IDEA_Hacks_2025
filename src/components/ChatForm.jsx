import { useRef } from 'react';

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {

    const inputRef = useRef(); 

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();

        if (!userMessage) return;
        inputRef.current.value = '';

        // update history with the user's message
        setChatHistory((history) => [...history, { role: 'user', text: userMessage }]);

        // create the time out for the response
        setTimeout(() => {
            setChatHistory((history) => [...history, { role: 'model', text: 'Lemme think' }])
            
            generateBotResponse([...chatHistory,  { role: 'user', text: userMessage }]); 
    
        }, 500);
    
        };

    return (
        <form className="chat-form" onSubmit={handleFormSubmit}>
            <input
            ref={inputRef}
            type="text"
            className="message-input"
            required
            placeholder="Message here..."
            />
            <button className="material-symbols-rounded">Send</button>
        </form>
    );
}; 

export default ChatForm;