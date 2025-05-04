import ChatForm from "./components/ChatForm";
import { useState } from 'react';
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const generateBotResponse = async (history) => {

    // helper function to update the chat history with the response from LLM
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text != "Lemme think"), { role: 'model', text }]);
    }

    // format chat history for the API call
    history = history.map(({role, text}) => ({role, parts: [{text}]}))

    const requestOptions = {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({
        contents: history,
      })
    }

    // make the API call for the response from LLM 
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      // clean and update the chat history with LLM's response
      const llmResponse = data.candidates[0].content.parts[0].text.replace(/^\s+|\s+$/g, "").trim();
      //  update the history with the response from LLM
      updateHistory(llmResponse);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return(
    <div className = "chat-body">
      <div className = "chat-history"> 
        {chatHistory.map((chat, index) => (
          <ChatMessage key ={index} chat={chat}/> 
        ))
        }
      </div>
      <div className= "chat-bot">
        <ChatForm chatHistory = {chatHistory} setChatHistory = {setChatHistory} generateBotResponse = {generateBotResponse}/>
      </div>
    </div>
  )
}; 
export default App
