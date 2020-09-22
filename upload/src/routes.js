const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

routes.post("/posts", multer(multerConfig).single("file"), (req, res) => {
  console.log(req.file);
  plantNet(req.file.path);
  return res.json({ hello: "world" });
});

const API_URL = "https://my-api.plantnet.org/v2/identify/all?api-key=";
const API_PRIVATE_KEY = "2a10RhakQYbhuTDbgvuwR5KTw"; // secret

async function plantNet(filePath) {
  let form = new FormData();
  form.append("organs", "flower");
  form.append("images", fs.createReadStream(filePath));
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
    return data;
  } catch (error) {
    console.error("error", error);
    return error;
  }
}
module.exports = routes;
