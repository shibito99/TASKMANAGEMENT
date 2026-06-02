output "cloudfront_url" {
  description = "アプリケーションの URL（フロントエンド・API 共通）"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "ec2_instance_id" {
  description = "EC2 インスタンス ID（SSM 接続時に使用）"
  value       = aws_instance.app.id
}

output "ec2_public_ip" {
  description = "EC2 の Elastic IP"
  value       = aws_eip.app.public_ip
}

output "s3_bucket_name" {
  description = "フロントエンドデプロイ先の S3 バケット名"
  value       = aws_s3_bucket.frontend.bucket
}

output "ssm_connect_command" {
  description = "SSM セッションマネージャーでの接続コマンド"
  value       = "aws ssm start-session --target ${aws_instance.app.id} --profile ${var.aws_profile}"
}
