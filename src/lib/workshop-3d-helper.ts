export const resolveCardTransform = (rawOffset: number, total: number) => {
  let o = rawOffset % total;
  if (o > total / 2) o -= total;
  if (o < -total / 2) o += total;

  switch (o) {
    case 0:
      return { x: 0, y: 0, z: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 20 };
    case 1:
      return {
        x: 76,
        y: 24,
        z: -70,
        rotateY: -22,
        scale: 0.84,
        opacity: 0.65,
        zIndex: 14,
      };
    case 2:
      return {
        x: 120,
        y: 44,
        z: -130,
        rotateY: -34,
        scale: 0.67,
        opacity: 0.3,
        zIndex: 8,
      };
    case -1:
      return {
        x: -76,
        y: 24,
        z: -70,
        rotateY: 22,
        scale: 0.84,
        opacity: 0.65,
        zIndex: 14,
      };
    case -2:
      return {
        x: -120,
        y: 44,
        z: -130,
        rotateY: 34,
        scale: 0.67,
        opacity: 0.3,
        zIndex: 8,
      };
    default:
      return {
        x: 0,
        y: 0,
        z: -220,
        rotateY: 0,
        scale: 0.5,
        opacity: 0,
        zIndex: 0,
      };
  }
};

export const normalizeOffset = (raw: number, total: number) => {
  let o = raw % total;
  if (o > total / 2) o -= total;
  if (o < -total / 2) o += total;
  return o;
};
