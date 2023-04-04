import 'bootstrap/dist/css/bootstrap.min.css';
import { useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';

import NewNote from './components/NewNote';
import useLocalStorage from './useLocalStorage';

type Note = {
  id: string;
} & NoteData;

type RawNote = {
  id: string;
} & RawNoteData;

type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

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

  return (
    <Container className='my-4'>
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
        <Route path='/new' element={<NewNote />} />
        <Route path='/:id'>
          <Route index element={<h1>Show</h1>} />
          <Route path='edit' element={<h1>Edit</h1>} />
        </Route>
        <Route path='/*' element={<Navigate to='/' />} />
      </Routes>
    </Container>
  );
}

export default App;
export type { Note, NoteData, Tag };
