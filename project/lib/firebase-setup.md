# Firebase Setup Instructions

## 1. Firestore Security Rules

Go to your Firebase Console → Firestore Database → Rules and replace the existing rules with:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs can be read by anyone authenticated, created/updated by owner
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.uid == request.resource.data.recruiterId;
    }
    
    // Applications - candidates can create, recruiters can read/update their job applications
    match /applications/{applicationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.candidateId;
      allow update: if request.auth != null;
    }
    
    // Interviews - accessible by candidate and recruiter involved
    match /interviews/{interviewId} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 2. Firebase Storage Rules

Go to Firebase Console → Storage → Rules and use:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own resumes and job descriptions
    match /resumes/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /job-descriptions/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

## 3. Authentication Settings

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Optionally enable "Google" for easier sign-in

## 4. Firestore Database

1. Create a Firestore database in production mode
2. Choose your preferred region
3. The collections will be created automatically when users interact with the app

## 5. Storage

1. Go to Firebase Console → Storage
2. Get started with default settings
3. The folders will be created automatically when files are uploaded
\`\`\`
