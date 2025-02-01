// USE ESTE CÓDIGO DESCOMENTADO PARA ADICIONAR DADOS DIRETO NO FIREBASE

// import * as admin from 'firebase-admin';
// import * as path from 'path';
// import * as fs from 'fs';

// const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'serviceAccountKey.json';

// admin.initializeApp({
//   credential: admin.credential.cert(require(path.resolve(serviceAccountPath)))
// });

// const db = admin.firestore();

// const jsonData = JSON.parse(fs.readFileSync('./src/data/tests_2.json', 'utf8'));

// (async () => {
//   try {
//     await db.collection('tests_2').add(jsonData);
//   } catch (e) {
//     console.error('Error adding document: ', e);
//   }
// })();