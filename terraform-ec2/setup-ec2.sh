#!/bin/bash
# SYSTEM UPDATE
sudo apt update

sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

# DOCKER INSTALLATION
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# DOCKER SERVICE START AND ENABLE
sudo systemctl start docker
sudo systemctl enable docker

# ADDING 'ubuntu' USER TO 'docker' GROUP
sudo usermod -aG docker ubuntu

# APPLY GROUP CHANGES
newgrp docker

# RESTART DOCKER SERVICE TO APPLY CHANGES
sudo systemctl restart docker