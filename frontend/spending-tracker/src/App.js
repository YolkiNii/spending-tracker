import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PersistLogin from './components/PersistLogin';

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path='/' element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App;
