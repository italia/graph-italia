import type { PointData } from "dataviz-components";
// Approximate Bounding Boxes
// const ITALY_BOUNDS = {
//   minLon: 6.6,
//   maxLon: 18.5,
//   minLat: 35.5,
//   maxLat: 47.1,
// };
const ITALY_BOUNDS = {
  minLon: 8.6,
  maxLon: 16.5,
  minLat: 37.5,
  maxLat: 45.1,
};

const TUSCANY_BOUNDS = {
  minLon: 9.8,
  maxLon: 12.5,
  minLat: 42.2,
  maxLat: 44.3,
};

function getRandomInRange(
  min: number,
  max: number,
  decimals: number = 4
): number {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

export function generateSamplePoints(totalPoints: number = 1000): PointData[] {
  const points: PointData[] = [];
  const tuscanyPoints = Math.floor(totalPoints / 2); // Half in Tuscany
  const otherPoints = totalPoints - tuscanyPoints;

  // Generate points in Tuscany
  for (let i = 0; i < tuscanyPoints; i++) {
    points.push({
      id: i,
      name: `Tuscan Point ${i + 1}`,
      lon: getRandomInRange(TUSCANY_BOUNDS.minLon, TUSCANY_BOUNDS.maxLon),
      lat: getRandomInRange(TUSCANY_BOUNDS.minLat, TUSCANY_BOUNDS.maxLat),
      region: "Tuscany",
    });
  }

  // Generate other points across Italy (avoiding too much overlap with precise Tuscany bounds)
  for (let i = 0; i < otherPoints; i++) {
    let lon = getRandomInRange(ITALY_BOUNDS.minLon, ITALY_BOUNDS.maxLon);
    let lat = getRandomInRange(ITALY_BOUNDS.minLat, ITALY_BOUNDS.maxLat);

    // Simple check to reduce density in Tuscany for "other" points
    // This is a naive way, for real scenarios you might want more sophisticated distribution
    if (
      lon >= TUSCANY_BOUNDS.minLon &&
      lon <= TUSCANY_BOUNDS.maxLon &&
      lat >= TUSCANY_BOUNDS.minLat &&
      lat <= TUSCANY_BOUNDS.maxLat
    ) {
      // If it falls within Tuscany, try generating another point outside
      // or bias towards edges of Italy
      if (Math.random() > 0.5) {
        // 50% chance to push it to an edge
        lon =
          Math.random() > 0.5
            ? getRandomInRange(ITALY_BOUNDS.minLon, TUSCANY_BOUNDS.minLon - 0.1) // West of Tuscany
            : getRandomInRange(
                TUSCANY_BOUNDS.maxLon + 0.1,
                ITALY_BOUNDS.maxLon
              ); // East of Tuscany
      } else {
        lat =
          Math.random() > 0.5
            ? getRandomInRange(ITALY_BOUNDS.minLat, TUSCANY_BOUNDS.minLat - 0.1) // South of Tuscany
            : getRandomInRange(
                TUSCANY_BOUNDS.maxLat + 0.1,
                ITALY_BOUNDS.maxLat
              ); // North of Tuscany
      }
      // Ensure it's still within overall Italy bounds
      lon = Math.max(ITALY_BOUNDS.minLon, Math.min(ITALY_BOUNDS.maxLon, lon));
      lat = Math.max(ITALY_BOUNDS.minLat, Math.min(ITALY_BOUNDS.maxLat, lat));
    }

    points.push({
      id: tuscanyPoints + i,
      name: `Italian Point ${i + 1}`,
      lon: lon,
      lat: lat,
      region: "Other",
    });
  }
  return points;
}
