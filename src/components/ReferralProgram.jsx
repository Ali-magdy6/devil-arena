import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import '../style.css';

const ReferralProgram = ({ lang }) => {
  const { user, referralDiscounts, addPoints } = useGamification();
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [referralHistory, setReferralHistory] = useState([]);

  useEffect(() => {
    // Generate referral code if user doesn't have one
    if (!user.referralCode) {
      const code = generateReferralCode();
      setReferralCode(code);
    } else {
      setReferralCode(user.referralCode);
    }
  }, [user.referralCode]);

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareReferral = (platform) => {
    const message = lang === 'ar' 
      ? `انضم إلى Devil Arena! استخدم كود الإحالة ${referralCode} واحصل على خصم ${referralDiscounts.referee * 100}%!`
      : `Join Devil Arena! Use referral code ${referralCode} and get ${referralDiscounts.referee * 100}% off!`;
    
    const url = window.location.origin;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        copyToClipboard();
        break;
    }
  };

  const applyReferralCode = (code) => {
    // Simulate applying referral code
    if (code && code.length === 8) {
      addPoints(200); // Give points for successful referral
      setReferralHistory(prev => [...prev, {
        id: Date.now(),
        code: code,
        date: new Date().toLocaleDateString(),
        status: 'success'
      }]);
      
      if (window.showNotification) {
        window.showNotification(
          lang === 'ar' ? 'تم تطبيق كود الإحالة!' : 'Referral code applied!',
          lang === 'ar' ? 'لقد حصلت على 200 نقطة' : 'You earned 200 points'
        );
      }
    }
  };

  return (
    <div className="referral-program-container">
      <div className="referral-card">
        <div className="referral-header">
          <h3>{lang === 'ar' ? 'برنامج الإحالة' : 'Referral Program'}</h3>
          <div className="referral-icon">🎁</div>
        </div>

        <div className="referral-content">
          {/* Your Referral Code */}
          <div className="referral-section">
            <h4>{lang === 'ar' ? 'كود الإحالة الخاص بك' : 'Your Referral Code'}</h4>
            <div className="referral-code-display">
              <div className="code-box">
                <span className="code-text">{referralCode}</span>
                <button 
                  className="copy-btn"
                  onClick={copyToClipboard}
                >
                  {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}
                </button>
              </div>
            </div>
          </div>

          {/* Referral Benefits */}
          <div className="referral-section">
            <h4>{lang === 'ar' ? 'مزايا الإحالة' : 'Referral Benefits'}</h4>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">👤</div>
                <div className="benefit-text">
                  <h5>{lang === 'ar' ? 'أنت (المُحِيل)' : 'You (Referrer)'}</h5>
                  <p>{lang === 'ar' ? 'احصل على خصم' : 'Get'} {referralDiscounts.referrer * 100}% {lang === 'ar' ? 'على حجزك التالي' : 'on your next booking'}</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">👥</div>
                <div className="benefit-text">
                  <h5>{lang === 'ar' ? 'صديقك (المُحال)' : 'Your Friend (Referee)'}</h5>
                  <p>{lang === 'ar' ? 'احصل على خصم' : 'Get'} {referralDiscounts.referee * 100}% {lang === 'ar' ? 'على حجزهم الأول' : 'on their first booking'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="referral-section">
            <h4>{lang === 'ar' ? 'شارك مع الأصدقاء' : 'Share with Friends'}</h4>
            <div className="share-buttons">
              <button 
                className="share-btn whatsapp"
                onClick={() => shareReferral('whatsapp')}
              >
                <span className="share-icon">📱</span>
                WhatsApp
              </button>
              <button 
                className="share-btn facebook"
                onClick={() => shareReferral('facebook')}
              >
                <span className="share-icon">📘</span>
                Facebook
              </button>
              <button 
                className="share-btn twitter"
                onClick={() => shareReferral('twitter')}
              >
                <span className="share-icon">🐦</span>
                Twitter
              </button>
              <button 
                className="share-btn copy"
                onClick={() => shareReferral('copy')}
              >
                <span className="share-icon">📋</span>
                {lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Apply Referral Code */}
          <div className="referral-section">
            <h4>{lang === 'ar' ? 'استخدم كود إحالة' : 'Use Referral Code'}</h4>
            <div className="apply-referral">
              <input
                type="text"
                placeholder={lang === 'ar' ? 'أدخل كود الإحالة' : 'Enter referral code'}
                className="referral-input"
                maxLength="8"
                onChange={(e) => setReferralCode(e.target.value)}
              />
              <button 
                className="apply-btn"
                onClick={() => applyReferralCode(referralCode)}
              >
                {lang === 'ar' ? 'تطبيق' : 'Apply'}
              </button>
            </div>
          </div>

          {/* Referral History */}
          {referralHistory.length > 0 && (
            <div className="referral-section">
              <h4>{lang === 'ar' ? 'تاريخ الإحالات' : 'Referral History'}</h4>
              <div className="referral-history">
                {referralHistory.map((referral) => (
                  <div key={referral.id} className="history-item">
                    <span className="referral-code">{referral.code}</span>
                    <span className="referral-date">{referral.date}</span>
                    <span className={`referral-status ${referral.status}`}>
                      {referral.status === 'success' ? 
                        (lang === 'ar' ? 'نجح' : 'Success') : 
                        (lang === 'ar' ? 'فشل' : 'Failed')
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referral Stats */}
          <div className="referral-stats">
            <div className="stat-item">
              <span className="stat-number">{user.badges.filter(badge => badge === 'referral').length}</span>
              <span className="stat-label">{lang === 'ar' ? 'إحالات ناجحة' : 'Successful Referrals'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.badges.filter(badge => badge === 'referral').length * 200}</span>
              <span className="stat-label">{lang === 'ar' ? 'نقاط مكتسبة' : 'Points Earned'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
