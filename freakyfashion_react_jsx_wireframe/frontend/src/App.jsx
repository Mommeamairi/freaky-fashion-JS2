import { useEffect, useState } from "react";

// Adressen till vår backend
const API = "http://localhost:3000";
const fallbackImage = "https://static.nike.com/a/images/w_1800,h_1000,c_fill,f_auto/7aead5df-d270-40a3-a8db-1322038878cc/image.jpg";

// Enkel navigation utan React Router.
// byter bara adress i webbläsaren.
function goTo(path) {
  window.location.href = path;
}

function Header() {
  // kollar om det finns en sökparameter i URL:en och använder den som initialt värde i sökrutan.
  const params = new URLSearchParams(window.location.search);
  // Om det inte finns någon sökparameter så blir det en tom sträng.
  const [searchText, setSearchText] = useState(params.get("q") || "");



  function search(e) {
    // Förhindra att formuläret skickas på vanligt sätt.
    e.preventDefault();
    // Om sökfältet inte är tomt, navigera till söksidan med sökparametern.
    if (searchText.trim() !== "") {
      // Navigera till söksidan med sökparametern.
      goTo("/search?q=" + encodeURIComponent(searchText));
    }
  }

  return (
    <header className="siteHeader">
      <div className="headerRow">
        <button className="logo" onClick={() => goTo("/")}>Freaky Fashion</button>

        <form className="searchForm" onSubmit={search}>
          <input
            value={searchText}
            // Hanterar ändringar i sökfältet.
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Sök produkt"
          />
        </form>

        <div className="headerIcons">
          <span>❤️</span>
          <span>🛒</span>
        </div>
      </div>

      <nav className="mainNav">
        <a href="#">Nyheter</a>
        <a href="#">Topplistan</a>
        <a href="#">Rea</a>
        <a href="#">Kampanjer</a>
      </nav>
    </header>
  );
}

// En produktkort som används på startsidan och söksidan. 
function ProductCard({ product }) {
  return (
    <article className="productCard" onClick={() => goTo("/products/" + product.slug)}>
      <div className="productImageWrap">
        <img src={product.image || fallbackImage} alt={product.name} />
        <button className="heartButton" onClick={(e) => e.stopPropagation()}>♡</button>
      </div>

      <div className="productInfo">
        <div className="productNamePrice">
          <span>{product.name}</span>
          <span>{product.price} SEK</span>
        </div>
        <small>{product.brand}</small>
      </div>
    </article>
  );
}

function Footer() {
  return (
    <>
      <section className="benefits">
        <div><span className="benefitIcon">❤️</span>Gratis frakt och returer</div>
        <div><span className="benefitIcon">❤️</span>Expressfrakt</div>
        <div><span className="benefitIcon">❤️</span>Säkra betalningar</div>
        <div><span className="benefitIcon">❤️</span>Nyheter varje dag</div>
      </section>

      <footer className="siteFooter">
        <div className="footerColumns">
          <details className="footerGroup" open>
            <summary>Shopping</summary>
            <div className="footerGroupContent">
              <p>Vinterjackor</p>
              <p>Pufferjackor</p>
              <p>Kappa</p>
              <p>Trenchcoats</p>
            </div>
          </details>

          <details className="footerGroup" open>
            <summary>Mina Sidor</summary>
            <div className="footerGroupContent">
              <p>Mina Ordrar</p>
              <p>Mitt Konto</p>
            </div>
          </details>

          <details className="footerGroup" open>
            <summary>Kundtjänst</summary>
            <div className="footerGroupContent">
              <p>Returnpolicy</p>
              <p>Integritetspolicy</p>
            </div>
          </details>
        </div>
        <p className="copyright"> Freaky Fashion</p>
      </footer>
    </>
  );
}


// Header och footer används på alla vanliga sidor.
function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="pageContent">{children}</main>
      <Footer />
    </>
  );
}

