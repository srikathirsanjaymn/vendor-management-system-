import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Vendom App Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', background: '#f7f8f5', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dce5df', maxWidth: '500px' }}>
            <h2 style={{ color: '#203a38', margin: '0 0 10px' }}>Something went wrong</h2>
            <p style={{ color: '#738080', fontSize: '14px', marginBottom: '20px' }}>
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{ background: '#167c69', color: '#fff', padding: '10px 18px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
