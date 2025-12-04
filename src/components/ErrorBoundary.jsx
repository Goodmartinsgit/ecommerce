import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    // You can also log the error to an error reporting service here
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    // Reset the error boundary and reload the page
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>

              {/* Error Description */}
              <p className="text-gray-600 mb-6">
                We apologize for the inconvenience. An unexpected error occurred.
                Please try refreshing the page.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-6 p-4 bg-gray-100 rounded-md">
                  <summary className="cursor-pointer font-semibold text-sm text-gray-700 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="text-xs text-red-600 font-mono whitespace-pre-wrap break-words">
                    <p className="font-bold mb-2">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="mt-2 text-gray-700 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Go Back
                </button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-6">
                If the problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // No error - render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
