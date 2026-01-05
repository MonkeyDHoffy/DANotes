import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"danotes-2408b","appId":"1:86999485362:web:00dd405b447d04f077f2ab","storageBucket":"danotes-2408b.firebasestorage.app","apiKey":"AIzaSyD-c8MQibqQSCfYtkuCpDZ1GYDmTqbrmyc","authDomain":"danotes-2408b.firebaseapp.com","messagingSenderId":"86999485362","measurementId":"G-S5HM1XMMXC","projectNumber":"86999485362","version":"2"})), provideFirestore(() => getFirestore())]
};
