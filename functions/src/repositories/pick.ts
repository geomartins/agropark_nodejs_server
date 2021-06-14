import * as dateAndTime from "date-and-time";
export const capitalize = (value: string) => {
  let strVal = "";
  const str = value.split(" ");
  for (let chr = 0; chr < str.length; chr++) {
    strVal += str[chr].substring(0, 1).toUpperCase() +
      str[chr].substring(1, str[chr].length) + " ";
  }
  return strVal;
};


export const humanReadable = (value: any) => {
  if (!value) return "";
  return dateAndTime.format(value, "ddd, MMM DD YYYY");
};
