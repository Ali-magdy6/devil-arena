import React, { useState, useEffect } from 'react';
import './SocialFeed.css';

const SocialFeed = ({ t }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [sharedPosts, setSharedPosts] = useState(new Set());

  // Mock social media posts data
  const mockPosts = [
    {
      id: 1,
      platform: 'instagram',
      username: 'devil_arena_official',
      userAvatar: '/images/logo-removebg-preview.png',
      content: 'مباراة رائعة اليوم في ديفيل أرينا! 🏆⚽',
      image: '/images/playground.jpg',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 45,
      comments: 12,
      shares: 8,
      hashtags: ['#devilarena', '#football', '#cairo', '#sports']
    },
    {
      id: 2,
      platform: 'facebook',
      username: 'Devil Arena',
      userAvatar: '/images/logo-removebg-preview.png',
      content: 'تحديث جديد: إضافة نظام إضاءة LED متطور للملعب! 💡✨',
      image: '/images/playground.jpg',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      likes: 78,
      comments: 23,
      shares: 15,
      hashtags: ['#upgrade', '#led', '#technology']
    },
    {
      id: 3,
      platform: 'twitter',
      username: '@DevilArena',
      userAvatar: '/images/logo-removebg-preview.png',
      content: 'مسابقة اليوم: من سيفوز بكأس ديفيل أرينا؟ 🏆\n\nشاركنا توقعاتك! #مسابقة #كأس',
      image: null,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      likes: 156,
      comments: 89,
      shares: 34,
      hashtags: ['#مسابقة', '#كأس', '#توقعات']
    },
    {
      id: 4,
      platform: 'instagram',
      username: 'devil_arena_official',
      userAvatar: '/images/logo-removebg-preview.png',
      content: 'ورشة عمل لتعليم أساسيات كرة القدم للأطفال 👶⚽',
      image: '/images/playground.jpg',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      likes: 92,
      comments: 18,
      shares: 25,
      hashtags: ['#workshop', '#kids', '#football', '#training']
    },
    {
      id: 5,
      platform: 'facebook',
      username: 'Devil Arena',
      userAvatar: '/images/logo-removebg-preview.png',
      content: 'شكراً لجميع عملائنا الكرام على ثقتهم في ديفيل أرينا! 🙏',
      image: null,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      likes: 203,
      comments: 45,
      shares: 67,
      hashtags: ['#thankyou', '#customers', '#gratitude']
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return t.minutesAgo?.replace('{count}', minutes) || `${minutes} دقيقة`;
    } else if (hours < 24) {
      return t.hoursAgo?.replace('{count}', hours) || `${hours} ساعة`;
    } else {
      return t.daysAgo?.replace('{count}', days) || `${days} يوم`;
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId ? { ...post, likes: post.likes - 1 } : post
          )
        );
      } else {
        newLiked.add(postId);
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }
      return newLiked;
    });
  };

  const handleShare = (postId) => {
    setSharedPosts(prev => {
      const newShared = new Set(prev);
      if (!newShared.has(postId)) {
        newShared.add(postId);
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId ? { ...post, shares: post.shares + 1 } : post
          )
        );
      }
      return newShared;
    });
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: '📷',
      facebook: '📘',
      twitter: '🐦',
      tiktok: '🎵'
    };
    return icons[platform] || '📱';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: '#E4405F',
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      tiktok: '#000000'
    };
    return colors[platform] || '#666';
  };

  // Show all posts without filtering
  const filteredPosts = posts;

  if (loading) {
    return (
      <div className="social-feed loading">
        <div className="loading-spinner"></div>
        <p>{t.loadingPosts || 'جاري تحميل المنشورات...'}</p>
      </div>
    );
  }

  return (
    <div className="social-feed">
      <div className="feed-header">
        <h2 className="feed-title">
          {t.socialFeedTitle || 'أحدث المنشورات'}
        </h2>
        <p className="feed-subtitle">
          {t.socialFeedSubtitle || 'تابع آخر أخبار وأنشطة ديفيل أرينا'}
        </p>
      </div>


      <div className="posts-container">
        {filteredPosts.map(post => (
          <div key={post.id} className="social-post">
            <div className="post-header">
              <div className="user-info">
                <img 
                  src={post.userAvatar} 
                  alt={post.username}
                  className="user-avatar"
                />
                <div className="user-details">
                  <h4 className="username">{post.username}</h4>
                  <div className="post-meta">
                    <span 
                      className="platform"
                      style={{ color: getPlatformColor(post.platform) }}
                    >
                      {getPlatformIcon(post.platform)} {post.platform}
                    </span>
                    <span className="timestamp">
                      {formatTimeAgo(post.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="post-content">
              <p className="post-text">{post.content}</p>
              
              {post.image && (
                <div className="post-image-container">
                  <img 
                    src={post.image} 
                    alt="Post content"
                    className="post-image"
                  />
                </div>
              )}

              {post.hashtags.length > 0 && (
                <div className="hashtags">
                  {post.hashtags.map((hashtag, index) => (
                    <span key={index} className="hashtag">
                      #{hashtag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="post-actions">
              <button 
                className={`action-btn like-btn ${likedPosts.has(post.id) ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <span className="action-icon">
                  {likedPosts.has(post.id) ? '❤️' : '🤍'}
                </span>
                <span className="action-count">{post.likes}</span>
              </button>

              <button className="action-btn comment-btn">
                <span className="action-icon">💬</span>
                <span className="action-count">{post.comments}</span>
              </button>

              <button 
                className={`action-btn share-btn ${sharedPosts.has(post.id) ? 'shared' : ''}`}
                onClick={() => handleShare(post.id)}
              >
                <span className="action-icon">📤</span>
                <span className="action-count">{post.shares}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="no-posts">
          <div className="no-posts-icon">📭</div>
          <p>{t.noPosts || 'لا توجد منشورات متاحة'}</p>
        </div>
      )}

      <div className="feed-footer">
        <button className="load-more-btn">
          {t.loadMore || 'تحميل المزيد'}
        </button>
      </div>
    </div>
  );
};

export default SocialFeed;
