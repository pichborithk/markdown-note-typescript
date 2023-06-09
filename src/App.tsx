import { useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import useLocalStorage from './useLocalStorage';

import NewNote from './components/NewNote';
import NoteList from './components/NoteList';
import NoteLayout from './components/NoteLayout';
import Note from './components/Note';
import EditNote from './components/EditNote';

type RawNote = {
  id: string;
} & RawNoteData;

type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

type Note = {
  id: string;
} & NoteData;

type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  function deleteTag(id: string) {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  }

  return (
    <Container className='my-4'>
      <Routes>
        <Route
          path='/'
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path='/new'
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDeleteNote={onDeleteNote} />} />
          <Route
            path='edit'
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path='/*' element={<Navigate to='/' />} />
      </Routes>
    </Container>
  );
}

export default App;
export type { Note, NoteData, Tag, RawNote };
