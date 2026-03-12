# SwissEph Integration Guide

## Runtime switches

- `window.ASTRO_HOUSE_SYSTEM = 'P'` (Placidus)
- `window.ASTRO_HOUSE_SYSTEM = 'K'` (Koch)
- `window.ASTRO_STRICT_PRECISION = true`
  - SwissEph adapter is required.
  - If SwissEph is not available, chart calculation throws.

Default behavior in current build:

- `ASTRO_STRICT_PRECISION` defaults to `false` to keep production UI available.
- When a SwissEph global API exists (`window.swisseph | window.Swe | window.swe`), engine uses SwissEph path.

## Required SwissEph API contract

The global object should provide these methods/constants:

- `swe_calc_ut` or `calc_ut`
- `swe_houses_ex` or `swe_houses`
- `SE_SUN..SE_PLUTO`
- `SEFLG_SPEED`
- `SEFLG_SWIEPH` (optional, fallback numeric flag used if missing)

## Data flow

1. Local birth time -> UTC normalization
2. `jdUT` calculation from Gregorian date
3. `deltaT` and `jdTT`
4. SwissEph `swe_calc_ut(jdUT, planet, flags)` for Sun..Pluto
5. SwissEph house calculation (`P` or `K`)
6. Structured JSON output via `AstroEngine.toNatalJSON(...)`

## JSON output schema

```json
{
  "meta": {
    "precisionMode": "swisseph|legacy-fallback",
    "houseSystem": "P|K"
  },
  "jdUT": 2451545.123456,
  "jdTT": 2451545.124321,
  "deltaT": 69.123,
  "data": [
    { "planet": "Sun", "degree": 123.4567, "house": 10, "is_retrograde": false }
  ],
  "aspects": [
    { "p1": "Sun", "p2": "Moon", "aspect": "Trine", "orb": 1.2345, "distance": 121.2345 }
  ]
}
```
