import React, { useRef } from "react";
import "./PaymentPage.css"; // لو عندك ملف CSS مخصص

function PaymentPage() {
  const formRef = useRef(null);

  const handleFakePayment = (e) => {
    e.preventDefault();

    const form = formRef.current;
    const name = form.name.value;
    const card = form.card.value;
    // const date = form.date.value;
    // const cvv = form.cvv.value;

    alert(`✅ تم الدفع الوهمي بنجاح!\n\nالاسم: ${name}\nرقم البطاقة: ${card}`);

    form.reset(); // تصفير النموذج بعد الدفع
  };

  return (
    <section className="payment-section">
      <div className="payment-box">
        <h2>نموذج الدفع التجريبي</h2>
        <form ref={formRef} onSubmit={handleFakePayment}>
          <div className="form-group">
            <label htmlFor="name">الاسم على البطاقة:</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className="form-group">
            <label htmlFor="card">رقم البطاقة:</label>
            <input type="text" id="card" name="card" required />
          </div>

          <div className="form-group">
            <label htmlFor="date">تاريخ الانتهاء:</label>
            <input type="text" id="date" name="date" placeholder="MM/YY" required />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" required />
          </div>

          <button type="submit" className="pay-button">ادفع الآن</button>
        </form>
      </div>
    </section>
  );
}

export default PaymentPage;
