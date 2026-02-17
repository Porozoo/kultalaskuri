// src/data/cities.ts

export interface Partner {
  name: string;
  tier: 'premium' | 'standard'; // Premiumilla kultareunukset ja badge
  address: string;
  phone: string;
  url: string;
  badge?: string; // Esim. "Nopein maksu" tai "Suositeltu"
}

export interface City {
  slug: string;      // URL-osoite (esim. tampere)
  name: string;      // Näkyvä nimi (esim. Tampere)
  genitive: string;  // Taivutus (esim. Tampereen)
  partitive: string; // Taivutus (esim. Tampereella)
  description: string;
  landmarks: string[]; // SEO: Kauppakeskukset ym.
  partners: Partner[];
}

export const cities: City[] = [
  {
    slug: 'helsinki',
    name: 'Helsinki',
    genitive: 'Helsingin',
    partitive: 'Helsingissä',
    description: 'Helsingissä kilpailu on kovaa. Keskustan, Kampin ja Itäkeskuksen alueilla toimii kymmeniä ostajia.',
    landmarks: ['Kamppi', 'Aleksanterinkatu', 'Itäkeskus', 'Tripla'],
    partners: [
      {
        name: "Helsingin Kulta-Aitta (Malli)",
        tier: "premium",
        address: "Esimerkkikatu 12",
        phone: "040 123 4567",
        url: "#",
        badge: "Paras hinta"
      },
      {
        name: "Stadin Jalometalli Oy",
        tier: "standard",
        address: "Mallikuja 4 B",
        phone: "09 876 5432",
        url: "#"
      }
    ]
  },
  {
    slug: 'tampere',
    name: 'Tampere',
    genitive: 'Tampereen',
    partitive: 'Tampereella',
    description: 'Tampereella parhaat hinnat löytyvät usein Hämeenkadun varrelta tai Ratinan kauppakeskuksesta.',
    landmarks: ['Hämeenkatu', 'Ratina', 'Koskikeskus', 'Hervanta'],
    partners: [
      // Jätetään Tampere tyhjäksi, jotta näet miltä "Liity kumppaniksi" -laatikko näyttää sivulla!
    ]
  },
  {
    slug: 'turku',
    name: 'Turku',
    genitive: 'Turun',
    partitive: 'Turussa',
    description: 'Turun kultakauppa keskittyy vahvasti Kauppatorin ympäristöön ja Skanssiin.',
    landmarks: ['Kauppatori', 'Skanssi', 'Hansakortteli'],
    partners: [
       {
        name: "Aurajoen Kulta (Demo)",
        tier: "standard",
        address: "Mallikatu 1",
        phone: "02 123 4567",
        url: "#"
      }
    ]
  },
  {
    slug: 'oulu',
    name: 'Oulu',
    genitive: 'Oulun',
    partitive: 'Oulussa',
    description: 'Oulussa kullan myynti onnistuu helpoiten keskustan kävelykadulla Rotuaarilla tai Valkean kauppakeskuksessa.',
    landmarks: ['Rotuaari', 'Kauppakeskus Valkea', 'Isokatu'],
    partners: [] // Tyhjä, näyttää placeholderin
  }
];