export type locationType = {
  type: "object",
  $id: "locationType",
  required: ["lon", "lat", "timestamp"],
  properties: {
    lon: { type: "number", minimum: -180, maximum: 180 },
    lat: { type: "number", minimum: -85.05112878, maximum: 85.05112878 },
    timestamp: { type: "number" , minimum: 1633345319},
  },
  additionalProperties: false
};

export type PointType = {
  latitude: number;
  longitude: number;
};