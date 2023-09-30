import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const cors = require("cors");
const app = express();

const puppeteer = require("puppeteer");

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.post("/api/url", (req, res) => {
  const { url } = req.body;

  //👇🏻 Puppeteer webscraping function
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    //👇🏻 returns all the website content
    const websiteContent = await page.evaluate(() => {
      return document.documentElement.innerText.trim();
    });

    //👇🏻 returns the website meta image
    const websiteOgImage = await page.evaluate(() => {
      const metas = document.getElementsByTagName("meta");
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("property") === "og:image") {
          return metas[i].getAttribute("content");
        }
      }
    });

    console.log({ websiteContent, websiteOgImage });
    await browser.close();
  })();
});

app.listen(PORT, () => [console.log(`Server running on ${PORT}`)]);
