# Pomodoro Timer Data Analysis

This project includes a Pomodoro timer that utilizes the microcontroller, IMU, and other hardware to provide data to the LLM. 
The LLM will receive the data and provide feedback to the user. 

# Requirements 
- React
- Vite <br> <br> 

**To run this file locally: **

Run `git clone https://github.com/alexanderhu77/IDEA_Hacks_2025.git` to download to your local machine. 

Connect the Bluetooth to the hardware. 

Go to the directory `cd IDEA_Hacks_2025` 

Do `npm install` 

And then run it. `npm run dev` <br><br> 

Copy the link that popped up after the last command line and paste it into the browser to view it. 
This will run an AI chat on the local server, which is fed with the data from the hardware. 

At the same time, run the **esp_server.py** on the IDE. This will be the backend server that receives data from the hardware.  
Then, you can just enter the prompt to the chatbot on the browser. <br><br> 


If esp_server.py encounters an error, adjust line 8, `SERIAL_PORT = "COM11"`. <br><br> 

**For Windows PC** <br> 
In most cases, it is between COM11 and COM15. Test between COM1 and COM15 if it does not work. <br><br> 


**For Mac OS** <br> 
Run this command in Terminal to find your ESP32:
`ls /dev/cu.*`

It will show Bluetooth devices connected. Choose the right one and change the SERIAL_PORT to the correct value. 
<br><br><br> 

# Conclusion:
This project will run two terminal windows on the device: one in the IDE and another for the React web. 
The data from the microcontroller will be sent to the backend, and with the prompt, the AI can provide feedback and analysis. This product is to improve productivity and time management. 

