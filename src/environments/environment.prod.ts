
export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    // Configure the above client key at https://console.cloud.google.com/apis/credentials
    // Restrict to: *.your-domain.com/* (and localhost for testing)
    // Restrict to: Google Cloud Firestore API, Identity Toolkit API
    authDomain: 'your-app.firebaseapp.com',
    projectId: 'your-app'
  }
};
