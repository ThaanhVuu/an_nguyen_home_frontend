import NavBar, { NavItem } from "@/components/nav/NavBar";

const itemNavs: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Category", href: "/category" },
    { label: "Product", href: "/product" },
    { label: "About", href: "/about" },
];

export default function PublicLayout({children,}: { children: React.ReactNode; }) {
    return (
        <>
            <header>
                <NavBar items={itemNavs} />
            </header>
            <main>{children}</main>
        </>
    );
}
