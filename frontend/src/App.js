import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HouseScreen from './screens/HouseScreen';
import HomeScreen from './screens/HomeScreen';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import HouseCreateScreen from './screens/HouseCreateScreen';
import RegisterScreen from './screens/RegisterScreen';
import SearchScreen from './screens/SearchScreen';
import UpdateHouseScreen from './screens/UpdateHouseScreen';

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
              <Route path='/create-listing' element={<HouseCreateScreen/> } />
              <Route path='/register' element={<RegisterScreen/> } />
              <Route path="/search/:keyword" element={<SearchScreen />} />
              <Route path="/house/update/:id" element={<UpdateHouseScreen />} />
            </Routes>
          </Container>
        </main>
    </Router>
  );
}

export default App;
