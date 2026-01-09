import InputCus from "@/components/input/InputCus";

export default function Login(){
    return(
        <section id={"login"}>
            <div className={"container"}>
                <form>
                    <InputCus placeholder={"Username"}/>
                </form>
            </div>
        </section>
    );
}