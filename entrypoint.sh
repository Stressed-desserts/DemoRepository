#!/bin/sh
set -e

# Initialize MariaDB data directory if it doesn't exist
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MariaDB data directory..."
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql > /dev/null

    echo "Starting MariaDB temporarily for initialization..."
    /usr/bin/mariadbd --user=mysql --datadir=/var/lib/mysql --skip-networking=0 &
    pid="$!"

    # Wait for MariaDB to start
    RETRIES=30
    until mariadb-admin ping >/dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
        echo "Waiting for MariaDB to start... ($RETRIES retries left)"
        sleep 1
        RETRIES=$((RETRIES - 1))
    done

    if [ $RETRIES -eq 0 ]; then
        echo "MariaDB initialization failed"
        exit 1
    fi

    echo "Setting up database and user..."
    mariadb -u root <<EOF
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE:-commercial_space}\`;
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD:-Sanika@12}';
FLUSH PRIVILEGES;
EOF

    echo "Shutting down temporary MariaDB..."
    mariadb-admin -u root -p"${MYSQL_ROOT_PASSWORD:-Sanika@12}" shutdown
    wait "$pid"
fi

# Run the command passed as arguments (usually supervisord)
exec "$@"
