import Link from "next/link";
import "./footer.css";
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-4">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          {/* Company Info */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold fw-bold font-serif">An Nguyen Home</h5>
            <p className="text-white-50">
              Elevating your living space with curated sustainable household essentials.
              Designed for modern living, crafted for life.
            </p>
          </div>

          {/* Shop Links */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold fw-bold">Shop</h5>
            <p><Link href="/products?sort=newest" className="text-white-50 text-decoration-none footer-link">New Arrivals</Link></p>
            <p><Link href="/products?sort=bestsellers" className="text-white-50 text-decoration-none footer-link">Best Sellers</Link></p>
            <p><Link href="/products?category=furniture" className="text-white-50 text-decoration-none footer-link">Furniture</Link></p>
            <p><Link href="/products?category=kitchen" className="text-white-50 text-decoration-none footer-link">Kitchenware</Link></p>
          </div>

          {/* Company Links */}
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold fw-bold">Company</h5>
            <p><Link href="/about" className="text-white-50 text-decoration-none footer-link">Our Story</Link></p>
            <p><Link href="/sustainability" className="text-white-50 text-decoration-none footer-link">Sustainability</Link></p>
            <p><Link href="/careers" className="text-white-50 text-decoration-none footer-link">Careers</Link></p>
            <p><Link href="/contact" className="text-white-50 text-decoration-none footer-link">Contact Us</Link></p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold fw-bold">Contact</h5>
            <p className="text-white-50 d-flex align-items-center justify-content-center justify-content-md-start">
              <MapPin size={18} className="me-2" /> 123 Nguyen Van Linh, Da Nang
            </p>
            <p className="text-white-50 d-flex align-items-center justify-content-center justify-content-md-start">
              <Mail size={18} className="me-2" /> vu@example.com
            </p>
            <p className="text-white-50 d-flex align-items-center justify-content-center justify-content-md-start">
              <Phone size={18} className="me-2" /> +84 123 456 789
            </p>
          </div>
        </div>

        <hr className="mb-4 text-white-50" />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-white-50 text-center text-md-start">
              © 2024 <strong>An Nguyen Home</strong>. All Rights Reserved.
            </p>
          </div>

          <div className="col-md-5 col-lg-4">
            <div className="text-center text-md-end">
              <ul className="list-unstyled list-inline">
                <li className="list-inline-item">
                  <a href="#" className="btn-floating btn-sm text-white"><Facebook size={20} /></a>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="btn-floating btn-sm text-white"><Twitter size={20} /></a>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="btn-floating btn-sm text-white"><Instagram size={20} /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
