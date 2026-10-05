# session-peer 技能

[English](README.md) · [한국어](README.ko.md) · [日本語](README.ja.md)

这是一个使用 [session-peer](https://github.com/abruption/session-peer) 查找本机、SSH 主机或可选配对设备上的 Claude Code、Codex 和正在运行的 Antigravity 会话并发送消息的代理技能。

## 演示

![在 Claude Code 和 Codex 之间交换消息的 session-peer 运行时](https://raw.githubusercontent.com/abruption/session-peer/v1.0.1/docs/assets/session-peer-live-codex-claude.gif)

运行时演示展示 Claude Code 与 Codex 的消息传输；技能提供代理指令。

## 快速开始

需要 session-peer 0.9.1 或更高版本；使用文档中的全部功能需要 session-peer 1.0.1 或更高版本。可选的配对设备传输需要 Unix、Python 3.11 或更高版本以及 `session-peer[relay]`。
为获得 v1.0.3 安全修复，建议使用 Python 运行时 1.0.3 或更高版本。上述兼容版本是 CLI 功能门槛，与安全推荐版本不同。

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

Skills CLI 创建 Claude Code 副本和 Codex/Antigravity 共用副本。如果技能列表已被缓存，请打开新的代理会话。

### 更新

```bash
pipx upgrade session-peer
npx -y skills@latest update session-peer --global --yes
```

上面的运行时更新命令适用于 pipx 安装。请继续使用原来的运行时包管理器。运行时升级不会更新技能。其他安装方式和固定版本安装请参阅使用指南。

排队或提交不代表接收方已读取。提交结果不确定时不要自动重发。Codex 回复等待流程见使用指南。

npm TypeScript 运行时使用独立的 `session-peer-ts` 技能。指定代理、项目/全局范围及已审查提交的安装步骤请参阅 [TypeScript 设置指南](docs/typescript.md)。

## 文档

- [TypeScript 技能安装、固定更新与移除](docs/typescript.md)
- [安装方式、固定版本、兼容性与回复等待](docs/usage.zh-CN.md)
- [正式发布的代理指令](session-peer/SKILL.md)
- [开发与发布流程（英语）](CONTRIBUTING.md)
- [运行时 CLI 参考（v1.0.3）](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md)

## 许可证

[MIT](LICENSE)

## 支持与安全

技能文档或安装问题请提交 [Issue](https://github.com/abruption/session-peer-skill/issues/new)。CLI 或传输问题请使用 [运行时 Issue](https://github.com/abruption/session-peer/issues)。

请按照包含邮件备用联系方式的 [维护者安全政策](https://github.com/abruption/session-peer/blob/main/SECURITY.md) 私下报告漏洞。不要在公开 Issue 中发布秘密信息、对话内容或会话标识符。
