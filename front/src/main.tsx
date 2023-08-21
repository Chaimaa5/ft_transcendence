import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Modal from 'react-modal';

// Modal.setAppElement('#root');
const doc : HTMLElement | null = document.getElementById('root')

if(doc)
    ReactDOM.createRoot(doc).render(
	<App />)
