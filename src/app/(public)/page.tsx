"use client"

import "./page.css";
import Link from "next/link";
import {useEffect} from "react";

export default function Home() {
    useEffect(() => {

    }, []);

    return (
        <section id={"home"} className="video-hero">
            {/* Video background */}
            <video
                className="video-bg"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/hero.mp4" type="video/mp4" />
            </video>

            {/* Content overlay */}
            <div className="container hero-content">
                <div className="row align-items-center h-100">
                    <div className="col-md-6">
                        <h1 className="display-5 fw-bold text-white">Long Title</h1>
                        <p className="lead text-white-50">
                            Short subtitle or value proposition goes here.
                        </p>

                        <div className="d-flex gap-3 mt-4">
                            <Link href="#" className="btn btn-outline-light">
                                Discovery
                            </Link>
                            <Link href="#" className="btn btn-light">
                                Learn More
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <p className="fs-5">
                            Long description. You can explain your product,
                            service, or story here in a concise but compelling way.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
