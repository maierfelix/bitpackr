/**
 * The default bit stride to use
 */
export const DEFAULT_BIT_STRIDE = 8;

/**
 * Converts the provided bits into a number
 * @param bits - The bits to convert
 * @param bitStride - Optional custom bit stride to use
 */
export function bitsToNumber(bits: Uint8Array, bitStride: number = DEFAULT_BIT_STRIDE): number {
  let number = 0;
  for (let bb = bitStride - 1; bb >= 0; --bb) {
    number |= (bits[bb] << bb);
  }
  return number;
}

/**
 * Converts the provided number into it's bit equivalent
 * @param number - The number to convert
 * @param bitStride - Optional custom bit stride to use
 */
export function numberToBits(number: number, bitStride: number = DEFAULT_BIT_STRIDE): Uint8Array {
  const bits = new Uint8Array(bitStride);
  for (let bb = bitStride - 1; bb >= 0; --bb) {
    bits[bitStride - 1 - bb] = number & (1 << bb) ? 1 : 0;
  }
  return bits;
}

/**
 * Converts the provided bytes into their bit equivalent
 * @param bytes - The bytes to convert
 */
export function bytesToBits(bytes: Uint8Array): Uint8Array {
  const bits = new Uint8Array(bytes.length * 8);
  for (let ii = 0; ii < bytes.length; ++ii) {
    const b = numberToBits(bytes[ii], 8);
    for (let bb = 0; bb < 8; ++bb) {
      bits[(ii * 8) + bb] = b[bb];
    }
  }
  return bits;
}

/**
 * Converts the provided 1-d bits into N-d bits
 * @param bitsn - The 1-d bits to convert
 * @param bitStride - Optional custom bit stride to use
 */
export function bitsToBitsN(bits: Uint8Array, bitStride: number = DEFAULT_BIT_STRIDE): Uint8Array {
  const output = new Uint8Array(Math.ceil(bits.length / bitStride));
  for (let ii = 0; ii < output.length; ++ii) {
    output[ii] = bitsToNumber(bits.subarray((ii * bitStride) + 0, (ii * bitStride) + bitStride), bitStride);
  }
  return output;
}

/**
 * Converts the provided N-d bits into 1-d bits
 * @param bitsn - The N-d bits to convert
 * @param bitStride - Optional custom bit stride to use
 */
export function bitsNToBits(bitsn: Uint8Array, bitStride: number = DEFAULT_BIT_STRIDE): Uint8Array {
  const output = new Uint8Array(Math.floor(bitsn.length * bitStride));
  for (let ii = 0; ii < bitsn.length; ++ii) {
    const bits = numberToBits(bitsn[ii], bitStride);
    for (let bb = 0; bb < bitStride; ++bb) {
      output[(ii * bitStride) + bb] = bits[bitStride - 1 - bb];
    }
  }
  return output;
}
