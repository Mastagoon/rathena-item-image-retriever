const fs = require("fs")
const readLine = require("readline")
const axios = require("axios")
const Path = require("path")

const readInterface = readLine.createInterface({
	input: fs.createReadStream('./ids.txt'),
	console: false,
})


async function sleep(t) {
	return new Promise(resolve => setTimeout(resolve, t));
}

async function download(id) {
	console.log(`downloading item ${id}...`)
	const url = `https://www.divine-pride.net/img/items/item/iRO/${id}`
	const path = Path.resolve(__dirname, 'item_icons', `${id}.jpg`)
	const writer = fs.createWriteStream(path)
	try {
		const response = await axios({ url, method: 'GET', responseType: 'stream' })
		response.data.pipe(writer)
		return new Promise((resolve, reject) => {
			writer.on('finish', resolve)
			writer.on('error', reject)
		})
	} catch (err) {
		console.log(`error fetching image: `, err)
	}
}

async function run() {
	readInterface.on("line", async (line) => {
		if (Number(line) !== NaN) {
			await download(id)
			await sleep(1000) // to not spam divine pride
		}
	})
}

run()
