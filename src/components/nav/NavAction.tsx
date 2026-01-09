import InputCus from "@/components/input/InputCus";
import {CircleUserIcon, ShoppingBag} from "lucide-react";
import Link from "next/link";

export function NavActions() {
    return (
        <ul className="d-flex gap-3 navbar-nav align-items-center">
            <li className={"nav-item"}>
                <InputCus placeholder="Search 🔎" className={"w-auto input-blur"}/>
            </li>
            <li className={"nav-item"}>
                <Link href={"/cart"} className={"nav-link"}><ShoppingBag/></Link>
            </li>
            <li className={"nav-item"}>
                {/*<Link href={"/login"} className={"nav-link"}><CircleUserIcon/></Link>*/}
                <Link href={"/login"} className={"nav-link"}>Login</Link>
            </li>
        </ul>
    );
}
