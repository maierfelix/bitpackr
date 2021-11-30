import {bitsToNumber, numberToBits, bitsNToBits, bitsToBitsN} from "./utils";

/**
 * Represents an internal packet table member
 */
interface IPacketTableMember {
  /**
   * Name of a packet table member
   */
  name: string;
  /**
   * Calculated bit offset of a packet table member
   */
  bitOffset: number;
  /**
   * Bit length of a packet table member
   */
  bitLength: number;
  /**
   * Calculated bit range of a packet table member
   */
  bitRange: number;
  /**
   * Element count of a packet table member
   */
  elementCount: number;
}

/**
 * Represents a packet layout member
 */
export interface IPacketLayoutMember {
  /**
   * The name of the layout member
   */
  name: string;
  /**
   * The bit length of the layout member
   */
  bitLength: number;
  /**
   * Optional element count of the layout member
   */
  elementCount?: number;
}

/**
 * Packet layout class
 */
export class Layout {

  /**
   * Internal layout table
   */
  private _table: Map<string, IPacketTableMember> = null;

  /**
   * The total bit length of the packet layout
   */
  private _totalBitLength: number = 0;

  /**
   * The constructor of this packet layout
   * @param layout - The packet layout to use
   */
  public constructor(layout: IPacketLayoutMember[]) {
    const table = new Map<string, IPacketTableMember>();
    let bitOffset = 0;
    // Build internal layout table
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
   * Encodes the provided packet data
   * @param packet - The packet data to encode
   * @param bitStride - Optional custom bit stride to use
   */
  public encode(packet: number[], bitStride: number = 8): Uint8Array {
    const output = new Uint8Array(this._totalBitLength);
    // Encode layout members
    let bitOffset = 0;
    let elementOffset = 0;
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
   * Decodes the layout member of the provided packet data
   * @param name - The name of the layout member to decode
   * @param bits - The packet bits to decode
   * @param elementIndex - Optional element index to start decoding at
   */
  public decode(name: string, bits: Uint8Array, elementIndex: number = 0): number {
    const table = this._table.get(name);
    // Validate table member query
    if (!table) throw new ReferenceError(`'${name}' is not a valid layout member`);
    // Validate element index
    if (elementIndex >= table.elementCount) throw new RangeError(`Element index '${elementIndex}' out of range`);
    // Decode layout member
    const bitStrideOffset = elementIndex * (table.bitLength | 0);
    const number = bitsToNumber(bits.subarray(table.bitOffset + bitStrideOffset), table.bitLength);
    // Overflow if OOB
    return number & table.bitRange;
  }

  /**
   * Decodes the layout member elements of the provided packet data
   * @param name - The name of the layout member to decode
   * @param bits - The packet bits to decode
   */
  public decodeElements(name: string, bits: Uint8Array): number[] {
    const table = this._table.get(name);
    // Validate table member query
    if (!table) throw new ReferenceError(`'${name}' is not a valid layout member`);
    // Decode layout member elements
    const output: number[] = [];
    for (let ii = 0; ii < table.elementCount; ++ii) {
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
