# AGENTS.md

React + Vite app with shadcn and Tailwind. Use `npm install`
`npm run format`
`npm run lint`
`npm run dev`
`npm run build`


# Skills

Use installed skills to maximize development performance and code quality.


## Installing new Agent Skills

- **Install location**: `~/.agents/skills/` only
- **Cursor only**: symlink to that directory (no copy)

```bash
npx skills add <owner/repo@skill> -g -a cursor -y
```

- `-g` — install to `~/.agents/skills/`
- `-a cursor` — symlink only for Cursor (not all agents)
- `-y` — skip prompts
