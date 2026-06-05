import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Render error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <section className="editorial-container my-8 border border-ink/10 bg-porcelain p-8 text-center">
          <p className="micro-label text-bronze">Render Diagnostic</p>
          <h2 className="serif-title mt-3 text-4xl leading-none text-espresso">
            This section could not be rendered.
          </h2>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
