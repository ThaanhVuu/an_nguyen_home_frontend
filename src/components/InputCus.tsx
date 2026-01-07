export interface InputCusProps {
    placeholder?: string,
    className?: string,
    type?: string,
}

export default function InputCus({type, placeholder, className}: InputCusProps){
    return(
        <input className={`${className} form-control`} placeholder={placeholder}/>
    )
}