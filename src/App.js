import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import ScrollToTop from "react-scroll-to-top";
import AboutPage from "./pages/AboutPage";
import ServicePage from "./pages/ServicePage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import TeamPage from "./pages/TeamPage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import ShopPage from "./pages/ShopPage";
import ShopDetailsPage from "./pages/ShopDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import ContactPage from "./pages/ContactPage";
import HomePageThree from "./pages/HomePageThree";
import ServiceDetails from "./components/ServiceDetails";
import { CartProvider } from "./context/CartContext";
import SelectTimeSlotPage from './components/SelectTimeSlotPage';
import TimeSlotPage from "./pages/TimeSlotPage";
import 'react-datepicker/dist/react-datepicker.css';
import ProfilePage from "./pages/ProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <RouteScrollToTop />
        <ScrollToTop smooth color="#E8092E" />
        <Routes>
          <Route exact path="/" element={<HomePageThree />} />
          <Route exact path="/about" element={<AboutPage />} />
          <Route exact path="/service" element={<ServicePage />} />
          <Route exact path="/service-details/:categoryId" element={<ServiceDetailsPage />} />
          <Route path="/servicedetails/:id" element={<ServiceDetails />} />
          <Route exact path="/project" element={<ProjectPage />} />
          <Route exact path="/project-details" element={<ProjectDetailsPage />} />
          <Route exact path="/blog" element={<BlogPage />} />
          <Route exact path="/blog-details" element={<BlogDetailsPage />} />
          <Route exact path="/team" element={<TeamPage />} />
          <Route exact path="/team-details" element={<TeamDetailsPage />} />
          <Route exact path="/shop" element={<ShopPage />} />
          <Route exact path="/shop-details" element={<ShopDetailsPage />} />
          <Route exact path="/cart" element={<CartPage />} />
          <Route exact path="/checkout" element={<CheckoutPage />} />
          <Route exact path="/wishlist" element={<WishlistPage />} />
          <Route exact path="/contact" element={<ContactPage />} />
          <Route exact path="/selecttimeslot" element={<TimeSlotPage />} />
          <Route exact path="/profile" element={<ProfilePage />} />
          <Route exact path="/mybookings" element={<MyBookingsPage />} />
          <Route exact path="/terms" element={<TermsPage />} />
          <Route exact path="/privacy" element={<PrivacyPage />} />
          <Route exact path="/refund" element={<RefundPage />} />



        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
