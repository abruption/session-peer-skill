# session-peer スキル

[English](README.md) · [한국어](README.ko.md) · [简体中文](README.zh-CN.md)

[session-peer](https://github.com/abruption/session-peer) を使い、ローカルまたは SSH 上の Claude Code、Codex、実行中の Antigravity セッションを検索してメッセージを送るエージェントスキルです。

このリポジトリにはエージェント向けの指示だけが含まれます。`session-peer` ランタイムは別途インストールしてください。

## 前提条件

session-peer 0.9.1 以降をインストールして確認します。

```bash
pipx install session-peer
session-peer --version
```

uv、pip、POSIX スタンドアロン、および Windows の手順は [session-peer のインストール方法](https://github.com/abruption/session-peer#installation-options)を参照してください。更新時も既存のパッケージマネージャーを使用します。

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

初回リリースを固定して導入する場合は `v0.1.0` タグを使用します。

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.1.0/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## 正式な配布元

このリポジトリの `session-peer/SKILL.md` が公開スキルの正本です。session-peer ランタイムリポジトリに残るコピーは移行期間向けの互換スナップショットです。CLI と通信機能は引き続き [session-peer リポジトリ](https://github.com/abruption/session-peer)で管理します。

## ライセンス

MIT
