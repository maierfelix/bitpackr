# bitpackr

An efficient low-level packet serializer, down to bit-level

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

### Example:

````ts
import * as bitpackr from "bitpackr";

// Define data layout
const PLAYER_PACKET = new bitpackr.Layout([
  {name: "id",     bitLength: 4},
  {name: "color",  bitLength: 32, bitStride: 8},
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
