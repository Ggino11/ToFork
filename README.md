# 🍽️ ToFork
### Sistema Distribuito di Prenotazione Ristoranti

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.6-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Latest-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

[Panoramica](#panoramica) • [Architettura](#architettura) • [Stack Tecnologico](#stack-tecnologico) • [Per Iniziare](#per-iniziare) • [API](#api) • [Deployment](#deployment)

---

## 📋 Panoramica

**ToFork** è una piattaforma per la gestione di ristoranti, prenotazioni e ordini. Costruita con un'architettura a microservizi,  permette agli utenti di prenotare tavoli, effettuare ordini e pagare i propri ordini e fornisce funzionalità di gestione per i ristoranti.

### ✨ Caratteristiche Principali
*   **🏗️ Architettura a Microservizi**: 5 servizi indipendenti che rappresentano le funzionalità del sistema.
*   **🔐 Sicurezza**: Autenticazione JWT e OAuth 2.0 (Google).
*   **🚀 Containerizzazione**: Stack completo Dockerizzato per uno sviluppo locale.
*   **🚢 Kubernetes Ready**: Configurazioni pronte per il deployment in produzione su cluster K8s.
*   **💳 Pagamenti Integrati**: Sistema pronto per l'elaborazione sicura delle transazioni tramite stripe api.

---

## 🏗️ Architettura

Il sistema segue il pattern dei microservizi con un design a tre livelli, garantendo la separazione delle responsabilità.

| Servizio | Porta | Descrizione |
|----------|-------|-------------|
| **User Service** | `8081` | Gestione utenti, autenticazione e profili. |
| **Order Service** | `8082` | Gestione del ciclo di vita degli ordini. |
| **Restaurant Service** | `8083` | Catalogo ristoranti, menu e disponibilità. |
| **Payment Service** | `8084` | Elaborazione sicura dei pagamenti. |
| **Booking Service** | `8085` | Gestione prenotazione tavoli. |

### Diagramma di Flusso Dati
*   **Richieste Esterne** → **Nginx Gateway** (`Port 80`) → **Microservizi**
*   Le comunicazioni tra microservizi avvengono tramite chiamate HTTP REST **Sincrone** (es. Payment Service -> Order Service).

---

## 🛠️ Stack Tecnologico

### Backend Ecosystem
*   **Framework**: Spring Boot 3.5.6
*   **Linguaggio**: Java 17
*   **Database**: PostgreSQL 15 (Schema per-service)
*   **Auth**: Spring Security + JWT + OAuth2

### Frontend Ecosystem
*   **Framework**: Next.js 15 (App Router)
*   **Linguaggio**: TypeScript
*   **Styling**: Tailwind CSS
*   **State**: React Context API

### Infrastruttura
*   **Gateway**: Nginx
*   **Container**: Docker & Docker Compose
*   **Orchestrator**: Kubernetes & minikube

---

## 🚀 Per Iniziare

### Prerequisiti
Assicurati di avere installato:
*   [Docker](https://www.docker.com/) e Docker Compose
*   [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) (opzionale, per dev locale)
*   [Node.js 18+](https://nodejs.org/) (opzionale, per dev locale)
*   [Minikube](https://minikube.sigs.k8s.io/docs/start/) (per dev locale)

### Quick Start (Docker Compose)

Esegui l'intero stack in pochi minuti.

1.  **Clona il repository**
    ```bash
    git clone https://github.com/Ggino11/ToFork.git
    cd ToFork
    ```

2.  **Configura Ambiente**
    Crea un file `.env` nella root:
    ```env
    GOOGLE_CLIENT_ID=tuo_client_id
    GOOGLE_CLIENT_SECRET=tuo_client_secret
    STRIPE_SECRET_KEY=tuo_stripe_fake_secret
    STRIPE_PUBLIC_KEY=tuo_stripe_fake_public
    STRIPE_WEBHOOK_SECRET=tuo_stripe_webhook
    ```

3.  **Avvia lo Stack**
    ```bash
    docker-compose up -d --build
    ```

4.  **Accedi**
    *   💻 **Frontend**: [http://localhost:3000](http://localhost:3000)
    *   🔌 **API Gateway**: [http://localhost/api](http://localhost/api)

### Credenziali Database
*   **User**: `postgres`
*   **Pass**: `postgres`
*   **DB**: `tofork`

---

## 📡 API Endpoints

Principali percorsi API esposti dal Gateway:

| Metodo | Percorso | Descrizione                |
|:------:|----------|----------------------------|
| **Auth** | |                            |
| `POST` | `/api/auth/register` | Registrazione nuovo utente |
| `POST` | `/api/auth/login` | Login (Ritorna JWT)        |
| `POST` | `/api/auth/oauth/google` | Login Google                  |
| **Ristoranti** | |                            |
| `GET` | `/api/restaurants` | Lista tutti i ristoranti   |
| `GET` | `/api/restaurants/{id}/menu` | Menu specifico             |
| **Ordini** | |                            |
| `POST` | `/api/orders` | Crea nuovo ordine          |
| `GET` | `/api/orders` | I miei ordini              |
| **Prenotazioni** | |                            |
| `POST` | `/api/bookings` | Prenota un tavolo          |

---

## 📦 Struttura del Progetto

```plaintext
ToFork/
├── 📂 backend/               # Codice sorgente Microservizi
│   ├── User-service/
│   ├── Order-service/
│   ├── Restaurant-service/
│   ├── Payment-service/
│   └── Booking-service/
├── 📂 frontend/              # Applicazione Next.js
│   └── my-app/
├── 📂 infra/                 # Config Nginx e init DB
├── 📂 k8s/                   # Manifest Kubernetes
└── 📄 docker-compose.yml     # Orchestrazione locale
```

---

## ☸️ Kubernetes Deployment

Il progetto è pronto per il cloud con configurazioni K8s complete.

```bash
# 1. avviare minikube
minikube start

# 2. Abilitare l'Ingress
minikube addons enable ingress

# 3. Collega il Terminale a Docker
eval $(minikube docker-env)

# 4. Costruzioni delle immagini Frontend e Backend
docker build --no-cache --build-arg NEXT_PUBLIC_API_URL=http://localhost -t tofork/frontend:latest ./frontend/my-app

docker build -t tofork/user-service:latest ./backend/User-service
docker build -t tofork/order-service:latest ./backend/Order-service
docker build -t tofork/restaurant-service:latest ./backend/Restaurant-service
docker build -t tofork/booking-service:latest ./backend/Booking-service
docker build -t tofork/payment-service:latest ./backend/Payment-service

# 5. Setup namespace e secrets
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/secret/          #//dopo averli popolati

# 6. Configmaps e PVC
kubectl apply -f k8s/db-configmap.yaml
kubectl apply -f k8s/pvc/

# 7. Deploy servizi e ingress
kubectl apply -f k8s/deployment/
kubectl apply -f k8s/service/
kubectl apply -f k8s/ingress/
```

---

## 🔒 Sicurezza

*   **JWT & OAuth2**: Protezione robusta degli endpoint.
*   **Network Isolation**: I microservizi non sono esposti direttamente, ma solo tramite Gateway.
*   **Database Partitioning**: Dati isolati per servizio.

---

> Progetto realizzato per il corso di **Laboratorio TAASS 24-25**.
