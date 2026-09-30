# E-Nexus (ई-नेक्सस) — E-Waste Informal Collector & Recycler Bridge

E-Nexus connects informal e-waste collectors (kabadiwalas) directly with authorized GPCB recyclers in industrial GIDC belts (Naroda, Odhav, Vatva, Surat, Vadodara, Rajkot). It eliminates exploitative middleman deductions by providing daily benchmark scrap rates, digital scale calibration verification, and official settlement compliance slips.

## Project Structure
- `/src/`
  - `App.tsx` - Root application routing and role switching
  - `data.ts` - Daily scrap rates, GPCB facilities, Gujarat GIDC hubs
  - `lotStore.ts` - Local state & batch lot management
  - `types.ts` - Shared TypeScript interfaces
  - `components/` - RoleSelectScreen, CollectorWorkspace, RecyclerWorkspace, etc.
- `standalone.html` - Single-file offline version (can run directly in any browser without Node.js)
- `index.html` - Modern Vite entrypoint
- `package.json` - Project dependencies and scripts

## Quick Start (Local Development)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open your browser:
   ```
   http://localhost:3000
   ```

## Build for Production
```bash
npm run build
```
The output will be in the `dist/` directory.

## Standalone Offline Mode
You can also directly double-click and open `standalone.html` in Chrome, Edge, Safari, or Firefox without installing any packages or running a server.

---

## Production Backend Architecture & Data Flow

### 1. System Architecture

**Kabadiwala Connect** utilizes a resilient, offline-first hybrid architecture designed for volatile cellular network conditions commonly experienced by informal collectors across scrap clusters, scrap yards, and industrial transit routes.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (PWA / Android WebView)                          │
│                                                                                        │
│  ┌───────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────┐ │
│  │  React 18 + Tailwind  │   │  LocalStore / IndexedDB   │   │  Sync Queue Manager   │ │
│  │   Vernacular UI       │◄─►│  (Lots, Prices, Cache)    │◄─►│  (FIFO, Exponential  │ │
│  │   (EN / HI / MR)      │   │                           │   │   Backoff, Conflict)  │ │
│  └───────────────────────┘   └───────────────────────────┘   └───────────┬───────────┘ │
└────────────────────────────────────────────┬─────────────────────────────┼─────────────┘
                                             │ HTTPS / REST API            │ POST /api/sync
                                             ▼                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             API GATEWAY & BACKEND ENGINE                               │
│                                 (Node.js + Express.js)                                 │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Core Middleware: Helmet, CORS, Rate-Limiting, JWT/EPR-Auth, Request Validator    │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                           │
│       ┌──────────────────┬─────────────────┼─────────────────┬──────────────────┐      │
│       ▼                  ▼                 ▼                 ▼                  ▼      │
│  ┌───────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌────────┐  │
│  │ Price     │    │ Recycler    │    │ Transaction │    │ Form-6      │    │ Sync   │  │
│  │ Controller│    │ Match Engine│    │ Controller  │    │ Trace Engine│    │ Queue  │  │
│  │ (CPCB/SDR)│    │ ($geoNear)  │    │ (Lot Audits)│    │ (EPR Hashes)│    │ Ingest │  │
│  └─────┬─────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └───┬────┘  │
└────────┼─────────────────┼──────────────────┼──────────────────┼───────────────┼───────┘
         │                 │                  │                  │               │
         ▼                 ▼                  ▼                  ▼               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE & STORAGE (MongoDB Atlas)                      │
│                                                                                        │
│   • materials       • prices (Timeseries)  • recyclers (2dsphere geospatial)           │
│   • transactions    • traceability (Form6) • collectors (Anonymized PII)               │
│                                                                                        │
│   Redis In-Memory Cache: Benchmark spot rates, geo-indexed recycler spatial buckets    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Client-to-Server Communication Flow:
1. **Local-First Interaction**: User operations (calculating material values, drafting a collection lot, updating weights) write synchronously to local storage (`LocalStorage` / `IndexedDB`) via our reactive client store. The UI renders optimistically with zero network wait-time.
2. **Network State Observer**: The client actively monitors network health via `window.navigator.onLine` and heartbeat ping calls to `/api/health`.
3. **Asynchronous REST Layer**: When online, requests hit standard Express.js endpoints (`/api/prices`, `/api/recyclers`, `/api/lots`, `/api/sync`) using authenticated Bearer tokens or anonymous device signatures.
4. **Idempotent Ingestion**: All mutable mutations send client-generated UUIDs (`lotId`, `clientSyncId`) preventing duplicate writes during retried network handshakes.

