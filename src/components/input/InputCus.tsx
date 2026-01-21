import { CSSProperties, ChangeEvent } from "react";
import "./InputCus.css";

export interface InputCusProps {
    placeholder?: string;
    className?: string;
    type?: string;
    style?: CSSProperties;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export default function InputCus({
                                     style,
                                     type = "text",
                                     placeholder,
                                     className,
                                     value,
                                     onChange,
                                     error,
                                 }: InputCusProps) {
    return (
      <>
          <input
              type={type}
              className={`form-control ${className ?? ""}`}
              placeholder={placeholder}
              style={style}
              value={value}
              onChange={onChange}
          />
          {error && (
              <div className="invalid-feedback d-block">
                  {error}
              </div>
          )}</>
    );
}
