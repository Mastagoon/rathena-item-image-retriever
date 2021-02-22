const fs = require("fs")
const readLine = require("readline")
const axios = require("axios")
const Path = require("path")

let lines = []


const readInterface = readLine.createInterface({
    input: fs.createReadStream('./ids.txt'),
    console: false,
})

let i = 0
let count = 0

readInterface.on("line", async (line) => {
    if(Number(line) < 12776) return
    if(!fs.existsSync(`./item_icons/${line}.jpg`)) return
    let stats = fs.statSync(`./item_icons/${line}.jpg`)
    if(stats.size == 0) {
        console.log(`item ${line} has no image! count: ${count}`)
        count++
        lines.push(line)
    }
})

const interval = setInterval(async () => {
    i++
    await download(lines[i])
    if(i >= lines.length) {
        clearInterval(interval)
    }
}, 50)


const download = async (id) => {
    console.log(`downloading item ${id}...`)
    const url = `https://www.divine-pride.net/img/items/item/iRO/${id}`
    const path = Path.resolve(__dirname, 'item_icons', `${id}.jpg`)
    const writer = fs.createWriteStream(path)
    const response = await axios({url, method: 'GET', responseType: 'stream'}).catch(err => lines.push(id))
    response?.data?.pipe(writer)
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

// const newItems = []

// let stats = fs.statSync()

// download(639)
// download(909)

// const readInterface = readLine.createInterface({
//     input: fs.createReadStream('./src.txt'),
//     // output: process.stdout,
//     console: false
// })
// // download()
// const writer = fs.createWriteStream("./ids.txt")

// readInterface.on('line', (line) => {
//     if(!line.startsWith("//"))
//         writer.write(line.split(",")[0]+"\n")
// })