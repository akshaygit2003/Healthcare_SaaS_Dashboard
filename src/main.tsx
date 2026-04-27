import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './app/store';
import { setNotificationPermission, setServiceWorkerRegistered } from './features/ui/uiSlice';
import { setUser } from './features/auth/authSlice';
import { subscribeToAuthChanges } from './services/authService';
import { registerServiceWorker } from './services/notifications';
import './styles.css';

void registerServiceWorker()
  .then((isRegistered) => {
    store.dispatch(setServiceWorkerRegistered(isRegistered));
  })
  .catch(() => {
    store.dispatch(setServiceWorkerRegistered(false));
  });

if ('Notification' in window) {
  const permission = Notification.permission === 'default' ? 'unknown' : Notification.permission;
  store.dispatch(setNotificationPermission(permission));
} else {
  store.dispatch(setNotificationPermission('unsupported'));
}

subscribeToAuthChanges((user) => {
  store.dispatch(setUser(user));
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            background: '#0f172a',
            color: '#f8fafc'
          }
        }}
      />
    </BrowserRouter>
  </Provider>
);
