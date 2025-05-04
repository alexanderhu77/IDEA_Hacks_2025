import serial
import time
import os


def find_esp32_port():
    """
    Finds the serial port associated with the ESP32 on macOS.
    It looks for a port that contains "ESP32" or "Bluetooth-Incoming-Port".

    Returns:
        str: The serial port name (e.g., '/dev/cu.ESP32-Serial-XXXXXX-SPPDev'), or None if not found.
    """
    dev_files = os.listdir("/dev")
    for dev_file in dev_files:
        if "ESP32" in dev_file or "Bluetooth-Incoming-Port" in dev_file:
            full_path = os.path.join("/dev", dev_file)
            print(f"Found ESP32 port: {full_path}")
            return full_path
    print(
        "ESP32 serial port not found.  Make sure the ESP32 is paired and advertising."
    )
    return None


def connect_to_esp32(port, baudrate=115200, timeout=5):
    """
    Connects to the ESP32 serial port.

    Args:
        port (str): The serial port name.
        baudrate (int, optional): The baud rate. Defaults to 115200.
        timeout (int, optional): Timeout for reading. Defaults to 5 seconds.

    Returns:
        serial.Serial: The serial port object, or None on error.
    """
    try:
        ser = serial.Serial(port, baudrate=baudrate, timeout=timeout)
        print(f"Connected to ESP32 at {port} with baud rate {baudrate}")
        return ser
    except serial.SerialException as e:
        print(f"Error connecting to ESP32: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


def read_from_esp32(ser):
    """
    Reads data from the ESP32 serial port.

    Args:
        ser (serial.Serial): The serial port object.

    Returns:
        str: The received data, or None on error or timeout.
    """
    try:
        data = ser.readline().decode("utf-8").strip()
        if data:
            print(f"Received from ESP32: {data}")
            return data
        else:
            return None
    except serial.SerialTimeoutException:
        print("Timeout reading from ESP32")
        return None
    except serial.SerialException as e:
        print(f"Error reading from ESP32: {e}")
        return None
    except UnicodeDecodeError as e:
        print(f"Error decoding data: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


def main():
    """
    Main function to connect to the ESP32 and read data.
    """
    # esp32_port = find_esp32_port()
    esp32_port = "COM11"
    if not esp32_port:
        print("ESP32 port not found.  Exiting.")
        return

    ser = connect_to_esp32(esp32_port)
    if not ser:
        print("Failed to connect to ESP32.  Exiting.")
        return

    try:
        while True:
            data = read_from_esp32(ser)
            ser.flush()
            if data:
                # Process the data as needed
                pass
       #     time.sleep(0.1)

    except KeyboardInterrupt:
        print("Program interrupted by user.")
    finally:
        if ser:
            ser.close()
            print("Disconnected from ESP32.")


if __name__ == "__main__":
    main()
