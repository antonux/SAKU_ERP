import { BrowserRouter } from 'react-router-dom'
import AppRoutes from "./routes/AppRoutes"
import Login from './pages/Shared/Login'

function App() {

  return (
    <div className="font-sans">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
}

export default App
