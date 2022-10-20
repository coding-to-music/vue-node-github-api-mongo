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

## Difficulties getting npm install to work, try upgrading dependencies

```
ncu -u
```

Output

```
Upgrading /mnt/volume_nyc1_01/vue-node-github-api-mongo/package.json
[====================] 31/31 100%

 @octokit/rest            ^16.1.0  →  ^19.0.5
 axios                    ^0.18.0  →   ^1.1.3
 body-parser              ^1.18.3  →  ^1.20.1
 debounce                  ^1.2.0  →   ^1.2.1
 express                  ^4.16.4  →  ^4.18.2
 logdna                    ^3.0.1  →   ^3.5.3
 mongo-sanitize            ^1.0.1  →   ^1.1.0
 mongoose                 ^5.3.15  →   ^6.6.6
 node-sass                ^4.10.0  →   ^7.0.3
 sass                     ^1.15.2  →  ^1.55.0
 sass-loader               ^7.1.0  →  ^13.1.0
 vue                      ^2.5.17  →  ^3.2.41
 vue-moment                ^4.0.0  →   ^4.1.0
 vue-nprogress             ^0.1.5  →   ^0.2.0
 vue-router                ^3.0.1  →   ^4.1.5
 vuex                      ^3.0.1  →   ^4.1.0
 @vue/cli-plugin-babel     ^3.2.0  →   ^5.0.8
 @vue/cli-plugin-eslint    ^3.2.0  →   ^5.0.8
 @vue/cli-service          ^3.2.0  →   ^5.0.8
 eslint                    ^5.8.0  →  ^8.25.0
 eslint-plugin-vue       ^5.0.0-0  →   ^9.6.0
 vue-template-compiler    ^2.5.17  →  ^2.7.13
 nodemon                  ^1.18.7  →  ^2.0.20

Run npm install to install new versions.
```
