# sensor-rest-api
Développement d’une API REST complète pour l’enregistrement, la consultation et le filtrage de données de capteurs dans MongoDB

```
led-supervision/
│
├── node_server/                         # Serveur Node.js (API REST + interface web)
│   ├── config/                          # Configuration de la BDD et variables d'environnement
│   │   ├── db.js                        # Connexion à MongoDB via Mongoose
│   │   └── .env                         # Variables (URI MongoDB, port, etc.)
│   │
│   ├── controllers/                     # Logique des routes (séparé des routes)
│   │   ├── userController.js
│   │   ├── sensorController.js
│   │   └── measurementController.js
│   │
│   ├── models/                          # Schémas Mongoose
│   │   ├── User.js
│   │   ├── Sensor.js
│   │   └── Measurement.js
│   │
│   ├── routes/                          # Définition des routes de l’API REST
│   │   ├── userRoutes.js
│   │   ├── sensorRoutes.js
│   │   └── measurementRoutes.js
│   │
│   ├── middlewares/                     # Middlewares personnalisés
│   │   ├── validationMiddleware.js
│   │   └── loggerMiddleware.js
│   │
│   ├── app.js                           # Création de l’app Express
│   └── server.js                        # Démarrage du serveur Express (écoute du port)
│
├── frontend/                            # Frontend
│ ├── public/                            # Fichiers statiques accessibles (CSS, JS front-end)
│   ├── js/                              # Fichiers JavaScript front-end
│   ├── index.html                       # Page principale du frontend avec connexion
│   ├── admin.html                       # Page d'administration
│   ├── dashboard.html                   # Tableau de bord avec affichage des capteurs et mesures
│   ├── inscription.html                 # Page d'inscription
│   ├── graphique_humidite.html          # Page de graphique de l'humidité avec Chart.js
│   ├── styles2.css                      # Styles CSS associés
│   └── styles.css                       # Styles CSS associés
|
├── client_rpi/                          # Client embarqué (Raspberry Pi)
│   ├── sensors/
│   │   ├── pir_sensor.py                # Capteur PIR
│   │   ├── button_humidity_sensor.py    # Bouton simulant des taux d'humidité
│   │   └── temp_sensor.py               # Capteur de température
│   ├── gpio/
│   │   ├── init.py                      # Initialisation des pins GPIO
│   │   └── led.py                       # LEDs 
|   |
│   ├── client.py                        # Envoi POST 
│   ├── main.py                          # Point d'entrée du client
│   ├── sensor_mapper.py                 # Mapping des Id des capteurs
│   └── config.yaml                      # Adresse serveur, seuils, pins gpio
│
│
├── README.md                            # Explication du projet
├── package.json                         # Dépendances Node.js
├── package-lock.json                    # Version des dépendances Node.js
└── .gitignore                           # Ignorer node_modules, environnement virtuel, etc.
```

## 📦 Dépendances

Ce projet utilise Node.js pour exécuter un serveur Express (backend) et un serveur statique pour le frontend.

### Dépendances principales (`dependencies`)
- **express** : Framework web pour créer l’API REST.
- **mongoose** : ODM pour MongoDB.
- **cors** : Middleware pour gérer les politiques CORS.
- **dotenv** : Pour charger les variables d’environnement à partir d’un fichier `.env`.
- **helmet** : Pour sécuriser les en-têtes HTTP.
- **ejs** : Moteur de template (si utilisé).

### Dépendances de développement (`devDependencies`)
- **http-server** : Pour servir le frontend statique dans `frontend/public`.

## ⚙️ Installation et lancement

1. Clonez le dépôt.
2. Installez les dépendances avec `npm install`.
4. Lancez le serveur backend avec `npm run start:backend`.
5. Lancez le serveur frontend avec `npm run start:frontend`.
