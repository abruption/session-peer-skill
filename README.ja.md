# session-peer スキル

[English](README.md) · [한국어](README.ko.md) · [简体中文](README.zh-CN.md)

[session-peer](https://github.com/abruption/session-peer) を使い、ローカル、SSH、またはオプションのペアリング済みデバイス上の Claude Code、Codex、実行中の Antigravity セッションを検索してメッセージを送るエージェントスキルです。

このリポジトリにはエージェント向けの指示だけが含まれます。`session-peer` ランタイムは別途インストールしてください。

## 前提条件

session-peer 0.9.1 以降をインストールして確認します。

```bash
pipx install session-peer
session-peer --version
```

uv、pip、POSIX スタンドアロン、および Windows の手順は [session-peer のインストール方法](https://github.com/abruption/session-peer#installation-options)を参照してください。更新時も既存のパッケージマネージャーを使用します。

スキルは安定版 0.9 のコマンド体系を前提とします。`--allow-inactive-codex-home` と `--relay-login` は session-peer 1.0.0 以降でのみ使用できます。オプションのペアリング済みデバイス転送には `session-peer[relay]` extra（Unix、Python 3.11 以降）が必要です。

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

特定のリリースに固定して導入する場合は、そのタグを使用します（例: `v0.2.0`）。

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.2.0/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## Codex の返信待ち

Codex はキューでメッセージを受け取り、進行中のターンが終わってから読み込みます。そのためスキルは、作業中の Codex セッションから返信がないことを正常な状態として扱い、依頼の再送や返信の催促をしません。次の手順が返信に依存する場合、エージェントは correlation token と再開する手順を記録し、ターンを終了して作業を一時停止します。一致する返信を受け取ったら、記録した手順から再開します。Codex の送信側も自身のキューで返信を受け取るため、別の作業を続けると返信の受信が遅れます。

## 正式な配布元

このリポジトリの `session-peer/SKILL.md` が公開スキルの正本です。session-peer ランタイムリポジトリに残るコピーは移行期間向けの互換スナップショットです。CLI と通信機能は引き続き [session-peer リポジトリ](https://github.com/abruption/session-peer)で管理します。

## ライセンス

MIT
