import { Routes , Route } from "react-router"
import Home from "./forUser/Pages/Home"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Register from "./auth/Register";
import Login from "./auth/Login";
import ISSeller from "./auth/verify/isSelle";
import ListProduct from "./forSeller/pages/ListProduct";
import SellerDashBord from "./forSeller/pages/SellerDashBord";
import SellerMainPage from "./forSeller/pages/SellerMainPage";
import ManageProducts from "./forSeller/pages/ManageProducts";
import Notification from "./forSeller/pages/Notification";
import SingleProduct from "./globalPage/SingleProduct";
import ISUser from "./auth/verify/ISUser";
import SearchPage from "./forUser/Pages/SearchPage";
import CartPage from "./forUser/Pages/CartPage";
import ProfilePage from "./forUser/Pages/ProfilePage";
import UpdateProfilePage from "./forUser/Pages/Components/ProfilePageComponets/UpdateProfilePage";
import CheckoutCancelPage from "./forUser/Pages/Components/CheckOutComponents/CheckoutCancelPage";
import CheckoutSuccessPage from "./forUser/Pages/Components/CheckOutComponents/CheckoutSuccessPage";
import OrderDatail from "./forUser/Pages/Components/ProfilePageComponets/OrderDatail";
import OrderPage from "./forSeller/pages/OrderPage";
import OrderDetail from "./forSeller/pages/OrderDetsil";

function App() {
 

  return (
    <>
    <Routes>
      <Route path="" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/product/:id" element={<SingleProduct/>}/>
      <Route path="/search" element={<SearchPage/>}/>

      <Route path="/user" element={<ISUser/>}>
      <Route path="profile" element={<ProfilePage/>}/>
      <Route path="profile/update/:id" element={<UpdateProfilePage />} />
      <Route path="order/details/:id" element={<OrderDatail />} />
      <Route path="cart" element={<CartPage/>}/>
      <Route path="checkout-success" element={<CheckoutSuccessPage />} />
      <Route path="checkout-cancel" element={<CheckoutCancelPage />} />
      </Route>
      <Route path="/seller" element={<ISSeller/>}>
      <Route path="" element={<SellerMainPage/>}/>
      <Route path="dashboard" element={<SellerDashBord/>}/>
      <Route path="manageproduct" element={<ManageProducts/>}/>
      <Route path="orders" element={<OrderPage/>}/>
      <Route path="orders/detail/:id" element={<OrderDetail/>}/>
        <Route path="list" element={<ListProduct/>}/>
        <Route path="notification" element={<Notification/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