---

### 2. Database Layer: The 6 Core Datasets in MongoDB

MongoDB was selected as the operational database for its document flexibility, schema validation capabilities, and native geospatial search (`$nearSphere` / `2dsphere`), allowing ultra-fast matching between roving collectors and authorized SPCB facilities.

#### Collection Schemas & Data Structure:

```typescript
// 1. Material Collection (materials)
interface MaterialDocument {
  _id: ObjectId;
  materialId: string;              // e.g., "MAT-PCB-001"
  category: 'pcb' | 'cable' | 'battery' | 'screen' | 'mixed_metals' | 'appliance';
  subCategory: string;             // e.g., "Telecom Grade Motherboards"
  description: string;
  approximateWeightPerUnitKg: number;
  conditionGrading: 'INTACT' | 'SEMI_DISMANTLED' | 'SHREDDED_CRUSHED';
  hazardousClassification: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  baselineBenchmarkRateInr: number;
  vernacularNames: { en: string; hi: string; mr: string };
  updatedAt: Date;
}

// 2. Price Collection (prices) - Optimized with Timeseries & Compound Indexes
interface PriceDocument {
  _id: ObjectId;
  materialId: string;              // References materials.materialId
  regionCluster: string;           // e.g., "Maharashtra - Mumbai / Thane Cluster"
  state: string;                   // e.g., "Maharashtra"
  buyingPriceInr: number;          // Current regional spot price
  quotedBenchmarkPriceInr: number; // Regional broker median
  formalRecyclerCeilingInr: number;// Upper ceiling paid by authorized recyclers
  unit: 'kg' | 'piece';
  historicalTrend: Array<{
    date: Date;
    priceInr: number;
    volumeKg: number;
  }>;
  lastUpdated: Date;
}
// Index: { materialId: 1, state: 1, lastUpdated: -1 }

// 3. Recycler Collection (recyclers) - Geospatial 2dsphere
interface RecyclerDocument {
  _id: ObjectId;
  recyclerId: string;              // e.g., "REC-MH-BHIWANDI-01"
  facilityName: string;
  registeredLegalEntity: string;
  spcbRegistrationNumber: string;  // SPCB / CPCB EPR Authorization ID
  authorizationStatus: 'VALID_AUTHORIZED' | 'PENDING_RENEWAL' | 'UNDER_AUDIT';
  authorizationValidityExpiry: Date;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [Longitude, Latitude]
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  serviceArea: {
    hubCluster: string;
    radiusKm: number;
    pickupAvailable: boolean;
  };
  acceptedMaterials: string[];     // ["pcb", "cable", "battery", "screen"]
  dailyProcessingCapacityMT: number;
  contact: {
    liaisonOfficer: string;
    phone: string;
    supportEmail: string;
    dispatchAddress: string;
  };
  rating: number;
  totalRecycledTons: number;
  instantDigitalSettlement: boolean;
}
// Index: { "location": "2dsphere", "authorizationStatus": 1, "acceptedMaterials": 1 }

// 4. Transaction Collection (transactions)
interface TransactionDocument {
  _id: ObjectId;
  lotId: string;                   // e.g., "LOT-20260920-8841"
  collectorPublicId: string;       // e.g., "COL-MH-MUM-901" (Anonymized)
  recyclerId: string;              // References recyclers.recyclerId
  materials: Array<{
    materialId: string;
    category: string;
    weightKg: number;
    pricePerKgInr: number;
    subTotalInr: number;
  }>;
  totalWeightKg: number;
  totalAmountInr: number;
  paymentMethod: 'UPI' | 'CASH' | 'BANK_TRANSFER';
  paymentStatus: 'ESCROW_HOLD' | 'SETTLED' | 'PENDING_WEIGHBRIDGE';
  settledAt?: Date;
  syncOrigin: 'ONLINE' | 'OFFLINE_SYNCED';
  createdAt: Date;
}

// 5. Traceability & EPR Manifest Collection (traceability)
interface TraceabilityDocument {
  _id: ObjectId;
  lotId: string;                   // Unique constraint
  form6ManifestNumber: string;     // Official CPCB Form-6 Reference: "CPCB-EPR-2026-F6-..."
  batchHash: string;               // SHA-256 (collectorHash + lotId + weight + timestamp + gps)
  originGps: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
  };
  destinationFacility: {
    recyclerId: string;
    spcbLicense: string;
    receivedAt?: Date;
  };
  weighbridgeVerification: {
    scaleModel: string;
    calibrationCertificateId: string;
    tareWeightKg: number;
    grossWeightKg: number;
    netWeightKg: number;
    variancePercent: number;       // Must be <= 2% to pass automated audit
  };
  eprCreditReference: string;
  immutableStatus: 'DRAFT' | 'DISPATCHED' | 'RECEIVED_AUDITED' | 'RECYCLED_FINAL';
  blockchainAnchorTxId?: string;
}

// 6. Collector Collection (collectors) - PII Segregated & Masked
interface CollectorDocument {
  _id: ObjectId;
  collectorPublicId: string;       // "COL-MH-MUM-901"
  hashedPhoneNumber: string;       // HMAC-SHA256(phone, HMAC_PEPPER)
  hashedIdentityDoc: string;       // HMAC-SHA256(Aadhaar/VoterID, HMAC_PEPPER)
  preferredLanguage: 'en' | 'hi' | 'mr';
  operatingCluster: string;        // "Dharavi / Kurla West"
  totalLotsCompleted: number;
  reputationBadge: 'PLATINUM_VERIFIED' | 'GOLD_COLLECTOR' | 'COMMUNITY_MEMBER';
  upiVpaMasked: string;            // e.g., "******901@upi"
  enrolledAt: Date;
}
```

