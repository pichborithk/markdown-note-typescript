import {
  Navigate,
  Outlet,
  useOutlet,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import { Note } from '../App';

type NoteLayoutProps = {
  notes: Note[];
};

const NoteLayout = ({ notes }: NoteLayoutProps) => {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  if (note === null) return <Navigate to='/' replace />;

  return <Outlet context={note} />;
};

function useNote() {
  return useOutletContext<Note>();
}

export default NoteLayout;
export { useNote };
