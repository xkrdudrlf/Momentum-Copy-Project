export const getDateWithOffset = function (dt = null, offset = null) {
  if (!dt) return new Date();
  return new Date((dt + offset) * 1000);
};
