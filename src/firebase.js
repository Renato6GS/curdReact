import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
   apiKey: 'AIzaSyCs28CmEr83XZQCE8MwypRFfUyj-GU9wM8',
   authDomain: 'crud-96d70.firebaseapp.com',
   projectId: 'crud-96d70',
   storageBucket: 'crud-96d70.appspot.com',
   messagingSenderId: '521060132555',
   appId: '1:521060132555:web:f8a681b615280fbe355d4e',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
