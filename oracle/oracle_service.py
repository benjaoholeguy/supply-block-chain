from flask import Flask, request, jsonify, make_response
import requests
import datetime


app = Flask(__name__)

# Replace with your OpenWeatherMap API key
API_KEY = '795eb1c0'

# Define the OpenWeatherMap API endpoint
WEATHER_API_URL = 'https://my.api.mockaroo.com/weather_location.json'

@app.route('/fetchWeather', methods=['GET'])
def fetch_weather():
    try:
        # latitude = float(request.args.get('latitude'))
        # longitude = float(request.args.get('longitude'))
        latitude = 16.7136708
        longitude = 103.3125299

        # Log the request and timestamp
        timestamp = datetime.datetime.now().isoformat()
        log_request(latitude, longitude, timestamp)
        # log_request(id, timestamp)

        # Construct the API URL
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'key': API_KEY,
            # 'units': 'C',  # Use Celsius for temperature
        }

        # Send a GET request to OpenWeatherMap API
        response = requests.get(WEATHER_API_URL, params=params)

        # return response.text

        if response.status_code == 200:
            # Parse the JSON response
            weather_data = response.json()

            # Extract relevant weather information
            temperature = weather_data['weather']['temperature']
            humidity = weather_data['weather']['humidity']
            weather_description = weather_data['weather']['description']

            # Create a weather response dictionary
            weather_response = {
                'temperature': temperature,
                'humidity': humidity,
                'weather_description': weather_description,
            }

            # Log the response and timestamp
            log_response(weather_data["coordinates"]["latitude"], weather_data["coordinates"]["longitude"], timestamp)

            # Create a response with additional headers for transparency
            response_headers = {
                'Data-Source': 'MockMackarooData',
                'Timestamp': timestamp,
            }

            return make_response(jsonify(weather_response), 200, response_headers)
            # return make_response(jsonify(weather_data), 200, response_headers)
        else:
            return 'Error fetching weather data', 500

    except Exception as e:
        return f'Error: {str(e)}', 400

def log_request(latitude, longitude, timestamp):
    # Implement request logging logic here
    print(f'Request - Latitude: {latitude}, Longitude: {longitude}, Timestamp: {timestamp}')

def log_response(latitude, longitude, timestamp):
    # Implement response logging logic here
    print(f'Response - Latitude: {latitude}, Longitude: {longitude}, Timestamp: {timestamp}')


# Sample car data (replace with your data source)
car_data = {
    "VIN123": {
        "vin": "VIN123",
        "make": "Toyota",
        "model": "Camry",
        "year": 2022,
    },
    "VIN456": {
        "vin": "VIN456",
        "make": "Honda",
        "model": "Accord",
        "year": 2021,
    },
}

@app.route('/getCarInfo', methods=['GET'])
def get_car_info():
    try:
        vin = request.args.get('vin')
        
        if vin is None:
            return jsonify({"error": "VIN is required"}), 400
        
        if vin in car_data:
            car_info = car_data[vin]
            return jsonify(car_info)
        else:
            return jsonify({"error": "Car not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
