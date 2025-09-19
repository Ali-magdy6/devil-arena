import React, { useState, useEffect, useRef } from 'react';
import './LiveChat.css';

const LiveChat = ({ t, lang, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t.welcomeMessage || "مرحبًا! كيف يمكنني مساعدتك اليوم؟",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Simulate typing indicator
  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  // Bot responses based on keywords
  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('حجز') || lowerMessage.includes('booking')) {
      return t.bookingHelp || "يمكنك الحجز من خلال النقر على زر 'احجز الآن' في الصفحة الرئيسية. ستحتاج إلى اختيار التاريخ والوقت وإدخال بياناتك.";
    }
    
    if (lowerMessage.includes('سعر') || lowerMessage.includes('price') || lowerMessage.includes('تكلفة')) {
      return t.priceInfo || "سعر الحجز هو 150 جنيه مصري للساعة الواحدة. يمكنك الدفع نقداً أو بالبطاقة الائتمانية.";
    }
    
    if (lowerMessage.includes('موقع') || lowerMessage.includes('location') || lowerMessage.includes('عنوان')) {
      return t.locationInfo || "ديفيل أرينا يقع في 123 شارع كرة القدم، القاهرة، مصر. يمكنك العثور على الموقع على الخريطة في قسم 'الموقع'.";
    }
    
    if (lowerMessage.includes('وقت') || lowerMessage.includes('time') || lowerMessage.includes('ساعات')) {
      return t.hoursInfo || "نحن نعمل من الساعة 6:00 صباحاً حتى 11:00 مساءً، سبعة أيام في الأسبوع.";
    }
    
    if (lowerMessage.includes('إلغاء') || lowerMessage.includes('cancel')) {
      return t.cancelInfo || "يمكنك إلغاء الحجز قبل 24 ساعة من الموعد المحدد. يرجى الاتصال بنا على الرقم الموجود في قسم 'تواصل معنا'.";
    }
    
    if (lowerMessage.includes('شكر') || lowerMessage.includes('thank')) {
      return t.thanksResponse || "شكراً لك! نحن سعداء لخدمتك. هل هناك أي شيء آخر يمكنني مساعدتك فيه؟";
    }
    
    // Default responses
    const defaultResponses = [
      t.defaultResponse1 || "أفهم سؤالك. هل يمكنك توضيح المزيد؟",
      t.defaultResponse2 || "يمكنني مساعدتك في الحجز، الأسعار، الموقع، أوقات العمل، أو أي استفسار آخر.",
      t.defaultResponse3 || "هل تريد معرفة المزيد عن خدماتنا؟ يمكنني إرشادك إلى الأقسام المناسبة في الموقع."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !isOnline) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    simulateTyping();

    // Simulate bot response after delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickReplies = [
    t.quickReply1 || "كيف يمكنني الحجز؟",
    t.quickReply2 || "ما هو سعر الحجز؟",
    t.quickReply3 || "أين موقعكم؟",
    t.quickReply4 || "ما هي أوقات العمل؟"
  ];

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isOpen) {
    return (
      <div className="chat-toggle" onClick={onToggle}>
        <div className="chat-icon">
          💬
        </div>
        <div className="chat-badge">
          <span className="online-indicator"></span>
        </div>
        <div className="chat-tooltip">
          {t.chatTooltip || "تحدث معنا"}
        </div>
      </div>
    );
  }

  return (
    <div className="live-chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <h4>{t.chatTitle || "الدعم الفني المباشر"}</h4>
          <div className="status">
            <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></span>
            <span className="status-text">
              {isOnline ? (t.online || "متصل") : (t.offline || "غير متصل")}
            </span>
          </div>
        </div>
        <button className="close-btn" onClick={onToggle}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-replies">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            className="quick-reply-btn"
            onClick={() => handleQuickReply(reply)}
            disabled={!isOnline}
          >
            {reply}
          </button>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.inputPlaceholder || "اكتب رسالتك هنا..."}
            disabled={!isOnline}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || !isOnline}
            className="send-btn"
          >
            📤
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;
