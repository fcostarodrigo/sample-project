import { Component, ComponentType, ErrorInfo, PropsWithChildren, ReactNode } from "react";

type ErrorBoundaryProps = PropsWithChildren<{
  fallback?: ReactNode;
  fallbackComponent?: ComponentType<{ error: Error }>;
  fallbackRender?: (error: Error) => ReactNode;
}>;

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error({ error, info });
  }

  render() {
    if (this.state.error === null) {
      return this.props.children;
    }

    if (this.props.fallbackComponent) {
      return <this.props.fallbackComponent error={this.state.error} />;
    }

    if (this.props.fallbackRender) {
      return this.props.fallbackRender(this.state.error);
    }

    return this.props.fallback;
  }

  shouldComponentUpdate(nextProps: ErrorBoundaryProps, nextState: ErrorBoundaryState, nextContext: unknown): boolean {
    return nextProps !== this.props || nextState !== this.state || nextContext !== this.context;
  }
}
