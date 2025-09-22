import Home from './components/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastOverrides.css';

import './App.scss'
import Home1 from './components/Home1';
const App = () => {
  return (
    <div className="app">
    <>
      <ToastContainer autoClose={2000} position="top-right" />
      <Home1 />
     </>
    </div>
  )
}

export default App