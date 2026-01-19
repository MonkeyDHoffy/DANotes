import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc, orderBy, query, limit, where  } from '@angular/fire/firestore';
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


 async deleteNote(coldID: "Notes" | "Trash", docID: string) {
    if(docID){
      try {
        const docRef = this.getSingleDocRef(coldID, docID);
        await deleteDoc(docRef);
        console.log("Document deleted successfully");
      } catch (err) {
        console.error("Error deleting document:", err);
      }
    }
  }

    async updateNote(note: Note) {
      if(note.id){
        let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
        await updateDoc(docRef, this.getCleanJson(note)).catch((err) => {console.log(err)}).then();
  }}

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


  async addNote(item: Note, colID: "Notes" | "Trash") {
    try {
      const ref = colID === "Notes" ? this.getNotesRef() : this.getTrashRef();
      const docRef = await addDoc(ref, item);
      console.log("Document written with ID:", docRef.id);
    } catch (err) {
      console.error("Error adding document:", err);
    }
  }
    
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
      const q = query(this.getNotesRef(),limit(100));
       return onSnapshot(q, (list) => {
        this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
    }

    
    // subMarkedNotesList(){
    //   const q = query(this.getNotesRef(),where("", "==", true), limit(100), orderBy("title"));
    //    return onSnapshot(q, (list) => {
    //     this.normalNotes = [];
    //   list.forEach(element => {
    //     this.normalNotes.push(this.setNoteObject(element.data(), element.id));
    //   });

    // });
    // }

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
  