"use client";
import React, { useState } from "react";
import useOrders, { OrderResponse } from "@/app/admin/order/useOrders";
import { Column, TableCus } from "@/components/TableCus";
import { useModal } from "@/hooks/useModalClient";
import ModalClient from "@/components/modal/ModalClient";
import { Pagination } from "@/components/Pagination";
import Toast, { ToastType } from "@/components/Toast";

export default function OrderComponent() {
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>("error");

    // For Detail Modal
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const DETAIL_MODAL_ID = "order_detail_modal";
    const { open: openDetail, close: closeDetail } = useModal(DETAIL_MODAL_ID);

    // For Payment Modal
    const PAYMENT_MODAL_ID = "payment_modal";
    const { open: openPaymentModal, close: closePaymentModal } = useModal(PAYMENT_MODAL_ID);
    const [paymentForm, setPaymentForm] = useState({ amount: 0, transactionId: "" });

    const {
        orders,
        pagination,
        setPage,
        setSize,
        setKeyword,
        setStatus,
        cancelOrder,
        confirmPayment,
        recordPayment
    } = useOrders();

    const [tempSearch, setTempSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const columns: Column<OrderResponse>[] = [
        {
            header: "ID",
            render: (order) => <span title={order.id} className="text-muted small">{order.id.split('-')[0]}...</span>
        },
        {
            header: "Date",
            render: (order) => <span className="small">{new Date(order.createdAt).toLocaleDateString("vi-VN")} {new Date(order.createdAt).toLocaleTimeString("vi-VN")}</span>
        },
        {
            header: "Customer",
            render: (order) => (
                <div className="d-flex flex-column">
                    <span className="fw-bold section-title" style={{ fontSize: '0.9rem' }}>{order.shippingName}</span>
                    <span className="text-muted small">{order.shippingPhone}</span>
                </div>
            )
        },
        {
            header: "Total",
            render: (order) => <span className="fw-bold text-danger">{order.totalAmount.toLocaleString("vi-VN")}đ</span>
        },
        {
            header: "Status",
            render: (order) => {
                let badgeClass = "bg-secondary";
                if (order.status === "COMPLETED") badgeClass = "bg-success";
                else if (order.status === "PENDING") badgeClass = "bg-warning text-dark";
                else if (order.status === "CANCELLED") badgeClass = "bg-danger";
                else if (order.status === "PENDING_PAYMENT") badgeClass = "bg-info text-dark";
                else if (order.status === "SHIPPING") badgeClass = "bg-primary";

                return <span className={`badge ${badgeClass}`}>{order.status}</span>;
            }
        },
        {
            header: "Action",
            render: (order) => (
                <button className="btn btn-sm btn-outline-primary" onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(order);
                }}>
                    View
                </button>
            )
        }
    ];

    // --- Handlers ---
    const handleEnterKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setKeyword(tempSearch);
            setPage(0);
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds((prev) => prev.filter((x) => x !== id));
        else setSelectedIds((prev) => [...prev, id]);
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) setSelectedIds(orders.map((o) => o.id));
        else setSelectedIds([]);
    };

    const handleViewDetail = (order: OrderResponse) => {
        setSelectedOrder(order);
        openDetail();
    }

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
            await cancelOrder(selectedOrder.id, "Admin cancelled from dashboard");
            setToastType("success");
            setToastMsg("Cancelled order successfully");
            closeDetail();
        } catch (e: any) {
            setToastType("error");
            setToastMsg(e.response?.data?.message || "Failed to cancel order");
        }
    }

    const handleConfirmPayment = async () => {
        if (!selectedOrder) return;
        try {
            await confirmPayment(selectedOrder.id);
            setToastType("success");
            setToastMsg("Payment confirmed");
            closeDetail();
        } catch (e: any) {
            setToastType("error");
            setToastMsg(e.response?.data?.message || "Failed to confirm payment");
        }
    }

    const openRecordPayment = () => {
        if (!selectedOrder) return;
        setPaymentForm({ amount: selectedOrder.totalAmount - (selectedOrder.paidAmount || 0), transactionId: "" });
        closeDetail(); // Close detail, open payment modal. Or keep detail open? Better separate.
        openPaymentModal();
    }

    const handleRecordPayment = async () => {
        if (!selectedOrder) return;
        try {
            await recordPayment(selectedOrder.id, paymentForm.amount, paymentForm.transactionId);
            setToastType("success");
            setToastMsg("Payment recorded");
            closePaymentModal();
        } catch (e: any) {
            setToastType("error");
            setToastMsg(e.response?.data?.message || "Failed to record payment");
        }
    }

    // Render Modal Content
    const renderDetailContent = () => {
        if (!selectedOrder) return null;
        return (
            <div className="container-fluid">
                <div className="row mb-3">
                    <div className="col-6">
                        <h6 className="fw-bold border-bottom pb-2">Shipping Info</h6>
                        <p className="mb-1"><strong>Name:</strong> {selectedOrder.shippingName}</p>
                        <p className="mb-1"><strong>Phone:</strong> {selectedOrder.shippingPhone}</p>
                        <p className="mb-1"><strong>Email:</strong> {selectedOrder.shippingEmail}</p>
                        <p className="mb-1"><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                    </div>
                    <div className="col-6">
                        <h6 className="fw-bold border-bottom pb-2">Order Info</h6>
                        <p className="mb-1"><strong>ID:</strong> <small>{selectedOrder.id}</small></p>
                        <p className="mb-1"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}</p>
                        <p className="mb-1"><strong>Status:</strong> {selectedOrder.status}</p>
                        <p className="mb-1"><strong>Payment:</strong> {selectedOrder.paidAmount ? selectedOrder.paidAmount.toLocaleString() : 0} / {selectedOrder.totalAmount.toLocaleString()} đ</p>
                    </div>
                </div>

                <h6 className="fw-bold border-bottom pb-2 mt-3">Order Items</h6>
                <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Product</th>
                                <th className="text-end">Price</th>
                                <th className="text-center">Qty</th>
                                <th className="text-end">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.orderItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.productName || item.productId}</td>
                                    <td className="text-end">{item.currencyPrice.toLocaleString("vi-VN")}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end">{(item.currencyPrice * item.quantity).toLocaleString("vi-VN")}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={3} className="text-end fw-bold">Shipping Fee</td>
                                <td className="text-end">{selectedOrder.shippingFee.toLocaleString("vi-VN")}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="text-end fw-bold text-danger">TOTAL</td>
                                <td className="text-end fw-bold text-danger">{selectedOrder.totalAmount.toLocaleString("vi-VN")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {selectedOrder.status === 'CANCELLED' && (
                    <div className="alert alert-danger mt-3">
                        <strong>Cancelled Reason:</strong> {selectedOrder.cancelReason} <br />
                        <small>{selectedOrder.cancelNote}</small>
                    </div>
                )}
            </div>
        );
    }

    // Detail Modal Footer with Payment Actions
    const renderModalFooter = () => {
        if (!selectedOrder) return null;
        const canCancel = ['PENDING', 'PENDING_PAYMENT'].includes(selectedOrder.status);
        const canPay = ['PENDING', 'PENDING_PAYMENT'].includes(selectedOrder.status);

        return (
            <div>
                <button type="button" className="btn btn-secondary me-2" onClick={closeDetail}>
                    Close
                </button>
                {canPay && (
                    <>
                        <button type="button" className="btn btn-warning me-2" onClick={openRecordPayment}>
                            Record Payment
                        </button>
                        <button type="button" className="btn btn-primary me-2" onClick={handleConfirmPayment}>
                            Confirm Paid
                        </button>
                    </>
                )}
                {canCancel && (
                    <button type="button" className="btn btn-danger" onClick={handleCancelOrder}>
                        Cancel Order
                    </button>
                )}
            </div>
        );
    }

    return (
        <section className="row container-fluid align-items-start mt-5">
            {/* Sidebar / Tools */}
            <aside className="col-2 d-flex flex-column gap-2">
                <span className="h4 fw-bold mt-3 mb-1">Order Management</span>

                <div className="card shadow-sm border">
                    <div className="card-header bg-light fw-bold small text-uppercase">Search</div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <input
                                className="form-control"
                                placeholder="Keyword..."
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                                onKeyDown={handleEnterKeydown}
                            />
                        </li>
                    </ul>
                </div>

                <div className="card">
                    <div className="card-header">Filter Status</div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <select className="form-select" onChange={(e) => setStatus(e.target.value || null)}>
                                <option value="">All Status</option>
                                <option value="PENDING">PENDING</option>
                                <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                                <option value="CONFIRMED_PAYMENT">CONFIRMED_PAYMENT</option>
                                <option value="SHIPPING">SHIPPING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Table */}
            <div className="col-10 mt-3">
                <TableCus
                    data={orders}
                    columns={columns}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectOne={handleSelectOne}
                    maxHeight={"600px"}
                />

                <Pagination currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.size}
                    totalElements={pagination.totalElements}
                    onPageChange={setPage}
                    onSizeChange={setSize}
                />
            </div>

            {/* Detail Modal */}
            <ModalClient id={DETAIL_MODAL_ID} footer={renderModalFooter()} title="Order Detail" size="lg">
                {renderDetailContent()}
            </ModalClient>

            {/* Payment Modal */}
            <ModalClient id={PAYMENT_MODAL_ID} title="Record Payment"
                footer={
                    <div>
                        <button type="button" className="btn btn-secondary me-2" onClick={closePaymentModal}>Cancel</button>
                        <button type="button" className="btn btn-success" onClick={handleRecordPayment}>Submit</button>
                    </div>
                }
            >
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-control"
                        value={paymentForm.amount}
                        onChange={e => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Transaction ID</label>
                    <input type="text" className="form-control"
                        value={paymentForm.transactionId}
                        onChange={e => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                    />
                </div>
            </ModalClient>

            {toastMsg && (
                <Toast
                    message={toastMsg}
                    type={toastType}
                    position="top-center"
                    onClose={() => setToastMsg(null)}
                />
            )}
        </section>
    );
}