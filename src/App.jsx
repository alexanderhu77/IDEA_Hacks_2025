import ChatForm from "./components/ChatForm";
import { useState } from 'react';
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  // helper function to update the chat history with the response from LLM
  const updateHistory = (text) => {
    setChatHistory(prev => [...prev.filter(msg => msg.text !== "Lemme think"), { role: 'model', text }]);
  }

  // Function to fetch ESP32 data
  const fetchESP32Data = async () => {
    try {
      console.log("Fetching ESP32 data...");
      const response = await fetch("http://localhost:5000/esp32-data");
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const { data } = await response.json();
      console.log("ESP32 Data received:", data);
      return data;
    } catch (err) {
      console.error("Failed to fetch ESP32 data:", err);
      return "[No ESP32 data yet]";
    }
  };
  

  const generateBotResponse = async (history) => {
    // Format chat history for the API call
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    // Fetch ESP32 data
    const espData = await fetchESP32Data();
    
    // Combine ESP32 data with the user's last message in the history
    const userMessage = history[history.length - 1]?.parts[0].text || "[No user message]";
    const combinedMessage = `Respond concisely and include only actionable steps to better study habits. Make some references to the data in a human way to actionable steps. Do not use the word ESP32, but you may use references to how much time the user spending doing a certain task like studying. You must suggest relations to the data that are suboptimal.\n\nSensor Info:\n${espData}\n\nUser Question:\n${userMessage}`;

    // Add the combined message to the history
    const updatedHistory = [...history, { role: 'user', parts: [{ text: combinedMessage }] }];
    
    // Prepare the request options
    const requestOptions = {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: updatedHistory,
      }),
    };

    // Make the API call for the response from LLM
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      // Clean and update the chat history with the LLM's response
      const llmResponse = data.candidates[0].content.parts[0].text.replace(/^\s+|\s+$/g, "").trim();
      
      // Update the history with the response from LLM
      updateHistory(llmResponse);
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="chat-body">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>
      <div className="chat-bot">
        <ChatForm 
          chatHistory={chatHistory} 
          setChatHistory={setChatHistory} 
          generateBotResponse={generateBotResponse} 
        />
      </div>
    </div>
  );
};

export default App;
