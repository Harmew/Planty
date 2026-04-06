export function formatHumidityLabel(value?: string | null): string {
  if (!value) {
    return "-";
  }

  return `${value}%`;
}
