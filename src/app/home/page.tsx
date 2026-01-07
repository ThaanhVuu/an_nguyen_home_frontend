import Image from "next/image";

export default function Home(){
    return(
        <div id={"home"} style={{backgroundColor: "#FFFFFF"}}>
            <div className={"container"}>
                <Image
                    src="https://icdn.dantri.com.vn/2025/04/21/sunhouse-edited-1745228901510.jpeg"
                    alt="sunhouse"
                    width={720}
                    height={720}
                />
            </div>
        </div>
    )
}