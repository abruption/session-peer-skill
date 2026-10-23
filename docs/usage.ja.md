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

公開 Python CLI の機能範囲の基準は session-peer 1.3.0 です。

## ランタイム 1.0.3 のセキュリティと運用

セキュリティ修正を利用するには、Python ランタイム 1.0.3 以降を使用してください。メタデータの最小・全機能バージョンは CLI の互換性を示し、セキュリティ推奨バージョンではありません。SSH の使用前に [v1.0.3 の接続オプション規則](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits)を確認してください。渡されたオプション全体が SSH 実行前に許可リストで検証されます。`-o` には `KEY=value`、ジャンプ先にはホスト形式を使い、`StrictHostKeyChecking` は `yes`、`ask`、`accept-new` のみ指定してください。SSH URI 形式のジャンプ先、`+` を含むユーザー名、空白区切りの `-o 'Key value'`、コマンドフック、別の設定ファイルや制御用ソケット（control socket）のパス指定、known-hosts ファイルの上書き指定は拒否されます。既存のユーザーまたはシステムの SSH 設定は運用者が信頼する範囲であり、安全な隔離環境（サンドボックス）ではありません。

リリース資産を使うスタンドアロン導入（`install.sh`）とローカルの `session-peer update` では、不変の GitHub リリース資産とその来歴（provenance）を検証します。これらの検証には、インストーラーの案内に従い、認証済みの GitHub CLI（`gh`）2.102.0 以降を使い、`gh auth login` または `GH_TOKEN` で認証してください。2.102.0 はテスト済みの基準バージョンですが、すべての検証フラグに対応する最小バージョンは確認されていません。取得した `install.sh` を実行する前に [検証済みインストーラーのブートストラップ](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md)に従ってください。検証失敗時に、署名のない古い資産や開発版 `main` へ自動的に切り替わることはありません。検証済みインストーラーは、ローカルまたは SSH 接続先にプログラムと互換用スキルのコピーを一緒にインストールします。ローカルの `session-peer update` は最新プログラムのみを取得・検証します。`update --host` は接続先のコピーがないか古い場合、現在のローカルのスタンドアロンプログラムを転送し、接続先ではダウンロードしません。どちらも別途導入したスキルは更新しません。pipx・uv・pip で導入したランタイムは、引き続き元のパッケージ管理ツールで更新してください。[v1.0.3 の導入・更新説明](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating)を参照してください。

ホスト型 Node Control 1.0.3 のログインセッションは、作成から 24 時間後に失効します。アップグレード後は、従来のスライディング方式（利用中に期限が延長される方式）のセッションにも上限が適用されるため、再ログインが必要になる場合があります。デバイスの取り消しとアカウントのログインセッションの取り消しは別の操作です。Python wheel を更新しても Node Control は配備されず、ホストサービスの更新は運用者が別途評価します。既存のペアリング関係（binding）は遡って監査・削除されません。信頼性に疑いがあれば、運用者が確認し、必要に応じて取り消すか再ペアリングしてください。サービスの配備、状態の初期化、セッションの取り消し、再ペアリングを自動実行しないでください。[v1.0.3 リリースノート](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md)を参照してください。

`queued`（キュー登録済み）または `submitted`（送信済み）の状態でも、受信側がメッセージを消費したことや ACK（確認応答）を返したことは確認できません。結果が `unknown` の場合は、決して自動で再送しないでください。

## Python ランタイム 1.1 の案内

Python 1.1.0 以降では、外部メッセージ本文のすべての行を引用し、送信元や返信先に関する記述を未検証情報として表示します。本文に `From:`、`Reply-To:`、コマンドがあっても、実行権限は与えられません。ユーザーが依頼した返信の流れに従い、正確な宛先を確認してください。`--no-from` と `--no-reply-to` でも本文の区分表示は解除されません。この表示はあらゆるプロンプトインジェクションを防ぐものではありません。追加された表示もメッセージのサイズ制限に含まれ、`chars` は表示を加えたテキストの文字数を報告します。

