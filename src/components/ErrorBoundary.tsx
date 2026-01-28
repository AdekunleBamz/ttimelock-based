import React, { Component, ErrorInfo, ReactNode } from "react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <span className="error-icon">💥</span>
            <h1>Something went wrong</h1>
            <p>
              We encountered an unexpected error. The application has crashed to protect your data.
            </p>
            {this.state.error && (
              <details style={{ textAlign: 'left', marginBottom: '20px', color: '#888', fontSize: '0.8rem' }}>
                <summary>Error Details</summary>
                <div style={{ marginTop: '10px' }}>{this.state.error.toString()}</div>
              </details>
            )}
            <button className="retry-btn" onClick={this.handleReload}>
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
