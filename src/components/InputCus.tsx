export interface InputCusProps {
    placeholder?: string,
    className?: string,
    type?: string,
    style?: object
}

export default function InputCus({style, type, placeholder, className}: InputCusProps){
    return(
        <input className={`${className} form-control`} placeholder={placeholder} style={style}/>
    )
}