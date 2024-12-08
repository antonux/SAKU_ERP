import { BrowserRouter } from 'react-router-dom'
import AppRoutes from "./routes/AppRoutes"

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
