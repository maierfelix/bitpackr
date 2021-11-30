import * as bitpackr from "../dist/index.js";

function areArraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let ii = 0; ii < a.length; ++ii) {
    if (a[ii] !== b[ii]) return false;
  }
  return true;
}

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 8}
  ]);
  const input = [
    255,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing single value`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 1}
  ]);
  const input = [
    1,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing 1-bit value`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 2}
  ]);
  const input = [
    2,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing 2-bit value`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 3}
  ]);
  const input = [
    7,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing 3-bit value`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 8}
  ]);
  const input = [
    255,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing 8-bit value`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 16}
  ]);
  const input = [
    65535,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing 16-bit value`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 32}
  ]);
  const input = [
    4294967295,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing 32-bit value`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 1}
  ]);
  const input = [
    3,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(output[0] === 1, `${title} failed`);
})(`Testing 1-bit overflow`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 8}
  ]);
  const input = [
    255 + 2,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(output[0] === 1, `${title} failed`);
})(`Testing 8-bit overflow`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id", bitLength: 32}
  ]);
  const input = [
    4294967295 + 5,
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id", decoded)
  ];
  console.assert(output[0] === 4, `${title} failed`);
})(`Testing 32-bit overflow`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 4},
    {name: "id-1", bitLength: 8},
    {name: "id-2", bitLength: 16},
    {name: "id-3", bitLength: 8},
  ]);
  const input = [
    11,
    128,
    1337,
    66
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id-0", decoded),
    Packet.decode("id-1", decoded),
    Packet.decode("id-2", decoded),
    Packet.decode("id-3", decoded),
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing multiple layout members`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "id-1", bitLength: 8, elementCount: 4},
    {name: "id-2", bitLength: 8},
  ]);
  const input = [
    128,
    ...[255, 128, 0, 255],
    66
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id-0", decoded),
    ...Packet.decodeElements("id-1", decoded),
    Packet.decode("id-2", decoded),
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing multi-element layout members`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "id-1", bitLength: 5, elementCount: 2},
    {name: "id-2", bitLength: 16},
  ]);
  const input = [
    128,
    ...[11, 22],
    65535
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id-0", decoded),
    Packet.decode("id-1", decoded, 0),
    Packet.decode("id-1", decoded, 1),
    Packet.decode("id-2", decoded),
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing multi-element layout members with manual decoding`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 53},
    {name: "id-1", bitLength: 53, elementCount: 3},
    {name: "id-2", bitLength: 2},
  ]);
  const input = [
    Number.MAX_SAFE_INTEGER,
    ...[Number.MAX_SAFE_INTEGER, 1337, Number.MAX_SAFE_INTEGER],
    3
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    Packet.decode("id-0", decoded),
    ...Packet.decodeElements("id-1", decoded),
    Packet.decode("id-2", decoded),
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing large data`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "id-1", bitLength: 32, elementCount: 2},
    {name: "id-2", bitLength: 4},
  ]);
  const input = [
    255,
    ...[420420, 696969],
    15
  ];
  const encoded = Packet.encode(input);
  console.assert(Packet.getLength() === encoded.length, `${title} reported: Invalid length`);
})(`Testing length`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "id-1", bitLength: 32, elementCount: 2},
    {name: "id-2", bitLength: 4},
  ]);
  const input = [
    255,
    ...[1337, 696969],
    7
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    bitpackr.Layout.decodeAt(decoded, 0, 8),
    bitpackr.Layout.decodeAt(decoded, 8, 32, 0),
    bitpackr.Layout.decodeAt(decoded, 8, 32, 1),
    bitpackr.Layout.decodeAt(decoded, 72, 8),
  ];

  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing manual decoding`);

((title) => {
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "id-1", bitLength: 32, elementCount: 2},
    {name: "id-2", bitLength: 4},
  ]);
  const input = [
    127,
    ...[5555, 13337],
    9
  ];
  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);
  const output = [
    bitpackr.Layout.decodeAt(decoded, 0, 8),
    ...bitpackr.Layout.decodeElementsAt(decoded, 8, 32, 2),
    bitpackr.Layout.decodeAt(decoded, 72, 8),
  ];

  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing manual element decoding`);

((title) => {
  const bitStride = 1;
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "id-1", bitLength: 53},
    {name: "id-2", bitLength: 32, elementCount: 2},
    {name: "id-3", bitLength: 2},
  ]);
  const input = [
    255,
    Number.MAX_SAFE_INTEGER,
    ...[4294967295, 696969],
    2
  ];
  const encoded = Packet.encode(input, bitStride);
  const decoded = bitpackr.Layout.getPacketBits(encoded, bitStride);
  const output = [
    Packet.decode("id-0", decoded),
    Packet.decode("id-1", decoded),
    ...Packet.decodeElements("id-2", decoded),
    Packet.decode("id-3", decoded),
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing 1-bit stride`);

((title) => {
  const bitStride = 4;
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "id-1", bitLength: 53},
    {name: "id-2", bitLength: 32, elementCount: 2},
    {name: "id-3", bitLength: 2},
  ]);
  const input = [
    255,
    Number.MAX_SAFE_INTEGER,
    ...[4294967295, 696969],
    2
  ];
  const encoded = Packet.encode(input, bitStride);
  const decoded = bitpackr.Layout.getPacketBits(encoded, bitStride);
  const output = [
    Packet.decode("id-0", decoded),
    Packet.decode("id-1", decoded),
    ...Packet.decodeElements("id-2", decoded),
    Packet.decode("id-3", decoded),
  ];
  console.assert(areArraysEqual(input, output), `${title} reported: Input/Output mismatch`);
})(`Testing 4-bit stride`);

((title) => {
  const bitStride = 2;
  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "id-1", bitLength: 32, elementCount: 2},
    {name: "id-2", bitLength: 4},
  ]);
  const input = [
    255,
    ...[420420, 696969],
    15
  ];
  const encoded = Packet.encode(input, bitStride);
  console.assert(Packet.getLength(bitStride) === encoded.length, `${title} reported: Invalid length`);
})(`Testing 2-bit stride length`);

((title) => {

  const TokenPacket = new bitpackr.Layout([
    {name: "token", bitLength: 8, elementCount: 8},
  ]);
  const inputToken = [13, 37, 42, 66, 88, 11, 22, 33];
  const encodedToken = TokenPacket.encode(inputToken, 3);

  const Packet = new bitpackr.Layout([
    {name: "id-0", bitLength: 8},
    {name: "token", bitLength: 3, elementCount: TokenPacket.getLength(3)},
    {name: "id-2", bitLength: 4},
  ]);
  const input = [
    255,
    ...encodedToken,
    15
  ];

  const encoded = Packet.encode(input);
  const decoded = bitpackr.Layout.getPacketBits(encoded);

  const decodedToken = bitpackr.Layout.getPacketBits(Packet.decodeElements("token", decoded), 3);
  const outputToken = TokenPacket.decodeElements("token", decodedToken);

  console.assert(areArraysEqual(inputToken, outputToken), `${title} reported: Embedded data mismatch`);
})(`Testing nested packets`);
