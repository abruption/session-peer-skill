# session-peer 技能

[English](README.md) · [한국어](README.ko.md) · [日本語](README.ja.md)

这是一个使用 [session-peer](https://github.com/abruption/session-peer) 查找本机或 SSH 主机上的 Claude Code、Codex 和正在运行的 Antigravity 会话并发送消息的代理技能。

本仓库只包含代理指令，不会安装 `session-peer` 运行时。

## 前置条件

安装 session-peer 0.9.1 或更高版本并确认版本：

```bash
pipx install session-peer
session-peer --version
```

uv、pip、POSIX 独立安装程序和原生 Windows 的安装方式请参阅 [session-peer 安装说明](https://github.com/abruption/session-peer#installation-options)。升级时应继续使用原有的包管理器。

## 安装技能

```bash
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

Skills CLI 会为 Claude Code 安装一份副本，并在 Codex 和 Antigravity 共用的 agents 目录中安装一份副本。如果当前代理会话没有自动刷新技能目录，请启动新会话。

```bash
npx -y skills@latest list --global --json
```

## 更新

```bash
npx -y skills@latest update session-peer --global --yes
```

需要固定首个版本时，请安装 `v0.1.0` 标签：

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.1.0/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## 发布来源

本仓库中的 `session-peer/SKILL.md` 是公开技能的唯一正式版本。session-peer 运行时仓库中保留的副本只是迁移期间的兼容快照。CLI 命令和传输行为仍由 [session-peer 仓库](https://github.com/abruption/session-peer)维护。

## 许可证

MIT
