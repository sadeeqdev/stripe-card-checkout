import {BrowserRouter as Switch, Routes, Route} from 'react-router-dom'
import Card from './pages/Card';
import Home from './pages/Home';

function App() {
  return (
    <Switch >
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/card' exact element={<Card/>} />
      </Routes>
    </Switch>
  );
}

export default App;
