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


// Sök efter produkter med namn.
app.get("/api/search", (req, res) => {
  const search = req.query.q || "";

  db.all(
    "SELECT * FROM products WHERE name LIKE ? ORDER BY id",
    ["%" + search + "%"],
    (err, products) => {
      if (err) {
        res.status(500).json({ error: "Något gick fel" });
        return;
      }

      res.json(products);
    }
  );
});

// Hämta en produkt med slug från URL:en.
app.get("/api/products/slug/:slug", (req, res) => {
  // Hämta slug från URL:en.
  const slug = req.params.slug;

  
 // Hämta produkten med det angivna slug från databasen.
  db.get("SELECT * FROM products WHERE slug = ?", [slug], (err, product) => {
    if (err) {
      res.status(500).json({ error: "Något gick fel" });
      return;
    }

    if (!product) {
      res.status(404).json({ error: "Produkten hittades inte" });
      return;
    }

    res.json(product);
  });
});

// Lägg till en ny produkt.
app.post("/api/products", (req, res) => {
  const name = req.body.name;
  const brand = req.body.brand;
  const price = req.body.price;
  const image = req.body.image;
  const description = req.body.description;
  const sku = req.body.sku;

  if (!name || !sku || !price) {
    res.status(400).json({ error: "Namn, SKU och pris måste fyllas i" });
    return;
  }

  const slug = makeSlug(name);

  const sql = `
    INSERT INTO products (name, brand, price, image, description, sku, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, brand, price, image, description, sku, slug],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Kunde inte spara produkten" });
        return;
      }

      res.status(201).json({ id: this.lastID });
    }
  );
});







app.listen(PORT, () => {
  console.log("Backend kör på http://localhost:" + PORT);
});
