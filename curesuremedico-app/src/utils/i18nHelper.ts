export function getLocalizedField(obj: any, fieldName: string, locale: string): string {
  if (!obj) return "";
  if (locale === 'fr' && obj[`${fieldName}_fr`]) return obj[`${fieldName}_fr`];
  if (locale === 'ar' && obj[`${fieldName}_ar`]) return obj[`${fieldName}_ar`];
  return obj[fieldName] || "";
}
