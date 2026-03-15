// Initial portfolio data
const initialPortfolio = [
    {
        title: "Mobile App Design",
        category: "UI/UX",
        description: "A clean, modern mobile application design for a fitness tracking startup.",
        year: "2023",
        image: ""
    },
    {
        title: "Brand Identity",
        category: "Graphic Design",
        description: "Complete brand identity package for a sustainable fashion brand.",
        year: "2022",
        image: ""
    }
];

// DOM elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const portfolioContainer = document.getElementById('portfolio-container');
const addPortfolioBtn = document.getElementById('add-portfolio');
const previewContainer = document.getElementById('live-preview');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const fullscreenPreviewBtn = document.getElementById('fullscreen-preview');
const profileImageInput = document.getElementById('profile-image');
const imagePreview = document.getElementById('image-preview');

// Current state
let portfolioItems = [...initialPortfolio];
let profileImage = null;

// Initialize the editor
function initEditor() {
    // Render initial portfolio
    renderPortfolioItems();
    
    // Render initial preview
    updatePreview();
    
    // Set up tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
    });
    
    // Set up content editing
    document.querySelectorAll('#content-tab .form-control').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    // Profile image upload
    profileImageInput.addEventListener('change', handleProfileImageUpload);
    
    // Add portfolio button
    addPortfolioBtn.addEventListener('click', addNewPortfolioItem);
    
    // Preview buttons
    refreshPreviewBtn.addEventListener('click', updatePreview);
    fullscreenPreviewBtn.addEventListener('click', openFullscreenPreview);
    
    // Copy code button
    document.querySelector('.btn-outline').addEventListener('click', function() {
        copyCodeToClipboard();
    });
}

// Handle profile image upload
function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            profileImage = event.target.result;
            imagePreview.style.display = 'block';
            imagePreview.innerHTML = `<img src="${profileImage}" alt="Profile Preview">`;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

// Switch between tabs
function switchTab(e) {
    const tabId = this.getAttribute('data-tab');
    
    // Update active tab
    tabs.forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    
    // Show corresponding content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

// Render portfolio items
function renderPortfolioItems() {
    portfolioContainer.innerHTML = '';
    
    portfolioItems.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'portfolio-card';
        itemEl.innerHTML = `
            <div class="portfolio-header">
                <span class="portfolio-title">${index + 1}. ${item.title}</span>
                <div class="portfolio-actions">
                    <button class="portfolio-btn expand-portfolio" data-index="${index}">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button class="portfolio-btn remove-portfolio" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="portfolio-expanded">
                <div class="form-group">
                    <label class="form-label">Project Title</label>
                    <input type="text" class="form-control portfolio-title-input" data-index="${index}" value="${item.title}">
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <input type="text" class="form-control portfolio-category-input" data-index="${index}" value="${item.category}">
                </div>
                <div class="form-group">
                    <label class="form-label">Year</label>
                    <input type="text" class="form-control portfolio-year-input" data-index="${index}" value="${item.year}">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control portfolio-desc-input" data-index="${index}" rows="4">${item.description}</textarea>
                </div>
                <div class="form-group portfolio-image-upload">
                    <label class="form-label">Project Image</label>
                    <input type="file" class="form-control portfolio-image-input" data-index="${index}" accept="image/*">
                    ${item.image ? `<img src="${item.image}" class="portfolio-image-preview" style="display: block;">` : ''}
                </div>
            </div>
        `;
        
        portfolioContainer.appendChild(itemEl);
        
        // Set up expand/collapse
        const expandBtn = itemEl.querySelector('.expand-portfolio');
        const expandedContent = itemEl.querySelector('.portfolio-expanded');
        
        expandBtn.addEventListener('click', function() {
            expandedContent.classList.toggle('active');
            const icon = this.querySelector('i');
            if (expandedContent.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
        
        // Set up remove portfolio item
        itemEl.querySelector('.remove-portfolio').addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            portfolioItems.splice(index, 1);
            renderPortfolioItems();
            updatePreview();
        });
        
        // Set up portfolio item editing
        itemEl.querySelector('.portfolio-title-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            portfolioItems[index].title = this.value;
            updatePreview();
            // Update the portfolio header title
            const portfolioHeader = this.closest('.portfolio-card').querySelector('.portfolio-title');
            portfolioHeader.textContent = `${index + 1}. ${this.value}`;
        });
        
        itemEl.querySelector('.portfolio-category-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            portfolioItems[index].category = this.value;
            updatePreview();
        });
        
        itemEl.querySelector('.portfolio-year-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            portfolioItems[index].year = this.value;
            updatePreview();
        });
        
        itemEl.querySelector('.portfolio-desc-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            portfolioItems[index].description = this.value;
            updatePreview();
        });
        
        // Set up portfolio image upload
        const imageInput = itemEl.querySelector('.portfolio-image-input');
        const imagePreview = itemEl.querySelector('.portfolio-image-preview');
        
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const index = parseInt(this.getAttribute('data-index'));
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    portfolioItems[index].image = event.target.result;
                    if (imagePreview) {
                        imagePreview.src = event.target.result;
                        imagePreview.style.display = 'block';
                    } else {
                        const newPreview = document.createElement('img');
                        newPreview.src = event.target.result;
                        newPreview.className = 'portfolio-image-preview';
                        newPreview.style.display = 'block';
                        this.parentNode.appendChild(newPreview);
                    }
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

