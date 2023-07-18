import puppeteer from "puppeteer";
import * as fs from "fs";

const getData = async () => {
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://www.shoppersstop.com/store-finder", {
    waitUntil: "domcontentloaded",
  });

  const cities = await page.evaluate(() => {
    return document.querySelector(".ex-select-menu").innerText.split('\n');
  });

  const cityWithAddress = new Map();

  for (const city of cities) {

    const allAddressCity = await page.goto(`https://www.shoppersstop.com/store-finder?q=${city}`);

    const addressArr = await allAddressCity.json();

    if (addressArr.results[0]) {
      cityWithAddress.set(city, addressArr.results);
      console.log('end');
    }
  }

  fs.writeFile("data.json", JSON.stringify(Array.from(cityWithAddress.entries())), (error) => {

    if (error) {
      // logging the error
      console.error(error);

      throw error;
    }
  });
  
  console.log(JSON.stringify(Array.from(cityWithAddress.entries())));

};

// Start the scraping

getData();