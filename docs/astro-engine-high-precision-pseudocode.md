# High-Precision Natal Engine Pseudo-code

## Pipeline

```text
INPUT:
  birthLocal = { year, month, day, hour, minute }
  place = { city, region, country, lat, lon, ianaTz }
  config = { houseSystem: 'P'|'K', orbs }

STEP 1) Time Normalization
  utcDateTime = convertLocalToUTC(birthLocal, place.ianaTz)
  decimalHourUTC = utcDateTime.hour + utcDateTime.minute / 60
  jdUT = gregorianToJulianDay(utcDateTime.date, decimalHourUTC)
  deltaT = estimateDeltaTSeconds(birthLocal.year + birthLocal.month/12)
  jdTT = jdUT + (deltaT / 86400)

STEP 2) Ephemeris (SwissEph/VSOP87-backed)
  for body in [Sun..Pluto, Chiron, MeanNode]:
    res = swe_calc_ut(jdUT, body, SEFLG_SWIEPH | SEFLG_SPEED)
    longitude[body] = normalizeDeg(res.longitude)
    speed[body] = res.speedLongitude
    retrograde[body] = speed[body] < 0

STEP 3) Houses + Angles
  houses = swe_houses_ex(jdUT, place.lat, place.lon, houseSystem)
  asc = houses.ascendant
  mc = houses.midheaven
  cusps = houses.cusps[1..12]

STEP 4) Planet-to-House Mapping
  for each body:
    house[body] = locateHouse(longitude[body], cusps)

STEP 5) Aspects
  for each pair (p1, p2):
    angle = minAngularDistance(longitude[p1], longitude[p2])
    if |angle-0| <= orb.conjunction -> Conjunction
    if |angle-60| <= orb.sextile -> Sextile
    if |angle-90| <= orb.square -> Square
    if |angle-120| <= orb.trine -> Trine
    if |angle-150| <= orb.quincunx -> Quincunx
    if |angle-180| <= orb.opposition -> Opposition

OUTPUT JSON:
  {
    meta: { jdUT, jdTT, deltaT, houseSystem, ephemeris: 'swisseph' },
    data: [
      { planet: 'Sun', degree: 123.4567, house: 10, is_retrograde: false },
      ...
    ],
    aspects: [
      { p1: 'Sun', p2: 'Moon', aspect: 'Trine', orb: 1.2345, distance: 121.2345 }
    ]
  }
```

## SwissEph JS Interface Contract

```js
// adapter input
computeNatal({
  birthLocal: { year, month, day, hour, minute },
  place: { lat, lon, ianaTz },
  config: {
    houseSystem: 'P', // P=Placidus, K=Koch
    orbs: { conjunction: 8, opposition: 8, trine: 7, square: 7, sextile: 5, quincunx: 3 }
  }
})

// required backend methods
swe_calc_ut(jdUT, bodyId, flags)
swe_houses_ex(jdUT, lat, lon, houseSystemCode)
```

## Mobile Optimization

- Cache by key: `year-month-day-hour-minute-lat-lon-tz-houseSystem`.
- Memoize `deltaT(year)`.
- Compute aspects only for selected body set on first render, full set on demand.
- Reuse typed arrays for longitudes/speeds in repeated runs.
- Batch expensive work in Web Worker for low-end devices.
