# Docker Run Instructions

This guide categorizes the steps to run the Backend, Frontend, and Database in separate Docker containers without using Docker Compose.

## Prerequisites
- Docker installed and running.

## Step 1: Create a Docker Network
Create a shared network so containers can communicate with each other.

```bash
docker network create commercial-net
```

## Step 2: Run Database Container
Start a MySQL container. We set the root password and create the default database.

```bash
docker run -d \
  --name commercial-db \
  --network commercial-net \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=commercial_space \
  -p 3307:3306 \
  mysql:8.0
```
*Note: We expose port 3307 (mapped to internal 3306) so you can connect to the DB using a local tool like Workbench or DBeaver using `localhost:3307`.*

## Step 3: Build and Run Backend

### Build the Image
Navigate to the root directory where the `backend` folder is located.

```bash
docker build -t commercial-backend ./backend
```

### Run the Container
We override the database URL to point to the `commercial-db` container we created in Step 2.

```bash
docker run -d \
  --name commercial-backend \
  --network commercial-net \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://commercial-db:3306/commercial_space?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  -p 8080:8080 \
  commercial-backend
```
*Success Check: You can view logs with `docker logs -f commercial-backend` to ensure it started and connected to the DB.*

## Step 4: Build and Run Frontend

### Build the Image
Navigate to the root directory where the `frontend` folder is located.

```bash
docker build -t commercial-frontend ./frontend
```

### Run the Container
Run the frontend container exposing port 3000.

```bash
docker run -d \
  --name commercial-frontend \
  --network commercial-net \
  -p 3000:3000 \
  commercial-frontend
```

## Access the Application
- **Frontend**: Open [http://localhost:3000](http://localhost:3000)
- **Backend API**: Accessible at [http://localhost:8080](http://localhost:8080)

## Cleanup
To stop and remove proper containers:
```bash
docker stop commercial-frontend commercial-backend commercial-db
docker rm commercial-frontend commercial-backend commercial-db
docker network rm commercial-net
```
