import React, { useState, useEffect } from 'react';
import { Scale, Calculator, Info, AlertTriangle } from 'lucide-react';
import { calculateGoldValue, formatEur, GOLD_PURITIES, type PurityCode, type CalculationResult } from '../../lib/calculations/goldCalculator';

interface Props {
  spotPriceEurPerGram: number;
}

export default function GoldCalculator({ spotPriceEurPerGram }: Props) {
  const [weight, setWeight] = useState<string>('');
  const [purity, setPurity] = useState<PurityCode>('14K');
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    if (!weight) {
      setResult(null);
      return;
    }
    const cleanWeight = weight.replace(',', '.').replace(/[^0-9.]/g, '');
    const numWeight = parseFloat(cleanWeight);

    if (!isNaN(numWeight) && numWeight > 0) {
      const res = calculateGoldValue(numWeight, purity, spotPriceEurPerGram);
      setResult(res);
    } else {
      setResult(null);
    }
  }, [weight, purity, spotPriceEurPerGram]);

  return (
    <div className="grid lg:grid-cols-12 gap-0 bg-white shadow-xl rounded-[2rem] overflow-hidden border border-gray-100">
      
      {/* --- VASEN PUOLI: SYÖTTÖ --- */}
      <div className="lg:col-span-5 bg-gray-50/80 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col gap-6 md:gap-8">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm text-gold-400">
            <Scale size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Syötä esineen tiedot</h2>
        </div>

        {/* Paino */}
        <div>
          <label htmlFor="gold-weight" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Paino (grammaa)
          </label>
          <div className="relative group">
            <input
              id="gold-weight"
              type="number"
              inputMode="decimal"
              aria-label="Kullan paino grammoina"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-bold text-2xl placeholder-gray-300 outline-none transition-all duration-300 focus:border-gold-400 focus:ring-4 focus:ring-gold-400/10"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-gold-500 transition-colors">
              g
            </span>
          </div>
        </div>

        {/* Pitoisuus - Mobiilissa 4-grid, Desktopissa 2-grid */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Pitoisuus
          </label>
          <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
            {(Object.keys(GOLD_PURITIES) as PurityCode[]).map((code) => {
              const isActive = purity === code;
              return (
                <button
                  key={code}
                  onClick={() => setPurity(code)}
                  className={`
                    flex flex-col items-center lg:items-start justify-center p-2 lg:p-3 rounded-xl border transition-all duration-200
                    ${isActive 
                      ? 'bg-white border-gold-500 ring-2 ring-gold-500/20 shadow-md transform scale-[1.02] z-10' 
                      : 'bg-white border-gray-200 hover:border-gold-300 hover:shadow-sm text-gray-500'
                    }
                  `}
                >
                  <span className={`text-base lg:text-lg font-black ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {code}
                  </span>
                  <span className="text-[10px] lg:text-xs font-medium text-gray-400 hidden lg:block">
                    {GOLD_PURITIES[code].label.split(' ')[1]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2 text-sm text-gray-500 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <Info size={18} className="text-gold-500 shrink-0" />
            <p className="text-xs leading-relaxed">{GOLD_PURITIES[purity].description}</p>
          </div>
        </div>
      </div>

      {/* --- OIKEA PUOLI: TULOS --- */}
      <div className="lg:col-span-7 p-6 md:p-10 bg-white relative min-h-[300px] lg:min-h-auto flex flex-col">
        {result ? (
          <div className="h-full flex flex-col justify-center animate-in fade-in duration-300">
            
            {/* TAGI */}
            <div className="mb-2">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] md:text-xs font-bold border border-green-100 uppercase tracking-wide">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                 Arvioitu myyntihinta
               </span>
            </div>

            {/* ISO HINTA */}
            <div className="mb-6">
              <span className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight tabular-nums leading-none">
                {formatEur(result.targetValue)}
              </span>
              
              <p className="text-gray-500 mt-4 md:mt-6 text-sm md:text-lg leading-relaxed max-w-md">
                Tämä on hinta, jota sinun kannattaa tavoitella. Luotettavat kullanostajat maksavat yleensä vähintään tämän verran.
              </p>

              {/* VAROITUSLAATIKKO */}
              <div className="mt-4 inline-flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl max-w-md w-full md:w-auto">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span className="font-bold text-xs md:text-sm">
                   Vinkki: Älä myy kultaasi alle tämän tason.
                </span>
              </div>
            </div>

            {/* LISÄTIEDOT */}
            <div className="grid grid-cols-2 gap-4 pt-6 md:pt-8 border-t border-gray-100 mt-auto">
              <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Puhdas kulta</p>
                  <p className="text-base md:text-lg font-bold text-gray-900 font-mono tabular-nums">{result.pureGoldContent.toFixed(2)}g</p>
              </div>
              <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Pörssiarvo (100%)</p>
                  <p className="text-base md:text-lg font-bold text-blue-600 font-mono tabular-nums">{formatEur(result.spotValue)}</p>
              </div>
            </div>

          </div>
        ) : (
          /* EMPTY STATE */
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 md:mb-6 border border-gray-100">
               <Calculator className="text-gray-300 w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Aloita laskeminen</h3>
            <p className="text-sm md:text-base text-gray-500 max-w-xs mx-auto">
              Syötä esineen paino (g) ja valitse karaatit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}