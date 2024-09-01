import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  async addUser(user: User): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `Users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  getUser(uid: string): Observable<any> {
    const userDocRef = doc(this.firestore, `Users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => docSnap.exists() ? docSnap.data() : null)
    );
  }

  async updateUser(uid: string, data: any): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `Users/${uid}`);
      await updateDoc(userDocRef, data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

}
