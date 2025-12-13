# 🏥 CareConnect

**A Microservices-Based Patient Management System**

CareConnect is a scalable, backend-focused healthcare platform built using **microservices architecture**. It enables seamless interaction between **patients, doctors, appointments, and notifications**, while demonstrating real-world distributed system concepts such as **API Gateway, asynchronous messaging, containerization, and service-to-service communication**.

This project is designed to showcase **production-grade backend engineering practices**.

---

## 🚀 Features

### 👤 Patient Service

* Patient registration & authentication
* Secure patient profile management
* JWT-based protected routes

### 👨‍⚕️ Doctor Service

* Doctor onboarding & authentication
* Doctor profile and specialization management
* Secure access using middleware

### 📅 Appointment Service

* Create and manage appointments
* Validates patient & doctor existence via service calls
* Publishes events to message broker

### 🔔 Notification Service

* Listens to appointment events
* Sends email notifications asynchronously
* Decoupled from core business logic

### 🌐 API Gateway

* Central entry point for all client requests
* Routes traffic to appropriate services
* Simplifies frontend integration

### 🖥️ Frontend (Client)

* Built with **React + Vite**
* Separate dashboards for doctors and patients
* Auth-protected routes

---

## 🧱 Architecture Overview

* **Microservices Architecture**
* **API Gateway Pattern**
* **Event-Driven Communication**
* **Loose Coupling via Message Broker**
* **Containerized using Docker**

```
Client → API Gateway → Services
                     ├── Patient Service
                     ├── Doctor Service
                     ├── Appointment Service
                     └── Notification Service (Async)
```

---

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **JWT Authentication**
* **RabbitMQ** (Event Messaging)

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **Tailwind**

### DevOps & Infrastructure

* **Docker**
* **Docker Compose**
* **Service-to-Service Communication**
* **Container Networking**

---

## 📂 Project Structure

```
CareConnect
├── gateway
├── patient-service
├── doctor-service
├── appointment-service
├── notification-service
├── client
├── docker-compose.yaml
└── arc.md
```

Each service follows a clean structure:

```
├── app.js
├── controllers
├── models
├── routes
├── middleware
├── db
├── service (RabbitMQ)
└── Dockerfile
```

---

## 🔄 Communication Patterns

### Synchronous

* REST APIs between Gateway and services
* Service-to-service HTTP validation (Doctor ↔ Patient)

### Asynchronous

* RabbitMQ for:

  * Appointment created events
  * Notification triggers
* Improves scalability & fault tolerance

---

## 🐳 Running the Project

### Prerequisites

* Docker
* Docker Compose

### Start All Services

```bash
docker-compose up --build
```

### Stop Services

```bash
docker-compose down
```

Each service runs in its own container and communicates via Docker’s internal network.

---

## 🔐 Security

* JWT-based authentication
* Route-level authorization middleware
* Secure environment variable handling
* No direct service exposure to clients

---

## 🎯 Learning Outcomes

This project demonstrates:

* Real-world **microservices design**
* **API Gateway implementation**
* **Event-driven architecture**
* **Asynchronous messaging with RabbitMQ**
* **Dockerized production-style setup**
* **Clean code organization & separation of concerns**

---

## 📌 Future Enhancements

* Replace REST with **gRPC** for inter-service communication
* Implement **Rate Limiting & Circuit Breakers**
* Add **Observability** (Prometheus, Grafana)
* Migrate Gateway to **Nginx**

---
