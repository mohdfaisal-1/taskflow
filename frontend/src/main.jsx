import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', padding: '40px', background: 'rgba(250,112,154,0.1)', border: '1px solid #fa709a', margin: '40px', borderRadius: '12px' }}>
          <h1 style={{ color: '#fa709a', fontSize: '24px', marginBottom: '16px' }}>React Crash!</h1>
          <pre style={{ whiteSpace: 'pre-wrap', marginBottom: '16px', color: '#ffb3c6' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{this.state.info?.componentStack}</pre>
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
  </StrictMode>,
)
