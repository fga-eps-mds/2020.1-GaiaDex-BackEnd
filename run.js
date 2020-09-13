"use strict";
require("dotenv").config({ path: __dirname + "/.env" });
const fs = require("fs"); // File System | Node.js
const axios = require("axios"); // HTTP client
const FormData = require("form-data"); // Readable "multipart/form-data" streams

const API_URL = "https://my-api.plantnet.org/v2/identify/all?api-key=";
const API_PRIVATE_KEY = process.env["API_TOKEN"]; // secret
const API_SIMSEARCH_OPTION = "&include-related-images=true"; // optional: get most similar images

const IMAGE_1 = "./catnip.jpg";
const ORGAN_1 = "leaf";

(async () => {
  let form = new FormData();

  form.append("organs", ORGAN_1);
  form.append("images", fs.createReadStream(IMAGE_1));

  try {
    const { status, data } = await axios.post(
      // list of probable species
      API_URL + API_PRIVATE_KEY,
      // list of probable species + most similar images
      // API_URL + API_PRIVATE_KEY + API_SIMSEARCH_OPTION,
      // list of probable species + french common names
      // API_URL + API_PRIVATE_KEY + API_LANG,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    console.log("status", status); // should be: 200
    console.log("data", require("util").inspect(data, false, null, true));
  } catch (error) {
    console.error("error", error);
  }
})();
