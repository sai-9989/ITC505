// server.js
const express = require('express')
const logger = require('morgan')
const path = require('path')
const fs = require('fs')

const server = express()

server.use(express.urlencoded({ extended: true }))
server.use(logger('dev'))

// Serve static files
const publicServedFilesPath = path.join(__dirname, 'public')
server.use(express.static(publicServedFilesPath))

// ===== Route for Mad Lib =====
server.post('/ITC505/lab-7/index.html', (req, res) => {
  const { noun, adjective, verb, place, pluralNoun } = req.body

  // Load the base HTML and footer
  const indexPath = path.join(publicServedFilesPath, 'ITC505/lab-7/index.html')
  let page = fs.readFileSync(indexPath, 'utf8')
  const footerPath = path.join(publicServedFilesPath, 'ITC505/lab-7/footer.html')
  const footer = fs.readFileSync(footerPath, 'utf8')

  // Generate Mad Lib text
  let result = ''
  if (!noun || !adjective || !verb || !place || !pluralNoun) {
    result = `<p class="error">⚠️ Please fill out all fields before submitting.</p>`
  } else {
    result = `
      <div class="result">
        <h2>Your Mad Lib Result:</h2>
        <p>Once upon a time, there was a <strong>${adjective}</strong> <strong>${noun}</strong> who loved to <strong>${verb}</strong> every single day. 
        One day, it decided to travel to <strong>${place}</strong>, where it met a group of <strong>${pluralNoun}</strong>. 
        Together, they had the most unforgettable adventure ever!</p>
      </div>
    `
  }

  // Insert result into the page
  page = page.replace('<!--RESULT_PLACEHOLDER-->', result + footer)

  res.send(page)
})

// ===== Test route =====
server.get('/do_a_random', (req, res) => {
  res.send(`Your number is: ${Math.floor(Math.random() * 100) + 1}`)
})

// ===== Port Configuration =====
let port = 80
if (process.argv[2] === 'local') port = 8080
server.listen(port, () => console.log(`✅ Ready on localhost:${port}!`))
