# Amazon Linux 2023 の最新 AMI を自動取得
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  # 起動時に Docker・Docker Compose・SSM Agent をセットアップ
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    db_username = var.db_username
    db_password = var.db_password
    db_name     = var.db_name
    aws_region  = var.aws_region
  }))

  tags = {
    Name    = "${var.project_name}-app"
    Project = var.project_name
  }
}

# Elastic IP（EC2 を停止・起動してもIPが変わらないように）
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"

  tags = {
    Name    = "${var.project_name}-eip"
    Project = var.project_name
  }
}
