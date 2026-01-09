import {CSSProperties} from "react";
import './InputCus.css';

export interface InputCusProps {
    placeholder?: string,
    className?: string,
    type?: string,
    style?: CSSProperties
}

export default function InputCus({style, type = "text", placeholder, className}: InputCusProps){
    return(
        <input type={type} className={`${className} form-control`} placeholder={placeholder} style={style}/>
    )
}