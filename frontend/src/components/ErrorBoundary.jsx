import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#FFF9F5] dark:bg-[#18111B] text-[#242026] dark:text-[#F9F4F8]">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#231826] border border-[#EADFE8] dark:border-[#3D2C42] shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF5A0A]/10 text-[#FF5A0A] flex items-center justify-center mx-auto">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-xl font-bold tracking-tight">An unexpected issue occurred</h3>
            <p className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              {this.state.error?.message || 'Component failed to render properly.'}
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-[#400849] hover:bg-[#5b0c67] text-white text-xs font-bold"
              >
                <RefreshCw size={14} className="mr-1.5" /> Reload Application
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/dashboard';
                }}
                className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] text-xs font-semibold"
              >
                <Home size={14} className="mr-1.5" /> Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
