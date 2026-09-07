const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./database.sqlite");
const PORT = 3000;

app.use(cors());
app.use(express.json());


// Gör om ett namn till en slug.
// Exempel: "Svart T-Shirt" blir "svart-t-shirt".
function makeSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ /g, "-");
}

// Skapar tabellen om den inte redan finns.
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    price INTEGER NOT NULL,
    image TEXT,
    description TEXT,
    sku TEXT,
    slug TEXT
  )
`);

// Hämta alla produkter.
app.get("/api/products", (req, res) => {
  // Hämta alla produkter från databasen och sortera dem efter id.
  db.all("SELECT * FROM products ORDER BY id", (err, products) => {
    if (err) {
      res.status(500).json({ error: "Något gick fel" });
      return;
    }
    // Skicka tillbaka produkterna som JSON FE.
    res.json(products);
  });
});
