export const formatTemperatureRange = (min?: string | null, max?: string | null): string => {
  if (!min && !max) {
    return "-";
  }

  if (min && max) {
    return `${min}° - ${max}°`;
  }

  if (min) {
    return `↓ ${min}°`;
  }

  return `↑ ${max}°`;
};
