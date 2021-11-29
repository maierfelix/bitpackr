import {bitsToNumber, numberToBits, bitsNToBits, bitsToBitsN} from "./utils";

/**
 * Returns the total bit length of the provided layout
 * @param layout - The layout to process
 */
function getLayoutBitLength(layout: IPacketLayout): number {
  let length = 0;
  for (const member of layout) {
    length += member.bitLength;
  }
  return length;
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
   * Optional element-wise bit stride of the packet member
   */
  bitStride?: number;
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
   * Packet layout of the class
   */
  private _layout: IPacketLayout = null;

  /**
   * Packet layout of the class
   */
  private _layoutBitOffsetTable: Map<string, number> = null;

  /**
   * The total bit length of the packet layout
   */
  private _totalBitLength: number = 0;

  /**
   * The constructor of this packet layout
   * @param layout - The packet layout to use
   */
  public constructor(layout: IPacketLayout) {
    this._layout = layout;
    this._totalBitLength = getLayoutBitLength(layout);
    this._layoutBitOffsetTable = this._createLayoutBitOffsetTable();
  }

  /**
   * Returns the layout
   */
  public getLayout(): IPacketLayout {return this._layout;}

  /**
   * Returns the total bit length of the packet layout
   */
  public getTotalBitLength(): number {return this._totalBitLength;}

  /**
   * Encodes the provided packet data
   * @param packet - The packet to encode
   * @param bitStride - Optional custom bit stride to use
   */
  public encode(packet: number[], bitStride: number = 8): Uint8Array {
    const layout = this.getLayout();
    const output = new Uint8Array(this.getTotalBitLength());

    let elementOffset = 0;
    let bitOffset = 0;
    // Encode packet members
    for (const {bitLength, bitStride} of layout) {
      // Encode multi-element data
      if (bitStride && bitStride > 0) {
        const elementCount = Math.floor(bitLength / bitStride);
        for (let ii = 0; ii < elementCount; ++ii) {
          const data = packet[elementOffset];
          //const bitRange = ((2 ** bitLength) - 1);
          //if (data < 0 || data > bitRange) throw new Error(`Layout member '${name}' data bit overflow`);
          const dataBits = numberToBits(data, bitStride).reverse();
          output.set(dataBits, bitOffset);
          bitOffset += bitStride;
          elementOffset++;
        }
      }
      // Encode single data
      else {
        const data = packet[elementOffset];
        //const bitRange = ((2 ** bitLength) - 1);
        //if (data < 0 || data > bitRange) throw new Error(`Layout member '${name}' data bit overflow`);
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
   * @param bitStrideIndex - Optional bit stride index to start decoding at
   */
  public decode(name: string, bits: Uint8Array, bitStrideIndex: number = 0): number {
    const {bitLength, bitStride} = this.getLayout().find(d => d.name === name);
    const bitStrideOffset = bitStrideIndex * (bitStride | 0);
    const bitOffset = this._layoutBitOffsetTable.get(name);
    // Decode packet member
    const number = bitsToNumber(bits.subarray(bitOffset + bitStrideOffset), bitLength);
    const bitRange = ((2 ** (bitStride || bitLength)) - 1);
    // Extra safety here, make sure that the data never goes out of range
    const output = number & bitRange;
    return output;
  }

  /**
   * Create a bit offset table to accelerate layout access times
   */
  private _createLayoutBitOffsetTable(): Map<string, number> {
    const layout = this.getLayout();
    const table = new Map<string, number>();
    let bitOffset = 0;
    for (let ii = 0; ii < layout.length; ++ii) {
      const {name, bitLength} = layout[ii];
      table.set(name, bitOffset);
      bitOffset += bitLength;
    }
    return table;
  }

  /**
   * Returns a bit representation of the provided data
   * @param data - The packet data to decode into bits
   * @param bitStride - Optional custom bit stride of the packet data to decode
   */
  public static getPacketBits(data: Uint8Array, bitStride: number = 8): Uint8Array {
    const bits = bitsNToBits(data, bitStride);
    return bits;
  }

}
