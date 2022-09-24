/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */

// TODO do right typing

// converts FT.Search that include "RESULT" parameters
export function rsToJSONWithReturn(input: Array<string | number | Array<string | number>>) {
  if (input[0] == 0) return {};
  else {
    const out = new Object;
    for (let i = 1; i < input.length; i += 2){
      const o = new Object;
      // @ts-ignore:
      for (let j = 0; j < input[i+1].length; j += 2){
        // @ts-ignore:
        let key = String(input[i+1][j]);
        key = key.substring(2);
        // subdocuments get returned escaped
        //TODO Handle images
        // @ts-ignore:
        if (typeof(input[i+1][j+1]) == "string" && input[i+1][j+1].charAt(0) == "{") {
          // @ts-ignore:
          o[key] = JSON.parse(input[i+1][j+1]);

        } else {
          // @ts-ignore:
          o[key] = input[i+1][j+1];
        }
      }
      // @ts-ignore:
      out[input[i]] = o;
    }
    // @ts-ignore:
    return out;
  }
}

// converts FT.Search that dont include "RESULT" parameters
export function rsToJSONWithoutReturn( input: Array<string|number|Array<string|number>> ) {
  if (input[0] == 0) return {};
  else {
    const out = new Object;
    for (let i = 1; i < input.length; i += 2){
      // @ts-ignore:
      out[input[i]] = JSON.parse(input[i+1][1]);
    }
    // @ts-ignore:
    return out;
  }
}