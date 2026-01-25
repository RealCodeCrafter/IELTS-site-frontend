import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { paymentsApi, PaymentHistoryItem } from '../api/payments';
import api from '../api/client';
import Toast from '../components/Toast';

export default function PaymentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [topUpAmount, setTopUpAmount] = useState<number>(10000);
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [paymentStartTime, setPaymentStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(30 * 60); // 30 minutes in seconds
  const [bankCardInfo, setBankCardInfo] = useState<{ cardNumber: string; cardholder: string; bankName: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBalance();
    loadPaymentHistory();
    loadBankCardInfo();
  }, [user, navigate]);

  const loadBankCardInfo = async () => {
    try {
      const response = await api.get('/payments/bank-card');
      setBankCardInfo(response.data);
    } catch (err) {
      console.error('Error loading bank card info:', err);
      // Fallback to default
      setBankCardInfo({
        cardNumber: '8600 1234 5678 9012',
        cardholder: 'BANDMASTER LLC',
        bankName: 'Bank Name',
      });
    }
  };

  const loadBalance = async () => {
    try {
      const info = await paymentsApi.getUserAccess();
      setBalance(Number(info.balance) || 0);
    } catch (err) {
      console.error('Error loading balance:', err);
      setBalance(0);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      const history = await paymentsApi.getPaymentHistory();
      setPaymentHistory(history);
    } catch (err) {
      console.error('Error loading payment history:', err);
    }
  };

  const handleStartManualPayment = () => {
    if (topUpAmount < 10000) {
      setToast({
        message: 'Minimum top-up amount is 10,000 UZS',
        type: 'warning',
      });
      return;
    }
    setShowManualPayment(true);
    setPaymentStartTime(new Date());
    setTimeRemaining(30 * 60); // 30 minutes
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setToast({
          message: 'Please upload an image file',
          type: 'error',
        });
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitManualPayment = async () => {
    if (!user || !screenshot) {
      setToast({
        message: 'Please upload a payment screenshot',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('amount', topUpAmount.toString());
      formData.append('description', `Balance top-up: ${topUpAmount} UZS`);

      const response = await api.post('/payments/manual/create', formData);

      setToast({
        message: response.data.ocrResult.message,
        type: response.data.ocrResult.success ? 'success' : 'info',
      });

      if (response.data.ocrResult.success) {
        // Reload balance
        await loadBalance();
        await loadPaymentHistory();
        setShowManualPayment(false);
        setScreenshot(null);
        setScreenshotPreview(null);
        setPaymentStartTime(null);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setToast({
        message: err.response?.data?.message || 'Error processing payment. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Timer for payment
  useEffect(() => {
    if (!showManualPayment || !paymentStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - paymentStartTime.getTime()) / 1000);
      const remaining = 30 * 60 - elapsed;
      if (remaining <= 0) {
        setTimeRemaining(0);
        setToast({
          message: 'Payment time has expired. Please start a new payment.',
          type: 'warning',
        });
        setShowManualPayment(false);
        setScreenshot(null);
        setScreenshotPreview(null);
        setPaymentStartTime(null);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showManualPayment, paymentStartTime]);

  return (
    <div className="layout">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="card">
        <div className="section-title">💰 Balance & Payments</div>
        <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
          Each exam attempt costs <strong>10,000 UZS</strong>. Top up your balance by making a bank transfer and uploading a payment screenshot. Our system will automatically verify your payment.
        </p>
        
        {/* Current Balance */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          color: 'white',
        }}>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Current Balance</div>
          <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: 4 }}>
            {balance.toLocaleString('en-US')} UZS
          </div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            {balance >= 10000 ? '✅ Enough balance to take exams' : '⚠️ Insufficient balance (minimum 10,000 UZS per exam)'}
          </div>
        </div>

        {/* Top-up Section */}
        {!showManualPayment ? (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Top Up Balance</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              {[10000, 25000, 50000, 100000, 200000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTopUpAmount(amount)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: topUpAmount === amount ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: topUpAmount === amount ? '#eff6ff' : 'white',
                    color: topUpAmount === amount ? '#2563eb' : '#0f172a',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  {amount.toLocaleString('en-US')} UZS
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <input
                type="number"
                className="input"
                placeholder="Or enter custom amount"
                value={topUpAmount || ''}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                min={10000}
                style={{ flex: 1 }}
              />
              <button
                className="btn"
                onClick={handleStartManualPayment}
                disabled={loading || topUpAmount < 10000}
                style={{ minWidth: '150px' }}
              >
                Start Payment
              </button>
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              Minimum top-up: 10,000 UZS. Each exam costs 10,000 UZS.
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              border: '2px solid #f59e0b',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: '#92400e' }}>
                ⚠️ Important: Screenshot Required
              </div>
              <div style={{ fontSize: 14, color: '#78350f', lineHeight: 1.6 }}>
                You must upload a payment screenshot to complete the transaction. If you cannot provide a screenshot, please do not proceed with the payment.
              </div>
              <div style={{ marginTop: 16, padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', fontSize: 13 }}>
                <strong>Need help?</strong> Contact us:
                <div style={{ marginTop: 8 }}>
                  📞 Phone: <a href={`tel:${import.meta.env.VITE_ADMIN_PHONE || '+998901234567'}`} style={{ color: '#92400e', textDecoration: 'underline' }}>
                    {import.meta.env.VITE_ADMIN_PHONE || '+998 90 123 45 67'}
                  </a>
                </div>
                <div>
                  💬 Telegram: <a 
                    href={`https://t.me/${(import.meta.env.VITE_ADMIN_TELEGRAM || '@bandmaster_support').replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#92400e', textDecoration: 'underline' }}
                  >
                    {import.meta.env.VITE_ADMIN_TELEGRAM || '@bandmaster_support'}
                  </a>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Complete Payment</h3>
            
            {/* Payment Timer */}
            <div style={{
              background: '#fee2e2',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, color: '#991b1b', marginBottom: 8, fontWeight: 600 }}>
                ⏱️ Time Remaining
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#dc2626' }}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Bank Card Info */}
            {bankCardInfo && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Bank Card Information</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: '#475569' }}>
                  <div><strong>Card Number:</strong> {bankCardInfo.cardNumber}</div>
                  <div><strong>Cardholder:</strong> {bankCardInfo.cardholder}</div>
                  <div><strong>Bank:</strong> {bankCardInfo.bankName}</div>
                  <div><strong>Amount:</strong> {topUpAmount.toLocaleString('en-US')} UZS</div>
                  <div style={{ marginTop: 12, padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <strong>Instructions:</strong>
                    <ol style={{ margin: '8px 0 0 20px', padding: 0 }}>
                      <li>Transfer {topUpAmount.toLocaleString('en-US')} UZS to the card above</li>
                      <li>Take a screenshot of the successful payment confirmation</li>
                      <li>Upload the screenshot below</li>
                      <li>Click "I Made Payment" to submit</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Screenshot Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                Payment Screenshot (Required)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                style={{ marginBottom: 12 }}
              />
              {screenshotPreview && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn"
                onClick={handleSubmitManualPayment}
                disabled={loading || !screenshot || timeRemaining <= 0}
                style={{ flex: 1 }}
              >
                {loading ? 'Processing...' : '✅ I Made Payment'}
              </button>
              <button
                className="btn ghost"
                onClick={() => {
                  setShowManualPayment(false);
                  setScreenshot(null);
                  setScreenshotPreview(null);
                  setPaymentStartTime(null);
                }}
                disabled={loading}
                style={{ minWidth: '120px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Payment History</h3>
          {paymentHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No payment history yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  style={{
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      {payment.amount.toLocaleString('en-US')} {payment.currency}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>
                      {new Date(payment.createdAt).toLocaleString('en-US')}
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: 12,
                    fontWeight: 600,
                    background: payment.status === 'paid' ? '#dcfce7' : payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                    color: payment.status === 'paid' ? '#166534' : payment.status === 'pending' ? '#92400e' : '#991b1b',
                  }}>
                    {payment.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
