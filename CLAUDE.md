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
