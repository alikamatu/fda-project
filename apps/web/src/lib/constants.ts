export const APP_NAME = "FDA Product Verify";
export const COMPANY_NAME = "FDA Verification System";
export const SUPPORT_EMAIL = "support@fda-verify.gov";
export const COPYRIGHT_YEAR = new Date().getFullYear();

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
