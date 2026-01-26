"use client";

import "./page.css";

export default function AboutPage() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Kiến tạo Công nghệ Tương lai</h1>
                    <p className="hero-desc">
                        An Nguyen Store không chỉ bán sản phẩm, chúng tôi mang đến giải pháp công nghệ
                        tối ưu nhất cho cuộc sống của bạn.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="section">
                <div className="story-grid">
                    <div className="story-image">
                        <img
                            src="https://images.unsplash.com/photo-1531297425971-ec1536284329?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Technology Workspace"
                        />
                    </div>
                    <div className="story-text">
                        <div className="section-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <h2 className="section-title">Câu chuyện của chúng tôi</h2>
                            <p className="section-subtitle">Hành trình từ đam mê đến thương hiệu uy tín</p>
                        </div>
                        <p>
                            Được thành lập vào năm 2023, An Nguyen Store bắt đầu với một niềm đam mê cháy bỏng:
                            làm cho công nghệ cao cấp trở nên dễ tiếp cận hơn với mọi người Việt.
                        </p>
                        <p>
                            Chúng tôi hiểu rằng một chiếc laptop không chỉ là công cụ làm việc, mà là người bạn đồng hành
                            trên con đường chinh phục thành công. Từ những ngày đầu tiên trong một văn phòng nhỏ,
                            nay chúng tôi đã trở thành điểm đến tin cậy cho hàng ngàn tín đồ công nghệ.
                        </p>
                        <p>
                            Sứ mệnh của chúng tôi là cung cấp những sản phẩm chính hãng chất lượng nhất, kèm theo
                            dịch vụ hậu mãi tận tâm, để bạn yên tâm sáng tạo và làm việc.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Giá trị cốt lõi</h2>
                    <p className="section-subtitle">Những nguyên tắc định hình nên An Nguyen Store</p>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon">💎</div>
                        <h3>Chất lượng hàng đầu</h3>
                        <p>Cam kết 100% sản phẩm chính hãng, được kiểm tra nghiêm ngặt trước khi đến tay khách hàng.</p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">🚀</div>
                        <h3>Tốc độ vượt trội</h3>
                        <p>Giao hàng hỏa tốc trong 2h tại nội thành và hỗ trợ vận chuyển toàn quốc nhanh chóng.</p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">🛡️</div>
                        <h3>Bảo hành uy tín</h3>
                        <p>Chính sách đổi trả minh bạch, bảo hành dài hạn và hỗ trợ kỹ thuật trọn đời.</p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">🤝</div>
                        <h3>Tận tâm phục vụ</h3>
                        <p>Đội ngũ tư vấn viên am hiểu công nghệ, luôn sẵn sàng lắng nghe và giải quyết mọi vấn đề.</p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section">
                <div className="stats-container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">5K+</span>
                            <span className="stat-label">Khách hàng hài lòng</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Sản phẩm đã bán</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Hỗ trợ kỹ thuật</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Chính hãng</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
