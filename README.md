# 🐳 Docker 3-Tier Web Application + Jenkins CI/CD

A full-stack, containerized application demonstrating a 3-tier architecture (**Nginx**, **Node.js**, **PostgreSQL**) with automated **Jenkins CI/CD** orchestration.

---

## 🏛️ Architecture Overview

```
                      +---------------------------------------+
                      |               CLIENT                  |
                      |            (Web Browser)              |
                      +----------+--------------------+-------+
                                 |                    |
                                 | Port 80            | Port 8080
                                 v                    v
                      +--------------------+  +--------------------+
                      |       Nginx        |  |      Jenkins       |
                      |   (Web & Proxy)    |  |     (CI/CD Hub)    |
                      +----------+---------+  +---------+----------+
                                 |                      |
                                 | /api/*               | Docker Socket
                                 v                      v
                      +--------------------+  +--------------------+
                      |      Node.js       |  |   Docker Daemon    |
                      |    (Express API)   |  |   (Build & Deploy) |
                      +----------+---------+  +--------------------+
                                 |
                                 | SQL (5432)
                                 v
                      +--------------------+
                      |     PostgreSQL     |
                      | (Persistent DB)    |
                      +--------------------+
```

---

## 🚀 Services & Ports

| Service | Container | Port | Purpose |
|---|---|---|---|
| **Website (Frontend)** | `devops_frontend` | `http://localhost` (Port 80) | Clean UI served by Nginx |
| **Jenkins (CI/CD)** | `devops_jenkins` | `http://localhost:8080` | CI/CD automation & pipelines |
| **Backend API** | `devops_backend` | `http://localhost:5000` | Express REST API |
| **PostgreSQL** | `devops_postgres` | Port 5432 | Relational database |

---

## 🛠️ Getting Started with Jenkins

### 1. Start All Containers
```bash
docker compose up -d --build
```

### 2. Unlock Jenkins
1. Open **[http://localhost:8080](http://localhost:8080)** in your browser.
2. Get your Administrator Password by running:
   ```bash
   docker exec devops_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Paste the password into Jenkins and click **Install suggested plugins**.
4. Create your admin user.

### 3. Run the CI/CD Pipeline
A ready-to-use `Jenkinsfile` is included in the project root:
1. In Jenkins dashboard, click **New Item**.
2. Enter a name (e.g., `devops-deploy-pipeline`) and select **Pipeline**. Click **OK**.
3. Scroll down to the **Pipeline** section:
   - Select **Pipeline script from SCM** (if using Git) OR select **Pipeline script** and paste the contents of `Jenkinsfile`.
4. Click **Save** and then click **Build Now**.

---

## 📋 Useful Commands

```powershell
# Check running containers
docker compose ps

# View Jenkins logs
docker compose logs -f jenkins

# View initial admin password anytime
docker exec devops_jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Stop all containers
docker compose down
```
