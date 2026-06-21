import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-7xl mb-4">💥</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.message || 'An unexpected error occurred'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition"
              >
                🔄 Refresh Page
              </button>
              <button
                onClick={this.handleGoBack}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg transition"
              >
                ⬅️ Go Back
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6">
                <button
                  onClick={this.toggleDetails}
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
                {showDetails && errorInfo && (
                  <div className="mt-3 text-left">
                    <div className="bg-gray-100 rounded-lg p-3 overflow-auto max-h-48">
                      <p className="text-xs text-gray-600 font-mono break-all">
                        {error?.stack || errorInfo?.componentStack || 'No stack trace available'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
