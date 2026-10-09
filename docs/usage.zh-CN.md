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

## 运行时 1.0.3 的安全与运维

如需获得安全修复，请使用 Python 运行时 1.0.3 或更高版本。元数据中的最低版本和完整功能版本表示 CLI 兼容性，不是安全推荐版本。使用 SSH 前请查看 [v1.0.3 连接选项规则](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits)：传入的完整选项列表会在执行 SSH 前经过允许列表校验。`-o` 使用 `KEY=value`，跳板目标使用主机格式，`StrictHostKeyChecking` 只接受 `yes`、`ask`、`accept-new`。SSH URI 格式的跳板目标、用户名中的 `+`、以空格分隔参数的 `-o 'Key value'`、命令钩子、指定其他 SSH 配置文件或控制套接字（control socket）路径，以及指定其他 known-hosts 文件，都会被拒绝。现有的用户级或系统级 SSH 配置仍属于运维人员需要信任的配置范围，并不是安全沙箱。

基于正式发布资产的独立安装（`install.sh`）和本机 `session-peer update` 会验证不可变的 GitHub 发布资产及其来源证明（provenance）。进行这些验证时，请按照安装器说明使用已认证的 GitHub CLI（`gh`）2.102.0 或更高版本，并通过 `gh auth login` 或 `GH_TOKEN` 完成身份验证。2.102.0 是已测试的基准版本；目前尚未确定支持全部验证标志的最低版本。执行下载的 `install.sh` 前，请遵循[已验证安装器的引导步骤](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md)。验证失败不会自动回退到未签名的旧资产或开发版 `main`。已验证安装器会在本机或 SSH 目标上同时安装程序及兼容技能副本。本机 `session-peer update` 只下载并验证最新程序；`update --host` 在远端副本不存在或较旧时推送当前本机独立程序，远端不会下载。两者均不会更新单独安装的技能。通过 pipx、uv 或 pip 安装的运行时，请继续使用原来的包管理器进行更新。[v1.0.3 安装与更新说明](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating)提供详情。

托管版 Node Control 1.0.3 登录会话自创建起 24 小时后绝对到期。升级后，先前会随活动延长有效期的会话也会受此时限约束，因此可能需要重新登录。撤销设备访问权限和撤销账号登录会话是两项不同操作。更新 Python wheel 不会部署 Node Control；托管服务的更新由运维人员另行评估。现有配对绑定不会被追溯审计或删除。如对其可信度有疑虑，应由运维人员检查，必要时撤销绑定或重新配对。不要自动部署服务、重置状态、撤销会话或重新配对。参见 [v1.0.3 发布说明](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md)。消息处于 `queued`（已排队）或 `submitted`（已提交）状态，不代表接收方已消费或已确认该消息（ACK）。`unknown`（结果未知）时绝不要自动重发。

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

需要固定某个版本时，请安装对应标签，例如 `v0.3.3`：

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.3.3/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## 版本元数据

[session-peer/SKILL.md](../session-peer/SKILL.md) 按照 [Agent Skills 规范](https://agentskills.io/specification)的规定，在 frontmatter（文件开头的元数据区域）`metadata` 映射中记录机器可读的版本信息。

| 键 | 含义 |
|---|---|
| `version` | 技能发布版本，与 `vX.Y.Z` 标签一致 |
| `runtime-min-version` | 技能支持的最低 session-peer 运行时版本 |
| `runtime-full-version` | 使用技能所述全部选项所需的运行时版本 |

工具可以读取这些值来提示技能或运行时已过时。运行时 1.0.1 及更高版本可通过 `skillUpdates` 报告过时技能，并通过 `session-peer doctor` 报告不兼容技能。请使用原来的安装管理工具更新技能；运行时升级不会更新单独管理的技能文件。

## 等待 Codex 回复

Codex 通过队列接收消息，并且只在当前回合结束后读取。因此，技能会把正在工作的 Codex 会话暂未回复视为正常状态，不会重新发送请求或催促回复。当下一步依赖回复时，智能体会记录关联令牌（correlation token）和要恢复的步骤，并结束当前回合以暂停工作；收到匹配的回复后，从记录的步骤继续。Codex 发送方同样通过自己的队列接收回复，继续其他工作会推迟回复的接收。

## 权威来源

本仓库中的 [session-peer/SKILL.md](../session-peer/SKILL.md) 是已发布技能的权威版本。session-peer 运行时仓库中保留的副本只是迁移期间的兼容快照。运行时命令和传输行为仍由 [session-peer 仓库](https://github.com/abruption/session-peer)维护。
