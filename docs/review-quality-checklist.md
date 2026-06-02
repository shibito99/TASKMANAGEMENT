# レビュー品質管理チェックリスト

本プロジェクト（React + Spring Boot）のコードレビュー時に確認する品質チェック項目をまとめたスキル図。

---

## フロントエンド（TypeScript / React）

### ESLint チェック項目

| カテゴリ | チェック内容 | 対処法 |
|---|---|---|
| Hooks ルール | `useEffect` 内で `async` 関数を直接渡さない | 内部で即時実行関数 `(async () => { ... })()` か Promise チェーンに変換 |
| Promise 処理 | 未処理の Promise を放置しない | `void` 演算子を付けるか `.catch()` を追加 |
| 型安全 | `any` 型の使用を避ける | 適切な型定義または `unknown` を使用 |
| 未使用変数 | 未使用のインポート・変数を残さない | 削除するか `_` プレフィックスを付ける |
| React | コンポーネント名は PascalCase にする | 命名規則に従い修正 |

### 実施例（commit f2d862c）

```tsx
// NG: useEffect に async を直接渡す
useEffect(async () => {
  const data = await fetchBoards();
  setBoards(data);
}, []);

// OK: void で Promise を明示処理
useEffect(() => {
  void (async () => {
    const data = await fetchBoards();
    setBoards(data);
  })();
}, []);
```

### チェックコマンド

```bash
cd frontend
npm run lint        # ESLint 実行
npm run type-check  # TypeScript 型チェック（tsc --noEmit）
```

---

## バックエンド（Java / Spring Boot）

### Checkstyle チェック項目

設定ファイル：[backend/checkstyle.xml](../backend/checkstyle.xml)

| カテゴリ | チェック内容 | 設定モジュール |
|---|---|---|
| **命名規則** | クラス名・定数・変数・メソッド・パッケージが規約に従っているか | `TypeName`, `ConstantName`, `MethodName` 等 |
| **インポート** | ワイルドカードインポート（`import java.util.*`）を使っていないか | `AvoidStarImport` |
| **インポート** | 未使用・重複インポートがないか | `UnusedImports`, `RedundantImport` |
| **コードスタイル** | `null` との比較で `equals` を誤用していないか（`"text".equals(var)` 推奨） | `EqualsAvoidNull` |
| **コードスタイル** | `String` 同士を `==` で比較していないか | `StringLiteralEquality` |
| **コードスタイル** | 冗長な boolean 式・return を簡略化できるか | `SimplifyBooleanExpression`, `SimplifyBooleanReturn` |
| **修飾子** | `public static final` 等の修飾子順序が正しいか | `ModifierOrder` |
| **ブロック** | `if/for/while` にブレース `{}` を省略していないか | `NeedBraces` |
| **ブロック** | 空のブロック（`catch {}` 等）がないか | `EmptyBlock`, `EmptyCatchBlock` |
| **長さ** | メソッドが 80 行以内か | `MethodLength` (max=80) |
| **長さ** | パラメータが 7 個以内か | `ParameterNumber` (max=7) |
| **潜在的バグ** | `switch` の `fall-through` が意図的でないか | `FallThrough` |
| **潜在的バグ** | 1 行に複数変数を宣言していないか | `MultipleVariableDeclarations` |

### チェックコマンド

```bash
cd backend
mvn checkstyle:check   # 違反があれば警告（failsOnError=false）
mvn checkstyle:checkstyle  # レポートを target/site/checkstyle.html に生成
```

> **設定方針：** `severity=warning`・`failsOnError=false` のため CI はブロックしない。  
> 将来的に重大な違反のみ `severity=error` に昇格させて CI ゲートを追加することを推奨。

---

## レビューフロー（スキル図）

```
コードレビュー開始
│
├── フロントエンド変更あり？
│   ├── YES → npm run lint & npm run type-check
│   │          └── 警告・エラー → 修正してから承認
│   └── NO  → スキップ
│
├── バックエンド変更あり？
│   ├── YES → mvn checkstyle:check
│   │          └── 命名・インポート・ブロック・長さ・潜在的バグ を確認
│   │          └── 警告 → コメントで指摘（必須修正 / 推奨修正を明記）
│   └── NO  → スキップ
│
├── API 変更あり？
│   └── YES → REST エンドポイントのレスポンス形式・ステータスコードを確認
│
└── 全チェック通過 → Approve & Merge
```

---

## 今後の改善ポイント

- [ ] ESLint を CI（GitHub Actions）に組み込み PR 時に自動チェック
- [ ] Checkstyle の `severity=error` 項目を段階的に追加
- [ ] フロントエンドに `prettier` を導入してフォーマット統一
- [ ] バックエンドに `SpotBugs` を追加して静的解析を強化
