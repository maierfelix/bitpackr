/**
 * The default bit stride to use
 */
export const DEFAULT_BIT_STRIDE = 8;

/**
 * Number to bit conversion buffer
 */
const NUMBER_TO_BITS_BUFFER = new Uint8Array(1 << 7);

/**
 * Converts the provided bits into a number
 * @param bits - The bits to convert
 * @param bitStride - Optional custom bit stride to use
 */
export function bitsToNumber(bits: Uint8Array, bitStride: number = DEFAULT_BIT_STRIDE): number {
  // Convert using bigint since js bitwise operators are 32-bit signed
  if (bitStride >= 32) {
    let number = 0n;
    for (let bb = BigInt(bitStride - 1); bb >= 0n; --bb) {
      number = number | (BigInt(bits[Number(bb)] & 1) << bb);
    }
    return Number(number);
  }
  // Convert using regular js bitwise operators
  let number = 0;
  for (let bb = bitStride - 1; bb >= 0; --bb) {
    number |= ((bits[bb] & 1) << bb);
  }
  return number;
}

/**
 * Converts the provided number into it's bit equivalent
 * @param number - The number to convert
 * @param bitStride - Optional custom bit stride to use
 */
export function numberToBits(number: number, bitStride: number = DEFAULT_BIT_STRIDE): Uint8Array {
  const bits = NUMBER_TO_BITS_BUFFER;
  // Convert using bigint since js bitwise operators are 32-bit signed
  if (bitStride >= 32) {
    for (let bb = BigInt(bitStride - 1); bb >= 0n; --bb) {
      bits[Number(bb)] = Number(BigInt(number) & (1n << bb) ? 1n : 0n);
    }
  }
  // Convert using regular js bitwise operators
  else {
    for (let bb = bitStride - 1; bb >= 0; --bb) {
      bits[bb] = number & (1 << bb) ? 1 : 0;
    }
  }
  return bits.subarray(0, bitStride);
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
      output[(ii * bitStride) + bb] = bits[bb];
    }
  }
  return output;
}
