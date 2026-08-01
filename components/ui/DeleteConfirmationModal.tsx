"use client";

import { useEffect, useRef } from "react";
import { b, type Lang } from "../../lib/content";

const local = (value: { ar: string; en: string } | string, lang: Lang) =>
  typeof value === "string" ? value : value[lang];

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  lang: Lang;
  title: string;
  itemType: string;
  itemName: string;
  affectedSummary?: string[];
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmationModal({
  isOpen,
  lang,
  title,
  itemType,
  itemName,
  affectedSummary = [],
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const t = {
    confirm: local(b("تأكيد الحذف النهائي", "Confirm deletion"), lang),
    cancel: local(b("إلغاء", "Cancel"), lang),
    warning: local(b("هذا الإجراء سينفذ حذفًا نهائيًا ولا يمكن التراجع عنه.", "This action is permanent and cannot be undone."), lang),
    affectedHeader: local(b("العناصر التابعة المتأثرة:", "Affected dependent entities:"), lang),
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="modal-content card-role-danger" ref={dialogRef}>
        <div className="modal-header">
          <span className="modal-badge">⚠️ {itemType}</span>
          <h2 id="delete-dialog-title">{title}</h2>
        </div>
        <p className="modal-body">
          <strong>{itemName}</strong>
          <br />
          <span>{t.warning}</span>
        </p>

        {affectedSummary.length > 0 && (
          <div className="modal-affected-list">
            <small>{t.affectedHeader}</small>
            <ul>
              {affectedSummary.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="secondary"
            onClick={onCancel}
          >
            {t.cancel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className="danger-button"
            onClick={onConfirm}
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