---

### 3. Offline-First Sync Pipeline

Due to weak network penetration inside metal scrap basements and industrial scrapyards, Kabadiwala Connect enforces an **Offline Queue State Machine**:

```
[User Creates Lot Offline]
            │
            ▼
┌──────────────────────────────────────────────┐
│  Write to LocalStore (IndexedDB / Storage)    │
│  - Set syncStatus = 'QUEUED'                 │
│  - Assign client UUID: lotId                 │
│  - Generate local digital receipt slip       │
└──────────────────────┬───────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
[Still Offline]                [Network Restored]
- Queued in localStorage       - window.addEventListener('online')
- Audio/UI "Saved Offline"     - Background Sync Service checks queue
                                               │
                                               ▼
                                ┌──────────────────────────────┐
                                │ POST /api/sync Batch Payload │
                                │ { items: [SyncPayload...] }  │
                                └──────────────┬───────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
            [HTTP 200: Sync Success]                        [409 / Conflict / Error]
            - Update local lot.isSynced=true                - Exponential Backoff:
            - Mark syncStatus='COMMITTED'                     (1s, 2s, 4s, 8s max 60s)
            - Fire 'enexus_lots_updated'                     - Preserve queue
            - Show green "Synced" checkmark                  - Alert user if validation failed
```

#### Step-by-Step Processing Pipeline:
1. **Local Drafting & Digital Scale Capture**:
   When the collector inputs items, the client assigns a temporary transaction ID (`LOT-YYYYMMDD-XXXX`), captures GPS coordinates from `navigator.geolocation`, calculates local subtotals using cached benchmark price tables, and writes directly into the local array.
2. **Queueing**:
   The lot object is wrapped into a `SyncQueueItem` containing:
   - `queueId`: Local UUID
   - `action`: `'CREATE_LOT'` | `'UPDATE_STATUS'` | `'VERIFY_SCALE'`
   - `payload`: Lot details, material breakdown, weight, settlement mode
   - `attempts`: 0
   - `enqueuedAt`: Timestamp
3. **Connection Detection & Heartbeat**:
   The app attaches listeners to `window.addEventListener('online', triggerSync)`. Furthermore, when the user focuses the window or switches tabs, an asynchronous heartbeat ping checks if the API gateway is genuinely reachable (avoiding false positives from captive WiFi portals).
