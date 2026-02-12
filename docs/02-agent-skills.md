# Browse agent skills

[skills.sh](https://skills.sh/vercel-labs/skills/find-skills)

# Install First agent skill

You can install skill from command line
NOTE:
- pick agent: Claude Code
- Global
- Copy

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills

Need to install the following packages:
skills@1.3.8
Ok to proceed? (y) y

███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝

┌   skills 
│
◇  Source: https://github.com/vercel-labs/skills.git
│
◇  Repository cloned
│
◇  Found 1 skill
│
●  Selected 1 skill: find-skills
│
◇  39 agents
◆  Which agents do you want to install to?
│
│  ── Universal (.agents/skills) ──────────────────────────────
│    ✓ Amp
│    ✓ Codex
│    ✓ Gemini CLI
│    ✓ GitHub Copilot
│    ✓ Kimi Code CLI
◆  Which agents do you want to install to?
│
│  ── Universal (.agents/skills) ──────────────────────────────
│    ✓ Amp
│    ✓ Codex
│    ✓ Gemini CLI
│    ✓ GitHub Copilot
│    ✓ Kimi Code CLI
◆  Which agents do you want to install to?
│
│  ── Universal (.agents/skills) ──────────────────────────────
│    ✓ Amp
│    ✓ Codex
│    ✓ Gemini CLI
│    ✓ GitHub Copilot
│    ✓ Kimi Code CLI
◇  Which agents do you want to install to?
│  Amp, Codex, Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, Claude Code
│
◇  Installation scope
│  Project
│
◇  Installation method
│  Copy to all agents

│
◇  Installation Summary ───────────────────────────────────────────────────╮
│                                                                          │
│  ~/workspace/stem/ui-training/ui-training/.agents/skills/find-skills     │
│    copy → Amp, Codex, Gemini CLI, GitHub Copilot, Kimi Code CLI +2 more  │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────╯
│
◇  Proceed with installation?
│  Yes
│
◇  Installation complete

│
◇  Installed 1 skill ───────────────────────────────────────────────────────╮
│                                                                           │
│  ✓ find-skills (copied)                                                   │
│    → ~/workspace/stem/ui-training/ui-training/.agents/skills/find-skills  │
│    → ~/workspace/stem/ui-training/ui-training/.agents/skills/find-skills  │
│    → ~/workspace/stem/ui-training/ui-training/.agents/skills/find-skills  │
│    → ~/workspace/stem/ui-training/ui-training/.agents/skills/find-skills  │
│    → ~/workspace/stem/ui-training/ui-training/.agents/skills/find-skills  │
│    → ~/workspace/stem/ui-training/ui-training/.agents/skills/find-skills  │
│    → ~/workspace/stem/ui-training/ui-training/.claude/skills/find-skills  │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────╯
```

---


ask in cursor:

```
/find-skills list avaliable skills for Mastra.ai
```

```
/find-skills list avaliable skills for assistent-ui
```
```
/find-skills list avaliable skills for react
```