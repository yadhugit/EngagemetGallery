document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Configuration
    const config = {
        totalImages: 104,
        fileNamePattern: 'AY (NUM).jpg',
        assetsPath: 'assets/'
    };
    
    const galleryContainer = document.getElementById('gallery');
    const searchInput = document.getElementById('search');
    const photoCountElement = document.getElementById('photo-count');
    
    // Generate image data
    function generateImageData() {
        const imageData = [];
        
        for (let i = 1; i <= config.totalImages; i++) {
            const fileName = config.fileNamePattern.replace('NUM', i);
            const imagePath = config.assetsPath + fileName;
            
            imageData.push({
                id: i,
                name: fileName,
                path: imagePath,
                alt: `Engagement photo ${i}`
            });
        }
        
        return imageData;
    }
    
    // Load gallery
    function loadGallery() {
        galleryContainer.innerHTML = '<div class="loading-spinner"></div>';
        
        // Simulate loading delay
        setTimeout(() => {
            const images = generateImageData();
            renderGallery(images);
            initLightGallery();
            initEventListeners();
            updatePhotoCount(images.length);
        }, 800);
    }
    
    // Render gallery items
    function renderGallery(images) {
        galleryContainer.innerHTML = '';
        
        if (images.length === 0) {
            galleryContainer.innerHTML = '<p class="no-results">No photos found</p>';
            return;
        }
        
        images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-src', img.path);
            item.setAttribute('data-sub-html', `<h4>${img.name}</h4>`);
            
            const imgEl = document.createElement('img');
            imgEl.src = img.path;
            imgEl.alt = img.alt;
            imgEl.loading = 'lazy';
            
            // Add photo number indicator
            const photoNumber = document.createElement('div');
            photoNumber.className = 'photo-number';
            photoNumber.textContent = img.id;
            
            // Context menu for download
            imgEl.oncontextmenu = (e) => {
                e.preventDefault();
                downloadImage(img.path, img.name);
            };
            
            item.appendChild(imgEl);
            item.appendChild(photoNumber);
            galleryContainer.appendChild(item);
        });
    }
    
    // Download image
    function downloadImage(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            })
            .catch(err => {
                console.error('Download error:', err);
                // Fallback to opening in new tab if download fails
                window.open(url, '_blank');
            });
    }
    
    // Initialize lightGallery
    function initLightGallery() {
        lightGallery(galleryContainer, {
            selector: '.gallery-item',
            download: true,
            counter: true,
            getCaptionFromTitleOrAlt: false,
            subHtmlSelectorRelative: true
        });
    }
    
    // Update photo count display
    function updatePhotoCount(count) {
        photoCountElement.textContent = count;
    }
    
    // Initialize event listeners
    function initEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = galleryContainer.querySelectorAll('.gallery-item');
            let visibleCount = 0;
            
            items.forEach(item => {
                const number = item.querySelector('.photo-number').textContent;
                const altText = item.querySelector('img').alt.toLowerCase();
                const isVisible = number.includes(searchTerm) || altText.includes(searchTerm);
                
                item.style.display = isVisible ? 'block' : 'none';
                if (isVisible) visibleCount++;
            });
            
            updatePhotoCount(visibleCount);
            
            // Show no results message if all filtered out
            if (visibleCount === 0 && items.length > 0) {
                galleryContainer.innerHTML = '<p class="no-results">No matching photos found</p>';
            } else if (visibleCount > 0 && galleryContainer.querySelector('.no-results')) {
                renderGallery(generateImageData());
                initLightGallery();
            }
        });
    }
    
    // Load the gallery
    loadGallery();
});