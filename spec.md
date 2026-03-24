# Beach Therapy Ostend

## Current State
- Hero section uses a generated beach background image (`hero-beach-ostende.dim_1920x1080.jpg`)
- Therapist profile photo is uploaded via blob-storage (`ExternalBlob`), stored as a content-addressed hash (`!caf!sha256:...`) in the backend
- `photoBytesToUrl` in `useQueries.ts` incorrectly tries to make a JPEG blob from the hash bytes, so the uploaded photo never renders
- `ContactSection.tsx` has hardcoded placeholder email/phone/address info
- Admin panel has no fields for the therapist's own contact info (display email, phone, address)

## Requested Changes (Diff)

### Add
- New Ostend coastline hero image (`hero-ostend-coastline.dim_1920x1080.jpg`) generated and available
- `contactEmail`, `contactPhone`, `contactAddress` fields to `TherapistProfile` in backend
- Admin panel "Profile" tab: editable fields for contact email, phone, and address
- `resolvePhotoUrl(photoBytes, config)` utility that decodes `!caf!hash` bytes to a real blob storage URL

### Modify
- `HeroSection.tsx`: use new Ostend coastline image
- `useTherapistProfile` hook: resolve photo bytes to direct URL using `loadConfig` + storage gateway URL formula
- `ContactSection.tsx`: read contact info from therapist profile instead of hardcoded values
- Backend `TherapistProfile` type: add `contactEmail`, `contactPhone`, `contactAddress` fields
- `updateTherapistProfile` and `seedSampleData` updated for new fields

### Remove
- Hardcoded placeholder contact info in `ContactSection.tsx`

## Implementation Plan
1. Update `main.mo`: add contact fields to `TherapistProfile`, update seed data
2. Update `useQueries.ts`: fix photo URL resolution; add `useTherapistPhotoUrl` hook that decodes blob storage reference
3. Update `PublicPage.tsx`: use new photo URL hook
4. Update `HeroSection.tsx`: swap hero background image
5. Update `ContactSection.tsx`: accept profile prop, show dynamic contact info
6. Update `AdminPage.tsx`: add contact info fields to Profile tab
