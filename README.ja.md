# session-peer スキル

[English](README.md) · [한국어](README.ko.md) · [简体中文](README.zh-CN.md)

[session-peer](https://github.com/abruption/session-peer) を使い、ローカル、SSH、またはオプションのペアリング済みデバイス上の Claude Code、Codex、実行中の Antigravity セッションを検索してメッセージを送るエージェントスキルです。

## デモ

![Claude Code と Codex 間でメッセージを交換する session-peer ランタイム](https://raw.githubusercontent.com/abruption/session-peer/v1.0.1/docs/assets/session-peer-live-codex-claude.gif)

ランタイムのデモは Claude Code と Codex 間の通信を示します。スキルはエージェント向けの指示を提供します。

## クイックスタート

session-peer 0.9.1 以降が必要です。記載する全機能には session-peer 1.0.1 以降が必要です。オプションのペアリング済みデバイス転送には Unix、Python 3.11 以降、`session-peer[relay]` が必要です。
v1.0.3 のセキュリティ修正を含む Python ランタイム 1.0.3 以降を推奨します。上記の互換バージョンは CLI 機能の条件であり、セキュリティ推奨バージョンとは別です。

### インストール

ランタイムとスキルを別々にインストールします。

```bash
pipx install session-peer
session-peer --version
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
npx -y skills@latest list --global --json
```

Skills CLI は Claude Code 用と Codex・Antigravity 共通のコピーを作成します。スキル一覧がキャッシュされている場合は、新しいエージェントセッションを開いてください。

### 更新

```bash
pipx upgrade session-peer
npx -y skills@latest update session-peer --global --yes
```

上記のランタイム更新コマンドは pipx 用です。既存のランタイムパッケージマネージャーを使い続けてください。ランタイムの更新はスキルを更新しません。他の導入方法と固定バージョンは利用ガイドを参照してください。

キュー登録や送信完了は読み込みの確認ではありません。送信結果が不明な場合は自動再送しないでください。Codex の返信待ちは利用ガイドで説明しています。

npm TypeScript ランタイムには別の `session-peer-ts` スキルを使います。エージェント、プロジェクト/グローバル範囲、確認済みコミットを指定する手順は [TypeScript 設定ガイド](docs/typescript.md)を参照してください。

## ドキュメント

- [TypeScript スキルの導入・固定更新・削除](docs/typescript.md)
- [導入方法・固定バージョン・互換性・返信待ち](docs/usage.ja.md)
- [公開エージェント指示](session-peer/SKILL.md)
- [開発とリリース手順（英語）](CONTRIBUTING.md)
- [ランタイム CLI リファレンス（v1.0.3）](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md)

## ライセンス

[MIT](LICENSE)

## サポートとセキュリティ

スキルの文書やインストールの問題は [Issue](https://github.com/abruption/session-peer-skill/issues/new) に報告してください。CLI・通信の問題は [ランタイムの Issue](https://github.com/abruption/session-peer/issues) を利用してください。

脆弱性は、メールの代替連絡先も記載された [管理者のセキュリティ方針](https://github.com/abruption/session-peer/blob/main/SECURITY.md) に従って非公開で報告してください。公開 Issue に秘密情報、会話本文、セッション識別子を投稿しないでください。
