import ReactDOM from 'react-dom/client';
import LoginPage from './pages/LoginPage.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from "./pages/SignUp.jsx";
import MainPage from "./pages/MainPage.jsx";
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/mainPage" element={<MainPage />} />
        </Routes>
    </Router>,
)
