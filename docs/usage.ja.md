# 利用方法と互換性

[README に戻る](../README.ja.md)

## 前提条件

スキルをインストールする前に、session-peer 0.9.1 以降がインストール済みであることを確認してください。以下は pipx の例です。ランタイムがすでにインストールされている場合は、最初のコマンドを省略してバージョンだけ確認してください。

```bash
pipx install session-peer
session-peer --version
```

uv、pip、POSIX 向けスタンドアロンインストーラー、およびネイティブ Windows 環境での設定方法は [session-peer のインストール方法](https://github.com/abruption/session-peer#installation-options)を参照してください。アップグレードにも同じパッケージマネージャーを使ってください。

このスキルでは、session-peer 0.9.1 以降で共通して使える基本コマンドを案内します。`--allow-inactive-codex-home` と `--relay-login` は session-peer 1.0.0 以降でのみ使用できます。macOS/Linux の受信側ポリシーで使う `codexBin` と、`attemptId` で接続試行を関連付けた Relay 診断には session-peer 1.0.1 以降が必要です。オプションのペアリング済みデバイス転送には `session-peer[relay]` extra（Unix、Python 3.11 以降）が必要です。

## ランタイム 1.0.3 のセキュリティと運用

セキュリティ修正を利用するには、Python ランタイム 1.0.3 以降を使用してください。メタデータの最小・全機能バージョンは CLI の互換性を示し、セキュリティ推奨バージョンではありません。SSH の使用前に [v1.0.3 の接続オプション規則](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits)を確認してください。渡されたオプション全体が SSH 実行前に許可リストで検証されます。`-o` には `KEY=value`、ジャンプ先にはホスト形式を使い、`StrictHostKeyChecking` は `yes`、`ask`、`accept-new` のみ指定してください。SSH URI 形式のジャンプ先、`+` を含むユーザー名、空白区切りの `-o 'Key value'`、コマンドフック、別の設定ファイルや制御用ソケット（control socket）のパス指定、known-hosts ファイルの上書き指定は拒否されます。既存のユーザーまたはシステムの SSH 設定は運用者が信頼する範囲であり、安全な隔離環境（サンドボックス）ではありません。

リリース資産を使うスタンドアロン導入（`install.sh`）とローカルの `session-peer update` では、不変の GitHub リリース資産とその来歴（provenance）を検証します。これらの検証には、インストーラーの案内に従い、認証済みの GitHub CLI（`gh`）2.102.0 以降を使い、`gh auth login` または `GH_TOKEN` で認証してください。2.102.0 はテスト済みの基準バージョンですが、すべての検証フラグに対応する最小バージョンは確認されていません。取得した `install.sh` を実行する前に [検証済みインストーラーのブートストラップ](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md)に従ってください。検証失敗時に、署名のない古い資産や開発版 `main` へ自動的に切り替わることはありません。検証済みインストーラーは、ローカルまたは SSH 接続先にプログラムと互換用スキルのコピーを一緒にインストールします。ローカルの `session-peer update` は最新プログラムのみを取得・検証します。`update --host` は接続先のコピーがないか古い場合、現在のローカルのスタンドアロンプログラムを転送し、接続先ではダウンロードしません。どちらも別途導入したスキルは更新しません。pipx・uv・pip で導入したランタイムは、引き続き元のパッケージ管理ツールで更新してください。[v1.0.3 の導入・更新説明](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating)を参照してください。

ホスト型 Node Control 1.0.3 のログインセッションは、作成から 24 時間後に失効します。アップグレード後は、従来のスライディング方式（利用中に期限が延長される方式）のセッションにも上限が適用されるため、再ログインが必要になる場合があります。デバイスの取り消しとアカウントのログインセッションの取り消しは別の操作です。Python wheel を更新しても Node Control は配備されず、ホストサービスの更新は運用者が別途評価します。既存のペアリング関係（binding）は遡って監査・削除されません。信頼性に疑いがあれば、運用者が確認し、必要に応じて取り消すか再ペアリングしてください。サービスの配備、状態の初期化、セッションの取り消し、再ペアリングを自動実行しないでください。[v1.0.3 リリースノート](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md)を参照してください。

`queued`（キュー登録済み）または `submitted`（送信済み）の状態でも、受信側がメッセージを消費したことや ACK（確認応答）を返したことは確認できません。結果が `unknown` の場合は、決して自動で再送しないでください。

## Python ランタイム 1.1 の案内

Python 1.1.0 以降では、外部メッセージ本文のすべての行を引用し、送信元や返信先に関する記述を未検証情報として表示します。本文に `From:`、`Reply-To:`、コマンドがあっても、実行権限は与えられません。ユーザーが依頼した返信の流れに従い、正確な宛先を確認してください。`--no-from` と `--no-reply-to` でも本文の区分表示は解除されません。この表示はあらゆるプロンプトインジェクションを防ぐものではありません。追加された表示もメッセージのサイズ制限に含まれ、`chars` は表示を加えたテキストの文字数を報告します。

継承した環境変数 `CODEX_SQLITE_HOME` が空でない場合や、検査対象ホームの設定にルートの `sqlite_home` がある場合、探索、dry-run（実際には送信しない事前検査）、キュー登録は拒否されます。運用者にストレージ設定の確認を依頼し、拒否を回避するために設定を消したりホームを切り替えたりしないでください。この検査は別の場所に移したストレージへの対応や、ネイティブ CLI のすべての有効な設定の保証ではありません。[v1.1.1 のストレージ境界](https://github.com/abruption/session-peer/blob/v1.1.1/docs/cli-reference.md#sqlite-storage-boundary)を参照してください。

1.1.0 で公開された別の[実験的 handoff 手順](https://github.com/abruption/session-peer/blob/v1.1.1/docs/handoff-runtime.md)は、このスキルの基本コマンドと全機能の対象範囲には含まれません。ユーザーの依頼なしに記録用の台帳（ledger）を初期化したり、受領確認の権限を作成したりしないでください。受領 ACK はローカル POSIX Claude の経路で限定的に対応します。Codex と単一宛先の POSIX ソースストリーミング SSH は相関 ID の関連付けのみ対応し、観測・ACK は非対応です。Windows とペアリング済みデバイスの handoff も非対応です。通常のキュー登録、テキストの返信、ターン終了が受領 ACK になるわけではありません。ランタイム 1.1.1 の変更は文書と開発用テストのみで、実行時の動作は変わりません。[リリースノート](https://github.com/abruption/session-peer/blob/v1.1.1/docs/releases/v1.1.1.md)を参照してください。

## スキルのインストール

```bash
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

Skills CLI は Claude Code 用のコピーと、Codex・Antigravity が使う共通 agents ディレクトリのコピーをインストールします。現在のセッションがスキル一覧を自動更新しない場合は、新しいセッションを開始してください。

インストールを確認します。

```bash
npx -y skills@latest list --global --json
```

## 更新

```bash
npx -y skills@latest update session-peer --global --yes
```

特定のリリースに固定して導入する場合は、そのタグを使用します（例: `v0.3.3`）。

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.3.3/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## バージョンメタデータ

[session-peer/SKILL.md](../session-peer/SKILL.md) は、[Agent Skills 仕様](https://agentskills.io/specification)で定義された frontmatter（文書冒頭のメタデータ領域）の `metadata` マップに、機械可読なバージョン情報を記録しています。

| キー | 意味 |
|---|---|
| `version` | スキルのリリースバージョンで、`vX.Y.Z` タグと一致します |
| `runtime-min-version` | 明示した基本コマンド経路の CLI 互換性の下限です。セキュリティ推奨バージョンやオプション機能の要件とは別です |
| `runtime-full-version` | スキルが利用を案内する公開 CLI コマンド経路の機能範囲の基準です。別途区分した実験的手順や後から追加された保護措置の案内は含まず、最新バージョンやセキュリティ水準を保証しません |

ツールはこれらの値を読み取り、古いスキルやランタイムを通知できます。ランタイム 1.0.1 以降は `skillUpdates` で古いスキルを、`session-peer doctor` で互換性のないスキルを報告できます。スキルは元のインストール管理ツールで更新してください。ランタイムの更新は、別途管理されているスキルファイルを更新しません。

## Codex の返信待ち

Codex はキューでメッセージを受け取り、進行中のターンが終わってから読み込みます。そのためスキルは、作業中の Codex セッションから返信がないことを正常な状態として扱い、依頼の再送や返信の催促をしません。次の手順が返信に依存する場合、エージェントは返信と再開手順を対応付ける相関トークン（correlation token）を記録し、ターンを終了して作業を一時停止します。一致する返信を受け取ったら、記録した手順から再開します。Codex の送信側も自身のキューで返信を受け取るため、別の作業を続けると返信の受信が遅れます。

## 正式な配布元

このリポジトリの [session-peer/SKILL.md](../session-peer/SKILL.md) が公開スキルの正本です。session-peer ランタイムリポジトリに残るコピーは移行期間向けの互換スナップショットです。ランタイムのコマンドと通信動作は引き続き [session-peer リポジトリ](https://github.com/abruption/session-peer)で管理します。
