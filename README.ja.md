# session-peer スキル

[English](README.md) · [한국어](README.ko.md) · [简体中文](README.zh-CN.md)

[session-peer](https://github.com/abruption/session-peer) を使い、ローカル、SSH 経由、またはオプションのペアリング済みデバイス経由で、Claude Code、Codex、および登録済みで、現在実行中の Antigravity セッションを検索し、メッセージを送るエージェントスキルです。

## デモ

![Claude Code と Codex 間でメッセージを交換する session-peer ランタイム](https://raw.githubusercontent.com/abruption/session-peer/v1.0.1/docs/assets/session-peer-live-codex-claude.gif)

ランタイムのデモは Claude Code と Codex 間の通信を示します。スキルはエージェント向けの指示を提供します。

## クイックスタート

session-peer 0.9.1 以降が必要です。記載されているすべての機能を使うには session-peer 1.0.1 以降が必要です。オプションのペアリング済みデバイス経由の通信には Unix、Python 3.11 以降、`session-peer[relay]` が必要です。
v1.0.3 のセキュリティ修正を利用するには、Python ランタイム 1.0.3 以降を使用してください。上記の互換バージョンは CLI 機能の条件であり、セキュリティ上の推奨バージョンではありません。

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

Skills CLI は、Claude Code 用のコピーと、Codex・Antigravity が共通で使うコピーを作成します。スキル一覧がキャッシュされている場合は、新しいエージェントセッションを開いてください。

### 更新

```bash
pipx upgrade session-peer
npx -y skills@latest update session-peer --global --yes
```

上記のランタイム更新コマンドは pipx でインストールした場合のものです。ランタイムは導入時と同じパッケージマネージャーで更新してください。ランタイムの更新はスキルを更新しません。他の導入方法と固定バージョンは利用ガイドを参照してください。

キューに登録済み、または送信済みであっても、受信側でメッセージが消費されたことは確認できません。送信結果が不明な場合は自動再送しないでください。Codex の返信待ちは利用ガイドで説明しています。

npm 版 TypeScript ランタイムには、別の `session-peer-ts` スキルを使います。エージェント、プロジェクト/グローバルの適用範囲、レビュー済みコミットを指定したインストール手順は [TypeScript 設定ガイド](docs/typescript.md)を参照してください。

## ドキュメント

- [TypeScript スキルの導入・バージョン固定による更新・削除](docs/typescript.md)
- [導入方法・固定バージョン・互換性・返信待ち](docs/usage.ja.md)
- [公開済みスキルの指示](session-peer/SKILL.md)
- [開発とリリース手順（英語）](CONTRIBUTING.md)
- [ランタイム CLI リファレンス（v1.0.3）](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md)

## ライセンス

[MIT](LICENSE)

## サポートとセキュリティ

スキルの文書やインストールの問題は [Issue](https://github.com/abruption/session-peer-skill/issues/new) に報告してください。CLI・通信の問題は [ランタイムの Issue](https://github.com/abruption/session-peer/issues) を利用してください。

脆弱性は、メールでの代替連絡先も記載された [メンテナーのセキュリティ方針](https://github.com/abruption/session-peer/blob/main/SECURITY.md) に従って非公開で報告してください。公開 Issue に機密情報、会話本文、セッション識別子を投稿しないでください。
