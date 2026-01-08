import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, collectionData } from '@angular/fire/firestore';
import { AsyncPipe } from '@angular/common';
// import { observable } from 'rxjs'; deprecated import removed

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);
  item$;

  constructor() {
this.item$ = collectionData(this.getNotesRef());

  }

    // const itemCollection = collection(this.firestore, 'items');

    getNotesRef(){
    return collection(this.firestore, 'Notes');
   }

    getTrashRef(){
    return collection(this.firestore, 'Trash');
   }

   getSingleDocRef(colId: string, docId: string){
return doc(collection(this.firestore, colId), docId);
   }

}
