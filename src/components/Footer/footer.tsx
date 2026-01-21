"use client";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer border-top mt-5">
      <div className="container py-3">
        <div className="row align-items-center">

          <div className="col-12 col-md-6 text-center text-md-start small text-muted">
            © 2024 ElectroHome Việt Nam. Đã đăng ký bản quyền.
          </div>

          <div className="col-12 col-md-6 text-center text-md-end mt-2 mt-md-0">
            <a href="#" className="footer-link">
              Chính sách bảo mật
            </a>
            <a href="#" className="footer-link">
              Điều khoản sử dụng
            </a>
            <a href="#" className="footer-link">
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
