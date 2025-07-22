# 🌱 api-rest-sensors-ws
A full-featured Express server for managing IoT sensors with a REST API, WebSocket support, JWT authentication, and an Angular user interface. An embedded Raspberry Pi client is used to send physical or simulated sensor data. The project follows security best practices and the MVC architecture.

## 📁 Project Structure

```
API-REST-SENSORS-WS/
│
├── node_server/                           # Node.js server (REST API + web interface)
│ ├── config/                              # Database and environment config
│ │ └── db.js                              # MongoDB connection via Mongoose
│ │
│ ├── controllers/                         # Route business logic
│ │ ├── userController.js
│ │ ├── sensorController.js
│ │ ├── measurementController.js
│ │ └── commandController.js
│ │
│ ├── models/                              # Mongoose schemas
│ │ ├── User.js
│ │ ├── Sensor.js
│ │ └── Measurement.js
│ │
│ ├── routes/                              # REST API route definitions
│ │ ├── userRoutes.js
│ │ ├── sensorRoutes.js
│ │ ├── measurementRoutes.js
│ │ └── commandRoutes.js
│ │
│ ├── middlewares/                         # Custom middlewares
│ │ ├── validationMiddleware.js            # Request data validation
│ │ ├── loggerMiddleware.js                # HTTP request logging
│ │ ├── authMiddleware.js                  # JWT authentication
│ │ └── adminMiddleware.js                 # Admin access control
│ │
│ ├── app.js                               # Express app setup
│ ├── server.js                            # Starts the Express server
│ └── wsServer.js                          # WebSocket server
│
├── frontend/                              # Angular frontend folder
│ ├── frontend_angular/                    # Angular project
│ │ ├── src/
│ │ │ ├── app/
│ │ │ │ ├── accueil/                       # Main landing page
│ │ │ │ ├── accueil2/                      # Alternate landing page
│ │ │ │ ├── administateur/                 # Full admin interface
│ │ │ │ ├── background-dashboard/          # Dashboard background visuals
│ │ │ │ ├── capteur/                       # Shared sensor component
│ │ │ │ ├── compte/                        # "My account" page
│ │ │ │ ├── dashboard/                     # User view with sensor widgets
│ │ │ │ ├── formulaire-connexion/          # User login form
│ │ │ │ ├── formulaire-inscription/        # User signup form
│ │ │ │ ├── header/                        # Top navigation bar
│ │ │ │ ├── historique-humidite/           # Humidity history page
│ │ │ │ ├── historique-temperature/        # Temperature history page
│ │ │ │ ├── humidimetre/                   # Humidity sensor widget
│ │ │ │ ├── interceptor/                   # HTTP auth interceptor
│ │ │ │ ├── lampe/                         # LED component
│ │ │ │ ├── serre/                         # Greenhouse name and state
│ │ │ │ ├── tab/                           # Dynamic tab interface
│ │ │ │ ├── temperature/                   # Temperature sensor widget
│ │ │ │ ├── app.component.ts|html|css      # Main app component
│ │ │ │ ├── app.routes.ts                  # Angular routing
│ │ │ │ ├── app.config.ts                  # Centralized config
│ │ │ │ ├── measurement.service.ts         # Measurement data service
│ │ │ │ ├── sensor.service.ts              # Sensor data service
│ │ │ │ └── user.service.ts                # User service
│ │ ├── assets/                            # Images, icons, etc.
│ │ ├── index.html                         # Angular root page
│ │ └── styles.css                         # Global stylesheet
│ │ ├── angular.json                       # Angular CLI config
│ │ ├── package.json                       # Frontend dependencies
│ │ └── tsconfig.json                      # TypeScript config
|
├── client_rpi/                            # Embedded client (Raspberry Pi)
│ ├── sensors/
│ │ ├── button_humidity_sensor.py          # Button simulating humidity values
│ │ └── temp_sensor.py                     # Temperature sensor
│ ├── gpio/
│ │ ├── init.py                            # GPIO pin setup
│ │ └── led.py                             # LEDs
| |
│ ├── client_ws.py                         # WebSocket client to send/receive data
│ ├── main.py                              # Main entry point for client
│ └── config.yaml                          # Server address, thresholds, pins, sensorIds, DeviceId
│
│
├── README.md                              # Project documentation
├── .env                                   # Env variables (Mongo URI, ports, JWT secret, etc.)
├── package.json                           # Node.js dependencies
├── package-lock.json                      # Node.js dependency versions
└── .gitignore                             # Ignore node_modules, virtual env, etc.
```


## 📦 Dependencies

This project uses Node.js to run an Express backend server and Angular CLI to run the frontend development server.

### Main dependencies (`dependencies`)
- **express**: Web framework for building the REST API  
- **mongoose**: ODM for MongoDB  
- **cors**: Middleware to manage CORS policies  
- **dotenv**: Loads environment variables from a `.env` file  
- **helmet**: Secures HTTP headers  
- **ejs**: Template engine  
- **jsonwebtoken**: Manages JWT tokens  
- **bcrypt**: Password hashing  
- **ws**: WebSocket support for the server  
- **socket.io-client**: WebSocket client for frontend communication

### Python dependencies (`client_rpi`)
- **adafruit-circuitpython-dht**: For DHT11 sensor reading  
- **pyyaml**: Reads configuration from `config.yaml`  
- **websocket-client**: Communicates with the WebSocket server  
- **rpi-lgpio**: GPIO pin control on Raspberry Pi

## ⚙️ Installation and Launch

1. Clone the repository  
2. Install backend dependencies from the project root with `npm install`  
3. Start the backend server with `npm run start:backend`  
4. Install frontend dependencies with `npm install` in `frontend/frontend_angular`  
   *Make sure Angular CLI is installed globally (`npm install -g @angular/cli`) if not already*  
5. Start the frontend server from `frontend/frontend_angular` with `npm start`  
6. Run the Raspberry Pi client with `python main.py` inside the `client_rpi` directory

