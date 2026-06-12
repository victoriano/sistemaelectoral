// ============================================================================
// party-aliases.ts — ONE canonical party-key normalization layer for the app.
//
// The raw electionsYYYY.ts files keep the labels used by their original
// sources ("EH Bildu", "EAJ-PNV", "CCa-NC", "C's", "JxCat", ...). The app
// (Pactometro coalitions, Simulator governability index, KPIs) reasons in
// canonical keys (BILDU, PNV, CCA, Cs, JUNTS, ...). This module renames /
// merges the data keys ONCE at load time (see all-elections.ts) so every
// consumer sees canonical keys. Do NOT mass-edit the electionsYYYY.ts files.
//
// Scope rules:
//  - Only identity-preserving renames (same candidacy, different label) and
//    the Podemos-confluence merges that the official record aggregates
//    (consistent with verify_seats.ts / the OFFICIAL baselines).
//  - Counting-specific attribution merges (UPN→PP in 1993–2015, EUPV/IC-V→IU
//    in the 90s, BILDU→AMAIUR in 2011, GBAI→NABAI, CHA-IU→IU) are NOT applied
//    here: they re-attribute seats between distinct parties for baseline
//    comparison only. They live in verify_seats.ts (COUNTING_ALIASES).
//  - Semantically questionable merges Scout did not list (e.g. "BNG-NÓS" 2016)
//    are left untouched.
// ============================================================================

import { CircunscripcionData } from "./elections2023";
import { historicalParties } from "./historical-elections";

/**
 * Per-election alias → canonical key map.
 * Keys of the outer object match the election keys of electionData
 * ("2015", "2016", "2019-A", "2019-N", "2027*").
 * Elections not listed are already canonical and pass through unchanged.
 */
export const PARTY_ALIASES: { [year: string]: { [dataKey: string]: string } } = {
  "2015": {
    // Podemos and its confluences, aggregated as in the official record.
    Podemos: "PODEMOS",
    "PODEMOS-En": "PODEMOS",   // En Marea (Galicia)
    UP: "PODEMOS",             // En Comú Podem (Catalonia) / En Marea (Lugo)
    // Unidad Popular (IU) lists.
    "UP: IULV-CA": "IU",
    "UPB: IU-UPe": "IU",
    "UNIDAD POPU": "IU",
    EUPV: "IU",
  },
  "2016": {
    "PODEMOS-IU-EQUO": "UP",            // Unidos Podemos
    ECP: "UP",                          // En Comú Podem
    "PODEMOS-COMPROMÍS-EUPV": "UP",     // A la valenciana
    "PODEMOS-EN MAREA-ANOVA-EU": "UP",  // En Marea
    "C's": "Cs",
    "ERC-CATSÍ": "ERC",
    "EAJ-PNV": "PNV",
    "EH Bildu": "BILDU",
    "CCa-PNC": "CCA",
  },
  "2019-A": {
    "En Comú Podem": "UP",
    "EH Bildu": "BILDU",
    CCa: "CCA",
    "Compromís": "COMPROMIS",
    JxCat: "JUNTS",
  },
  "2019-N": {
    ECP: "UP",
    "EH Bildu": "BILDU",
    "Más País": "MASPAIS",
    "Compromís": "COMPROMIS",
    "CCa-NC": "CCA",
    "Navarra Suma": "NA+",
    "TERUEL EXISTE": "TERUEL",
    JxCat: "JUNTS",
  },
  "2027*": {
    Podemos: "PODEMOS",
  },
};

/**
 * Returns a copy of the circumscription list with party keys canonicalized.
 * Votes of keys that map to the same canonical key are summed.
 */
export function normalizeElectionData(
  year: string,
  circumscriptions: CircunscripcionData[]
): CircunscripcionData[] {
  const aliases = PARTY_ALIASES[year];
  if (!aliases) return circumscriptions;
  return circumscriptions.map(circ => {
    const votes: { [party: string]: number } = {};
    for (const [party, v] of Object.entries(circ.votes)) {
      const key = aliases[party] ?? party;
      votes[key] = (votes[key] || 0) + v;
    }
    return { ...circ, votes };
  });
}

/**
 * Party metadata (name/color) keyed by canonical key.
 * Built from the existing maps (elections2023.parties via historicalParties),
 * remapping colors that were only keyed by old labels onto the canonical key.
 */
export const canonicalParties: { [key: string]: { name: string; color: string } } =
  (() => {
    const out: { [key: string]: { name: string; color: string } } = {
      ...historicalParties,
    };
    for (const aliases of Object.values(PARTY_ALIASES)) {
      for (const [from, to] of Object.entries(aliases)) {
        if (!out[to] && out[from]) {
          out[to] = { name: out[from].name, color: out[from].color };
        }
      }
    }
    return out;
  })();
