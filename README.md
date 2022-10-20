# vue-node-github-api-mongo

# 🚀 A list of Vue.js libraries and plugins based on the Awesome-Vue repo 🚀

https://github.com/coding-to-music/vue-node-github-api-mongo

From / By https://github.com/ernestii/vuelibs.org

## Environment variables:

```java
Mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/vue-node-github-api-mongo');
if (process.env.ENV === 'prod' && process.env.LOGDNA_KEY) {
if (!process.env.OCTOKIT_TOKEN) {
BASE_URL=
PORT=
```

## GitHub

```java
git init
git add .
git remote remove origin
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:coding-to-music/vue-node-github-api-mongo.git
git push -u origin main
```

# Build for production

### Prerequisites:

- nodejs
- forever
- yarn
- set up nginx proxy on port 3001

## Install:

```
git clone ...
cd vuelibs.org
yarn install
```

## Deploy Webapp

```
# Copy example.deploy.sh as deploy.sh and replace api keys and mongo url.
chmod +x deploy.sh
./deploy.sh
```

#### Parser

```
# Copy example.parser.sh as parser.sh and replace api keys and mongo url.
chmod +x parser.sh

# Dev
ENV=dev ./parser.sh

# Prod
ENV=prod ./parser.sh
```

## CRON

Run parser everyday at 5:23

```
EDITOR=nano crontab -e
23 5 * * * ENV=prod CD PATH_TO_REPO/ && ./parser.sh
```

# Tech stack

- node.js
- mongodb (I use mlab)
- vue.js
- babel
