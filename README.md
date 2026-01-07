# 🚀 Project Manager DevOps - Backend

Une application backend pour la gestion de projets avec monitoring et observabilité DevOps.

---

## 📑 Table des matières

- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📚 Utilisation](#-utilisation)
- [🏗️ Architecture](#️-architecture)
- [🐳 Docker](#-docker)
- [🔨 Jenkins](#-jenkins)
- [☸️ Kubernetes](#️-kubernetes)
- [🔄 ArgoCD](#-argocd)
- [📊 Monitoring](#-monitoring)
- [📸 Screenshots](#-screenshots)
- [💻 Technologies](#-technologies)
- [📝 Licence](#-licence)

---

## 🚀 Installation

### 📋 Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- MongoDB
- Docker
- kubectl
- Kubernetes cluster

### 📦 Étapes d'installation

```bash
# 1. Cloner le repository
git clone <repository-url>
cd project-manager-devops/backend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
```

---

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-manager
NODE_ENV=development
```

---

## 📚 Utilisation

### 🛠️ Mode développement

```bash
npm run dev
```

### 🎯 Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

---

## 🏗️ Architecture

```
project-manager-devops/
│
├── 📁 backend/
│   ├── 📄 server.js           # Point d'entrée principal
│   ├── 📄 package.json        # Dépendances du projet
│   ├── 📄 .env               # Variables d'environnement
│   └── 📄 README.md          # Documentation
│
├── 📄 Dockerfile             # Configuration Docker
├── 📄 docker-compose.yml     # Orchestration locale
├── 📄 Jenkinsfile           # Pipeline CI/CD Jenkins
└── 📁 k8s/                  # Manifestes Kubernetes
```

---

## 🐳 Docker

### 🔨 Build de l'image

```bash
docker build -t project-manager-backend:latest .
```

### ▶️ Exécuter avec Docker

```bash
docker run -p 5000:5000 --env-file .env project-manager-backend:latest
```

### 🎼 Docker Compose

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f backend
```

---

## 🔨 Jenkins

### 📌 Accès Jenkins

```
http://localhost:8080
```

### 📊 Étapes du Pipeline

| Étape | Description |
|-------|-------------|
| **Checkout** | Clone du repository |
| **Build** | Installation des dépendances |
| **Test** | Exécution des tests unitaires |
| **Docker Build** | Construction de l'image Docker |
| **Docker Push** | Push vers le registre Docker |
| **Deploy** | Déploiement sur Kubernetes |
| **Verify** | Vérification du déploiement |

### 🚀 Exécuter le Pipeline

Le pipeline se déclenche automatiquement à chaque push ou manuellement via l'interface Jenkins.

---

## ☸️ Kubernetes

### 🔌 Port-Forward Services

#### Backend (Server)
```bash
kubectl -n project-manager port-forward svc/server 3001:5000
```
🔗 Accès: `http://localhost:3001`

#### Frontend (Client)
```bash
kubectl -n project-manager port-forward svc/client 5173:5173
```
🔗 Accès: `http://localhost:5173`

#### Métriques Prometheus
```bash
kubectl -n project-manager port-forward svc/server 5000:5000
```
🔗 Accès: `http://localhost:5000/metrics`

---

## 🔄 ArgoCD

### 🔐 Accès ArgoCD

```bash
kubectl port-forward svc/argocd-server -n argocd 8090:443
```

| Paramètre | Valeur |
|-----------|--------|
| **URL** | `https://localhost:8090` |
| **Username** | `admin` |
| **Password** | `nv X-e6-ewTpAMRuI9a` |

---

## 📊 Monitoring

### 📈 Grafana

```bash
kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
```

| Paramètre | Valeur |
|-----------|--------|
| **URL** | `http://localhost:3000` |
| **Username** | `admin` |
| **Password** |  |

### 🎯 Prometheus

```bash
kubectl -n monitoring port-forward svc/monitoring-prometheus 9090:9090
```

🔗 URL: `http://localhost:9090`
📡 Métriques: `/metrics` du serveur

---

## 📸 Screenshots

### 🖼️ Dashboards et Interfaces

| Capture | Description |
|---------|-------------|
| ![ArgoCD Dashboard](./docs/screenshots/argocd-dashboard.png) | **ArgoCD Dashboard** - Gestion des déploiements |
| ![Grafana Metrics](./docs/screenshots/grafana-metrics.png) | **Grafana Metrics** - Visualisation des métriques |
| ![Prometheus Targets](./docs/screenshots/prometheus-targets.png) | **Prometheus Targets** - Cibles de collecte |
| ![Jenkins Pipeline](./docs/screenshots/jenkins-pipeline.png) | **Jenkins Pipeline** - Automation CI/CD |
| ![Kubernetes Pods](./docs/screenshots/k8s-pods.png) | **Kubernetes Pods** - Orchestration des conteneurs |
| ![Docker Compose](./docs/screenshots/docker-compose.png) | **Docker Compose** - Orchestration locale |

---

## 💻 Technologies

### 🔧 Backend & ORM
- **Express.js** - Framework web minimaliste
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB

### 📊 Logging & Monitoring
- **Morgan** - Middleware de logging HTTP
- **prom-client** - Métriques Prometheus

### 🛠️ Utilitaires
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement
- **nodemon** - Rechargement automatique en développement

### 🐳 Infrastructure & DevOps
- **Docker** - Conteneurisation
- **Kubernetes** - Orchestration de conteneurs
- **Jenkins** - Automation CI/CD
- **ArgoCD** - GitOps continuous deployment
- **Prometheus** - Collecte de métriques
- **Grafana** - Visualisation de métriques

---

