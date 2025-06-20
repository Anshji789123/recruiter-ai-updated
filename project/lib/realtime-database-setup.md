# Firebase Realtime Database Setup

## Database URL
Your Realtime Database is now configured with:
`https://web-extension-app-default-rtdb.firebaseio.com/`

## Database Structure

The app uses the following structure in your Realtime Database:

\`\`\`
/
├── jobs/
│   ├── {jobId}/
│   │   ├── title: "Software Engineer"
│   │   ├── description: "Job description"
│   │   ├── status: "active"
│   │   ├── requirements: ["React", "Node.js"]
│   │   ├── createdAt: "2025-01-19T..."
│   │   ├── recruiterId: "user123"
│   │   ├── recruiterName: "John Doe"
│   │   ├── company: "Tech Corp"
│   │   └── timestamp: ServerValue.TIMESTAMP
│   
├── applications/
│   ├── {applicationId}/
│   │   ├── candidateId: "user456"
│   │   ├── name: "Jane Smith"
│   │   ├── email: "jane@example.com"
│   │   ├── jobId: "job123"
│   │   ├── jobTitle: "Software Engineer"
│   │   ├── status: "pending"
│   │   ├── appliedAt: "2025-01-19T..."
│   │   ├── recruiterName: "John Doe"
│   │   └── timestamp: ServerValue.TIMESTAMP
│   
└── interviews/
    ├── {interviewId}/
    │   ├── candidateId: "user456"
    │   ├── recruiterId: "user123"
    │   ├── jobTitle: "Software Engineer"
    │   ├── scheduledAt: "2025-01-20T..."
    │   ├── status: "scheduled"
    │   ├── meetingLink: "https://meet.google.com/..."
    │   └── timestamp: ServerValue.TIMESTAMP
\`\`\`

## Real-time Features

✅ **Live Job Postings** - Jobs appear instantly when recruiters post them
✅ **Real-time Applications** - Recruiters see applications immediately
✅ **Live Status Updates** - Application status changes in real-time
✅ **Interview Notifications** - Instant interview scheduling alerts
✅ **Live Indicators** - Visual indicators show real-time activity

## Database Rules

For development, you can use these permissive rules:

\`\`\`json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
\`\`\`

For production, use more specific rules:

\`\`\`json
{
  "rules": {
    "jobs": {
      ".read": "auth != null",
      "$jobId": {
        ".write": "auth != null && auth.uid == data.child('recruiterId').val()"
      }
    },
    "applications": {
      ".read": "auth != null",
      "$applicationId": {
        ".write": "auth != null && (auth.uid == data.child('candidateId').val() || auth.uid == data.child('recruiterId').val())"
      }
    },
    "interviews": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
\`\`\`

## How It Works

1. **Recruiter posts job** → Instantly appears in candidate dashboard
2. **Candidate applies** → Recruiter gets real-time notification
3. **Recruiter selects candidate** → Interview automatically scheduled
4. **All updates are live** → No page refresh needed

The system now uses your Firebase Realtime Database for instant, live updates!