// Add new portfolio item
function addNewPortfolioItem() {
    portfolioItems.push({
        title: "New Project",
        category: "Design",
        description: "Describe your project here...",
        year: new Date().getFullYear().toString(),
        image: ""
    });
    renderPortfolioItems();
    updatePreview();
    
    // Scroll to the new item
    const lastItem = portfolioContainer.lastElementChild;
    lastItem.scrollIntoView({ behavior: 'smooth' });
    
    // Expand the new item
    const expandBtn = lastItem.querySelector('.expand-portfolio');
    const expandedContent = lastItem.querySelector('.portfolio-expanded');
    expandedContent.classList.add('active');
    const icon = expandBtn.querySelector('i');
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
}

// Update the preview
function updatePreview() {
    const yourName = document.getElementById('your-name').value;
    const profession = document.getElementById('profession').value;
    const aboutMe = document.getElementById('about-me').value;
    const socialLinks = document.getElementById('social-links').value.split(',');
    const contactEmail = document.getElementById('contact-email').value;
    
    previewContainer.innerHTML = `
        <div class="creative-content">
            <header class="creative-header">
                ${profileImage ? `<img src="${profileImage}" class="profile-image" alt="${yourName}">` : ''}
                <h1 class="creative-title">${yourName}</h1>
                <p class="creative-subtitle">${profession}</p>
                <div class="creative-social">
                    ${socialLinks.filter(link => link.trim()).map(link => `
                        <a href="https://${link.trim()}" class="social-link" target="_blank">
                            <i class="fab fa-${getSocialIcon(link.trim())}"></i>
                        </a>
                    `).join('')}
                </div>
            </header>
            
            <section class="creative-about">
                <h2 class="section-title">About Me</h2>
                <p class="section-content">${aboutMe}</p>
            </section>
            
            <section class="container">
                <h2 class="section-title">My Portfolio</h2>
                <div class="portfolio-grid">
                    ${portfolioItems.map(item => `
                        <div class="portfolio-item">
                            <div class="portfolio-image">
                                ${item.image ? 
                                    `<img src="${item.image}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;">` : 
                                    `<i class="fas fa-image" style="font-size: 3rem;"></i>`
                                }
                            </div>
                            <div class="portfolio-overlay">
                                <h3 class="portfolio-item-title">${item.title}</h3>
                                <p class="portfolio-item-category">${item.category} • ${item.year}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <footer class="creative-footer">
                <p>Let's work together! Contact me at <a href="mailto:${contactEmail}" style="color: white;">${contactEmail}</a></p>
            </footer>
        </div>
    `;
}

// Helper function to get social icon
function getSocialIcon(url) {
    if (url.includes('twitter.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('dribbble.com')) return 'dribbble';
    if (url.includes('behance.net')) return 'behance';
    if (url.includes('github.com')) return 'github';
    if (url.includes('linkedin.com')) return 'linkedin';
    return 'link';
}

// Open preview in fullscreen
function openFullscreenPreview() {
    const previewHtml = generateFullHtml();
    const newWindow = window.open('', '_blank');
    newWindow.document.write(previewHtml);
    newWindow.document.close();
}

// Generate full HTML for export
function generateFullHtml() {
    const yourName = document.getElementById('your-name').value;
    const profession = document.getElementById('profession').value;
    const aboutMe = document.getElementById('about-me').value;
    const socialLinks = document.getElementById('social-links').value.split(',');
    const contactEmail = document.getElementById('contact-email').value;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${yourName} | Creative Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #7c3aed;
            --secondary-color: #5b21b6;
            --text-color: #1f2937;
            --light-text: #6b7280;
            --border-color: #e5e7eb;
            --bg-color: #f9fafb;
            --card-bg: #ffffff;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            color: var(--text-color);
            line-height: 1.6;
            background-color: var(--bg-color);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        /* Header Styles */
        .creative-header {
            text-align: center;
            padding: 4rem 0;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
        }
        
        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            margin: 0 auto 1.5rem;
            display: block;
        }
        
        .creative-title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .creative-subtitle {
            font-size: 1.25rem;
            margin-bottom: 1.5rem;
            opacity: 0.9;
        }
        
        .creative-social {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .social-link {
            color: white;
            font-size: 1.25rem;
            transition: all 0.2s;
        }
        
        .social-link:hover {
            transform: translateY(-3px);
        }
        
        /* Content Sections */
        .creative-about {
            padding: 3rem 0;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .section-title {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: var(--primary-color);
            text-align: center;
        }
        
        .section-content {
            line-height: 1.8;
            color: var(--light-text);
            text-align: center;
        }
        
        /* Portfolio Grid */
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 3rem 0;
        }
        
        .portfolio-item {
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s;
            position: relative;
        }
        
        .portfolio-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .portfolio-image {
            height: 250px;
            background-color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--light-text);
        }
        
        .portfolio-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 1rem;
            transform: translateY(100%);
            transition: all 0.3s;
        }
        
        .portfolio-item:hover .portfolio-overlay {
            transform: translateY(0);
        }
        
        .portfolio-item-title {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }
        
        .portfolio-item-category {
            font-size: 0.875rem;
            opacity: 0.8;
        }
        
        /* Footer */
        .creative-footer {
            text-align: center;
            padding: 2rem;
            background-color: var(--primary-color);
            color: white;
        }
        
        .creative-footer a {
            color: white;
            text-decoration: underline;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .creative-title {
                font-size: 2rem;
            }
            
            .creative-subtitle {
                font-size: 1rem;
            }
            
            .portfolio-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="creative-header">
        ${profileImage ? `<img src="${profileImage}" class="profile-image" alt="${yourName}">` : ''}
        <h1 class="creative-title">${yourName}</h1>
        <p class="creative-subtitle">${profession}</p>
        <div class="creative-social">
            ${socialLinks.filter(link => link.trim()).map(link => `
                <a href="https://${link.trim()}" class="social-link" target="_blank">
                    <i class="fab fa-${getSocialIcon(link.trim())}"></i>
                </a>
            `).join('')}
        </div>
    </header>
    
    <section class="creative-about">
        <h2 class="section-title">About Me</h2>
        <p class="section-content">${aboutMe}</p>
    </section>
    
    <section class="container">
        <h2 class="section-title">My Portfolio</h2>
        <div class="portfolio-grid">
            ${portfolioItems.map(item => `
                <div class="portfolio-item">
                    <div class="portfolio-image">
                        ${item.image ? 
                            `<img src="${item.image}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;">` : 
                            `<i class="fas fa-image" style="font-size: 3rem;"></i>`
                        }
                    </div>
                    <div class="portfolio-overlay">
                        <h3 class="portfolio-item-title">${item.title}</h3>
                        <p class="portfolio-item-category">${item.category} • ${item.year}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
    
    <footer class="creative-footer">
        <p>Let's work together! Contact me at <a href="mailto:${contactEmail}">${contactEmail}</a></p>
    </footer>
</body>
</html>`;
}

// Copy code to clipboard
function copyCodeToClipboard() {
    const fullHtml = generateFullHtml();
    navigator.clipboard.writeText(fullHtml).then(() => {
        alert('Portfolio code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy code. Please try again.');
    });
}

// Initialize the editor when the page loads
window.addEventListener('DOMContentLoaded', initEditor);