// src/lib/seo.ts

export function generateIndexSchema(spotPrice: number, price14k: string) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organisaatio
      {
        "@type": "Organization",
        "name": "Kultalaskuri.fi",
        "url": "https://kultalaskuri.fi",
        "description": "Suomen kattavin kultalaskuri reaaliaikaisella pörssikurssilla.",
        "sameAs": []
      },

      // 2. WebSite 
      {
        "@type": "WebSite",
        "name": "Kultalaskuri.fi",
        "url": "https://kultalaskuri.fi",
        "description": "Laske kullan arvo reaaliaikaisesti. Ilmainen kultalaskuri ja ajantasainen pörssihinta.",
        "inLanguage": "fi-FI"
      },

      // 3. WebApplication 
      {
        "@type": "WebApplication",
        "name": "Kultalaskuri",
        "url": "https://kultalaskuri.fi",
        "applicationCategory": "FinanceApplication",
        "description": "Ilmainen kultalaskuri, joka laskee kultakorujen, kultaharkkojen ja romukullan arvon reaaliaikaisella pörssikurssilla.",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR"
        },
        "featureList": "Kullan hinnan laskeminen, Karattipitoisuuksien vertailu, Reaaliaikainen markkinadata"
      },

      // 4. BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Etusivu",
            "item": "https://kultalaskuri.fi"
          }
        ]
      },

      // 5. FAQPage
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Paljonko on kullan hinta grammalta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Kullan hinta grammalta vaihtelee pörssikurssin mukaan. Juuri nyt puhtaan kullan (24K) markkinahinta on noin ${spotPrice.toFixed(2)} €/g.`
            }
          },
          {
            "@type": "Question",
            "name": "Mitä eroa on 14K ja 18K kullalla?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ero on kultapitoisuudessa. 14K (leima 585) sisältää 58,5 % puhdasta kultaa ja on kovempaa, mikä tekee siitä Suomen yleisimmän korumateriaalin. 18K (leima 750) sisältää 75 % kultaa; se on arvokkaampaa ja väriltään syvemmän keltaista, mutta pehmeämpänä se naarmuuntuu helpommin."
            }
          },
          {
            "@type": "Question",
            "name": "Mitä tarkoittaa leima 585?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Leima 585 tarkoittaa 14 karaatin kultaa. Luku kertoo, että seoksesta 585 tuhannesosaa (eli 58,5 %) on puhdasta kultaa. Loput ovat seosmetalleja, kuten kuparia ja hopeaa, jotka tekevät korusta kestävämmän."
            }
          },
          {
            "@type": "Question",
            "name": "Paljonko kultasormus tai ketju painaa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Korujen paino vaihtelee suuresti. Kevyt naisten sormus painaa tyypillisesti 2–4 grammaa, kun taas tukevampi miesten sormus voi painaa 5–10 grammaa. Ohut kaulaketju voi olla alle 3 grammaa, mutta paksut panssariketjut voivat painaa kymmeniä grammoja."
            }
          },
          {
            "@type": "Question",
            "name": "Onko kultakoruissa aina leima?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Suomessa myytävissä, yli 1 gramman painoisissa kultatuotteissa tulee lain mukaan olla pitoisuusleima. Hyvin vanhoissa koruissa, ulkomailta tuoduissa esineissä tai itse tehdyissä töissä leima voi kuitenkin puuttua tai se on voinut kulua näkymättömiin."
            }
          },
          {
            "@type": "Question",
            "name": "Mistä tietää onko esine kultaa vai kullattu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Varmin keino on etsiä leimat (esim. 585 tai 750). Toinen kotikonsti on magneetti: aito kulta ei ole magneettista. Jos koru tarttuu magneettiin, se on todennäköisesti kullattua rautaa. Myös kuluneet kohdat, joista paistaa toinen väri läpi, paljastavat esineen olevan vain kullattu."
            }
          },
          {
            "@type": "Question",
            "name": "Kannattaako kulta myydä juuri nyt?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kullan hinta on historiallisesti erittäin korkealla tasolla. Jos sinulla on tarpeettomia koruja, rikkinäistä kultaa tai parittomia korvakoruja, nykyinen markkinatilanne on myyjän kannalta erinomainen."
            }
          },
          {
            "@type": "Question",
            "name": "Miten kullan maailmanmarkkinahinta määräytyy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kullan hinta (spot-hinta) määräytyy kansainvälisissä pörsseissä kysynnän ja tarjonnan mukaan. Siihen vaikuttavat maailmantalouden tilanne, dollarin kurssi, inflaatio ja geopoliittinen epävarmuus. Kultalaskuri.fi seuraa tätä hintaa reaaliajassa."
            }
          }
        ]
      }
    ]
  });
}