# Intentionally misconfigured Terraform — for scanner testing only.
# Do not apply this to any real cloud account.

provider "aws" {
  region = "us-east-1"
}

# 1. Security group open to the world on SSH
resource "aws_security_group" "test_sg" {
  name        = "snyk-test-sg"
  description = "Intentionally open security group for IaC scan testing"

  ingress {
    description = "SSH open to the world"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "All ports open to the world"
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. S3 bucket with public access and no encryption
resource "aws_s3_bucket" "test_bucket" {
  bucket = "snyk-test-bucket-example"
}

resource "aws_s3_bucket_acl" "test_bucket_acl" {
  bucket = aws_s3_bucket.test_bucket.id
  acl    = "public-read"
}

# 3. Unencrypted, publicly accessible RDS instance with hardcoded credentials
resource "aws_db_instance" "test_db" {
  identifier             = "snyk-test-db"
  engine                 = "mysql"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  username               = "admin"
  password               = "SuperSecretPassword123!"
  publicly_accessible    = true
  storage_encrypted      = false
  skip_final_snapshot    = true
}

# 4. IAM policy granting overly broad permissions
resource "aws_iam_policy" "test_policy" {
  name = "snyk-test-overly-permissive-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "*"
        Resource = "*"
      }
    ]
  })
}
