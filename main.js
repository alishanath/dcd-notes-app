const notesData = [
  {
    id: 'notes-jT-jjsyz61J8XKiI',
    title: 'Welcome to Notes, Alisha!',
    body: 'Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.',
    createdAt: '2022-07-28T10:03:12.594Z',
    archived: false,
  },
  {
    id: 'notes-aB-cdefg12345',
    title: 'Meeting Agenda',
    body: 'Discuss project updates and assign tasks for the upcoming week.',
    createdAt: '2022-08-05T15:30:00.000Z',
    archived: false,
  },
  //... other notes
];

class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Notes App</h1>`;
  }
}

customElements.define('app-bar', AppBar);

class NoteList extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <input type="search" id="search" placeholder="Search notes...">
      <ul id="notes-list"></ul>
    `;

    const notesList = this.querySelector('#notes-list');
    const searchInput = this.querySelector('#search');

    notesData.forEach(note => {
      this.createNoteItem(notesList, note);
    });

    searchInput.addEventListener('input', this.filterNotes.bind(this));
  }

  filterNotes(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredNotes = notesData.filter(note => note.title.toLowerCase().includes(searchTerm) || note.body.toLowerCase().includes(searchTerm));

    const notesList = this.querySelector('#notes-list');
    notesList.innerHTML = '';

    filteredNotes.forEach(note => {
      this.createNoteItem(notesList, note);
    });
  }

  createNoteItem(notesList, note) {
    const noteItem = document.createElement('li');
    noteItem.classList.add('note-item');
    noteItem.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.body}</p>
      <button class="edit-btn" data-id="${note.id}">Edit</button>
      <button class="delete-btn" data-id="${note.id}">Delete</button>
    `;
    notesList.appendChild(noteItem);

    noteItem.querySelector('.edit-btn').addEventListener('click', this.editNote.bind(this));
    noteItem.querySelector('.delete-btn').addEventListener('click', this.deleteNote.bind(this));
  }

  editNote(event) {
    const noteId = event.target.getAttribute('data-id');
    const note = notesData.find(note => note.id === noteId);
    if (note) {
      document.querySelector('#note-title').value = note.title;
      document.querySelector('#note-body').value = note.body;
      document.querySelector('#note-id').value = note.id;
    }
  }

  deleteNote(event) {
    const noteId = event.target.getAttribute('data-id');
    const noteIndex = notesData.findIndex(note => note.id === noteId);
    if (noteIndex > -1) {
      notesData.splice(noteIndex, 1);
      this.render();
    }
  }
}

customElements.define('note-list', NoteList);

class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <form id="note-form">
        <input type="hidden" id="note-id">
        <input type="text" id="note-title" placeholder="Note title" required>
        <textarea id="note-body" placeholder="Note body" required></textarea>
        <button type="submit">Add Note</button>
      </form>
    `;

    const form = this.querySelector('#note-form');
    form.addEventListener('submit', this.addOrUpdateNote.bind(this));
  }

  addOrUpdateNote(event) {
    event.preventDefault();
    const id = this.querySelector('#note-id').value;
    const title = this.querySelector('#note-title').value;
    const body = this.querySelector('#note-body').value;

    if (id) {
      const note = notesData.find(note => note.id === id);
      note.title = title;
      note.body = body;
    } else {
      const newNote = {
        id: `notes-${Math.random().toString(36).substr(2, 9)}`,
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
      };
      notesData.push(newNote);
    }

    this.querySelector('#note-id').value = '';
    this.querySelector('#note-title').value = '';
    this.querySelector('#note-body').value = '';

    document.querySelector('note-list').render();
  }
}

customElements.define('note-form', NoteForm);
