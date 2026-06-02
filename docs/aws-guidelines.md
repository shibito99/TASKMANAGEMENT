# AWS 運用ガイドライン

本プロジェクト（taskmanagement）の AWS 環境における運用・管理手順をまとめる。

---

## 1. 基本方針

| 項目 | 方針 |
|---|---|
| 用途 | 学習・個人利用のみ（公開・商用不可） |
| コスト目標 | 無料枠の範囲内（やむを得ない場合は月数百円以内） |
| 冗長化 | なし（シングル構成） |
| IaC | Terraform で管理（手動での AWS コンソール操作は原則禁止） |
| 認証 | IAM ユーザー（`default` プロファイル）を使用。ルートアカウントは使用しない |

---

## 2. デプロイ手順

### 2-1. フロントエンドのデプロイ

```bash
# 1. ビルド
cd frontend
npm run build

# 2. S3 にアップロード（index.html はキャッシュ無効）
aws s3 sync frontend/dist/ s3://taskmanagement-frontend-237228997080/ \
  --delete \
  --cache-control "no-cache" \
  --exclude "*" --include "index.html"

# 3. assets はブラウザキャッシュを活用（ファイル名にハッシュあり）
aws s3 sync frontend/dist/ s3://taskmanagement-frontend-237228997080/ \
  --cache-control "max-age=31536000,immutable" \
  --exclude "index.html"

# 4. CloudFront キャッシュを無効化
aws cloudfront create-invalidation \
  --distribution-id E1U5YS63SSQ5HH \
  --paths "/*"
```

### 2-2. バックエンドのデプロイ

```bash
# 1. jar ビルド
cd backend
mvn package -DskipTests

# 2. S3 にアップロード
aws s3 cp target/taskmanagement-0.0.1-SNAPSHOT.jar \
  s3://taskmanagement-frontend-237228997080/backend/app.jar

# 3. EC2 上で jar を差し替えてサービス再起動
aws ssm send-command \
  --instance-ids "i-08295b40ac01f03cf" \
  --document-name "AWS-RunShellScript" \
  --parameters '{"commands":["aws s3 cp s3://taskmanagement-frontend-237228997080/backend/app.jar /app/app.jar && systemctl restart taskmanagement"]}'
```

---

## 3. サーバー管理（SSM Session Manager）

SSH ポートは開放していないため、サーバーへの接続はすべて SSM を使用する。

```bash
# インタラクティブシェル接続
aws ssm start-session --target i-08295b40ac01f03cf --profile default

# コマンド実行（非インタラクティブ）
aws ssm send-command \
  --instance-ids "i-08295b40ac01f03cf" \
  --document-name "AWS-RunShellScript" \
  --parameters '{"commands":["コマンド"]}'

# コマンド結果確認
aws ssm get-command-invocation \
  --command-id "<CommandId>" \
  --instance-id "i-08295b40ac01f03cf" \
  --query "[Status,StandardOutputContent]" --output text
```

### よく使うコマンド

```bash
# アプリログ確認
journalctl -u taskmanagement -n 100 --no-pager

# アプリ状態確認
systemctl status taskmanagement --no-pager

# PostgreSQL コンテナ確認
docker ps
docker logs taskmanagement-postgres
```

---

## 4. コスト管理

### 現在の構成と料金

| サービス | スペック | 料金 |
|---|---|---|
| EC2 | t2.micro (1vCPU / 1GB RAM) | 無料枠：月 750 時間 |
| EBS | gp3 30GB | 無料枠：月 30GB まで |
| EIP | EC2 に紐付け中 | EC2 停止中のみ課金（約 $0.005/時） |
| S3 | 標準ストレージ | 無料枠：5GB / 月 20,000 GET / 2,000 PUT |
| CloudFront | PriceClass_200 | 無料枠：月 1TB データ転送 / 10,000,000 リクエスト |
| SSM | Session Manager | 無料 |

> 無料枠は AWS アカウント作成から **12 ヶ月間** 適用。それ以降は EC2・EBS が課金対象。

