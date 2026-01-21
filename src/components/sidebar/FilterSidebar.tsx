"use client";
import InputCus from "../input/InputCus";
export default function FilterSidebar() {
  return (
    <aside className="col-12 col-md-4 col-lg-3">
      <div className="p-2 position-sticky" style={{ top: "80px" }}>
        <div className="border rounded-3 shadow-sm bg-white p-3">
          <h4 className="fw-semibold mb-3 text-center">Filter</h4>
          <hr className="my-3" />
          <div className="mb-4">
            <div className="fw-semibold mb-2">Price range</div>
            <div className="d-flex gap-2">
              {["from", "Arrive"].map((placeholder, index) => (
                <InputCus
                  key={index}
                  className="form-control form-control-sm"
                  placeholder={placeholder}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="fw-semibold mb-2">Trademark</div>
            {["Samsung", "LG", "Toshiba", "Panasonic"].map((brand, i) => (
              <div key={i} className="form-check mb-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`brand-${i}`}
                />
                <label className="form-check-label" htmlFor={`brand-${i}`}>
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
