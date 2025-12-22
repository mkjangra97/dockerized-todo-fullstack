provider "aws" {
  region = "ap-south-1"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    # Switched to Jammy (22.04) which is the stable industry standard
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type" # Filter for HVM AMIs (Hardware Virtual Machine)
    values = ["hvm"]
  }
}

# Security Group to allow SSH and HTTP access
resource "aws_security_group" "web_sg" {
  name        = "react-project-sg"
  description = "Allow SSH and HTTP traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


# EC2 Instance to host the React application
resource "aws_instance" "react_instance" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  security_groups             = [aws_security_group.web_sg.name]
  key_name                    = "keypair"

  user_data = file("setup-ec2.sh")
  tags = {
    Name = "Dockerized Project"
  }
}