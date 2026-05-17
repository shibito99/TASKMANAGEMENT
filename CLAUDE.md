# CLAUDE.md — Claude Code 作業ルール

## Git / GitHub ワークフロー（厳守）

### 絶対ルール

1. **main ブランチへの直接プッシュ禁止**
2. **作業開始前に必ず GitHub Issue を作成する**
3. **Issue に対応するブランチを作成してから実装する**
4. **実装完了後は Pull Request を作成して main にマージする**

---

### ブランチ命名規則

| 種別 | 命名パターン | 例 |
|---|---|---|
| 機能追加 | `feature/issue-{番号}-{説明}` | `feature/issue-1-crud-api` |
| バグ修正 | `fix/issue-{番号}-{説明}` | `fix/issue-5-card-delete` |
| ドキュメント | `docs/issue-{番号}-{説明}` | `docs/issue-3-readme` |

---

### Issue 作成ルール

- タイトル形式：`[Phase N] 作業内容の概要`
- 本文に実装する内容を箇条書きで記載する
- 対応するフェーズのラベルを付与する（`phase-1` 〜 `phase-5`）

---

### ブランチ作成コマンド

```bash
gh issue develop {Issue番号} --checkout --branch feature/issue-{番号}-{説明}
```

---

### PR 作成ルール

- タイトル形式：`[Phase N] 作業内容の概要`
- 本文に `Closes #Issue番号` を含める（マージ時に Issue が自動クローズされる）

---

### コミットメッセージ

- 日本語で簡潔に内容を記述する
- 末尾に以下を付与する：

```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React + Vite + TypeScript + Tailwind CSS |
| バックエンド | Java 21 + Spring Boot 3 |
| ORM | Spring Data JPA（Hibernate） |
| ビルドツール | Maven |
| データベース | PostgreSQL（Docker Compose で起動） |
| API 形式 | REST API（ベース URL: `http://localhost:8080/api`） |

---

## サーバー起動ルール（厳守）

### ポート定義

| サーバー | ポート | 固定 |
|---|---|---|
| バックエンド（Spring Boot） | `8080` | 変更禁止 |
| フロントエンド（Vite） | `5173` | 変更禁止 |

### 起動前のポート解放（必須）

サーバーを起動する前に、**必ずそのポートを使用中のプロセスを終了させてから起動する**。  
ポートが空いていれば何もしない（エラーにならない）。

```powershell
# ポート 8080 を解放
$p = (Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue).OwningProcess
if ($p) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }

# ポート 5173 を解放
$p = (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue).OwningProcess
if ($p) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
```

> **Claude Code フック設定済み（`.claude/settings.json`）：**  
> `spring-boot:run` または `npm run dev` を含むコマンドを実行する直前に、  
> 対象ポートのプロセスを自動終了する `PreToolUse` フックが登録されている。  
> 手動でコマンドを実行するときも上記 PowerShell を先に実行すること。

---

## DB 起動コマンド

```bash
# プロジェクトルートで実行
docker compose up -d
```

---

## バックエンド起動コマンド

```bash
cd backend
mvn spring-boot:run
```

---

## フロントエンド起動コマンド

```bash
cd frontend
npm run dev
# → http://localhost:5173
```
