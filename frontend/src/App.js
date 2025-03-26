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
import ChatScreen from './screens/ChatScreen';
import MessageHistoryScreen from './screens/MessageHistoryScreen';
import PaymentScreen from './screens/PaymentScreen';
import { Routes, Route } from 'react-router-dom';  // ✅ Only keep Routes/Route
import CartScreen from './screens/CartScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

function App() {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path='/house/:id' element={<HouseScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/create-listing' element={<HouseCreateScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path="/search/:keyword" element={<SearchScreen />} />
            <Route path="/house/update/:id" element={<UpdateHouseScreen />} />
            <Route path="/messages" element={<MessageHistoryScreen />} />
            <Route path="/chat/:buyerId/:sellerId/:houseId" element={<ChatScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/cart/:id?' element={<CartScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path='/order/:id' element={<OrderScreen />} />
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
