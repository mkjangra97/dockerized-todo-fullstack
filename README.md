# Dockerized Todo Fullstack Application

A robust, containerized full-stack Todo application built with **React**, **Node.js**, **Express**, and **MySQL**. This project demonstrates a modern microservices architecture with Docker and includes Infrastructure as Code (IaC) scripts for deploying to AWS EC2 using **Terraform**.

## 🚀 Features

- **Manage Todos**: Create, view, and delete todo messages easily.
- **Responsive Design**: Clean and responsive user interface built with React and pure CSS.
- **Persistent Storage**: All data is securely stored in a MySQL database.
- **Containerized**: Fully Dockerized application for consistent development and deployment environments.
- **Infrastructure as Code**: Terraform configuration included for provisioning AWS EC2 instances.
- **Microservices Architecture**: Separate services for frontend, backend, and database using Docker Compose.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (v19)
- **Web Server**: Nginx (Alpine)
- **Build Tool**: Vite
- **Styling**: Pure CSS
- **Container**: `manishjangra97/todo-app-frontend`

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database Driver**: MySQL2
- **Container**: `manishjangra97/todo-app-backend`

### Database
- **Service**: MySQL 8.0
- **Volume Management**: Docker Volumes for data persistence

### 🌐 Nginx (Frontend & Reverse Proxy)
The frontend container uses **Nginx** to serve the React application and acts as a reverse proxy for the backend.
- **Static Content**: Serves the built React files (HTML, CSS, JS) on port `80`.
- **Reverse Proxy**: Forwards all requests starting with `/api/` to the backend service (`todo-backend:5000`). This eliminates CORS issues and simplifies the API URL structure for the client.

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose
- **Cloud Provider**: AWS (EC2)
- **IaC**: Terraform

## 📋 Prerequisites

Ensure you have the following installed on your local machine:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Terraform](https://developer.hashicorp.com/terraform/downloads) (Optional, for AWS deployment)

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dockerized-todo-fullstack
```

### 2. Environment Configuration
The project uses environment variables for configuration. The essential variables are already handled in `docker-compose.yml`, but you can customize `.env` files if needed.

**Example Backend Environment (`.env` or via Docker):**
```env
DB_HOST=mysql-db
DB_USER=root
DB_PASSWORD=password
DB_NAME=myapp
```

### 3. Run with Docker Compose
Build and start the services using the following command. This will pull necessary images and build your local components.

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:80/api

To stop the services:
```bash
docker-compose down
```

## 🔌 API Reference

The backend exposes a RESTful API at `http://localhost:80/api`.

| Method | Endpoint             | Description              | Body Parameter |
|:-------|:---------------------|:-------------------------|:---------------|
| `GET`  | `/api/messages`      | Retrieve all messages    | -              |
| `POST` | `/api/save`          | Save a new message       | `{ "text": "..." }` |
| `DELETE`| `/api/messages/:id` | Delete a message by ID   | -              |

## ☁️ Deployment (AWS with Terraform)

This project includes Terraform configuration to provision an AWS EC2 instance.

1. Navigate to the Terraform directory:
   ```bash
   cd terraform-ec2
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Review the plan:
   ```bash
   terraform plan
   ```

4. Apply the configuration (provisions t2.micro instance):
   ```bash
   terraform apply
   ```

> **Note**: Ensure you have configured your AWS credentials (`aws configure`) and updated the `main.tf` file with your preferred bucket backend or SSH key details if necessary.

## � CI/CD Pipeline (GitHub Actions)

This project includes a fully automated CI/CD pipeline using **GitHub Actions**. The pipeline handles building Docker images, provisioning infrastructure with Terraform, and deploying the application to AWS EC2.

### Workflow Overview (`.github/workflows/main.yml`)

The pipeline runs automatically on every push to the `main` branch and executes the following stages sequentially:

1.  **Build & Push (`build-docker.yml`)**:
    - Checks out the code.
    - Logs in to Docker Hub.
    - Builds Docker images for Frontend and Backend.
    - Pushes images to Docker Hub (`todo-app-frontend` and `todo-app-backend`).

2.  **Infrastructure (`terraform.yml`)**:
    - Configures AWS credentials.
    - Sets up Terraform.
    - Runs `terraform init` and `terraform apply`.
    - Provisions an EC2 instance.
    - Outputs the **Public IP** of the new (or existing) instance to be used in the next step.

3.  **Deploy (`deploy-to-ec2.yml`)**:
    - Connects to the EC2 instance via SSH using the IP from the Terraform step.
    - Copies `docker-compose.yml`, Nginx config, and environment variables.
    - Pulls the latest Docker images.
    - Restarts the application using `docker-compose up -d`.

### 🔑 Required Secrets

To make the pipeline work, you must add the following **Repository Secrets** in GitHub (Settings > Secrets and variables > Actions):

| Secret Name             | Description                                      |
|:------------------------|:-------------------------------------------------|
| `DOCKER_USERNAME`       | Your Docker Hub username                         |
| `DOCKER_TOKEN_ID`       | Docker Hub Access Token (or password)            |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key for Terraform                     |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key for Terraform                     |
| `EC2_PRIVATE_KEY`       | Private SSH Key content (e.g., `-----BEGIN...`)   |
| `ENV_FILE`              | Content for root `.env` (Database configs)       |
| `ENV_FRONTEND`          | Content for frontend `.env` (API URL)            |

## �📂 Project Structure

```
dockerized-todo-fullstack/
├── backend/                # Node.js/Express Backend
│   ├── server.js           # API Entry Point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/                # Source Code
│   ├── Dockerfile
│   └── vite.config.js
├── terraform-ec2/          # Terraform Infrastructure Scripts
│   ├── main.tf             # AWS Resources (EC2, SG)
│   └── setup-ec2.sh        # User data script
├── docker-compose.yml      # Orchestration config
└── README.md               # Project Documentation
```

## 📄 License

This project is licensed under the ISC License.
