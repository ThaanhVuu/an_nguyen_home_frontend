import { CSSProperties, ReactNode } from "react";
import "./InputCus.css";

export interface InputCusProps {
    placeholder?: string;
    className?: string;
    type?: string;
    style?: CSSProperties;
    icon?: ReactNode;
}

export default function InputCus({
                                     style,
                                     type = "text",
                                     placeholder,
                                     className,
                                     icon
                                 }: InputCusProps) {
    return (
        <div className="input-cus-wrapper">
            {icon && <span className="input-cus-icon">{icon}</span>}
            <input
                type={type}
                className={`form-control input-cus ${className ?? ""}`}
                placeholder={placeholder}
                style={style}
            />
        </div>
    );
}
