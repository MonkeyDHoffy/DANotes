import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  @Input() note!:Note;
  edit = false;
  hovered = false;
  
  constructor(private noteService: NoteListService){}

  changeMarkedStatus(){
    this.note.marked = !this.note.marked;
  }

  deleteHovered(){
    if(!this.edit){
      this.hovered = false;
    }
  }

  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    this.edit = false;
    this.saveNote();
  }

  moveToTrash(){
    if(this.note.id) {
      const docId = this.note.id;
      this.note.type = 'trash';
      this.note.id = '';  // statt delete this.note.id, da wir eine neue ID in der Trash Collection bekommen
      this.noteService.addNote(this.note, 'Trash');
      this.noteService.deleteNote('Notes', docId);
    }
  }

  moveToNotes(){
    if(this.note.id) {
      const docId = this.note.id;
      this.note.type = 'note';
      this.note.id = '';
      this.noteService.addNote(this.note, 'Notes');
      this.noteService.deleteNote('Trash', docId);
    }
  }

  deleteNote(){
    if(this.note.id) {
      this.noteService.deleteNote('Trash', this.note.id);
    }
  }

  saveNote(){
    this.noteService.updateNote(this.note);
  }
}
