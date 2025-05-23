# KAISAR NETWORK

Your compute, your currency
Transform your compute power into real earnings

![banner](image.png)

# Kaisar Beta Cli Mode
## Update:
- Add auto spin:
  ```bash
  npm run spin
  ```

## Features

- Support Multy accounts.
- Support Proxy.

## Requirements

- Node.js 20+
- Dependencies installed via `npm install`

## Files

- **if you already have account you can create file manually**
- `tokens.txt`: Stores access_tokens each line 1 account.
- `id.txt`: Stores Extension IDs each line 1 account.
- `proxy.txt`: stores Proxy url format `http://user:pass@ip:port` each line 1 proxy.
- **if you register using cli, file above auto filled, just fill `email.txt` with your email.**
- `emails.txt`: Store email account 1 line 1 account.

## Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/Zlkcyber/kaisar-bot.git
   cd kaisar-bot
   ```
2. install dependencies:
   ```bash
   npm install
   ```
3. Login to get Access Token
   ```bash
   npm run login
   ```
4. Create Extension ID for new account
   ```bash
   npm run setup
   ```
5. Run the bot:
   ```bash
   npm run start
   ```
