# api-rest-sensors-ws
Serveur Express pour capteurs IoT avec API REST, WebSocket et authentification JWT + WebClient Interface

```
API-REST-SENSORS-WS/
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
- **http-server** : Pour servir le frontend statique dans `frontend_angular`.

## ⚙️ Installation et lancement

1. Clonez le dépôt.
2. Installez les dépendances avec `npm install`.
4. Lancez le serveur backend avec `npm run start:backend`.
5. Lancez le serveur frontend dans le fichier frontend/frontend_angular avec `npm start`.
6. Lancer le fichier main.py dans le client_rpi
