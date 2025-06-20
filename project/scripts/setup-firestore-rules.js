// Firestore Security Rules
// Copy these rules to your Firebase Console -> Firestore Database -> Rules

const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs can be read by anyone, but only created/updated by the owner
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.recruiterId;
      allow update: if request.auth != null && request.auth.uid == resource.data.recruiterId;
    }
    
    // Applications can be read by the candidate who created them or recruiters
    match /applications/{applicationId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.candidateId || 
         request.auth.uid in get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.recruiterId);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.candidateId;
      allow update: if request.auth != null;
    }
    
    // Interviews can be read by the candidate or recruiter involved
    match /interviews/{interviewId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.candidateId || 
         request.auth.uid == resource.data.recruiterId);
    }
  }
}
`

console.log("Copy these Firestore Security Rules to your Firebase Console:")
console.log(firestoreRules)
