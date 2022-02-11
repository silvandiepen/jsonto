import cssFunctions from "../../data/functions";
import cssValues from "../../data/values";

export const isCssFunction = (str: string): boolean =>
  cssFunctions.indexOf(`${str}(`) === 0;

export const isCssPropertyValue = (str: string): boolean =>
  cssValues.includes(str);

export const isCssNumber = (str: string | number): boolean => {
  let isNumber = false;
  if (str == "0") isNumber = true;
  if (typeof str == "number") isNumber = true;
  if (typeof str == "string")
    if (parseInt(str) > 0 || str.startsWith("0.")) isNumber = true;

  return isNumber;
};

export const isCssBoolean = (str: string): boolean =>
  str == "true" || str == "false";

export const SassValue = (input: any) => {
  let convertedInput = "";
  if (
    isCssNumber(input) ||
    (typeof input == "string" && isCssFunction(input)) ||
    (typeof input == "string" && isCssPropertyValue(input)) ||
    (typeof input == "string" && isCssBoolean(input)) ||
    (typeof input == "string" && input.startsWith("'"))
  ) {
    convertedInput = `${input}`;
  } else if (typeof input == "string") {
    convertedInput = `"${input}"`;
  } else if (typeof input == "boolean") {
    convertedInput = input ? "true" : "false";
  } else if (Array.isArray(input)) {
    convertedInput = `(${input.join(", ")})`;
  } else {
    let entries: string[] = [];
    Object.keys(input).forEach((entry) => {
      entries.push(`${entry} : ${input[entry]}`);
    });
    convertedInput = `(${entries.join(", ")})`;
  }
  return convertedInput;
};

export const SassObject = (input: any): string => {
  let SassObjectGroup: string[] = [];

  Object.keys(input).forEach((entry: string) => {
    SassObjectGroup.push(`"${entry}": ${SassValue(input[entry])}`);
  });

  return SassObjectGroup.join(",\n");
};
