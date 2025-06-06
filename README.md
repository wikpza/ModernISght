# 🛍️ Modern Sight — Online Clothing Store

## 📌 Description

**Modern Sight** is a modern and scalable web application for an online clothing store, built with a **microservices architecture**.  
Each service is responsible for a specific business domain, improving scalability, maintainability, and performance.

## 🧱 Architecture

The system consists of several microservices:

- 🔐 **account_service** — User registration, authentication, profile, addresses, and payment methods.
- 🛒 **product_service** — Product catalog, categories, collections, inventory, and orders.
- 🖼️ **storage_service** — Media file (e.g., product images) storage and management.
- 🚪 **API Gateway** — Unified entry point for all services, routing requests and handling authentication.
- 📡 **Kafka** — Message broker for asynchronous, event-driven communication between services.

## ⚙️ Technologies Used

| Layer              | Technology Stack                                  |
|--------------------|---------------------------------------------------|
| **Frontend**        | React, TypeScript, Tailwind CSS                  |
| **Backend**         | Node.js, Express, TypeScript                     |
| **Database**        | MongoDB with Mongoose ODM                        |
| **Inter-Service Communication** | Apache Kafka                         |
| **Dev Tools**       | Docker, Git, Jest, Draw.io, MS Excel             |

## 🧩 Features

- ✅ Email-based registration and authentication
- 👤 Personal user dashboard with:
  - Profile management
  - Address and card management
  - Order history
- 🛍️ Product catalog with advanced filtering:
  - By category, brand, collection, and gender
- 🧾 Shopping cart and checkout
- 🛠️ Admin dashboard:
  - Product, brand, color, and size management
  - Inventory and stock tracking
- 🖼️ Media service for image uploading and delivery
- 📦 Kafka-based communication between services

## 📘 Diagrams (to include)

- 📌 **Use Case Diagram**
![Use Case](./images/usecase.png)

- 🔄 **DFD (Data Flow Diagram)** – Data flow between system components
- 🔷 **IDEF0 Diagram** – Business process decomposition
- 🧭 **Activity Diagram** – User behavior and flow logic
- 🏗 **Class Diagram** – Object structure of the system
- 🗂 **Database Schema** – MongoDB collections and relations


