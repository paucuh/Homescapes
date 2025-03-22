import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HouseScreen from './screens/HouseScreen';
import HomeScreen from './screens/HomeScreen';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

function App() {
  return (
    <Router>
      <Header/>
        <main className='py-3'>
          <Container>
            <Routes>
              <Route path='/' element={<HomeScreen />} exact />
              <Route path='/house/:id' element={<HouseScreen />} />
              <Route path='/login' element={<LoginScreen/> } />
              <Route path='/profile' element={<ProfileScreen/> } />
            </Routes>
          </Container>
        </main>
    </Router>
  );
}

export default App;
