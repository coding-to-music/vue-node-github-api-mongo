const { Component } = require("./models/component");
const { axios } = require("axios");
const { markdown } = require("markdown");
// // const { console } = require("logdna");
// const { Octokit } = require("@octokit/rest");
const { mongoose } = require("mongoose");
// require("dotenv").config({ path: __dirname + "/.env" });

// require("dotenv").config({ path: __dirname + "/.env" });

require("dotenv").config({ path: __dirname + "/../.env" });

// const envpath = __dirname + "/../.env";
// console.log("path %s", __dirname);
// console.log("envpath %s", envpath);

// import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config();

// import Mongoose from "mongoose";
// import Component from "./models/component.js";
// import axios from "axios";
// import { markdown } from "markdown";
// import Octokit from "@octokit/rest";
// import console from "logdna";

const DELAY = 2000;

// const AV_URL = process.env.GITHUB_README_URL
//   "https://raw.githubusercontent.com/vuejs/awesome-vue/master/README.md";

// let console = console;

// if (process.env.ENV === "prod" && process.env.LOGDNA_KEY) {
//   console = console.setupDefaultconsole(process.env.LOGDNA_KEY, {
//     app: "org.vuelib.parser",
//   });
// }

console.log("OCTOKIT_TOKEN %s", process.env.OCTOKIT_TOKEN);

if (!process.env.OCTOKIT_TOKEN) {
  console.log("OCTOKIT_TOKEN is not defined.");
  process.exit(1);
}

async function connectMongo() {
  try {
    await Mongoose.connect(
      process.env.MONGO_URI || "mongodb://mongo:27017/vue-node-github-api-mongo"
    );
    console.log("Connected to mongo");
  } catch (err) {
    const foo = process.env.MONGO_URI;
    console.log("parser.js: Could not connect to mongo %s", foo);
    console.log(
      "parser.js: Could not connect to mongo %s",
      process.env.MONGO_URI
    );
  }
}

async function parseGithubFile() {
  console.log("parser.js: await axios.get %s", process.env.GITHUB_README_URL);

  const { data } = await axios.get(process.env.GITHUB_README_URL);
  const tree = markdown.parse(data);

  let idx = tree.findIndex((i) => i[2] == "Components & Libraries");

  let poi = [];
  let categories = {};
  let rawd = [];

  let currentCategory;
  let currentSubcategory;

  for (let i = idx + 1; i < tree.length; i++) {
    let item = tree[i];
    if (item[0] === "header" && item[1].level === 1) break;
    poi.push(tree[i]);

    if (item[0] === "header" && item[1].level === 2) {
      currentCategory = item[2];
      if (!categories[currentCategory]) {
        categories[currentCategory] = {};
      }
    }

    if (item[0] === "header" && item[1].level === 3) {
      currentSubcategory = item[2];
      if (!categories[currentCategory][currentSubcategory]) {
        categories[currentCategory][currentSubcategory] = [];
      }
    }

    if (item[0] === "bulletlist") {
      let list = [];
      list = item.reduce((acc, cur) => {
        let thislistitem = {};
        if (cur[0] === "listitem") {
          if (cur[1][0] === "link") {
            thislistitem.name = cur[1][2];
            thislistitem.url = cur[1][1].href;
          }
        }
        if (!Array.isArray(cur[0])) {
          if (cur[2]) {
            thislistitem.desc = cur[2].toString().replace(" - ", "");
          }
        }
        if (thislistitem.name) {
          acc.push(thislistitem);
          rawd.push({
            ...thislistitem,
            category: currentCategory,
            subcategory: currentSubcategory,
          });
        }
        return acc;
      }, []);
      categories[currentCategory][currentSubcategory] = list;
    }
  }

  return rawd;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// const octokit = new Octokit({
//   baseUrl: "https://api.github.com",
//   auth: process.env.OCTOKIT_TOKEN,
// });

// let octokit;

const { Octokit } = require("@octokit/rest");
// import Octokit from "@octokit/rest";

async function connectGithub() {
  // console.log("Connecting to GitHub with token " + process.env.OCTOKIT_TOKEN);
  const octokit = new Octokit({
    auth: process.env.OCTOKIT_TOKEN,
    // auth: "token " + process.env.OCTOKIT_TOKEN,
  });
  await sleep(DELAY);
  const { data } = await octokit.rateLimit.get();
  console.log(
    `GitHub rate limits: ${data.rate.remaining}/${data.rate.limit}. ` +
      JSON.stringify(data.rate)
  );

  if (data.rate.remaining <= 1000) {
    console.log("WARN: GitHub remaining API calls is less than 1000. Exiting.");
    process.exit();
  }
}

async function getGithubStats(repourl) {
  if (!repourl) {
    console.log("getGithubStats: no repourl present");
    return;
  }

  let parsedUrl = repourl
    .split("/")
    .reverse()
    .filter((i) => !!i);
  let okRequest = {
    repo: parsedUrl[0],
    owner: parsedUrl[1],
  };

  try {
    let response = await octokit.repos.get(okRequest);
    let r = response.data;

    return {
      owner: r.owner.login,
      urls: {
        github: r.html_url,
      },
      stats: {
        updated: r.pushed_at,
        stars: r.stargazers_count,
        issues: r.open_issues_count,
        created: r.created_at,
        forks: r.forks_count,
      },
    };
  } catch (e) {
    throw new Error(e);
  }
}

async function getReadme(repourl) {
  const GH_URL = "https://github.com/";
  const GH_CONTENT = "https://raw.githubusercontent.com/";

  let response = {};
  try {
    response = await axios.get(
      repourl.replace(GH_URL, GH_CONTENT) + "/master/README.md"
    );
  } catch (e) {
    console.log("Unable to get readme for " + repourl, e);
  }
  return response.data;
}

async function update() {
  const comps = await parseGithubFile();

  for (let j = 0; j < comps.length; j++) {
    await new Promise(async (next) => {
      const i = comps[j];

      console.log(`┌ Adding: ${i.name}`);

      await new Promise((next) => {
        setTimeout(() => {
          next();
        }, DELAY);
      });

      let githubStats = {
        owner: null,
        urls: {
          github: null,
        },
        stats: {
          updated: null,
          stars: null,
          issues: null,
          created: null,
          forks: null,
        },
      };

      let readme;

      try {
        if (i.url.includes("github.com")) {
          githubStats = await getGithubStats(i.url);
          readme = await getReadme(i.url);
        } else {
          console.warn(`├ Github.com not found in the url: ${i.url}`);
        }
      } catch (e) {
        console.warn(`└ Unable to get github stats for ${i.name}. Skipping.`, {
          meta: { error: e.toString() },
        });
        return next();
      }

      Component.findOneAndUpdate(
        { name: i.name },
        {
          $set: {
            name: i.name,
            url: i.url,
            desc: i.desc,
            category: i.category,
            subcategory: i.subcategory,
            ...githubStats,
            readme,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, updated) {
          if (!err) {
            console.log(`└ Finished adding ${i.name}.`);
          } else {
            console.log("└ Unable to ${i.name} save to mongo.");
          }
          next();
        }
      );
    });
  }
}

(async () => {
  await connectMongo();
  await connectGithub();
  console.log("Starting" + new Date());
  await update();
  console.log("Finished" + new Date());
  process.exit();
})();
