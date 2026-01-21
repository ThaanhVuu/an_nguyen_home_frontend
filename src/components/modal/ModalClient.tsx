"use client";

import { useEffect, useRef } from "react";

type ModalProps = {
    id: string;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    onClose?: () => void;
};

export default function ModalClient({
                                  id,
                                  title,
                                  children,
                                  footer,
                                  onClose,
                              }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!modalRef.current) return;

        const handler = () => onClose?.();
        modalRef.current.addEventListener("hidden.bs.modal", handler);

        return () => {
            modalRef.current?.removeEventListener("hidden.bs.modal", handler);
        };
    }, [onClose]);

    return (
        <div
            ref={modalRef}
            className="modal fade"
            id={id}
            tabIndex={-1}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    {title && (
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            />
                        </div>
                    )}

                    <div className="modal-body">{children}</div>

                    {footer && <div className="modal-footer">{footer}</div>}

                </div>
            </div>
        </div>
    );
}
