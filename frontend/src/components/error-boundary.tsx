import { Component, type ComponentType, type ErrorInfo, type PropsWithChildren, type ReactNode } from "react";

type ErrorBoundaryProps = PropsWithChildren<{
  fallback?: ReactNode;
  fallbackComponent?: ComponentType<{ error: Error }>;
  fallbackRender?: (error: Error) => ReactNode;
}>;

interface ErrorBoundaryState {
  error: Error | undefined;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error({ error, info });
  }

  override render() {
    if (this.state.error === undefined) {
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

  override shouldComponentUpdate(
    nextProps: ErrorBoundaryProps,
    nextState: ErrorBoundaryState,
    nextContext: unknown,
  ): boolean {
    return nextProps !== this.props || nextState !== this.state || nextContext !== this.context;
  }
}
