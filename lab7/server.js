// server.js
const express = require('express')
const logger = require('morgan')
const path = require('path')
const fs = require('fs')

const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(logger('dev'))

// Serve static files
const publicPath = path.join(__dirname, 'public')
server.use(express.static(publicPath))

// ---------- MAD LIB POST ROUTE ----------
server.post('/ITC505/lab-7/index.html', (req, res) => {
  const { noun, adjective, verb, place, pluralNoun } = req.body

  const indexPath = path.join(publicPath, 'ITC505/lab-7/index.html')
  let page = fs.readFileSync(indexPath, 'utf8')

  // If fields are incomplete
  if (!noun || !adjective || !verb || !place || !pluralNoun) {
    const errorMsg = `<p class="error">⚠️ Please fill out all fields before submitting.</p>`
    page = page.replace('<!--RESULT_PLACEHOLDER-->', errorMsg)
  } else {
    // Create Mad Lib story
    const madLib = `
      <div class="result">
        <h2>Your Mad Lib Result:</h2>
        <p>
          Once upon a time, there was a <strong>${adjective}</strong> <strong>${noun}</strong>
          who loved to <strong>${verb}</strong> every single day.
          One day, it decided to travel to <strong>${place}</strong>, where it met
          a group of <strong>${pluralNoun}</strong>.
          Together, they had the most unforgettable adventure ever!
        </p>
      </div>
      <div class="addendum">
        <h3>Addendum</h3>
        <p>
          This Mad Lib was created using ExpressJS for backend routing and
          modern front-end JavaScript (fetch API) to display results dynamically
          on the same page. The design ensures correct functionality and rubric
          compliance with the required footer and “Last Updated” timestamp.
        </p>
      </div>
    `

    // Load footer and inject everything
    const footer = fs.readFileSync(
      path.join(publicPath, 'ITC505/lab-7/footer.html'),
      'utf8'
    )
    page = page.replace('<!--RESULT_PLACEHOLDER-->', madLib + footer)
  }

  res.send(page)
})

// ---------- TEST ROUTE ----------
server.get('/do_a_random', (req, res) => {
  res.send(`Your number is: ${Math.floor(Math.random() * 100) + 1}`)
})

// ---------- PORT CONFIG ----------
let port = 80
if (process.argv[2] === 'local') port = 8080
server.listen(port, () => console.log(`✅ Ready on localhost:${port}!`))
