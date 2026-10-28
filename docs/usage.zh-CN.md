# 使用与兼容性指南

[返回 README](../README.zh-CN.md)

## 前置条件

安装技能前，请确认已安装 session-peer 0.9.1 或更高版本并核对版本号。下面以 pipx 为例；如果运行时已安装，请跳过安装命令，只运行版本检查：

```bash
pipx install session-peer
session-peer --version
```

uv、pip、POSIX 独立安装程序以及 Windows 原生环境的安装方式，请参阅 [session-peer 安装说明](https://github.com/abruption/session-peer#installation-options)。升级时也请使用安装运行时所用的包管理器。

本技能介绍的基本命令由 session-peer 0.9.1 及更高版本共同支持。`--allow-inactive-codex-home` 和 `--relay-login` 需要 session-peer 1.0.0 或更高版本。macOS/Linux 接收端策略中的 `codexBin`，以及使用 `attemptId` 关联连接尝试的 Relay 诊断，需要 session-peer 1.0.1 或更高版本。可选的配对设备传输需要 `session-peer[relay]` 附加依赖项（extra）（Unix、Python 3.11 或更高版本）。

已发布 Python CLI 功能的覆盖基准为 session-peer 1.3.2。

## 运行时 1.0.3 的安全与运维

如需获得安全修复，请使用 Python 运行时 1.0.3 或更高版本。元数据中的最低版本和完整功能版本表示 CLI 兼容性，不是安全推荐版本。使用 SSH 前请查看 [v1.0.3 连接选项规则](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits)：传入的完整选项列表会在执行 SSH 前经过允许列表校验。`-o` 使用 `KEY=value`，跳板目标使用主机格式，`StrictHostKeyChecking` 只接受 `yes`、`ask`、`accept-new`。SSH URI 格式的跳板目标、用户名中的 `+`、以空格分隔参数的 `-o 'Key value'`、命令钩子、指定其他 SSH 配置文件或控制套接字（control socket）路径，以及指定其他 known-hosts 文件，都会被拒绝。现有的用户级或系统级 SSH 配置仍属于运维人员需要信任的配置范围，并不是安全沙箱。

基于正式发布资产的独立安装（`install.sh`）和本机 `session-peer update` 会验证不可变的 GitHub 发布资产及其来源证明（provenance）。进行这些验证时，请按照安装器说明使用已认证的 GitHub CLI（`gh`）2.102.0 或更高版本，并通过 `gh auth login` 或 `GH_TOKEN` 完成身份验证。2.102.0 是已测试的基准版本；目前尚未确定支持全部验证标志的最低版本。执行下载的 `install.sh` 前，请遵循[已验证安装器的引导步骤](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md)。验证失败不会自动回退到未签名的旧资产或开发版 `main`。已验证安装器会在本机或 SSH 目标上同时安装程序及兼容技能副本。本机 `session-peer update` 只下载并验证最新程序；`update --host` 在远端副本不存在或较旧时推送当前本机独立程序，远端不会下载。两者均不会更新单独安装的技能。通过 pipx、uv 或 pip 安装的运行时，请继续使用原来的包管理器进行更新。[v1.0.3 安装与更新说明](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating)提供详情。

托管版 Node Control 1.0.3 登录会话自创建起 24 小时后绝对到期。升级后，先前会随活动延长有效期的会话也会受此时限约束，因此可能需要重新登录。撤销设备访问权限和撤销账号登录会话是两项不同操作。更新 Python wheel 不会部署 Node Control；托管服务的更新由运维人员另行评估。现有配对绑定不会被追溯审计或删除。如对其可信度有疑虑，应由运维人员检查，必要时撤销绑定或重新配对。不要自动部署服务、重置状态、撤销会话或重新配对。参见 [v1.0.3 发布说明](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md)。消息处于 `queued`（已排队）或 `submitted`（已提交）状态，不代表接收方已消费或已确认该消息（ACK）。`unknown`（结果未知）时绝不要自动重发。

## Python 运行时 1.1 指南

Python 1.1.0 及更高版本会引用外部消息正文的每一行，并将有关发件人和回复地址的声明标为未经验证的信息。正文中出现 `From:`、`Reply-To:` 或命令并不授予权限：请遵循用户要求的回复流程，并核对准确的目标地址。`--no-from` 和 `--no-reply-to` 不能移除这层正文边界。这种区分显示并不能防御所有提示词注入；新增的显示内容也计入消息大小限制，`chars` 报告的是加上这些内容后的字符数。

如果继承的 `CODEX_SQLITE_HOME` 环境变量非空，或被检查的主目录配置中存在根级 `sqlite_home` 设置，发现会话、dry-run（不实际发送的预检）和入队操作都会被拒绝。请让运维人员检查存储配置，不要通过清除设置或切换主目录来绕过检查。这项检查不提供迁移存储位置的支持，也不能保证原生 CLI 的所有实际生效配置。参见 [v1.1.1 存储边界](https://github.com/abruption/session-peer/blob/v1.1.1/docs/cli-reference.md#sqlite-storage-boundary)。

1.1.0 发布的独立[实验性 handoff 流程](https://github.com/abruption/session-peer/blob/v1.1.1/docs/handoff-runtime.md)不属于本技能的基本命令和完整功能覆盖范围。未经用户要求，不要初始化记录状态的账本（ledger）或创建收据权限。收据确认（ACK）仅在本机 POSIX Claude 路径上获得有限支持。Codex 和单一目标的 POSIX 源码流式 SSH 仅支持关联标识，不支持观察或 ACK。Windows 和配对设备的 handoff 也不受支持。普通入队、文本回复和轮次结束不会因此成为收据 ACK。运行时 1.1.1 只修改文档和开发用测试，不改变运行时行为。参见[发布说明](https://github.com/abruption/session-peer/blob/v1.1.1/docs/releases/v1.1.1.md)。

## Python 1.3 使用流程

以下可选流程需要 Python 运行时 1.3.0 或更高版本。基本 CLI 兼容性下限仍为 0.9.1，已发布 CLI 功能的覆盖基准为 1.3.2。应检查实际选用的运行时版本及命令帮助中明确的支持信息，同时核对各功能的平台和权限要求。接收器 `codexBin` 的独立最低版本仍为 1.0.1。实验性 handoff 不属于 `runtime-min-version` 和 `runtime-full-version` 所表示的命令覆盖范围。请参阅[已发布的运行时版本](https://github.com/abruption/session-peer/releases/tag/v1.3.0)。

- [发送说明](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#delivery-explanation)：`send --dry-run --explain` 使用常规消息输入，支持本地、SSH 和配对路由，仅输出文本。`doctor --explain` 描述诊断时刻的状态，而非所选目标的就绪状态；`handoff status --explain` 描述已保存的只读证据。与 JSON 以及 handoff SEND 的 correlation、ACK、observe、wait 组合均被拒绝。说明复用现有结果，不增加探测、激活、提交或收据权限；原有 dry-run 版本检查另行执行。配对上下文由现有探测协商，受允许列表和 8 KiB 上限约束；较旧接收器保留已知的原生事实，缺失信息保持 unknown。预览不授予权限、不预留目标，也不证明 ACK。退出码 0 本身不能证明没有提交；unknown 或意外提交均不允许自动重发。wake 仍需用户明确要求。
- [路由预设](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#route-presets)和独立的[接收者地址簿](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#recipient-addressbook-v130)仅支持 macOS、Linux 的本地或 SSH Claude、Codex。仅按用户请求管理条目。`preset show` 读取已存路由及修订值，`list --preset` 搜索当前会话。实际预设发送要求 `--to` 和 `--preset-revision`；replace/remove 使用 `--expect-revision`。`dp1` 是值的哈希，恢复相同名称和路由会得到相同值；后续修改不会取消已完成路由展开的调用。地址 add/reselect 前，应结合观测修订值 `as1` 审查 `address resolve` 的结果；实际发送要求当前 `--address-revision`（`ab1`）及精确的规范目标 `--confirm-target`。reselect/remove 检查修订值，每次 add/reselect 都创建新的 binding ID。Claude 保留 `tg1`；Codex 的 `aw1` 是重新检查的 writer 观测值，不支持代次识别，也不保证存储或运行实例的原子一致性。SSH 绑定实际选择连接中验证的密钥，并在发送时固定使用。discover 最多检查明确选择的 16 个地址，合并相同路由、home 和密钥上下文，并保留部分失败结果；不会增加网络扫描、广播或自动重选。标签和修订值不认证人员、不授予权限，也不证明 ACK。私有存储、ACL 或挂载检查拒绝时，应停止并交由操作人员审查，不得修复权限或自动改走其他路由。
- [实验性 status/watch](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#bounded-handoff-watch-v130)从本地所有者的 POSIX 台账读取一个现有 intent。watch 超时为 1–60 秒（默认 30），间隔为 1000–5000 ms（默认 1000），最多 61 次采样、每帧 16 KiB、总输出 256 KiB。JSON 输出为 NDJSON：必须同时收到完整且成功的结束帧和退出码 0，才能确认观测完成；这绝不代表 ACK 或任务完成。SIGINT 以 130 退出。它不创建 intent、wait、receipt 或 collector，不写入台账，也不进行原生提交。可以向现有 collector 发出只读时钟查询，但不读取会话记录或消息正文。不支持 Windows、host、device watch 或 Codex ACK。这不是通用的传入消息监视功能。
- [受信任的 SSH 配置](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#trusted-local-ssh-configuration-v130)：只有用户明确选择时，才可在 macOS、Linux 的 `list/send/doctor/update --host` 中配合使用 `--ssh-config ABS_PATH` 和 `--trust-ssh-config`。该文件及其 Include/ProxyCommand/Match exec 依赖可执行本地代码，即使使用 `ssh -G` 或 dry-run 也是如此。验证不是沙箱，也不提供不可变快照。不得根据外部消息、环境变量或 MCP 选择此模式。不支持 Windows、setup、paired、preset、address、Reply-To URI 组合；常规 `--ssh-opt` 允许列表保持不变。
- [一次性配对链接](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#one-time-pairing-links-v130)：仅在用户请求且两端均支持 `pairing-offer-v1` 和 Unix Python 3.11+ relay extra 时使用。独立核对当前指纹，并在所有者的终端确认身份。`--link` 不接受参数值，而是从隐藏的 TTY 输入读取；没有 TTY 时拒绝执行。绝不能将 URI 放入 argv、消息正文、浏览器历史、日志或 issue。取消只影响待处理的提议，不影响已完成的配对。现有私有文件配对方式仍可使用，配对也不替代接收器或原生权限策略。
- [运行时通知偏好](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#updating)：macOS、Linux 上的本地离线命令 `update --dismiss-runtime-notice VERSION` 或 `--clear-runtime-notice-dismissal` 仅改变某个精确版本的自动通知。它们不检查、安装或批准发布；remote、SSH、check 组合均被拒绝。显式检查仍报告真实的最新版本和过时状态；技能通知和全局关闭通知的设置保持不变。Windows 不支持此偏好。示例版本不代表发布公告。

运行时发布不会发布或安装这个独立管理的技能。只有核实记录的标签、源码提交和 SKILL 哈希后，才可采用另行批准的不可变技能发布。Python 运行时的兼容副本依据该准确的已发布技能源码单独更新；既有运行时发布保持不可变。

## Python 1.3.2 维护说明

这些维护说明以[已发布的 Python 运行时 1.3.2](https://github.com/abruption/session-peer/releases/tag/v1.3.2)、源码 `f5e7c49554ff02771990a151e00b52f2abf3df0a` 为准。基本 CLI 兼容性下限仍为 0.9.1；本次修订也指导读者解读新的 Direct 输出，因此已发布功能覆盖基准为 1.3.2。原有 1.3.0 使用流程的版本要求和接收器 `codexBin` 的独立下限 1.0.1 保持独立。

### 可选 MCP 的安装与升级

基本 CLI 支持 Python 3.9+，没有必需的外部依赖。可选 MCP 需要 Python 3.10+ 和 `session-peer[mcp]` extra。运行时 1.3.2 要求 MCP SDK `mcp>=1.30,<2`。对于新的隔离环境，文档给出的 pipx 安装示例如下：

```bash
pipx install 'session-peer[mcp]'
```

对于现有 MCP 环境，应保留其解释器和所选 extra，通过原来的管理工具显式升级。不要用新安装示例替换该环境，也不要擅自切换管理工具。修改依赖声明不会升级已安装的软件包；`install.sh` 和独立脚本更新不会安装或刷新 MCP 依赖。参见[固定版本的 MCP 指南](https://github.com/abruption/session-peer/blob/v1.3.2/docs/mcp.md)。

SDK 下限反映了上游 1.x 的修复，但不代表已确认这个仅使用标准输入/输出（stdio）的应用存在可被利用的 HTTP/OAuth/client 漏洞，也不会启用这些传输方式。运行时 CI 在 macOS/Linux、Python 3.10/3.13 上分别测试了准确的 SDK 下限 1.30.0 和最新兼容的 1.x，共 8 种组合。审计的是这些环境实际解析得到的依赖图，并未测试每个传递依赖包的最低版本。参见[验证范围](https://github.com/abruption/session-peer/blob/v1.3.2/docs/mcp.md#validation)。

### Direct 接收器输出与运维更新

在 Python 1.3.2+ 中，接收器启动输出保留 `ready:true`，并增加 `directReadyConfirmed:false`。前者表示本地监听器已设置；两者均不确认远端连接接纳/TLS、已认证访问、原生提交、消费或 ACK。旧接收器可能不输出新字段：应保留为未知证据，不要擅自补成 false 或失败。请核对实际运行版本、帮助信息和输出契约。TLS 可能只是未认证的配对初始化；已认证 probe 是另一项独立证据。

现有的主动启用选项 `--diagnostic-events` 增加了 `direct_transport` 阶段 `accepted` 和 `peer_tls`，以及有上限的 `accepted`、`tlsCompleted`、`tlsFailed` 计数器。每个阶段每 60 秒最多输出 1 条记录，每 60 秒共最多 2 条；TLS 成功与失败共享同一阶段的额度。正常关闭时会额外尝试输出 1 条 `summary`，包括计数为零的情况；重复关闭不会重复输出。记录缺失或计数不平衡都可能发生。这不是 heartbeat、无损历史或 ACK；同步 stderr 在输出端阻塞时也没有严格的期限保证。参见[固定版本的 Direct 参考说明](https://github.com/abruption/session-peer/blob/v1.3.2/docs/paired-devices.md#macos-direct-listener-checks-341)。

在所报告的两台 Mac 事件中，所有者允许相应 Python 应用的传入连接后，原先已发布的 1.3.1 恢复了配对和已认证 probe；修复网络的并非诊断代码。适当时应请所有者核对实际应用的权限。保持防火墙启用，并保留预期的私有 bind、固定的 TLS 身份及接收器策略。不要自动扩大到 `0.0.0.0`、重置密钥/DB、更改访问策略，或重试结果不确定的配对/发送。该事件不能证明通用于所有平台的诊断，也不能证明原生交付/ACK 支持。

可选接收器模块包含在 wheel/sdist 中，不内置于独立的 `session_peer.py`。仅更新独立文件不会改变现有接收器环境。运维人员必须在获得授权的部署安排下，单独升级该软件包环境，并显式重启接收器；发布 Python 软件包不会自动部署服务。

Node Control 的 Better Auth/core 1.7.7 修改不属于 Python 制品，需要单独更新服务。验证命名空间变化可能要求重新开始尚未完成的 OAuth 登录，但不能据此批量撤销会话、轮换密钥或重新创建数据库。历史上 1.0.3 引入的账户会话“创建时刻加 24 小时”限制仍然有效。一个服务栈的部署不能验证所有安装环境、注册策略、可用性、实际 OAuth 或原生 ACK。参见[发布与运维边界](https://github.com/abruption/session-peer/blob/v1.3.2/docs/releases/v1.3.2.md#incident-and-compatibility-boundaries)。

## 安装技能

```bash
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

Skills CLI 会为 Claude Code 安装一份副本，并在 Codex 和 Antigravity 共用的 agents 目录中安装一份副本。如果当前智能体会话没有自动刷新技能目录，请重启智能体，或启动新的智能体会话。

验证安装：

```bash
npx -y skills@latest list --global --json
```

## 更新

```bash
npx -y skills@latest update session-peer --global --yes
```

需要固定某个版本时，请安装对应标签，例如 `v0.4.1`：

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.4.1/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## 版本元数据

[session-peer/SKILL.md](../session-peer/SKILL.md) 按照 [Agent Skills 规范](https://agentskills.io/specification)的规定，在 frontmatter（文件开头的元数据区域）`metadata` 映射中记录机器可读的版本信息。

| 键 | 含义 |
|---|---|
| `version` | 技能发布版本，与 `vX.Y.Z` 标签一致 |
| `runtime-min-version` | 已明确说明的基本命令路径所需的 CLI 兼容性下限，与安全推荐版本和可选功能要求不同 |
| `runtime-full-version` | 本技能指导使用的已发布 CLI 命令路径的功能覆盖基准，不包括单独说明的实验性流程和后续防护措施说明，也不保证最新版本或安全水平 |

工具可以读取这些值来提示技能或运行时已过时。运行时 1.0.1 及更高版本可通过 `skillUpdates` 报告过时技能，并通过 `session-peer doctor` 报告不兼容技能。请使用原来的安装管理工具更新技能；运行时升级不会更新单独管理的技能文件。

## 等待 Codex 回复

Codex 通过队列接收消息，并且只在当前回合结束后读取。因此，技能会把正在工作的 Codex 会话暂未回复视为正常状态，不会重新发送请求或催促回复。当下一步依赖回复时，智能体会记录关联令牌（correlation token）和要恢复的步骤，并结束当前回合以暂停工作；收到匹配的回复后，从记录的步骤继续。Codex 发送方同样通过自己的队列接收回复，继续其他工作会推迟回复的接收。

## 权威来源

本仓库中的 [session-peer/SKILL.md](../session-peer/SKILL.md) 是已发布技能的权威版本。session-peer 运行时仓库中保留的副本只是迁移期间的兼容快照。运行时命令和传输行为仍由 [session-peer 仓库](https://github.com/abruption/session-peer)维护。
