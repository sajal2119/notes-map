# notes-map
> Demo is available here - [https://notesmap.imfast.io/](https://notesmap.imfast.io/)
_____________


Basic Features
===================
- [x] A user should be able to create notes, where each note is made up of some text.
- [x] One should be able to create a sub-note to a parent note by clicking on “New note” button.
- [x] There can be multiple top level Notes which are created by entering text in the top input box and clicking “Submit” button.
- [x] Ability to search. On search, it should show only the notes matching the search string.


Additional Features
===================
- [x] Ability to edit the text of the notes.
- [x] Searching
    1. It should highlight the matching text in each Note
    2. It should show the lineage of the matching note, for e.g. if a leaf note is matched, it should show all its parent notes as well.
- [x] Persist the notes in local storage so that refreshing the page also comes up with existing notes
- [x] Ability to delete, notes.


Stack Used
===================
* HTML
* CSS
* vanilla JS


Directory Structure
============================
    .
    ├── logics                   # JS file (`main.js`)
    ├── styles                   # CSS file (`main.css`)
    ├── index.html   
    ├── note.txt               
    └── README.md