### コスト超過を防ぐポイント

- EC2 を長期間停止させる場合は EIP の関連付けを外すか EC2 を終了する（停止中の EIP は課金）
- S3 への大量アップロード・ダウンロードは無料枠の PUT/GET 上限に注意
- CloudFront の無効化（Invalidation）は月 1,000 パス以内は無料、超過すると $0.005/パス

---

## 5. セキュリティ

### IAM

| ポリシー | 理由 |
|---|---|
| `AmazonSSMManagedInstanceCore` | SSM Session Manager でのサーバー管理 |
| `AmazonEC2ContainerRegistryReadOnly` | ECR からのイメージ取得（現在は未使用、将来のコンテナ化に備え） |
| `AmazonS3ReadOnlyAccess` | EC2 から S3 の jar・スクリプトを取得 |

- ルートアカウントは使用しない
- IAM ユーザーに MFA を設定する
- 不要なポリシーは付与しない（最小権限の原則）

### セキュリティグループ

| ルール | 設定値 | 理由 |
|---|---|---|
| EC2 Inbound 8080 | CloudFront prefix list (`pl-58a04531`) のみ | CloudFront 経由以外の直接アクセスを拒否 |
| EC2 Inbound 22 (SSH) | 開放なし | SSM を使うため SSH 不要 |
| EC2 Outbound | `0.0.0.0/0` | S3・SSM・ECR などへの外部通信を許可 |

### シークレット管理

- DB パスワードは `terraform/prod.tfvars` に記載し `.gitignore` で除外
- systemd のサービスファイルに環境変数として注入（コードにハードコードしない）
- `prod.tfvars` はバージョン管理に含めない

---

## 6. Terraform 操作手順

```bash
cd terraform

# 初期化（初回のみ）
terraform init -plugin-dir=%APPDATA%\terraform.d\plugins

# 差分確認
terraform plan -var-file="prod.tfvars"

# 適用
terraform apply -var-file="prod.tfvars"

# リソース削除（全削除）
terraform destroy -var-file="prod.tfvars"
```

> **注意**: `terraform destroy` を実行すると EC2・S3・CloudFront など **すべてのリソースが削除** される。
> 誤操作を防ぐため、実行前に必ず `plan` で影響範囲を確認すること。

---

## 7. 障害対応

### アプリが応答しない場合

```bash
# 1. サービス状態確認
systemctl status taskmanagement --no-pager

# 2. ログ確認（直近 100 行）
journalctl -u taskmanagement -n 100 --no-pager

# 3. サービス再起動
systemctl restart taskmanagement

# 4. PostgreSQL 確認
docker ps
docker restart taskmanagement-postgres
```

### CloudFront でキャッシュが古い場合

```bash
aws cloudfront create-invalidation \
  --distribution-id E1U5YS63SSQ5HH \
  --paths "/*"
```

### EC2 インスタンスの停止・起動

```bash
# 停止
aws ec2 stop-instances --instance-ids i-08295b40ac01f03cf

# 起動
aws ec2 start-instances --instance-ids i-08295b40ac01f03cf

# 状態確認
aws ec2 describe-instances \
  --instance-ids i-08295b40ac01f03cf \
  --query "Reservations[0].Instances[0].State.Name" --output text
```

> EC2 起動後、Spring Boot の起動まで約 30 秒かかる。
> EC2 停止中も EIP は課金されるため、長期停止する場合は EIP を解放すること。

---

## 8. リソース識別子一覧

| リソース | ID / 値 |
|---|---|
| EC2 Instance ID | `i-08295b40ac01f03cf` |
| EC2 EIP | `54.238.75.117` |
| CloudFront Distribution ID | `E1U5YS63SSQ5HH` |
| CloudFront URL | `https://d1sxveuvnbvq2z.cloudfront.net` |
| S3 バケット名 | `taskmanagement-frontend-237228997080` |
| AWS リージョン | `ap-northeast-1`（東京） |
| AWS プロファイル | `default` |
