from flask import Flask, jsonify
import serial
import threading
import time
from flask_cors import CORS  
app = Flask(__name__)

SERIAL_PORT = "COM11"
BAUDRATE = 115200
READ_TIMEOUT = 5

app = Flask(__name__)
CORS(app)

# Use a list to store the recent ESP32 lines
esp32_log = []
log_lock = threading.Lock()
ser = None

def read_serial_loop():
    global ser
    buffer = []

    while True:
        try:
            line = ser.readline().decode("utf-8").strip()
            if line:
                print(f"Received from ESP32: {line}")
                with log_lock:
                    esp32_log.append(line)
                    if len(esp32_log) > 20:  # Keep last 20 lines max
                        esp32_log.pop(0)
        except Exception as e:
            print(f"[Serial Read Error] {e}")

@app.route("/esp32-data", methods=["GET"])
def get_esp32_data():
    with log_lock:
        return jsonify({"data": "\n".join(esp32_log)})

if __name__ == "__main__":
    try:
        ser = serial.Serial(SERIAL_PORT, baudrate=BAUDRATE, timeout=READ_TIMEOUT)
        time.sleep(2)
        print(f"Connected to {SERIAL_PORT} at {BAUDRATE} baud.")
    except Exception as e:
        print(f"[FATAL] Could not open serial port {SERIAL_PORT}: {e}")
        exit(1)

    thread = threading.Thread(target=read_serial_loop, daemon=True)
    thread.start()

    app.run(debug=True, use_reloader=False)
