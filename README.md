# bitpackr

An efficient low-level packet serializer, down to bit-level.

### Documentation:
The documentation is auto-generated and can be found [here](https://maierfelix.github.io/bitpackr/docs).

### Installation:
Package installation:
````
npm install bitpackr
````

Browser installation:
````html
<script src="https://unpkg.com/bitpackr/dist/index.iife.min.js"></script>
````

### General:
This library doesn't validate encoded/decoded data. Instead of throwing errors to the user:
 - If data is missing or has gaps, zeros get filled in
 - If data exceeds it's bit range, it overflows

### Example:

````ts
import * as bitpackr from "bitpackr";

// Define data layout
const PLAYER_PACKET = new bitpackr.Layout([
  {name: "id",     bitLength: 4},
  {name: "color",  bitLength: 8, elementCount: 4},
  {name: "health", bitLength: 8},
  {name: "dead",   bitLength: 1},
]);

// The data to encode
const input = [
  // Packet id
  15,
  // Color
  128, 0, 128, 255,
  // Health
  66,
  // Dead
  1
];

// Encode data
const encoded = PLAYER_PACKET.encode(input);
// Decode data
const decoded = bitpackr.Layout.getPacketBits(encoded);

// The decoded data
const output = [
  // Packet id
  PLAYER_PACKET.decode("id", decoded),
  // Color
  PLAYER_PACKET.decode("color", decoded, 0),
  PLAYER_PACKET.decode("color", decoded, 1),
  PLAYER_PACKET.decode("color", decoded, 2),
  PLAYER_PACKET.decode("color", decoded, 3),
  // Health
  PLAYER_PACKET.decode("health", decoded),
  // Dead
  PLAYER_PACKET.decode("dead", decoded),
];
````

### Steganography:

By default, this library encodes data into an `Uint8Array` with `8-bit` per item. Instead of `8-bit`, a custom bit stride can be used. This allows you to encode your data into destinations, where you have less than `8-bit` available per item.

One scenario where you have only `3-bit` available are transaction sums. This library allows you to hide information within a transaction sum:

````ts
import * as bitpackr from "bitpackr";

const BITS_PER_DIGIT = 3;

const SECRET_DATA = new bitpackr.Layout([
  {name: "token", bitLength: 8, elementCount: 4},
]);

const input = [11, 22, 33, 44];

// The transaction amount to send, which stores secret data
const encoded = "0.0" + SECRET_DATA.encode(input, BITS_PER_DIGIT).join(""); // 0.031031201450

const decoded = bitpackr.Layout.getPacketBits(encoded.split("").map(v => parseInt(v)).slice(3), BITS_PER_DIGIT);

const output = SECRET_DATA.decodeElements("token", decoded);
````
