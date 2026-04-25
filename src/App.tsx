import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Home } from '@/pages/Home';
import { SavedTimetables } from '@/pages/SavedTimetables';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<SavedTimetables />} />
      </Route>
    </Routes>
  );
}

export default App;