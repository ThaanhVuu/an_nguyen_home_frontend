import InputCus from "@/components/InputCus";
import {CircleUserIcon, ShoppingBag} from "lucide-react";
import Link from "next/link";

export function NavActions() {
    return (
        <ul className="d-flex gap-3 navbar-nav align-items-center">
            <li className={"nav-item"}>
                <InputCus placeholder="Search 🔎" className={"w-auto input-blur"}/>
            </li>
            <li>
                <Link href={"/cart"} className={"nav-item"}><ShoppingBag/></Link>
            </li>
            <li>
                <Link href={"/login"} className={"nav-item"}><CircleUserIcon/></Link>
            </li>
        </ul>
    );
}
