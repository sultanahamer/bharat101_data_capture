export const getPlaceHoldersFor = (fieldCount) => {
  return Array.from(Array(fieldCount).keys()).map(() => "?").join(",");
}
