# API-homework
software engineering class cs 308

# Weather API

The Weather API allows you to retrieve current weather conditions, weather forecasts, and historical weather data for various locations.

### Prerequisites
- Node.js 
- NPM 
- API key for the OpenWeatherMap API
- Express
- Winston

### Installation
1. Clone the repository: `git clone https://github.com/Kadiiiix/API-homework.git`
2. Navigate to the project directory: `cd API-homework`
3. Install the dependencies: `npm install`

### Configuration
1. Open the `.env` file in the project root.
2. Set the value of `API_KEY` to your OpenWeatherMap API key.

### Starting the Server
node .

### Make API requests to the available endpoints 
1. current weather: 
```http://localhost:3000/weather/current?location= xx ```(insert location at xx)
2. weather forecast
```http://localhost:3000/weather/forecast?location= xx``` (insert location at xx)
3. weather history:
```http://localhost:3000/weather/history?location= xx &startDate= yyyy-mm-dd &endDate=yyyy-mm-dd```  (insert location at xx, start and end dates in format yyyy-mm-dd )

### Postman collection

https://api.postman.com/collections/27429620-ac91bf16-f702-4010-84ad-659239f2121d?access_key=PMAT-01H0GYMCE14865AP2DKXV69G01

### Logging
Winston library is used, logs written in app.log

### Cache
Data saved in cache can be re-used within 2 minutes without requesting it from the API


