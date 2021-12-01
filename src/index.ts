import {bitsToNumber, numberToBits, bitsNToBits, DEFAULT_BIT_STRIDE, bitsToBitsN} from "./utils";

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
 * Type representing the allowed packet data
 */
export type PacketData = (number | number[]);

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
  private _bitLength: number = 0;

  /**
   * The bit stride of the packet layout
   */
  private _bitStride: number = 0;

  /**
   * The constructor of this packet layout
   * @param layout - The packet layout to use
   * @param bitStride - Optional custom bit stride to use
   */
  public constructor(layout: IPacketLayoutMember[], bitStride: number = DEFAULT_BIT_STRIDE) {
    const table = new Map<string, IPacketTableMember>();
    let bitOffset = 0;
    // Build internal layout table
    for (const member of layout) {
      const name = member.name;
      const bitLength = (member.bitLength) | 0;
      const elementCount = (member.elementCount | 0) || 1;
      table.set(name, {name, bitOffset, bitLength, elementCount});
      bitOffset += bitLength * elementCount;
    }
    this._table = table;
    this._bitLength = bitOffset;
    if (bitStride <= 0 || bitStride > 8) {
      throw new RangeError(`Custom bit stride must be between 1 and 8`);
    }
    this._bitStride = bitStride;
  }

  /**
   * Returns the total bit length of the layout
   */
  public getBitLength(): number {return this._bitLength;}

  /**
   * Returns the bit stride of the layout
   */
  public getBitStride(): number {return this._bitStride;}

  /**
   * Returns the total length of the layout
   */
  public getLength(): number {return Math.ceil(this.getBitLength() / this.getBitStride());}

  /**
   * Encodes the provided bit buffer into a buffer
   * @param buffer - The bit buffer to encode
   */
  public encodeLayout(buffer: Uint8Array): Uint8Array {return bitsToBitsN(buffer, this.getBitStride());}

  /**
   * Decodes the provided buffer into a bit buffer
   * @param buffer - The buffer to decode
   */
  public decodeLayout(buffer: Uint8Array): Uint8Array {return bitsNToBits(buffer, this.getBitStride());}

  /**
   * Encodes the layout data
   * @param name - The name of the layout member to encode
   * @param data - The packet data to encode
   * @param buffer - The bit buffer to encode into
   */
  public encode(name: string, data: PacketData, buffer: Uint8Array): void {
    const table = this._table.get(name);
    // Validate table member query
    if (!table) throw new ReferenceError(`'${name}' is not a valid layout member`);
    // Encode packet array data
    if (Array.isArray(data)) {
      for (let ii = 0; ii < table.elementCount; ++ii) {
        const dataBits = numberToBits(data[ii] || 0, table.bitLength);
        buffer.set(dataBits, table.bitOffset + (ii * table.bitLength));
      }
    }
    // Encode packet numeric data
    else {
      const dataBits = numberToBits(data || 0, table.bitLength);
      buffer.set(dataBits, table.bitOffset);
    }
  }

  /**
   * Decodes the layout data
   * @param name - The name of the layout member to decode
   * @param buffer - The bit buffer to decode from
   */
  public decode(name: string, buffer: Uint8Array): PacketData {
    const table = this._table.get(name);
    // Validate table member query
    if (!table) throw new ReferenceError(`'${name}' is not a valid layout member`);
    // Decode packet array data
    if (table.elementCount > 1) {
      const output: number[] = [];
      for (let ii = 0; ii < table.elementCount; ++ii) {
        const bitStrideOffset = ii * table.bitLength;
        const data = bitsToNumber(buffer.subarray(table.bitOffset + bitStrideOffset), table.bitLength);
        output.push(data);
      }
      return output;
    }
    // Decode packet numeric data
    return bitsToNumber(buffer.subarray(table.bitOffset), table.bitLength);
  }

  /**
   * Manually decodes the layout data
   * @param buffer - The bit buffer to decode from
   * @param bitOffset - The bit offset to start decoding at
   * @param bitLength - The bit length to decode with
   * @param elementCount - Optional element count to decode
   */
  public static decodeAt(buffer: Uint8Array, bitOffset: number, bitLength: number, elementCount: number = 0): PacketData {
    if (elementCount > 0) {
      const output: number[] = [];
      for (let ii = 0; ii < elementCount; ++ii) {
        const bitStrideOffset = ii * (bitLength | 0);
        const data = bitsToNumber(buffer.subarray((bitOffset | 0) + bitStrideOffset), (bitLength | 0));
        output.push(data);
      }
      return output;
    }
    return bitsToNumber(buffer.subarray((bitOffset | 0)), (bitLength | 0));
  }

  /**
   * Encodes the provided bit buffer into a buffer
   * @param buffer - The bit buffer to encode
   * @param bitStride - Optional custom bit stride to use
   */
  public static encodeLayout(buffer: Uint8Array, bitStride: number = DEFAULT_BIT_STRIDE): Uint8Array {
    return bitsToBitsN(buffer, bitStride);
  }

  /**
   * Decodes the provided buffer into a bit buffer
   * @param buffer - The buffer to decode
   * @param bitStride - Optional custom bit stride to use
   */
  public static decodeLayout(buffer: Uint8Array, bitStride: number = DEFAULT_BIT_STRIDE): Uint8Array {
    return bitsNToBits(buffer, bitStride);
  }

}
