import {BrowserRouter as Switch, Routes, Route} from 'react-router-dom'
import Card from './pages/Card';

function App() {
  return (
    <Switch >
      <Routes>
        <Route path='/' exact element={<Card/>} />
      </Routes>
    </Switch>
  );
}

export default App;