function HomePage() {
  const [products, setProducts] = useState([]);

  // När sidan öppnas hämtar vi produkter från backend.
  useEffect(() => {
    fetch(API + "/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.slice(0, 8)));
  }, []);

  return (
    <Layout>
      <section className="hero">
        <div className="heroText">
          <h1>senaste tröja</h1>
          <p>senaste tröja</p>
        </div>
        <img
          src="https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/b3699a23-fcf1-4976-be62-fb8f33c27b1f/U+NSW+TEE+LSE+REFLECTIVE+SHOX.png"
          alt="Mode"
        />
      </section>

      <section className="spots">
        <div><img src="https://images.pexels.com/photos/18838613/pexels-photo-18838613.jpeg" alt="Ytter" /><span>ytter</span></div>
        <div><img src="https://images.pexels.com/photos/5158837/pexels-photo-5158837.jpeg" alt="Inner" /><span>inner</span></div>
        <div><img src="https://images.pexels.com/photos/37510228/pexels-photo-37510228.jpeg" alt="Skor" /><span>skor</span></div>
      </section>

      <h2 className="sectionTitle">Populära Produkter</h2>
      <section className="productGrid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </Layout>
  );
}

function SearchPage() {
  const q = new URLSearchParams(window.location.search).get("q") || "";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(API + "/api/search?q=" + encodeURIComponent(q))
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, [q]);

  return (
    <Layout>
      <h2 className="searchTitle">Hittade {products.length} produkter</h2>
      <section className="productGrid searchGrid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </Layout>
  );
}

function ProductPage({ slug }) {
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    // Hämta produkten som hör till slugen i URL:en.
    fetch(API + "/api/products/slug/" + slug)
      .then((response) => response.json())
      .then((data) => setProduct(data));

    // Hämta alla produkter och välj tre andra som liknande produkter.
    fetch(API + "/api/products")
      .then((response) => response.json())
      .then((data) => {
        const others = data.filter((item) => item.slug !== slug);
        setSimilar(others.slice(0, 3));
      });
  }, [slug]);

  if (!product) {
    return <Layout><p>Laddar produkt...</p></Layout>;
  }

  return (
    <Layout>
      <section className="productDetail">
        <div className="detailImageWrap">
          <img src={product.image || fallbackImage} alt={product.name} />
          <button className="heartButton detailHeart">♡</button>
        </div>

        <div className="detailText">
          <h1>{product.name}</h1>
          <small>{product.brand}</small>
          <p>{product.description}</p>
          <p className="detailPrice">{product.price} SEK</p>
          <button className="cartButton">Lägg i varukorg</button>
        </div>
      </section>

      <h2 className="similarTitle">Liknande produkter</h2>
      <section className="similarGrid">
        {similar.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </section>
    </Layout>
  );
}

function AdminHeader() {
  return (
    <header className="adminHeader">
      <h1>Administration</h1>
      <nav>
        <button onClick={() => goTo("/admin/products")}>Produkter</button>
      </nav>
    </header>
  );
}

function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(API + "/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="adminPage">
      <AdminHeader />
      <main className="adminContent">
        <div className="adminTitleRow">
          <h2>Produkter</h2>
          <button onClick={() => goTo("/admin/products/new")}>Ny produkt</button>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr><th>Namn</th><th>SKU</th><th>Pris</th></tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function AdminNewProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [message, setMessage] = useState("");

  function saveProduct(e) {
    e.preventDefault();

    const product = {
      name: name,
      description: description,
      sku: sku,
      image: image,
      price: price,
      brand: brand,
    };

    fetch(API + "/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (response.ok) {
          goTo("/admin/products");
        } else {
          setMessage("Kunde inte spara produkten.");
        }
      })
      .catch(() => setMessage("Backend verkar inte vara igång."));
  }

  return (
    <div className="adminPage">
      <AdminHeader />
      <main className="adminContent">
        <h2>Ny produkt</h2>

        <form className="adminForm" onSubmit={saveProduct}>
          <label>Namn<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label>Beskrivning<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" /></label>
          <label>SKU<input value={sku} onChange={(e) => setSku(e.target.value)} required /></label>
          <label>Bild<input value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL till bild" /></label>
          <label>Pris<input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></label>
          <label>Märke<input value={brand} onChange={(e) => setBrand(e.target.value)} /></label>

          {message && <p className="formMessage">{message}</p>}
          <button type="submit">Lägg till</button>
        </form>
      </main>
    </div>
  );
}