4. **Batch Synchronization Endpoint (`POST /api/sync`)**:
   The sync queue manager flushes pending lots in a batched transactional payload:
   ```json
   {
     "deviceId": "DEV-ANDR-88219-B",
     "batchTimestamp": "2026-09-20T09:12:00.000Z",
     "transactions": [
       {
         "clientSyncId": "SYNC-LOT-8841",
         "lotId": "LOT-20260920-8841",
         "collectorPublicId": "COL-MH-MUM-901",
         "recyclerId": "REC-MH-BHIWANDI-01",
         "materials": [{ "materialId": "MAT-PCB-001", "weightKg": 42.5, "unitRate": 360 }],
         "totalAmountInr": 15300,
         "gps": { "latitude": 19.0435, "longitude": 72.8562, "accuracy": 12 },
         "createdAt": "2026-09-20T08:45:10.000Z"
       }
     ]
   }
   ```
5. **Conflict Resolution & Idempotency**:
   - The backend checks if `lotId` exists in `transactions`. If found and matching, it returns `HTTP 200` with the existing server confirmation, preventing duplicates.
   - If pricing shifted between offline creation and server sync, the server honors the offline rate if submitted within a 12-hour grace period window, safeguarding vulnerable collectors against sudden market volatility.
6. **Reactivity**:
   Upon server acknowledgment, local records update their `isSynced: true` flag, and dispatch a custom DOM event `enexus_lots_updated`, instantly changing UI badges from Amber *(Offline Queue)* to Green *(Cloud Synced & Verified)*.

---

### 4. Traceability & Compliance Security (E-Waste Rules, 2022 EPR)

The Ministry of Environment, Forest and Climate Change (MoEF&CC) E-Waste (Management) Rules, 2022 mandate end-to-end chain of custody accountability for Extended Producer Responsibility (EPR) credit generation.

#### A. Digital Form-6 Manifest Generation
For every synced lot, the system automatically instantiates a statutory **Form-6 Hazardous / E-Waste Transport Manifest**:
- **Manifest ID**: Structured as `CPCB-EPR-{YEAR}-F6-{STATE}-{UNIQUE_HEX}`.
- **Material Classification**: Maps scrap fractions to authorized Basel Convention / CPCB E-Waste codes (e.g., Motherboards -> *ITEW1-16 PCB Gold/Palladium Fraction*).
- **Physical Scale Verification Stamp**: Upon arrival at an SPCB-authorized facility, certified weighbridge scales log net weight directly via RS-232 / USB scale telemetry. If the weight variance exceeds ±2% compared to collector entry, an automated audit flag is triggered for joint reinspection.

#### B. Cryptographic Traceability Chain
To ensure auditability without bulky ledger overhead, every handover record computes an immutable cryptographic hash chain:

$$\text{BatchHash} = \text{SHA-256}(\text{lotId} \parallel \text{collectorPublicId} \parallel \text{recyclerLicense} \parallel \text{netWeightKg} \parallel \text{gpsCoords} \parallel \text{timestamp})$$

This fingerprint is signed with the facility's private key upon receipt and stored in the `traceability` document. Any manual database tampering breaks the hash chain, immediately failing CPCB annual compliance audits.

#### C. Zero-Knowledge Collector Privacy & Identity Anonymization
Informal waste pickers are frequently hesitant to engage with formal digital portals due to fears of harassment, tax scrutiny, or identity theft. Kabadiwala Connect enforces rigorous data protection:
1. **No Plaintext PII Storage**: Personal identifiers (phone numbers, national IDs) are hashed using `HMAC-SHA-256` with an environment-level pepper secret before reaching persistent storage.
2. **Pseudo-Anonymous Collector Public IDs**: All outward manifests and recycler screens identify the supplier as `COL-MH-MUM-901` (denoting Region and Cluster number only).
3. **Direct-to-UPI Settlement Tokenization**: Payment processing uses tokenized UPI VPAs (`alias@upi`), allowing direct bank credit to the collector's Jan Dhan account without exposing bank account details, full legal names, or physical residence to corporate recyclers.
4. **Role-Based Field Redaction**: SPCB inspectors view full Form-6 quantities, material fractions, and GPS transit paths, while all collector-identifying contact fields remain permanently masked.

