export function addressSplitter(addressStr) {
  return {
    0: addressStr.substring(0, Math.round(addressStr.length / 2)),
    1: addressStr.substring(
      Math.round(addressStr.length / 2),
      addressStr.length,
    ),
  };
}
