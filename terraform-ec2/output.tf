output "server_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.react_instance.public_ip
}

output "server_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.react_instance.id
}