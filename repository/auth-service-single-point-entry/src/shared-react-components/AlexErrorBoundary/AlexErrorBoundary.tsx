import {Component, ErrorInfo, ReactNode} from "react";
import {AlexErrorPage} from "./AlexErrorPage.tsx";

interface IProps {
    children: ReactNode
}

interface IState {
    hasError: boolean
}

export class AlexErrorBoundary extends Component<IProps, IState> {
    public state: IState = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): IState {
        // Update state so the next render will show the fallback UI.
        return {hasError: true}
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return <AlexErrorPage/>
        }
        return this.props.children
    }
}``