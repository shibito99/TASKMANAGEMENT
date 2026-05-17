# タスク管理アプリ

Trello ライクなタスク管理 Web アプリです。  
ボード・リスト・カードでタスクを視覚的に管理し、ドラッグ&ドロップで直感的に操作できます。

---

## 機能一覧

| 機能 | 内容 |
|---|---|
| ボード表示 | リストとカードを一覧表示 |
| リスト管理 | リストの追加・名前変更・削除 |
| カード管理 | カードの追加・削除 |
| ドラッグ&ドロップ | リスト間・リスト内でカードを移動 |
| ラベル | 🔴緊急 / 🟡中 / 🟢低 のラベルをカードに表示 |
| 期限日 | 期限切れカードを赤色でハイライト |
| REST API | バックエンドに全操作を API 経由で保存 |

---

## 技術スタック

### バックエンド

| 技術 | バージョン | 用途 |
|---|---|---|
| Java | 21 (LTS) | プログラミング言語 |
| Spring Boot | 3.5.14 | Web フレームワーク |
| Spring Data JPA | Spring Boot 管理 | ORM（Hibernate） |
| PostgreSQL | 17 | データベース |
| Maven | 3.9+ | ビルドツール |
| Lombok | Spring Boot 管理 | ボイラープレート削減 |

### フロントエンド

| 技術 | バージョン | 用途 |
|---|---|---|
| Node.js | 24 | JavaScript ランタイム |
| React | 19 | UI ライブラリ |
| Vite | 8 | ビルドツール |
| TypeScript | 6 | 型安全な JavaScript |
| Tailwind CSS | 4 | CSS フレームワーク |
| Axios | 1 | HTTP クライアント |
| @dnd-kit | 6/10 | ドラッグ&ドロップ |

### インフラ

| 技術 | 用途 |
|---|---|
| Docker Compose | PostgreSQL コンテナ管理 |
| GitHub Actions | CI/CD（予定） |

---

## 前提条件

以下のツールをインストールしてください。

| ツール | バージョン | 確認コマンド |
|---|---|---|
| Docker Desktop | 最新版 | `docker --version` |
| Java (JDK) | 21 以上 | `java -version` |
| Maven | 3.9 以上 | `mvn -version` |
| Node.js | 22 以上 | `node --version` |

