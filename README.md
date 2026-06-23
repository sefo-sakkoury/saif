#  MULTI-MUSIC BOT BY RTX 
▶️ simple and powerful music bot.
▶️ consisting of various commands.
▶️ Still in development you may face minor bugs|


## 🛠️ Installation

1. **Create a TOKEN Secret**: Generate a bot token from the Discord Developer Portal and add it to your bot.
2. **Install Dependencies**: Install all required Node.js modules using the following command:
> npm install

## 📜 Commands
/help: for available commands.
/play: plays music.
...

## 🔎 4-Letter Username Availability Export

Generate JSON records for 4-letter usernames (`a-z`) with availability labels:

```bash
npm run usernames:check
```

Notes:
- Default mode is simulated unless `--endpoint` (or `DISCORD_CHECK_URL`) is provided.
- Simulated mode prints a limitation notice to stderr.
- Real-time mode limits checks to 1000 by default to reduce rate-limit risk.

Examples:

```bash
# Simulated, first 100 entries
node util/discordUsernameAvailability.js --limit=100 --simulate=true

# Real-time endpoint (expects available:boolean or availability string in JSON)
node util/discordUsernameAvailability.js --endpoint=https://example.com/check --limit=500 --delay-ms=80

# Write output to file
node util/discordUsernameAvailability.js --output=/tmp/usernames.json
```

## 🤝 Contributing [Contact me on Discord]

**Contributions to this project are welcome! If you'd like to contribute, follow these steps:**

## Join Our Discord: Join our Discord server to connect with the community.
## Show Your Work: Share your contributions with the community.
## Bug Fixes: If you encounter any bugs or errors, please notify them.
## Commit Changes: Commit your changes to your forked repository.
## Pull Request: Submit a pull request with your changes.

# 📚 Copyright 

All code in this project is authored by RTX. Please do not use this code for any public usage, such as creating YouTube videos, Git repositories, etc., without my explicit permission.

/*

   MADE BY RTX!! FEEL FREE TO USE ANY PART OF CODE

  ██████╗░████████╗██╗░░██╗           
  ██╔══██╗╚══██╔══╝╚██╗██╔╝          
  ██████╔╝░░░██║░░░░╚███╔╝░          
  ██╔══██╗░░░██║░░░░██╔██╗░          
  ██║░░██║░░░██║░░░██╔╝╚██╗          
  ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          

   FOR EMOJIS EITHER YOU CAN EDIT OR JOIN OUR DISCORD SERVER 
   SO WE ADD BOT TO OUR SERVER SO YOU GET ANIMATED EMOJIS.

   DISCORD SERVER : https://discord.gg/FUEHs7RCqz
   YOUTUBE : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A

   FOR HELP CONTACT ME ON DISCORD
   ## Contact    [ DISCORD SERVER :  https://discord.gg/c4kaW2sSbm ]
*/z