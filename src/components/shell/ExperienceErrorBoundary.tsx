import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/common/Button";
import { experienceActions } from "@/experience/state";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ExperienceErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Experience error boundary", error, info.componentStack);
  }

  private handleReset = (): void => {
    experienceActions.reset();
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          className="flex h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6 text-center text-ink"
          data-testid="experience-error"
        >
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Experience error</p>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            The 3D experience hit an unexpected error. The rest of this demo is static and does not
            require a backend. Reset restores the default shell and remounts the scene.
          </p>
          <p className="max-w-md font-mono text-xs text-alert">{this.state.error.message}</p>
          <Button onClick={this.handleReset}>Reset</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
