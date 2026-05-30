# freaky-discord-bot

this bot is a discord music bot mainly built for a private discord server where i hangout with my buddies and game. 

Feel free to use the soruce code to create our own bot and use it by hosting it on your pc with docker or running it locally by cloning the repo.

before running the bot, follow the steps below

- log into your discord dev console. create new application (Application -> New Application)

- Go to 'General Information' in overview. copy the application ID. that is the CLIENT_ID

- go to 'Bot' in overview, click on token reset button and copy the token. That is the DISCORD_TOKEN

## NOTE:
run these commands once and ONLY ONCE.
```bash
npm run build

node dist/commands/deploy-commands.js
```
deploy-commands.js is a independent script used to register and deploy slash commands to discord. this file should be executed only ONCE when u make changes to slash command. 

check discord.js docs for reference and more info -> [docs](https://discordjs.guide/legacy/app-creation/deploying-commands)
## set env var 
create .env in the root.

```
DISCORD_TOKEN=
CLIENT_ID=
```

## Run the bot locally
1. clone
```bash
git clone https://github.com/Pranav1703/Freaky-bot.git
```

2. build 
```bash
npm run build
```

3. start
```bash
node start
```

## self host using docker
1. clone
```bash
git clone https://github.com/Pranav1703/Freaky-bot.git
```

2. run container
```bash
docker compose up
```
this command automatically builds the image from source code and starts a container.

