# Firebase Security Specification - SimplyFunds Loan DSA

## Data Invariants
1. **Lead Integrity**: A lead must contain valid contact information and loan details.
2. **Ownership**: Every lead and advisor log must be explicitly tied to a user via `ownerId` or `userId`.
3. **Temporal Consistency**: `createdAt` must always be the server's authoritative timestamp at creation time.
4. **State Control**: Only admins (if implemented) or system processes can transition a lead to 'approved' or 'rejected' (though for now, users just submit).

## The Dirty Dozen (Payloads to Deny)
1. **Identity Theft**: `{ "ownerId": "victim_uid", "name": "Attacker" }` -> Denied (UID mismatch).
2. **Status Privilege Escalation**: `{ "status": "approved" }` -> Denied (Users can't set status on creation).
3. **Immutable Field Poisoning**: `{ "createdAt": "2020-01-01T00:00:00Z" }` -> Denied (Must be server time).
4. **Data Scraping**: `get /leads/any_other_id` -> Denied (Resource ownership check).
5. **Bulk Update Attack**: Attempting to change `loanAmount` on multiple leads via a batch without ownership.
6. **Shadow Fields**: `{ "ownerId": "me", ..., "ghost_field": "hidden_data" }` -> Denied (Strict schema).
7. **Resource Exhaustion**: `{ "name": "A" * 1000000 }` -> Denied (Size constraints).
8. **ID Poisoning**: Creating a lead with ID `../users/admin` -> Denied (isValidId guard).
9. **Role Spoofing**: Attempting to set `isAdmin: true` on user metadata.
10. **Type Mismatch**: `{ "loanAmount": "one million" }` -> Denied (Must be number).
11. **Negative Loan**: `{ "loanAmount": -100 }` -> Denied (Must be positive).
12. **Orphaned Reads**: Querying `collection('leads')` without a `where('ownerId', '==', uid)` clause.

## Security Rules Strategy
- Reusable helpers for `isValidId`, `isOwner`, `isValidLead`.
- Strict key size matching for `create`.
- Diff-based affectedKeys matching for `update`.
