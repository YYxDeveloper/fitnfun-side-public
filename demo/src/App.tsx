import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Instructors } from './pages/Instructors';
import { NewInstructor } from './pages/NewInstructor';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/instructors/new" element={<NewInstructor />} />
      </Routes>
    </HashRouter>
  );
}