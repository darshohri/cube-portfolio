# Security Specification & Threat Model — Transmission Portal Messages

This specification outlines the data invariants and threat vectors for the Firestore `messages` collection, serving as our security test framework.

## 1. Data Invariants

1. **Write-Only Public Ingress**: Public users can create new message entries but are strictly forbidden from viewing, updating, or deleting existing records.
2. **Deterministic Document Identifiers**: All message document IDs must follow strict alphanumeric format bounds (`isValidId`) and never exceed 128 characters.
3. **Immutability of Sent Logs**: Once written via `create`, records can never be structurally alerted or amended.
4. **Temporal Authenticity**: The submission field `createdAt` must match the server's transactional time `request.time` exactly. Client-supplied clock values are rejected.
5. **Payload Bounds**: Field sizes are firmly bounded (`inquirerName` size <= 256, `messagePayload` size <= 10000) to immunize the DB against Denial-of-Wallet attacks.

---

## 2. The "Dirty Dozen" Payloads (Threat Vectors Checked)

The security rules must deny the following 12 payloads or operation patterns:

1. **The PII Blanket Leak (Anonymous Read)**
   * *Action*: `get` or `list`
   * *Structure*: Reading `/messages/{messageId}` or querying the collection.
   * *Result*: `PERMISSION_DENIED`

2. **The Shadow Field Payload (Schema Pollution)**
   * *Action*: `create`
   * *Payload*: `{ inquirerName, inquirerEmail, messagePayload, createdAt, isVerifiedAdmin: true }`
   * *Result*: `PERMISSION_DENIED` (Exceeds allowable key allocation sizing and names).

3. **Temporal Spoofing Attack**
   * *Action*: `create`
   * *Payload*: `{ inquirerName, inquirerEmail, messagePayload, createdAt: "2020-01-01T00:00:00Z" }` (not matching `request.time`)
   * *Result*: `PERMISSION_DENIED`

4. **Resource Poisoning ID (Path Injection)**
   * *Action*: `create` at path `/messages/some-malicious-long-session-id-with-weird-symbols-$$-%20`
   * *Result*: `PERMISSION_DENIED` (Fails `isValidId` syntax regex)

5. **Payload Size Flood (Refugee Buffer Overflow)**
   * *Action*: `create`
   * *Payload*: `{ inquirerName, inquirerEmail, messagePayload: "A" * 20000, createdAt }`
   * *Result*: `PERMISSION_DENIED` (Key too large, standard size validation fails)

6. **Missing Required Fields**
   * *Action*: `create`
   * *Payload*: `{ inquirerName: "Nicola", messagePayload: "Hello", createdAt }`
   * *Result*: `PERMISSION_DENIED` (Missing required `inquirerEmail`)

7. **Null / Type-Mismatched Fields**
   * *Action*: `create`
   * *Payload*: `{ inquirerName: 12345, inquirerEmail: "nk@gmail.com", messagePayload: "test", createdAt }`
   * *Result*: `PERMISSION_DENIED` (Name is an integer rather than string)

8. **Message Payload Mutation (Adversarial Overwrite)**
   * *Action*: `update`
   * *Payload*: Modifying `{ messagePayload: "Malicious update" }`
   * *Result*: `PERMISSION_DENIED`

9. **Message Deletion Attempt**
   * *Action*: `delete`
   * *Result*: `PERMISSION_DENIED`

10. **Query Scraper (Blind Collection List)**
    * *Action*: `list`
    * *Result*: `PERMISSION_DENIED`

11. **Malicious Domain / Subject Injection**
    * *Action*: `create`
    * *Payload*: `{ inquirerName, inquirerEmail, messagePayload, messageSubject: "A" * 600, createdAt }`
    * *Result*: `PERMISSION_DENIED` (Subject exceeds 500 characters constraint)

12. **Session ID Resource Exhaustion**
    * *Action*: `create`
    * *Payload*: `{ inquirerName, inquirerEmail, messagePayload, deviceSession: "A" * 300, createdAt }`
    * *Result*: `PERMISSION_DENIED` (Session ID exceeds 256 characters)
