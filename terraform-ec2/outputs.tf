output "instance_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.react_instance.public_ip  # Yahan 'my_ec2' ki jagah apne resource ka naam likhein
}