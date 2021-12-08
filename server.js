require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
	res.json({ greeting: "hello API" });
});

let count = 0;

function getKeyByValue(object, value) {
	return Object.keys(object).find((key) => object[key] === value);
}

let obj = {};
//https://www.geeksforgeeks.org/check-if-an-url-is-valid-or-not-using-regular-expression/
app.post("/api/:url", (req, res) => {
	let regex =
		"((http|https)://)(www.)?" + "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" + "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
	let url = regex.exec(req.body.url);
	if (url === null) res.json({ error: "Invalid URL" });
	else {
		let result = getKeyByValue(obj, url.input);
		if (result === undefined) {
			count++;
			obj[count] = req.body.url;
			res.json({
				original_url: req.body.url,
				short_url: count,
			});
		} else {
			res.json({
				original_url: req.body.url,
				short_url: result,
			});
		}
	}
});

app.get("/api/shorturl/:shorturl", (req, res) => {
	let shorturl = req.params.shorturl;
	let result = obj[shorturl];
	if (result === undefined) res.json({ error: "Invalid URL" });
	else res.redirect(obj[shorturl]);
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
