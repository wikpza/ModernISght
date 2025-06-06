🛍️ Modern Sight — Online Clothing Store

📌 Description
Modern Sight is a web application for an online clothing store, developed using a microservices architecture.

🧱 Architecture
The project is divided into separate microservices:

account_service — handles user registration, authentication, address and card management.
product_service — manages products, categories, brands, sizes, and inventory.
storage_service — responsible for storing and serving media files (product images, etc.).
Microservices communicate via Apache Kafka in an event-driven architecture. All client requests go through a central API Gateway.

⚙️ Technologies Used

Layer	Technologies
Frontend	TypeScript, React, Tailwind CSS
Backend	Node.js, TypeScript, Express
Database	MongoDB (via Mongoose)
Service Communication	Apache Kafka
Developer Tools	Git, Docker, Jest, Draw.io, MS Excel
🧩 Main Functional Modules

User registration and login with email verification
User dashboard with profile, address, and payment card management
Product catalog with filtering by category, brand, collection, and gender
Admin panel to manage products, brands, collections, sizes, colors, and inventory
Shopping cart and order processing
Product image storage and delivery
Order history and inventory management
📘 Diagrams

You can include these diagrams to better represent the system's structure:

📌 Use Case Diagram — visualizes user and admin interactions with the system.
🔄 DFD (Data Flow Diagram) — shows data flow between modules and services (include Level 0 and Level 1).
🔷 IDEF0 Diagram — describes high-level business processes and decompositions.
🏗 Class Diagram — object-oriented system structure with classes and relationships.
