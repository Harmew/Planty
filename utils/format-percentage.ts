/** Função para formatar porcentagem (%) */
export const formatPercentage = (value?: string | number): string => {
  if (value === undefined || value === null) return "";

  const stringValue = String(value);

  // mantém apenas números
  const digits = stringValue.replace(/\D/g, "");

  if (!digits) return "";

  return `${digits}%`;
};
