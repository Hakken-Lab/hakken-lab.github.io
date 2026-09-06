import { interceptNavigation, routerEvents, handlePopState, pushState } from '../lib/view-route.js';
import './App.js';

const app = () => {
    const root = document.getElementById('root');
    root.innerHTML = `<hakken-app></hakken-app>`;
    interceptNavigation(root);
}

document.addEventListener('DOMContentLoaded', app);
