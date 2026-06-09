export const formatTimestamp = (isoString) => {
  if (!isoString) return '';
  return isoString.replace('T', ' ');
};