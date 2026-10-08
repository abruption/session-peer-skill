<div align="center">

# session-peer 技能

[English](README.md) · [한국어](README.ko.md) · [日本語](README.ja.md)

这是一项智能体技能，使用 [session-peer](https://github.com/abruption/session-peer) 查找 Claude Code、Codex 和已注册且正在运行的 Antigravity 会话并向其发送消息。可在本机或通过 SSH 使用，也可选择使用配对设备传输。

</div>

## 演示

![在 Claude Code 和 Codex 之间交换消息的 session-peer 运行时](https://raw.githubusercontent.com/abruption/session-peer/v1.0.1/docs/assets/session-peer-live-codex-claude.gif)

运行时演示展示 Claude Code 与 Codex 之间的消息传递；技能提供智能体指令。

## 快速开始

基本 Python CLI 命令需要 session-peer 0.9.1 或更高版本。本技能介绍的全部 Python CLI 功能需要 session-peer 1.0.1 或更高版本。配对设备传输为可选功能，需要 `session-peer[relay]` 附加依赖项（Unix、Python 3.11 或更高版本）。
如需获得 v1.0.3 安全修复，请使用 Python 运行时 1.0.3 或更高版本。上述兼容版本是 CLI 功能门槛，并非安全建议版本。

### 安装

请分别安装运行时和技能：

```bash
pipx install session-peer
session-peer --version
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
npx -y skills@latest list --global --json
```

Skills CLI 会创建 Claude Code 专用副本，以及供 Codex 和 Antigravity 共用的副本。如果技能目录使用了缓存，请开启新的智能体会话。

### 更新

```bash
pipx upgrade session-peer
npx -y skills@latest update session-peer --global --yes
```

上面的运行时更新命令适用于通过 pipx 安装的情况；请继续使用安装运行时所用的包管理器。运行时升级不会更新技能。其他安装方式和固定版本安装请参阅使用指南。

`queued` 或 `submitted` 状态不代表接收方已消费该消息。提交结果不确定时不要自动重发。Codex 回复等待流程请参阅使用指南。

npm TypeScript 运行时使用独立的 `session-peer-ts` 技能。指定智能体、项目/全局适用范围和经审查提交版本的安装步骤，请参阅 [TypeScript 设置指南](docs/typescript.md)。

## 文档

- [TypeScript 技能的安装、固定版本更新与移除](docs/typescript.md)
- [安装方式、固定版本、兼容性与回复等待](docs/usage.zh-CN.md)
- [已发布的智能体指令](session-peer/SKILL.md)
- [开发与发布流程（英文）](CONTRIBUTING.md)
- [运行时 CLI 参考（v1.0.4）](https://github.com/abruption/session-peer/blob/v1.0.4/docs/cli-reference.md)

## 许可证

[MIT](LICENSE)

## 支持与安全

技能文档或安装问题请通过[问题反馈页](https://github.com/abruption/session-peer-skill/issues/new)提交。CLI 或传输问题请使用[运行时问题跟踪页](https://github.com/abruption/session-peer/issues)。

请按照包含邮件备用联系方式的[维护者安全策略](https://github.com/abruption/session-peer/blob/main/SECURITY.md)私下报告漏洞。不要在公开 Issue 中发布机密信息、对话内容或会话标识符。
