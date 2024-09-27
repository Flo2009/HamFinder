import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import SearchStations from './pages/SearchStations.jsx'
import SavedStations from './pages/SavedStations.jsx'
import AboutUs from './components/AboutUs.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchStations />
      }, {
        path: '/saved',
        element: <SavedStations />
      },{
        path: '/aboutus',
        element: < AboutUs />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
