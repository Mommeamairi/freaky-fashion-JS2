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