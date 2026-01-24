import {NavProps} from "@/components/nav/NavBar";
import Link from "next/link";
import {usePathname} from "next/navigation";

export function NavLink({items}: NavProps){
    const pathName = usePathname();

    return(
        <ul className={"navbar-nav ps-4 gap-3"}>
            {items.map((item) => (
                <li key={item.href} className="nav-item">
                    <Link className={`nav-link fw-semibold ${pathName == item.href ? "text-success" : ""}`} href={item.href || "#"}>
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}