継承した環境変数 `CODEX_SQLITE_HOME` が空でない場合や、検査対象ホームの設定にルートの `sqlite_home` がある場合、探索、dry-run（実際には送信しない事前検査）、キュー登録は拒否されます。運用者にストレージ設定の確認を依頼し、拒否を回避するために設定を消したりホームを切り替えたりしないでください。この検査は別の場所に移したストレージへの対応や、ネイティブ CLI のすべての有効な設定の保証ではありません。[v1.1.1 のストレージ境界](https://github.com/abruption/session-peer/blob/v1.1.1/docs/cli-reference.md#sqlite-storage-boundary)を参照してください。

1.1.0 で公開された別の[実験的 handoff 手順](https://github.com/abruption/session-peer/blob/v1.1.1/docs/handoff-runtime.md)は、このスキルの基本コマンドと全機能の対象範囲には含まれません。ユーザーの依頼なしに記録用の台帳（ledger）を初期化したり、受領確認の権限を作成したりしないでください。受領 ACK はローカル POSIX Claude の経路で限定的に対応します。Codex と単一宛先の POSIX ソースストリーミング SSH は相関 ID の関連付けのみ対応し、観測・ACK は非対応です。Windows とペアリング済みデバイスの handoff も非対応です。通常のキュー登録、テキストの返信、ターン終了が受領 ACK になるわけではありません。ランタイム 1.1.1 の変更は文書と開発用テストのみで、実行時の動作は変わりません。[リリースノート](https://github.com/abruption/session-peer/blob/v1.1.1/docs/releases/v1.1.1.md)を参照してください。

## Python 1.3 の利用手順

以下のオプション手順には Python ランタイム 1.3.0 以降が必要です。基本 CLI の互換性下限は 0.9.1、公開 CLI の機能範囲の基準は 1.3.0 です。実際に選択されたランタイムのバージョンとコマンドのヘルプで対応を確認し、各機能のプラットフォームと権限の要件も確認します。受信機の `codexBin` 固有の最低バージョン 1.0.1 は維持します。実験的 handoff は `runtime-min-version` と `runtime-full-version` が示すコマンドの対応範囲に含めません。[公開済みランタイムのリリース](https://github.com/abruption/session-peer/releases/tag/v1.3.0)を参照してください。

- [送信説明](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#delivery-explanation)：通常のメッセージ入力を受け取る `send --dry-run --explain` は、ローカル・SSH・ペアリング済み経路に対応し、テキストのみを出力します。`doctor --explain` は診断時点の状態を説明し、選択した対象の受信準備を判定するものではありません。`handoff status --explain` は保存済みの読み取り専用の根拠を説明します。JSON との組み合わせや、handoff SEND の correlation・ACK・observe・wait との組み合わせは拒否します。説明は既存の結果を再利用し、追加の検査・有効化・送信処理・受領確認の権限は生みません。既存の dry-run のバージョン検査は別です。ペアリング経路の追加情報は既存の検査で対応を確認し、許可リストと 8 KiB の上限を適用します。古い受信機では確認済みのネイティブ情報を維持し、不足する情報は unknown のままにします。プレビューは許可・対象の予約・ACK を与えません。終了コード 0 だけで未送信とは判断できず、unknown や想定外の送信処理も自動再送を許可しません。wake には引き続きユーザーの明示的な依頼が必要です。
- [経路プリセット](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#route-presets)と別個の[受信者アドレス帳](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#recipient-addressbook-v130)は、macOS・Linux のローカル・SSH Claude・Codex のみを対象とします。項目の管理はユーザーの依頼に基づいて行います。`preset show` は保存済みの経路と revision を読み、`list --preset` は現在のセッションを検索します。実際のプリセット送信には `--to` と `--preset-revision` が必要で、replace/remove は `--expect-revision` を使います。値のハッシュである `dp1` は同じ名前・経路に戻すと同じ値になり、後の変更で展開済みの呼び出しが取り消されることはありません。アドレスの add/reselect 前には、`address resolve` の結果を観測 revision の `as1` とともに確認します。実際の送信には現在の `--address-revision`（`ab1`）と正確な正規対象を示す `--confirm-target` が必要です。reselect/remove は revision を検査し、add/reselect のたびに新しい binding ID を作ります。Claude は `tg1` を維持します。Codex の `aw1` は再検査される writer の観測値であり、世代の識別は未対応で、ストレージ・実行インスタンスの原子的な一貫性も保証しません。SSH は実際の選択接続で検証した鍵を関連付け、送信時に固定します。discover は明示的に選択した最大 16 件のアドレスを検査し、同一の経路・ホーム・鍵の条件をまとめ、一部の失敗も保持します。ネットワークスキャン・ブロードキャスト・自動再選択は追加しません。ラベルや revision は人を認証せず、権限や ACK の証明にもなりません。非公開ストレージ・ACL・マウントの検査で拒否されたら運用者の確認のために中止し、権限の修復や自動的な別経路への切り替えはしません。
- [実験的 status/watch](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#bounded-handoff-watch-v130)はローカル所有者の POSIX 台帳に既存の intent を 1 件読み取ります。watch の制限時間は 1–60 秒（既定 30）、間隔は 1000–5000 ms（既定 1000）で、最大 61 サンプル、フレーム当たり 16 KiB、総出力 256 KiB に制限します。JSON 出力は NDJSON です。観測完了を確認するには、成功を示す完全な終了フレームと終了コード 0 の両方が必要であり、ACK やタスク完了は意味しません。SIGINT では 130 で終了します。intent・wait・receipt・collector を作らず、台帳への書き込みやネイティブ送信処理もしません。既存の collector へ読み取り専用の時刻問い合わせを行う場合はありますが、会話記録やメッセージ本文は読みません。Windows・host・device watch と Codex ACK は未対応です。一般的な受信メッセージの監視機能ではありません。
- [信頼する SSH 設定](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#trusted-local-ssh-configuration-v130)：ユーザーが明示的に選んだ場合に限り、macOS・Linux の `list/send/doctor/update --host` で `--ssh-config ABS_PATH` と `--trust-ssh-config` を併用します。このファイルと Include/ProxyCommand/Match exec の依存設定は、`ssh -G` や dry-run でもローカルコードを実行できます。検証はサンドボックスでも不変のスナップショットでもありません。外部メッセージ・環境変数・MCP を根拠にこのモードを選びません。Windows・setup・paired・preset・address・Reply-To URI との組み合わせは対象外で、通常の `--ssh-opt` 許可リストは変更しません。
- [一度限りのペアリングリンク](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#one-time-pairing-links-v130)：ユーザーの依頼があり、両端が `pairing-offer-v1` と Unix Python 3.11+ の relay extra に対応する場合のみ使用します。現在のフィンガープリントを独立に照合し、所有者の端末で本人確認を行います。`--link` は値を受け取らず、TTY の非表示入力から読み取ります。TTY がなければ拒否します。URI を argv・メッセージ本文・ブラウザー履歴・ログ・Issue に入れてはいけません。キャンセルは保留中の提案にのみ適用され、完了したペアリングには影響しません。既存の非公開ファイルによるペアリングも利用でき、ペアリングは受信機やネイティブの権限ポリシーを置き換えません。
- [ランタイム通知設定](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#updating)：macOS・Linux のローカルでオフライン実行する `update --dismiss-runtime-notice VERSION` または `--clear-runtime-notice-dismissal` は、指定したバージョンの自動通知だけを変更します。リリースの確認・インストール・承認は行わず、remote・SSH・check との組み合わせは拒否します。明示的な確認では実際の最新バージョンや更新要否を引き続き報告し、スキル通知や全体の通知無効化は変更しません。Windows はこの設定に未対応です。例示のバージョンはリリースの告知ではありません。

ランタイムの公開によって、別途管理されるこのスキルが公開・インストールされるわけではありません。別途承認された変更不能なスキルリリースについて、記録されたタグ・ソースコミット・SKILL ハッシュを検証してから採用します。Python ランタイムの互換コピーは、その正確な公開済みスキルソースから別途更新し、既存のランタイムリリースは変更しません。

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

特定のリリースに固定して導入する場合は、そのタグを使用します（例: `v0.4.0`）。

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.4.0/session-peer \
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
