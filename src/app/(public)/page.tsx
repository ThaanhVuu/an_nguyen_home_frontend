"use client";

import "./page.css";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Truck, ShieldCheck, Clock, Sofa, Utensils, BedDouble } from "lucide-react";
import useProducts from "@/app/admin/product/useProducts";
import Card from "@/components/card/card";
import useCategories from "@/app/admin/category/useCategories";
import CategoryCard from "@/components/categorycard/CategoryCard";

export default function Home() {
    // Fetch New Arrivals (default sort by createdDate desc is set in hook or we can enforce it)
    const { products, loading: productsLoading } = useProducts();

    // Fetch Root Categories
    const { rootCategories, loading: categoriesLoading } = useCategories();

    useEffect(() => {
        // Any init logic if needed
    }, []);

    const features = [
        {
            icon: <Truck size={40} className="text-primary mb-3" />,
            title: "Free Shipping",
            desc: "On all orders over 500k"
        },
        {
            icon: <ShieldCheck size={40} className="text-primary mb-3" />,
            title: "Secure Payment",
            desc: "100% secure payment"
        },
        {
            icon: <Clock size={40} className="text-primary mb-3" />,
            title: "24/7 Support",
            desc: "Dedicated support"
        }
    ];

    // Helper to map category name to icon (optional, or just use generic)
    const getCategoryIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('kitchen') || lower.includes('bếp')) return <Utensils size={32} />;
        if (lower.includes('bed') || lower.includes('ngủ')) return <BedDouble size={32} />;
        return <Sofa size={32} />;
    };

    return (
        <main>
            {/* HERO SECTION */}
            <section id="home" className="video-hero position-relative">
                <video className="video-bg" autoPlay muted loop playsInline>
                    <source src="/hero.mp4" type="video/mp4" />
                </video>
                <div className="overlay"></div>

                <div className="container hero-content position-relative z-2 h-100 d-flex flex-column justify-content-center">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-2 font-serif fw-bold text-white mb-4 animate-up">
                                Elevate Your <br />
                                <span className="fst-italic">Living Space</span>
                            </h1>
                            <p className="lead text-white-50 mb-5 animate-up delay-100" style={{ maxWidth: '550px', letterSpacing: '0.5px' }}>
                                Curated household essentials that blend timeless design with everyday functionality.
                            </p>

                            <div className="d-flex gap-3 animate-up delay-200">
                                <Link href="/product" className="btn btn-light rounded px-4 fw-bold text-uppercase align-items-center" >
                                    Shopping Now
                                </Link>
                                <Link href="#story" className="btn btn-outline-light rounded px-4 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                                    Explore
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR STORY SECTION */}
            <section id="story" className="py-5 bg-white">
                <div className="container py-lg-5">
                    <div className="row align-items-center gx-lg-5">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <img
                                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop"
                                alt="Our Story"
                                className="img-fluid story-image shadow-sm w-100"
                            />
                        </div>
                        <div className="col-lg-6">
                            <h6 className="text-secondary text-uppercase ls-2 mb-3">Our Philosophy</h6>
                            <h2 className="display-5 font-serif fw-bold mb-4">Designed for Living,<br />Crafted for Life.</h2>
                            <p className="text-muted fs-5 mb-4 text-justify">
                                We believe that a home is more than just a place to live—it's a sanctuary.
                                Our journey began with a simple idea: to bring high-quality, aesthetically pleasing
                                household goods to modern homes without the premium price tag.
                            </p>
                            <p className="text-muted mb-4 text-justify">
                                Every product in our collection is handpicked for its durability, functionality, and
                                ability to elevate the ordinary moments of your day. From morning coffee to evening rest,
                                we are there with you.
                            </p>
                            <Link href="/about" className="text-dark fw-bold text-decoration-none border-bottom border-dark pb-1">
                                READ FULL STORY
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES SECTION */}
            <section id="categories" className="py-5 bg-light">
                <div className="container py-lg-5">
                    <div className="text-center mb-5">
                        <h6 className="text-secondary text-uppercase ls-2">Curated Collections</h6>
                        <h2 className="display-5 font-serif fw-bold">Explore by Category</h2>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {categoriesLoading ? (
                            <div className="text-center py-5">Loading categories...</div>
                        ) : rootCategories.length > 0 ? (
                            rootCategories.map((cat, index) => (
                                <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                                    <div className="h-100 position-relative category-card bg-white p-4 text-center">
                                        <div className="mb-4 category-icon-wrapper d-flex justify-content-center">
                                            {getCategoryIcon(cat.name)}
                                        </div>
                                        <h4 className="font-serif fs-4 mb-3 category-title text-success">{cat.name}</h4>
                                        <Link href={`/product?category=${cat.id}`} className="stretched-link category-link text-decoration-none small text-uppercase fw-bold">
                                            Shop Collection <span className="ms-1 arrow-icon">→</span>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted">No categories available.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION (Minimalist) */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4 border-top border-bottom py-5">
                        {features.map((f, index) => (
                            <div key={index} className="col-md-4 text-center border-end-md">
                                <div className="p-3">
                                    {f.icon}
                                    <h5 className="font-serif fw-bold mb-2">{f.title}</h5>
                                    <p className="text-muted small text-uppercase ls-2 mb-0">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW ARRIVALS SECTION (Clean Grid) */}
            <section className="py-5">
                <div className="container py-lg-5">
                    <div className="d-flex flex-column align-items-center mb-5 text-center">
                        <h6 className="text-secondary text-uppercase ls-2">Fresh From Studio</h6>
                        <h2 className="display-5 font-serif fw-bold mb-0">New Arrivals</h2>
                    </div>

                    {productsLoading ? (
                        <div className="text-center py-5">Loading products...</div>
                    ) : (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-5">
                            {products.slice(0, 8).map((product) => (
                                <div key={product.id} className="col product-card-minimal">
                                    <Card product={product} />
                                </div>
                            ))}
                            {products.length === 0 && (
                                <div className="col-12 text-center py-5 text-muted">
                                    No products available yet.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="text-center mt-5">
                        <Link href="/product" className="btn btn-dark rounded px-5 py-3 text-uppercase fw-bold ls-2">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-5 bg-light text-center">
                <div className="container py-5">
                    <h2 className="font-serif display-6 fw-bold mb-4">Join Our Community</h2>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '500px' }}>
                        Subscribe to receive updates on new arrivals, special offers and other discount information.
                    </p>
                    <div className="mx-auto" style={{ maxWidth: '500px' }}>
                        <div className="input-group input-group-lg">
                            <input type="email" className="form-control rounded-start" placeholder="Enter your email" />
                            <button className="btn btn-primary rounded-end px-4">Subscribe</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}