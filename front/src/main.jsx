import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ShoppingListApp from "./ShoppingListApp";
import BlogApp from "./BlogApp.jsx";
import ProjetFinal from "./ProjetFinal.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjetFinal />
  </StrictMode>,
)
