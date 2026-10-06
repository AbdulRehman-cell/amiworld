require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.json())

// ── Admin auth helpers ──────────────────────────────────────────────────────
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "FRJfv7wuGN"

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (!token) return res.status(401).json({ error: 'Admin authentication required' })
  try { jwt.verify(token, ADMIN_SECRET); next() }
  catch { res.status(401).json({ error: 'Invalid or expired admin token' }) }
}

app.post('/api/admin/login', function (req, res) {
  const { password } = req.body || {}
  if (!password || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid password.' })
  const token = jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '12h' })
  res.json({ token })
})

// ── DB readiness guard — keeps 500s from leaking when Mongo is not connected ──
function dbReady(req, res, next) {
  if (mongoose.connection.readyState === 1) return next()
  res.status(503).json({ error: 'Database not connected. Set the MONGODB_URI environment variable to a valid MongoDB connection string (e.g. MongoDB Atlas) and redeploy.' })
}
app.use('/api', dbReady)

// ── Data routes (GET+POST public; PUT+DELETE require admin token) ───────────
app.use('/api/products', require('./routes/product.routes'))

// ── Global error handler ─────────────────────────────────────────────────────
app.use(function (err, req, res, _next) {
  console.error('[API error]', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// ── Serve the built React client ─────────────────────────────────────────────
app.use('/api/admin', require('./routes/admin.routes'))

const dist = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(dist))
app.get('*', function (req, res, next) {
  if (req.path.indexOf('/api/') === 0) return next()
  res.sendFile(path.join(dist, 'index.html'))
})

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amiworld'

try { require('./seed') } catch(e) { console.warn('Seed skipped:', e.message) }
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
  .then(function () {
    console.log('MongoDB connected')
    app.listen(PORT, function () { console.log('Server ready on port ' + PORT) })
  })
  .catch(function (err) {
    console.error('MongoDB connection failed: ' + err.message)
    console.error('Set MONGODB_URI to a valid MongoDB Atlas connection string.')
    // Start server anyway so healthcheck / static assets still work
    app.listen(PORT, function () { console.log('Server on port ' + PORT + ' (DB unavailable — API routes return 503)') })
  })
