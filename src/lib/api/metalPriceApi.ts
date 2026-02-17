// src/lib/api/metalPriceApi.ts

const API_KEY = import.meta.env.METALPRICE_API_KEY;
const TROY_OUNCE_IN_GRAMS = 31.1034768;

// ============================================
// CACHE CONFIGURATION
// ============================================
// API: 30 min updates, 1000 requests/month
// 45 min cache = ~960 requests/month (turvallinen)
// ============================================
const CACHE_DURATION_MS = 45 * 60 * 1000; // 45 minuuttia

// In-memory cache
interface CachedPrice {
  data: GoldPriceResult;
  timestamp: number;
}

let priceCache: CachedPrice | null = null;

// Tyypitykset
interface MetalPriceResponse {
  success: boolean;
  base: string;
  timestamp: number;
  rates: {
    XAU?: number;
    EUR?: number;
  };
}

export interface GoldPriceResult {
  priceEurGram: number;
  priceUsdOz: number;
  usdEurRate: number;
  updatedAt: Date;
  fromCache: boolean;
  cacheAgeMinutes: number;
}

/**
 * Hakee kullan hinnan API:sta TAI cachesta.
 * Cache: 45 minuuttia (API päivittyy 30 min välein)
 */
export async function getGoldPrice(): Promise<GoldPriceResult | null> {
  
  // --- 🛠️ DEV-MODE ---
  if (import.meta.env.DEV) {
    console.log("🛠️ DEV-MODE: Käytetään staattista hintaa");
    return {
      priceEurGram: 84.50,
      priceUsdOz: 2750.00,
      usdEurRate: 0.95,
      updatedAt: new Date(),
      fromCache: false,
      cacheAgeMinutes: 0
    };
  }

  // --- CACHE CHECK ---
  const now = Date.now();
  
  if (priceCache) {
    const ageMs = now - priceCache.timestamp;
    const ageMinutes = Math.round(ageMs / 1000 / 60);
    
    if (ageMs < CACHE_DURATION_MS) {
      console.log(`📦 CACHE HIT: ${priceCache.data.priceEurGram.toFixed(2)} €/g (${ageMinutes} min vanha, vanhenee ${Math.round((CACHE_DURATION_MS - ageMs) / 1000 / 60)} min)`);
      return {
        ...priceCache.data,
        fromCache: true,
        cacheAgeMinutes: ageMinutes
      };
    }
  }

  // --- API FETCH ---
  console.log("🌐 CACHE MISS: Haetaan uusi hinta API:sta...");
  
  if (!API_KEY) {
    console.error('❌ METALPRICE_API_KEY puuttuu!');
    return getFallbackPrice("API-avain puuttuu");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${API_KEY}&base=USD&currencies=XAU,EUR`,
      {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: MetalPriceResponse = await response.json();

    if (!data.success) {
      throw new Error(`API error: ${JSON.stringify(data)}`);
    }
    
    if (!data.rates.XAU || !data.rates.EUR) {
      throw new Error(`Puuttuva data: XAU=${data.rates.XAU}, EUR=${data.rates.EUR}`);
    }

    // Laske hinnat
    const priceUsdOz = 1 / data.rates.XAU;
    const usdEurRate = data.rates.EUR;
    const priceEurOz = priceUsdOz * usdEurRate;
    const priceEurGram = priceEurOz / TROY_OUNCE_IN_GRAMS;

    const result: GoldPriceResult = {
      priceEurGram: Number(priceEurGram.toFixed(4)),
      priceUsdOz: Number(priceUsdOz.toFixed(2)),
      usdEurRate: Number(usdEurRate.toFixed(4)),
      updatedAt: new Date(),
      fromCache: false,
      cacheAgeMinutes: 0
    };

    // Tallenna cacheen
    priceCache = {
      data: result,
      timestamp: now
    };

    console.log(`✅ API OK: ${result.priceEurGram.toFixed(2)} €/g (cache 45 min)`);
    
    return result;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Tuntematon virhe';
    console.error('❌ API-virhe:', errorMsg);
    return getFallbackPrice(errorMsg);
  }
}

/**
 * Fallback: palauta vanha cache tai hätätila-hinta
 */
function getFallbackPrice(reason: string): GoldPriceResult | null {
  if (priceCache) {
    const ageMinutes = Math.round((Date.now() - priceCache.timestamp) / 1000 / 60);
    console.log(`⚠️ FALLBACK: Käytetään vanhaa cachea (${ageMinutes} min) - Syy: ${reason}`);
    return {
      ...priceCache.data,
      fromCache: true,
      cacheAgeMinutes: ageMinutes
    };
  }
  
  // Viimeisenä vaihtoehtona: staattinen hätätila-hinta
  console.log(`🆘 EMERGENCY: Käytetään staattista hintaa - Syy: ${reason}`);
  return {
    priceEurGram: 85.00,  // Päivitä tämä manuaalisesti tarvittaessa
    priceUsdOz: 2800.00,
    usdEurRate: 0.92,
    updatedAt: new Date(),
    fromCache: true,
    cacheAgeMinutes: 999
  };
}

/**
 * Debug: cachen tila
 */
export function getCacheStatus() {
  if (!priceCache) {
    return { 
      hasCache: false, 
      ageMinutes: null, 
      expiresInMinutes: null,
      requestsPerDay: 'N/A'
    };
  }
  
  const now = Date.now();
  const ageMs = now - priceCache.timestamp;
  
  return { 
    hasCache: true, 
    ageMinutes: Math.round(ageMs / 1000 / 60),
    expiresInMinutes: Math.max(0, Math.round((CACHE_DURATION_MS - ageMs) / 1000 / 60)),
    requestsPerDay: `~${Math.round(24 * 60 / 45)} (45 min cache)`
  };
}