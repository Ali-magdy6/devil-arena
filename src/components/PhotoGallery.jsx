import React, { useState, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import '../style.css';

const PhotoGallery = ({ lang }) => {
  const { photos, addPhoto } = useGamification();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Mock photos for demonstration
  const mockPhotos = [
    {
      id: 1,
      url: '/images/playground.jpg',
      title: lang === 'ar' ? 'لحظة مميزة في الملعب' : 'Special moment at the arena',
      date: '2024-01-15',
      likes: 24,
      author: 'Ahmed Ali',
      tags: ['arena', 'fun', 'friends']
    },
    {
      id: 2,
      url: '/images/playground.jpg',
      title: lang === 'ar' ? 'فريق الأبطال' : 'Team of Champions',
      date: '2024-01-10',
      likes: 18,
      author: 'Sarah Mohamed',
      tags: ['team', 'victory', 'champions']
    },
    {
      id: 3,
      url: '/images/playground.jpg',
      title: lang === 'ar' ? 'ليلة لا تُنسى' : 'Unforgettable Night',
      date: '2024-01-08',
      likes: 32,
      author: 'Omar Hassan',
      tags: ['night', 'memories', 'celebration']
    },
    {
      id: 4,
      url: '/images/playground.jpg',
      title: lang === 'ar' ? 'اللحظة الحاسمة' : 'The Decisive Moment',
      date: '2024-01-05',
      likes: 15,
      author: 'Fatima Ahmed',
      tags: ['action', 'decisive', 'moment']
    },
    {
      id: 5,
      url: '/images/playground.jpg',
      title: lang === 'ar' ? 'أصدقاء مدى الحياة' : 'Friends for Life',
      date: '2024-01-03',
      likes: 28,
      author: 'Youssef Ibrahim',
      tags: ['friends', 'bonding', 'lifetime']
    },
    {
      id: 6,
      url: '/images/playground.jpg',
      title: lang === 'ar' ? 'الانتصار الحلو' : 'Sweet Victory',
      date: '2024-01-01',
      likes: 41,
      author: 'Aisha Khalil',
      tags: ['victory', 'sweet', 'success']
    }
  ];

  const displayPhotos = photos.length > 0 ? photos : mockPhotos;

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(lang === 'ar' ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(lang === 'ar' ? 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت' : 'File size too large. Maximum 5MB');
      return;
    }

    setUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPhoto = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        title: file.name.split('.')[0],
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        author: 'You',
        tags: ['uploaded', 'new']
      };

      addPhoto(newPhoto);

      if (window.showNotification) {
        window.showNotification(
          lang === 'ar' ? 'تم رفع الصورة!' : 'Photo uploaded!',
          lang === 'ar' ? 'تم إضافة الصورة للمعرض' : 'Photo added to gallery'
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(lang === 'ar' ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading photo');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = (photoId) => {
    // Simulate like functionality
    console.log('Liked photo:', photoId);
  };

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="photo-gallery-container">
      <div className="gallery-header">
        <h3>{lang === 'ar' ? 'معرض الذكريات' : 'Memory Gallery'}</h3>
        <div className="gallery-actions">
          <button 
            className="upload-btn"
            onClick={triggerFileUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="loading-spinner"></span>
                {lang === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
              </>
            ) : (
              <>
                <span className="upload-icon">📸</span>
                {lang === 'ar' ? 'رفع صورة' : 'Upload Photo'}
              </>
            )}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div className="gallery-grid">
        {displayPhotos.map((photo) => (
          <div 
            key={photo.id} 
            className="photo-card"
            onClick={() => openPhotoModal(photo)}
          >
            <div className="photo-image">
              <img src={photo.url} alt={photo.title} />
              <div className="photo-overlay">
                <div className="photo-actions">
                  <button 
                    className="like-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                  >
                    ❤️ {photo.likes}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="photo-info">
              <h4 className="photo-title">{photo.title}</h4>
              <div className="photo-meta">
                <span className="photo-author">by {photo.author}</span>
                <span className="photo-date">{photo.date}</span>
              </div>
              <div className="photo-tags">
                {photo.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal-overlay" onClick={closePhotoModal}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPhoto.title}</h3>
              <button className="close-btn" onClick={closePhotoModal}>
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedPhoto.url} alt={selectedPhoto.title} />
              </div>
              
              <div className="modal-info">
                <div className="modal-meta">
                  <span className="modal-author">by {selectedPhoto.author}</span>
                  <span className="modal-date">{selectedPhoto.date}</span>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="modal-like-btn"
                    onClick={() => handleLike(selectedPhoto.id)}
                  >
                    ❤️ {selectedPhoto.likes} {lang === 'ar' ? 'إعجاب' : 'likes'}
                  </button>
                </div>
                
                <div className="modal-tags">
                  {selectedPhoto.tags.map((tag, index) => (
                    <span key={index} className="modal-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {displayPhotos.length === 0 && (
        <div className="empty-gallery">
          <div className="empty-icon">📷</div>
          <h4>{lang === 'ar' ? 'لا توجد صور بعد' : 'No photos yet'}</h4>
          <p>{lang === 'ar' ? 'كن أول من يشارك ذكرياته!' : 'Be the first to share your memories!'}</p>
          <button className="upload-first-btn" onClick={triggerFileUpload}>
            {lang === 'ar' ? 'رفع أول صورة' : 'Upload First Photo'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
