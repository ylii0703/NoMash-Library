import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCKtN4li68wZz9wEbMZzGKNFENRZ_PnTmc",
  authDomain: "week7-yuchenli.firebaseapp.com",
  projectId: "week7-yuchenli",
  storageBucket: "week7-yuchenli.firebasestorage.app",
  messagingSenderId: "469282694835",
  appId: "1:469282694835:web:c62b650fa57d58af46b2c6"
};

export const app  = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const db = getFirestore(app)
export { db }          
export default db       