> **Windows の場合：** Java と Maven は [Scoop](https://scoop.sh/) でインストールできます。
> ```powershell
> scoop bucket add java
> scoop install temurin21-jdk maven
> ```

---

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/shibito99/TASKMANAGEMENT.git
cd TASKMANAGEMENT
```

### 2. 環境変数ファイルを作成

```bash
# .env ファイルを作成（.gitignore 対象のため手動作成が必要）
cp .env.example .env  # または以下の内容で新規作成
```

`.env` の内容：

```env
POSTGRES_DB=taskmanagement
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### 3. フロントエンドの依存パッケージをインストール

```bash
cd frontend
npm install
cd ..
```

---

## 起動方法

### 1. データベース（PostgreSQL）を起動

```bash
# プロジェクトルートで実行
docker compose up -d

# 起動確認
docker compose ps
```

### 2. バックエンド（Spring Boot）を起動

```bash
cd backend
mvn spring-boot:run
```

起動確認：`http://localhost:8080/api/health` にアクセスして `{"status":"ok"}` が返れば OK。

### 3. フロントエンド（React + Vite）を起動

```bash
cd frontend
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

> **ポートの固定ルール：**  
> バックエンドは `8080`、フロントエンドは `5173` で固定です。  
> Claude Code が起動前に自動でポートを解放するフックを設定済みです。

---

## API エンドポイント一覧

ベース URL：`http://localhost:8080/api`

### ボード（Board）

| メソッド | エンドポイント | 説明 |
|---|---|---|
| GET | `/boards` | ボード一覧取得 |
| GET | `/boards/{id}` | ボード詳細取得（リスト・カード含む） |

### リスト（List）

| メソッド | エンドポイント | 説明 |
|---|---|---|
| POST | `/boards/{boardId}/lists` | リスト追加 |
| PATCH | `/lists/{id}` | リスト名・並び順の更新 |
| DELETE | `/lists/{id}` | リスト削除（配下カードも削除） |

### カード（Card）

| メソッド | エンドポイント | 説明 |
|---|---|---|
| POST | `/lists/{listId}/cards` | カード追加 |
| PATCH | `/cards/{id}` | カード内容の更新（タイトル・説明・期限日・並び順・移動先リスト） |
| DELETE | `/cards/{id}` | カード削除 |

### ラベル（Label）

| メソッド | エンドポイント | 説明 |
|---|---|---|
| GET | `/labels` | ラベル一覧取得 |
| POST | `/cards/{cardId}/labels/{labelId}` | カードにラベルを付与 |
| DELETE | `/cards/{cardId}/labels/{labelId}` | カードからラベルを外す |

---

## プロジェクト構成

```
TASKMANAGEMENT/
├── backend/                          # Spring Boot バックエンド
│   ├── src/main/java/com/taskmanagement/
│   │   ├── controller/               # REST コントローラー
│   │   ├── service/                  # ビジネスロジック
│   │   ├── entity/                   # JPA エンティティ（DB テーブル対応）
│   │   ├── repository/               # Spring Data JPA リポジトリ
│   │   ├── dto/                      # リクエスト・レスポンス DTO
│   │   ├── exception/                # 例外ハンドラー
│   │   └── initializer/              # 起動時テストデータ投入
│   ├── src/main/resources/
│   │   └── application.properties    # DB 接続設定
│   └── pom.xml
│
├── frontend/                         # React フロントエンド
│   ├── src/
│   │   ├── api/                      # Axios API クライアント
│   │   ├── components/               # React コンポーネント
│   │   │   ├── BoardView.tsx         # ボード全体（DnD コンテキスト）
│   │   │   ├── ListColumn.tsx        # リスト列
│   │   │   └── CardItem.tsx          # カード1枚
│   │   ├── types/                    # TypeScript 型定義
│   │   └── App.tsx                   # エントリポイント
│   ├── package.json
│   └── vite.config.ts
│
├── prototype/                        # HTML/CSS/JS 静的プロトタイプ
│   └── index.html
│
├── docker-compose.yml                # PostgreSQL コンテナ設定
├── .env                              # 環境変数（Git 管理外）
├── CLAUDE.md                         # Claude Code 作業ルール
├── 要件定義書.md
├── 技術設計書.md
└── 開発計画書.md
```

---

## データベース構成

```
boards       ─┐
              ├─ lists ─┐
                         ├─ cards ─── card_labels ─── labels
```

| テーブル | 説明 |
|---|---|
| `boards` | ボード |
| `lists` | リスト（列） |
| `cards` | カード（タスク） |
| `labels` | ラベル（🔴緊急 / 🟡中 / 🟢低） |
| `card_labels` | カードとラベルの中間テーブル（多対多） |

---

## 開発ワークフロー

このプロジェクトは以下のフローで開発を進めます。

```
1. GitHub Issue を作成
2. Issue からブランチを作成
   gh issue develop {番号} --checkout --name feature/issue-{番号}-{説明}
3. 実装・コミット
4. Pull Request を作成（本文に Closes #{番号}）
5. レビュー後 main にマージ
```

> main ブランチへの直接プッシュはブランチ保護により禁止されています。

---

## 開発状況

| フェーズ | 内容 | 状態 |
|---|---|---|
| Phase 1 | バックエンド CRUD API | ✅ 完了 |
| Phase 2 | React フロントエンド基本 | ✅ 完了 |
| Phase 3 | ドラッグ&ドロップ | ✅ 完了 |
| Phase 4 | カード詳細ポップアップ | 🔄 開発中 |
| Phase 5 | 結合テスト・納品 | ⏳ 予定 |

---

## ライセンス

MIT License
