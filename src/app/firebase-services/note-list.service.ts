import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc  } from '@angular/fire/firestore';
import { AsyncPipe } from '@angular/common';
// import { observable } from 'rxjs'; deprecated import removed

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);
  // item$;
  // items;
  // unsubList;

  unsubTrash: () => void;
  unsubNotes: () => void;

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();

    // this.item$ = collectionData(this.getNotesRef());
    // this.items = this.item$.subscribe((list) => {
    //   list.forEach(element => {
    //     console.log(element);
    //   });
    // });
  }

    async updateNote(note: Note) {
      if(note.id){
        let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
        await updateDoc(docRef, this.getCleanJson(note)).catch((err) => {console.error(err)}).then();}
  }

  getCleanJson(note: Note){
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
  }
}

  getColIdFromNote(note: Note){
    if(note.type == 'note'){
      return 'Notes';
    } else {
      return 'Trash';
    }
  }


  async addNote(item: Note) {
    await addDoc(this.getNotesRef(), item).catch(
       (err)=> {console.error(err)}).then((docRef) => {console.log("Document written with ID:", docRef?.id);});
  }




    // const itemCollection = collection(this.firestore, 'items');

    ngonDestroy() { 
      this.unsubNotes();
      this.unsubTrash();
      // this.items.unsubscribe();
    }

    subTrashList(){
       return onSnapshot(this.getTrashRef(), (list) => {
        this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
    }

    subNotesList(){
       return onSnapshot(this.getNotesRef(), (list) => {
        this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
    }

    setNoteObject(obj: any, id: string): Note {
      return {
        id: id  || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
      };
    }

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
  