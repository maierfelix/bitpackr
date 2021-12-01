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
const PacketLayout = new bitpackr.Layout([
  {name: "id", bitLength: 4},
  {name: "health", bitLength: 8},
  {name: "color", bitLength: 8, elementCount: 4},
  {name: "dead", bitLength: 1},
]);

// Input data
const inputId = 15;
const inputHealth = 255;
const inputColor = [128, 0, 192, 255];
const inputDead = 1;

// Encode
const encodeBuffer = new Uint8Array(PacketLayout.getBitLength());
PacketLayout.encode("id", inputId, encodeBuffer);
PacketLayout.encode("health", inputHealth, encodeBuffer);
PacketLayout.encode("color", inputColor, encodeBuffer);
PacketLayout.encode("dead", inputDead, encodeBuffer);

// Encode the data into a packet
const packet = PacketLayout.encodeLayout(encodeBuffer);
// Decode the packet
const decoded = PacketLayout.decodeLayout(packet);

// Output data
const outputId = PacketLayout.decode("id", decoded);
const outputHealth = PacketLayout.decode("health", decoded);
const outputColor = PacketLayout.decode("color", decoded);
const outputDead = PacketLayout.decode("dead", decoded);
````

### Steganography:

By default, this library encodes data into an `Uint8Array` with `8-bit` per item. Instead of `8-bit`, a custom bit stride can be used. This allows you to encode your data into destinations, where you have less than `8-bit` available per item.

This allows you to hide information within a transaction sum, where you only have `3-bit` available per digit:

````ts
import * as bitpackr from "bitpackr";

// Define data layout, use a 3-bit stride
const PacketLayout = new bitpackr.Layout([{name: "secret", bitLength: 8, elementCount: 4}], 3);

// The secret data that we want to hide
const inputSecret = [11, 22, 33, 44];

// Encode secret
const encodeBuffer = new Uint8Array(PacketLayout.getBitLength());
PacketLayout.encode("secret", inputSecret, encodeBuffer);

// The transaction amount to send, which contains the secret data
const encoded = "0.0" + PacketLayout.encodeLayout(encodeBuffer).join(""); // 0.031031201450
// Decode the transaction amount
const decoded = PacketLayout.decodeLayout(encoded.split("").map(v => parseInt(v)).slice(3));

// Decode secret
const outputSecret = PacketLayout.decode("secret", decoded); // 11, 22, 33, 44
````
