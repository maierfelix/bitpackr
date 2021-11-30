import {bitsToNumber, numberToBits, bitsNToBits, bitsToBitsN} from "./utils";

/**
 * Represents a layout table entry
 */
interface ILayoutTableEntry {
  /**
   * The name of the layout member
   */
  name: string;
  /**
   * Calculated bit offset of a layout member
   */
  bitOffset: number;
  /**
   * Bit length of a layout member
   */
  bitLength: number;
  /**
   * Calculated bit range of a layout member
   */
  bitRange: number;
  /**
   * Element count of a layout member
   */
  elementCount: number;
}

/**
 * Represents packet layout member
 */
export interface IPacketLayoutMember {
  /**
   * The name of the packet member
   */
  name: string;
  /**
   * The bit length of the packet member
   */
  bitLength: number;
  /**
   * Optional element count
   */
  elementCount?: number;
}

/**
 * Packet layout alias
 */
export type IPacketLayout = IPacketLayoutMember[];

/**
 * Class representing a layout
 */
export class Layout {

  /**
   * Internal packet layout of the class
   */
  private _table: Map<string, ILayoutTableEntry> = null;

  /**
   * The total bit length of the packet layout
   */
  private _totalBitLength: number = 0;

  /**
   * The constructor of this packet layout
   * @param layout - The packet layout to use
   */
  public constructor(layout: IPacketLayout) {
    const table = new Map<string, ILayoutTableEntry>();
    let bitOffset = 0;
    for (const member of layout) {
      const name = member.name;
      const bitLength = member.bitLength | 0;
      const bitRange = ((2 ** bitLength) - 1);
      const elementCount = (member.elementCount | 0) || 1;
      table.set(name, {name, bitOffset, bitLength, bitRange, elementCount});
      bitOffset += bitLength * elementCount;
    }
    this._table = table;
    this._totalBitLength = bitOffset;
  }

  /**
   * Encodes the provided packet data into
   * @param packet - The packet to encode
   * @param bitStride - Optional custom bit stride to use
   */
  public encode(packet: number[], bitStride: number = 8): Uint8Array {
    const output = new Uint8Array(this._totalBitLength);

    let elementOffset = 0;
    let bitOffset = 0;
    // Encode packet members
    for (const [_, {bitLength, bitRange, elementCount}] of this._table) {
      for (let ii = 0; ii < elementCount; ++ii) {
        // Overflow if OOB
        const data = packet[elementOffset] & bitRange;
        const dataBits = numberToBits(data, bitLength).reverse();
        output.set(dataBits, bitOffset);
        bitOffset += bitLength;
        elementOffset++;
      }
    }

    return bitsToBitsN(output, bitStride);
  }

  /**
   * Decodes the packet member of the provided packet data
   * @param name - The member name to query by
   * @param bits - The packet bits to decode
   * @param elementIndex - Optional element index to start decoding at
   */
  public decode(name: string, bits: Uint8Array, elementIndex: number = 0): number {
    const {bitOffset, bitLength, bitRange, elementCount} = this._table.get(name);
    // Validate element index
    if (elementIndex >= elementCount) {
      throw new RangeError(`Element index '${elementIndex}' out of maximum range '${elementCount}'`);
    }
    const bitStrideOffset = elementIndex * (bitLength | 0);
    // Decode packet member
    const number = bitsToNumber(bits.subarray(bitOffset + bitStrideOffset), bitLength);
    // Overflow if OOB
    return number & bitRange;
  }

  /**
   * Decodes the packet member elements of the provided packet data
   * @param name - The member name to query by
   * @param bits - The packet bits to decode
   */
  public decodeElements(name: string, bits: Uint8Array): number[] {
    const {elementCount} = this._table.get(name);
    const output: number[] = [];
    for (let ii = 0; ii < elementCount; ++ii) {
      output.push(this.decode(name, bits, ii));
    }
    return output;
  }

  /**
   * Returns a bit representation of the provided data
   * @param data - The packet data to decode into bits
   * @param bitStride - Optional custom bit stride to use
   */
  public static getPacketBits(data: Uint8Array, bitStride: number = 8): Uint8Array {
    const bits = bitsNToBits(data, bitStride);
    return bits;
  }

}
