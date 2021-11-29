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

// Define layout
const layout = new bitpackr.PacketLayout([
  {name: "id", bitLength: 4},
  {name: "color", bitLength: 32, bitStride: 8},
  {name: "health", bitLength: 8},
]);

// The data to encode
const input = [
  // Packet id
  0,
  // RGBA Color
  255, 0, 255, 255,
  // Health
  255
];
// Encode data into an Uint8Array
const encoded = layout.encode(input);

// Decode encoded data
const decodedBits = bitpackr.PacketLayout.getPacketBits(encoded);
// Read decoded data
const decoded = [
  // Read packet id
  layout.decode("id", decodedBits),
  // Read color
  layout.decode("color", decodedBits, 0),
  layout.decode("color", decodedBits, 1),
  layout.decode("color", decodedBits, 2),
  layout.decode("color", decodedBits, 3),
  // Read health
  layout.decode("health", decodedBits),
];
````
