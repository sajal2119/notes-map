const notesContainerNode = document.querySelector('#notes-list-container');
const searchButton = document.querySelector('#search-button');
const submitButton = document.querySelector('#submit-button');
const clearButton = document.querySelector('#clear-button');
const textNode = document.querySelector('[name=new-note-input]');
let notesArray = window.localStorage.getItem('notes-array') || '';
let searchString = '';
notesArray = notesArray ? JSON.parse(notesArray) : [];

function deleteNote(note) {
    let actualIndex = note.getAttribute('data-node-level');
    actualIndex = actualIndex.split('.');

    if(actualIndex.length === 1) {
        notesArray = notesArray.filter(function(value, index) {
            return (index !== (actualIndex[0] - 1));
        })
    } else {
        let runningIndex = 0;
        let actualNoteIndexToDelete = actualIndex[runningIndex];
        let actualArrayToUpdate = notesArray[actualNoteIndexToDelete - 1];
        runningIndex++;

        while (actualIndex.length > (runningIndex + 1)) {
            actualNoteIndexToDelete = actualIndex[runningIndex];
            actualArrayToUpdate = actualArrayToUpdate.childNotes[actualNoteIndexToDelete - 1];
            runningIndex++;
        }

        actualNoteIndexToDelete = actualIndex[runningIndex];
        actualArrayToUpdate.childNotes = actualArrayToUpdate.childNotes.filter(function(value, index) {
            return (index !== (actualNoteIndexToDelete - 1));
        });
    }

    saveAndReRenderView();
}

function editNoteText(note) {
    let editNote = note.children[0].children[0];
    let text = editNote.innerText;
    let levelNameIndex = text.indexOf(':');
    text = text.slice(levelNameIndex + 2);
    
    let editNoteValue = window.prompt("Edit Note:", text);

    if(editNoteValue) {
        editNoteValue;

        let actualIndex = note.getAttribute('data-node-level');
        actualIndex = actualIndex.split('.');

        if(actualIndex.length === 1) {
            notesArray = notesArray.map(function(obj, index) {
                if(index !== (actualIndex[0] - 1)) {
                    return obj;
                }
                return Object.assign({}, obj, { text: editNoteValue })
            })
        } else {
            let runningIndex = 0;
            let actualNoteIndexToEdit = actualIndex[runningIndex];
            let actualArrayToUpdate = notesArray[actualNoteIndexToEdit - 1];
            runningIndex++;

            while (actualIndex.length > (runningIndex + 1)) {
                actualNoteIndexToEdit = actualIndex[runningIndex];
                actualArrayToUpdate = actualArrayToUpdate.childNotes[actualNoteIndexToEdit - 1];
                runningIndex++;
            }

            actualNoteIndexToEdit = actualIndex[runningIndex];
            actualArrayToUpdate.childNotes = actualArrayToUpdate.childNotes.map(function(obj, index) {
                if(index !== (actualNoteIndexToEdit - 1)) {
                    return obj;
                }
                return Object.assign({}, obj, { text: editNoteValue.trim() })
            });
        }

        saveAndReRenderView();
    }
}

function addSubNoteText(note) {
    let addSubNoteText = window.prompt("Add Sub Note:", '');

    if(addSubNoteText) {
        let actualIndex = note.getAttribute('data-node-level');
        actualIndex = actualIndex.split('.');
        let runningIndex = 0;
        let actualArrayToUpdate = notesArray[actualIndex[runningIndex] - 1];
        runningIndex++;

        while (actualIndex.length > (runningIndex)) {
            actualArrayToUpdate = actualArrayToUpdate.childNotes[actualIndex[runningIndex] - 1];
            runningIndex++;
        }

        actualArrayToUpdate.childNotes.push({
            text: addSubNoteText.trim(),
            childNotes: []
        });

        saveAndReRenderView();
    }
}

function addNewNoteToRoot(){
    const text = textNode.value;
    if (text && text.length > 0) {
        notesArray.push({
            isRootNode: true,
            text: text.trim(),
            childNotes: []
        })

        textNode.value = '';

        saveAndReRenderView();
    }
}

