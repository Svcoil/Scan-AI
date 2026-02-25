# Data Safety — Suggested Answers (EN-US)

Use this as a baseline when filling out Data Safety in Play Console.

## 1) Does the app collect or share data?
Suggested for current version:
- Data collection: Yes (user-provided in-app data)
- Data sharing with third parties: No

## 2) Data types
### Personal info
- No mandatory real name collection
- No mandatory email collection (current version)

### Health and fitness
- Body weight (entered or OCR-detected)
- Weight goal
- Weight history

## 3) Is this data optional?
- Yes, data is provided directly by the user while using app features.

## 4) Is data encrypted in transit?
- Current version does not require sending user data to app servers.
- If backend is added later, enforce HTTPS/TLS and update this form.

## 5) Can users request data deletion?
- Current version: users can clear app data in device settings.
- Future account-based versions should include in-app account deletion.

## 6) Camera usage
- Camera is used to capture scale images for OCR reading.
- Camera access depends on user permission.

## 7) Purpose of data use
- App functionality (weight logging and progress display)
- Basic personalization

## 8) Do you sell data?
- No.

## 9) Important note
Whenever you add login, cloud backup, analytics, or real subscriptions, review and update Data Safety before each release.
