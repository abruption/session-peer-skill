# 利用方法と互換性

[README に戻る](../README.ja.md)

## 前提条件

session-peer 0.9.1 以降をインストールして確認します。

```bash
pipx install session-peer
session-peer --version
```

uv、pip、POSIX スタンドアロン、および Windows の手順は [session-peer のインストール方法](https://github.com/abruption/session-peer#installation-options)を参照してください。更新時も既存のパッケージマネージャーを使用します。

このスキルは session-peer 0.9.1 以降で共通して使える基本コマンドを案内します。`--allow-inactive-codex-home` と `--relay-login` は session-peer 1.0.0 以降でのみ使用できます。macOS・Linux の受信側ポリシーの `codexBin` と試行単位の Relay 診断には session-peer 1.0.1 以降が必要です。オプションのペアリング済みデバイス転送には `session-peer[relay]` extra（Unix、Python 3.11 以降）が必要です。

## ランタイム 1.0.3 のセキュリティと運用

セキュリティ修正のため、Python ランタイム 1.0.3 以降を推奨します。メタデータの最小・全機能バージョンは CLI の互換性を示し、セキュリティ推奨バージョンではありません。SSH の使用前に [v1.0.3 の接続オプション規則](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits)を確認してください。渡されたオプション全体が SSH 実行前に許可リストで検証されます。`-o` には `KEY=value`、ジャンプ先にはホスト形式を使い、`StrictHostKeyChecking` は `yes`、`ask`、`accept-new` のみ指定してください。SSH URI 形式のジャンプ先、`+` を含むユーザー名、空白区切りの `-o 'Key value'`、コマンドフック、代替設定・control socket のパス、known-hosts ファイルの変更は拒否されます。既存のユーザー・システム SSH 設定は運用者の信頼境界であり、sandbox ではありません。

リリース版のスタンドアロン導入とローカル更新には、不変のリリース資産と来歴の検証、認証済みの新しい GitHub CLI（`gh`、2.102.0 で検証）が必要です。取得した `install.sh` を実行する前に [検証済みインストーラーのブートストラップ](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md)に従ってください。検証失敗時に、署名のない古い資産や開発版 `main` へ自動的に切り替わることはありません。検証済みインストーラーは、ローカルまたは SSH の接続先にプログラムと互換用スキルのコピーを一緒に入れます。ローカルの `session-peer update` は最新プログラムのみを取得・検証します。`update --host` は接続先のコピーがないか古い場合、現在のローカルのスタンドアロンプログラムを転送し、接続先ではダウンロードしません。どちらも別途導入したスキルは更新しません。pipx・uv・pip で導入した場合は元の管理ツールを使ってください。[v1.0.3 の導入・更新説明](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating)を参照してください。

ホストされた Node Control 1.0.3 のログインセッションは作成から 24 時間で失効します。アップグレード時には従来の sliding セッションにも上限が適用され、再ログインが必要な場合があります。デバイスの失効とアカウントのログインセッション失効は別々です。Python wheel の更新だけでは Node Control は配備されず、運用者がホストサービスの更新を別途判断します。既存のペアリング binding は遡って監査・削除されないため、信頼性に疑いがあれば運用者が確認して revoke または re-pair してください。サービス配備、状態の初期化、セッション失効、再ペアリングを自動実行しないでください。[v1.0.3 リリースノート](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md)を参照してください。`queued` や `submitted` は消費や ACK を意味しません。`unknown` の結果を自動で再送しないでください。

## スキルのインストール

```bash
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

Skills CLI は Claude Code 用のコピーと、Codex・Antigravity が使う共通 agents ディレクトリのコピーをインストールします。現在のセッションがスキル一覧を自動更新しない場合は、新しいセッションを開始してください。

```bash
npx -y skills@latest list --global --json
```

## 更新

```bash
npx -y skills@latest update session-peer --global --yes
```

特定のリリースに固定して導入する場合は、そのタグを使用します（例: `v0.3.2`）。

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.3.2/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## バージョンメタデータ

[session-peer/SKILL.md](../session-peer/SKILL.md) は [Agent Skills 仕様](https://agentskills.io/specification)の frontmatter `metadata` マップに、機械可読なバージョン情報を記録します。

| キー | 意味 |
|---|---|
| `version` | スキルのリリースバージョンで、`vX.Y.Z` タグと一致します |
| `runtime-min-version` | スキルが対応する session-peer ランタイムの最小バージョンです |
| `runtime-full-version` | スキルが案内するすべてのオプションに必要なランタイムのバージョンです |

ツールはこれらの値を読み取り、古いスキルやランタイムを通知できます。ランタイム 1.0.1 以降は `skillUpdates` で古いスキルを、`session-peer doctor` で互換性のないスキルを報告できます。スキルは元のインストール管理ツールで更新してください。ランタイムの更新は、別途管理されているスキルファイルを更新しません。

## Codex の返信待ち

Codex はキューでメッセージを受け取り、進行中のターンが終わってから読み込みます。そのためスキルは、作業中の Codex セッションから返信がないことを正常な状態として扱い、依頼の再送や返信の催促をしません。次の手順が返信に依存する場合、エージェントは correlation token と再開する手順を記録し、ターンを終了して作業を一時停止します。一致する返信を受け取ったら、記録した手順から再開します。Codex の送信側も自身のキューで返信を受け取るため、別の作業を続けると返信の受信が遅れます。

## 正式な配布元

このリポジトリの [session-peer/SKILL.md](../session-peer/SKILL.md) が公開スキルの正本です。session-peer ランタイムリポジトリに残るコピーは移行期間向けの互換スナップショットです。CLI と通信機能は引き続き [session-peer リポジトリ](https://github.com/abruption/session-peer)で管理します。
