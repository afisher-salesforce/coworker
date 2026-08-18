import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Redirect HTTP to HTTPS on Heroku
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

app.use(express.static(__dirname));

// No SPA fallback needed — this is a multi-page static site.
// Each HTML page is served directly by express.static.

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