function addNewNote(text, parentNode) {
    // Creates a new parent node
    const note = document.createElement('DIV');
    let dataNodeLevel = notesContainerNode.children.length + 1;

    // Set level for note to be added
    if(parentNode) {
        let totalSubNotes = 0;

        for (var i = 0; i < parentNode.children.length; i++) {
            const child = parentNode.children[i];
            if(child.className.indexOf('sub-note') > -1) {
                totalSubNotes++;
            }
        }

        let finalNodeLevel = totalSubNotes + 1;
        dataNodeLevel = parentNode.getAttribute('data-node-level') + '.' + finalNodeLevel;
        note.className = 'note sub-note';
    } else {
        note.className = 'note';
    }

    note.style.display = 'none';
    note.setAttribute('data-node-level', dataNodeLevel);
    const noteBody =  document.createElement('DIV');
    noteBody.className = 'note-body';
    const para = document.createElement('P');

    if(!searchString || text.indexOf(searchString) > -1) {
        if(!searchString) {
            para.innerText = 'Level ' + dataNodeLevel + ': ' + text;
        } else {
            let searchIndex = text.indexOf(searchString);
            let searchPreText = text.slice(0, searchIndex);
            let searchPostText = text.slice(searchIndex + (searchString.length));

            const searchPreSpan = document.createElement('SPAN');
            searchPreSpan.className = 'search-pre-text';
            searchPreSpan.innerText = 'Level ' + dataNodeLevel + ': ' + searchPreText;

            const searchPostSpan = document.createElement('SPAN');
            searchPostSpan.className = 'search-post-text';
            searchPostSpan.innerText = searchPostText;

            const searchSpan = document.createElement('SPAN');
            searchSpan.className = 'search-text';
            searchSpan.innerText = searchString;

            para.appendChild(searchPreSpan);
            para.appendChild(searchSpan);
            para.appendChild(searchPostSpan);
        }

        note.style.display = '';
    } else {
        para.innerText = 'Level ' + dataNodeLevel + ': ' + text;
    }

    const innerDiv = document.createElement('DIV');
    innerDiv.className = 'note-buttons';

    const editButton = document.createElement('SPAN');
    editButton.className = 'edit-button';
    editButton.innerText = 'Edit';
    editButton.onclick = () => editNoteText(note);

    const addButton = document.createElement('SPAN');
    addButton.className = 'add-button';
    addButton.innerText = 'Add Note';
    addButton.onclick = () => addSubNoteText(note);

    const deleteButton = document.createElement('SPAN');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => deleteNote(note);

    innerDiv.appendChild(deleteButton);
    innerDiv.appendChild(editButton);
    innerDiv.appendChild(addButton);
    noteBody.appendChild(para);
    noteBody.appendChild(innerDiv);
    note.appendChild(noteBody);

    return note;
}

function searchNodes() {
    const text = textNode.value;
    if (text && text.length > 0) {
        searchString = text.trim();

        submitButton.style.display = 'none';
        clearButton.style.display = '';

        saveAndReRenderView();
    }
}

function clearSearch() {
    searchString = '';
    clearButton.style.display = 'none';
    submitButton.style.display = '';
    textNode.value = '';

    saveAndReRenderView();
}

function saveAndReRenderView() {
    notesContainerNode.innerHTML = '';
    renderNotes(notesArray, notesContainerNode);
    window.localStorage.setItem('notes-array', JSON.stringify(notesArray));
}

function renderNotes(notesArray, currentParentNode) {
    notesArray.forEach(function(noteObj){
        const note = addNewNote(noteObj.text, !noteObj.isRootNode ? currentParentNode : null);

        if(noteObj.childNotes && noteObj.childNotes.length > 0) {
            renderNotes(noteObj.childNotes, note)
        }

        if(note.style.display !== 'none') {
            currentParentNode.style.display = '';
        }
        currentParentNode.appendChild(note);
    });
}

clearButton.style.display = 'none';
notesContainerNode.innerHTML = '';
renderNotes(notesArray, notesContainerNode);

textNode.addEventListener('keypress', function(e){
    if (event.keyCode == 13) addNewNoteToRoot();
});
