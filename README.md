# 🌱 api-rest-sensors-ws
Serveur Express complet pour la gestion de capteurs IoT avec API REST, WebSocket, authentification JWT et interface utilisateur Angular. Un client embarqué Raspberry Pi permet d’envoyer des mesures physiques ou simulées. Le projet est conçu pour respecter les bonnes pratiques de sécurité et l'architecture MVC.

## 📁 Structure du projet

```
API-REST-SENSORS-WS/
│
├── node_server/                         # Serveur Node.js (API REST + interface web)
│   ├── config/                          # Configuration de la BDD et variables d'environnement
│   │   └── db.js                        # Connexion à MongoDB via Mongoose
│   │
│   ├── controllers/                     # Logique métier des routes 
│   │   ├── userController.js            
│   │   ├── sensorController.js          
│   │   ├── measurementController.js     
│   │   └── commandController.js         
│   │
│   ├── models/                          # Schémas Mongoose
│   │   ├── User.js
│   │   ├── Sensor.js
│   │   └── Measurement.js
│   │
│   ├── routes/                          # Définition des routes de l’API REST
│   │   ├── userRoutes.js
│   │   ├── sensorRoutes.js
│   │   ├── measurementRoutes.js
│   │   └── commandRoutes.js
│   │
│   ├── middlewares/                     # Middlewares personnalisés
│   │   ├── validationMiddleware.js      # Validation des données
│   │   ├── loggerMiddleware.js          # Logging des requêtes HTTP
│   │   ├── authMiddleware.js            # Authentification JWT
│   │   └── adminMiddleware.js           # Vérification des droits d'administration
│   │
│   ├── app.js                           # Création de l’app Express
│   ├── server.js                        # Démarrage du serveur Express (écoute du port)
│   └── wsServer.js                      # WebSocket Server
│
├── frontend/                           # Répertoire du frontend Angular
│   ├── frontend_angular/               # Projet Angular
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── accueil/                    # Page d'accueil principale
│   │   │   │   ├── accueil2/                   # Variante de page d’accueil
│   │   │   │   ├── administateur/             # Interface d’administration complète
│   │   │   │   ├── background-dashboard/      # Fond graphique pour le dashboard
│   │   │   │   ├── capteur/                   # Logiciel commun aux capteurs
│   │   │   │   ├── compte/                    # Page "Mon compte"
│   │   │   │   ├── dashboard/                 # Vue utilisateur avec capteurs
│   │   │   │   ├── formulaire-connexion/      # Connexion utilisateur
│   │   │   │   ├── formulaire-inscription/    # Création de compte
│   │   │   │   ├── header/                    # Barre de navigation
│   │   │   │   ├── historique-humidite/       # Historique humidité
│   │   │   │   ├── historique-temperature/    # Historique température
│   │   │   │   ├── humidimetre/               # Capteur humidité
│   │   │   │   ├── interceptor/               # Intercepteur HTTP (auth)
│   │   │   │   ├── lampe/                     # Composant LED
│   │   │   │   ├── serre/                     # Nom et état de la serre
│   │   │   │   ├── tab/                       # Onglets dynamiques
│   │   │   │   ├── temperature/               # Capteur température
│   │   │   │   ├── app.component.ts|html|css  # Composant principal
│   │   │   │   ├── app.routes.ts              # Routes Angular
│   │   │   │   ├── app.config.ts              # Configuration centrale
│   │   │   │   ├── measurement.service.ts     # Service pour les mesures
│   │   │   │   ├── sensor.service.ts          # Service pour les capteurs
│   │   │   │   └── user.service.ts            # Service pour les utilisateurs
│   │   │   ├── assets/                        # Images, icônes, etc.
│   │   │   ├── index.html                     # Page racine Angular
│   │   │   └── styles.css                     # Feuille de style globale
│   │   ├── angular.json                       # Config Angular CLI
│   │   ├── package.json                       # Dépendances frontend
│   │   └── tsconfig.json                      # Configuration TypeScript
|
├── client_rpi/                          # Client embarqué (Raspberry Pi)
│   ├── sensors/
│   │   ├── button_humidity_sensor.py    # Bouton simulant des taux d'humidité
│   │   └── temp_sensor.py               # Capteur de température
│   ├── gpio/
│   │   ├── init.py                      # Initialisation des pins GPIO
│   │   └── led.py                       # LEDs 
|   |
│   ├── client_ws.py                     # Client WebSocket pour envoyer des mesures et recevoir des commandes
│   ├── main.py                          # Point d'entrée du client
│   └── config.yaml                      # Adresse serveur, seuils, pins gpio, sensorIds, DeviceId
│
│
├── README.md                            # Explication du projet
├── .env                                 # Variables (URI MongoDB, port, token secret, etc.)
├── package.json                         # Dépendances Node.js
├── package-lock.json                    # Version des dépendances Node.js
└── .gitignore                           # Ignorer node_modules, environnement virtuel, etc.
```

## 📦 Dépendances

Ce projet utilise Node.js pour exécuter un serveur Express (backend) et Angular CLI pour lancer le serveur de développement du frontend.

### Dépendances principales (`dependencies`)
- **express** : Framework web pour créer l’API REST.
- **mongoose** : ODM pour MongoDB.
- **cors** : Middleware pour gérer les politiques CORS.
- **dotenv** : Pour charger les variables d’environnement à partir d’un fichier `.env`.
- **helmet** : Pour sécuriser les en-têtes HTTP.
- **ejs** : Moteur de template.
- **jsonwebtoken** : Pour la gestion des tokens JWT.
- **bcrypt** : Pour le hachage des mots de passe.
- **ws** : Pour la gestion des WebSockets.
- **socket.io-client** : Pour la communication avec le serveur WebSocket depuis le frontend.

### Dépendances Python (`client_rpi`)
- **adafruit-circuitpython-dht** : Pour la lecture des capteurs DHT11.
- **pyyaml** : Pour la lecture du fichier de configuration `config.yaml`.
- **websocket-client** : Pour la communication WebSocket avec le serveur.
- **rpi-lgpio** : Pour la gestion des broches GPIO sur le Raspberry Pi.

## ⚙️ Installation et lancement

1. Clonez le dépôt.
2. Installez les dépendances depuis la racine du projet avec `npm install`.
3. Lancez le serveur backend avec `npm run start:backend`.
4. Installez les dépendances frontend avec `npm install` dans le répertoire `frontend/frontend_angular`.
*S'assurer d'avoir installé Angular CLI globalement (`npm install -g @angular/cli`) si ce n'est pas déjà fait.*
5. Lancez le serveur frontend dans le dossier `frontend/frontend_angular` avec `npm start`.
6. Lancer le client Raspberry Pi avec `python main.py` dans le répertoire `client_rpi`.
