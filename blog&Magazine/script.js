// Initial data for blog/magazine
const initialCategories = ["News", "Technology", "Business", "Health", "Entertainment"];
const initialArticles = [
    {
        title: "The Future of Artificial Intelligence",
        category: "Technology",
        date: "May 15, 2023",
        author: "Jane Smith",
        excerpt: "Exploring how AI will transform industries in the coming decade and what it means for the workforce.",
        content: "<p>Artificial Intelligence has made significant strides in recent years, with applications ranging from healthcare diagnostics to autonomous vehicles. As we look to the future, experts predict even more dramatic changes across all sectors of the economy.</p><p>One area of particular interest is the impact on employment. While some jobs will undoubtedly be automated, new roles will emerge that we can't even imagine today. The key will be in preparing the workforce for this transition through education and retraining programs.</p>",
        featured: true,
        image: ""
    },
    {
        title: "Sustainable Business Practices Pay Off",
        category: "Business",
        date: "May 10, 2023",
        author: "Michael Johnson",
        excerpt: "New study shows companies with strong sustainability programs outperform their peers financially.",
        content: "<p>A comprehensive analysis of 2,000 companies across various industries has revealed a clear correlation between sustainability initiatives and financial performance. Companies that prioritized environmental and social responsibility saw an average of 15% higher returns over a five-year period.</p><p>The study's authors suggest that these results may be due to several factors, including improved brand reputation, operational efficiencies from reduced waste, and better talent attraction and retention.</p>",
        featured: false,
        image: ""
    },
    {
        title: "Breakthrough in Cancer Research",
        category: "Health",
        date: "May 5, 2023",
        author: "Dr. Sarah Williams",
        excerpt: "Scientists discover promising new approach to targeting resistant cancer cells.",
        content: "<p>Researchers at the National Cancer Institute have identified a novel mechanism that certain cancer cells use to resist treatment. More importantly, they've developed a compound that appears to block this resistance pathway in laboratory tests.</p><p>While still in early stages, this discovery could lead to more effective treatments for cancers that currently have poor survival rates. Clinical trials are expected to begin within the next two years.</p>",
        featured: false,
        image: ""
    }
];

// DOM elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const articlesContainer = document.getElementById('articles-container');
const categoriesContainer = document.getElementById('categories-container');
const addArticleBtn = document.getElementById('add-article');
const addCategoryBtn = document.getElementById('add-category');
const newCategoryInput = document.getElementById('new-category');
const articleCategorySelect = document.getElementById('article-category');
const previewContainer = document.getElementById('live-preview');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const fullscreenPreviewBtn = document.getElementById('fullscreen-preview');
const publicationLogoInput = document.getElementById('publication-logo');
const logoPreview = document.getElementById('logo-preview');

// Current state
let articles = [...initialArticles];
let categories = [...initialCategories];
let publicationLogo = null;
let layoutStyle = "magazine";
let colorScheme = "classic";
let imagePosition = "top";
let fontFamily = "serif";

// Initialize the editor
function initEditor() {
    // Render initial categories
    renderCategories();
    updateCategorySelect();
    
    // Render initial articles
    renderArticles();
    
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
    
    // Publication logo upload
    publicationLogoInput.addEventListener('change', handleLogoUpload);
    
    // Add article button
    addArticleBtn.addEventListener('click', addNewArticle);
    
    // Add category button
    addCategoryBtn.addEventListener('click', addNewCategory);
    
    // Layout options
    document.getElementById('layout-style').addEventListener('change', function() {
        layoutStyle = this.value;
        updatePreview();
    });
    
    document.getElementById('color-scheme').addEventListener('change', function() {
        colorScheme = this.value;
        updatePreview();
    });
    
    document.getElementById('image-position').addEventListener('change', function() {
        imagePosition = this.value;
        updatePreview();
    });
    
    document.getElementById('font-family').addEventListener('change', function() {
        fontFamily = this.value;
        updatePreview();
    });
    
    // Preview buttons
    refreshPreviewBtn.addEventListener('click', updatePreview);
    fullscreenPreviewBtn.addEventListener('click', openFullscreenPreview);
    

    // Copy code button
    document.querySelector('.btn-outline').addEventListener('click', function() {
        copyCodeToClipboard();
    });
}

// Handle logo upload
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            publicationLogo = event.target.result;
            logoPreview.style.display = 'block';
            logoPreview.innerHTML = `<img src="${publicationLogo}" alt="Logo Preview">`;
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

// Render categories
function renderCategories() {
    categoriesContainer.innerHTML = '';
    
    categories.forEach((category, index) => {
        const categoryEl = document.createElement('div');
        categoryEl.className = 'category-tag';
        categoryEl.innerHTML = `
            ${category}
            <span class="remove-category" data-index="${index}">
                <i class="fas fa-times"></i>
            </span>
        `;
        
        categoriesContainer.appendChild(categoryEl);
        
        // Set up remove category
        categoryEl.querySelector('.remove-category').addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            categories.splice(index, 1);
            renderCategories();
            updateCategorySelect();
            updatePreview();
        });
    });
}

// Update category select dropdown
function updateCategorySelect() {
    articleCategorySelect.innerHTML = '';
    
    // Add "All Categories" option
    const allOption = document.createElement('option');
    allOption.value = "all";
    allOption.textContent = "All Categories";
    articleCategorySelect.appendChild(allOption);
    
    // Add each category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        articleCategorySelect.appendChild(option);
    });
}

// Add new category
function addNewCategory() {
    const newCategory = newCategoryInput.value.trim();
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        newCategoryInput.value = '';
        renderCategories();
        updateCategorySelect();
        updatePreview();
    }
}

// Render articles
function renderArticles() {
    articlesContainer.innerHTML = '';
    
    const selectedCategory = articleCategorySelect.value;
    const filteredArticles = selectedCategory === "all" 
        ? articles 
        : articles.filter(article => article.category === selectedCategory);
    
    filteredArticles.forEach((article, index) => {
        const articleEl = document.createElement('div');
        articleEl.className = 'article-card';
        articleEl.innerHTML = `
            <div class="article-header">
                <span class="article-title">${index + 1}. ${article.title}</span>
                <div class="article-actions">
                    <button class="article-btn expand-article" data-index="${index}">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button class="article-btn remove-article" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="article-expanded">
                <div class="form-group">
                    <label class="form-label">Article Title</label>
                    <input type="text" class="form-control article-title-input" data-index="${index}" value="${article.title}">
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-control article-category-select" data-index="${index}">
                        ${categories.map(cat => 
                            `<option value="${cat}" ${cat === article.category ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Publish Date</label>
                    <input type="text" class="form-control article-date-input" data-index="${index}" value="${article.date}">
                </div>
                <div class="form-group">
                    <label class="form-label">Author</label>
                    <input type="text" class="form-control article-author-input" data-index="${index}" value="${article.author}">
                </div>
                <div class="form-group">
                    <label class="form-label">Featured</label>
                    <input type="checkbox" class="form-control article-featured-input" data-index="${index}" ${article.featured ? 'checked' : ''}>
                </div>
                <div class="form-group">
                    <label class="form-label">Excerpt</label>
                    <textarea class="form-control article-excerpt-input" data-index="${index}" rows="4">${article.excerpt}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Content</label>
                    <textarea class="form-control article-content-input" data-index="${index}" rows="8">${article.content}</textarea>
                </div>
                <div class="form-group article-image-upload">
                    <label class="form-label">Featured Image</label>
                    <div class="image-upload-container">
                        <input type="file" class="form-control article-image-input" data-index="${index}" accept="image/*">
                        <button class="btn btn-outline clear-image-btn" data-index="${index}" ${!article.image ? 'disabled' : ''}>
                            <i class="fas fa-times"></i> Clear Image
                        </button>
                    </div>
                    <div class="image-preview-container" data-index="${index}" style="${article.image ? '' : 'display: none;'}">
                        <img src="${article.image || ''}" class="article-image-preview" style="${article.image ? 'display: block;' : 'display: none;'}">
                    </div>
                </div>
            </div>
        `;
        
        articlesContainer.appendChild(articleEl);
        
        // Set up expand/collapse
        const expandBtn = articleEl.querySelector('.expand-article');
        const expandedContent = articleEl.querySelector('.article-expanded');
        
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
        
        // Set up remove article
        articleEl.querySelector('.remove-article').addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            articles.splice(index, 1);
            renderArticles();
            updatePreview();
        });
        
        // Set up article editing
        articleEl.querySelector('.article-title-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            articles[index].title = this.value;
            updatePreview();
            // Update the article header title
            const articleHeader = this.closest('.article-card').querySelector('.article-title');
            articleHeader.textContent = `${index + 1}. ${this.value}`;
        });
        
        articleEl.querySelector('.article-category-select').addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            articles[index].category = this.value;
            updatePreview();
        });
        
        articleEl.querySelector('.article-date-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            articles[index].date = this.value;
            updatePreview();
        });
        
        articleEl.querySelector('.article-author-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            articles[index].author = this.value;
            updatePreview();
        });
        
        articleEl.querySelector('.article-featured-input').addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            articles[index].featured = this.checked;
            updatePreview();
        });
        
        articleEl.querySelector('.article-excerpt-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            articles[index].excerpt = this.value;
            updatePreview();
        });
        
        articleEl.querySelector('.article-content-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            articles[index].content = this.value;
            updatePreview();
        });
        
        // Set up article image upload
        const imageInput = articleEl.querySelector('.article-image-input');
        const imagePreviewContainer = articleEl.querySelector('.image-preview-container');
        const imagePreview = articleEl.querySelector('.article-image-preview');
        const clearImageBtn = articleEl.querySelector('.clear-image-btn');
        
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const index = parseInt(this.getAttribute('data-index'));
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    articles[index].image = event.target.result;
                    imagePreview.src = event.target.result;
                    imagePreviewContainer.style.display = 'block';
                    imagePreview.style.display = 'block';
                    clearImageBtn.disabled = false;
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
        
        clearImageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const index = parseInt(this.getAttribute('data-index'));
            articles[index].image = '';
            imagePreview.src = '';
            imagePreviewContainer.style.display = 'none';
            imageInput.value = '';
            this.disabled = true;
            updatePreview();
        });
    });
}

// Add new article
function addNewArticle() {
    if (categories.length === 0) {
        alert('Please add at least one category first!');
        return;
    }
    
    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    
    articles.push({
        title: "New Article",
        category: categories[0],
        date: formattedDate,
        author: "Editor",
        excerpt: "Brief summary of your article content...",
        content: "<p>Start writing your article content here. You can use HTML tags to format your text.</p><p>For example, this is a new paragraph.</p>",
        featured: false,
        image: ""
    });
    renderArticles();
    updatePreview();
    
    // Scroll to the new article
    const lastArticle = articlesContainer.lastElementChild;
    lastArticle.scrollIntoView({ behavior: 'smooth' });
    
    // Expand the new article
    const expandBtn = lastArticle.querySelector('.expand-article');
    const expandedContent = lastArticle.querySelector('.article-expanded');
    expandedContent.classList.add('active');
    const icon = expandBtn.querySelector('i');
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
}

// Update the preview
function updatePreview() {
    const publicationName = document.getElementById('publication-name').value;
    const publicationTagline = document.getElementById('publication-tagline').value;
    const publicationDescription = document.getElementById('publication-description').value;
    const publicationEmail = document.getElementById('publication-email').value;
    const publicationPhone = document.getElementById('publication-phone').value;
    const publicationAddress = document.getElementById('publication-address').value;
    
    // Get featured articles and regular articles
    const featuredArticles = articles.filter(article => article.featured);
    const regularArticles = articles.filter(article => !article.featured);
    
    previewContainer.innerHTML = `
        <div class="publication-content">
            <header class="publication-header">
                ${publicationLogo ? `<img src="${publicationLogo}" class="publication-logo" alt="${publicationName}">` : ''}
                <h1 class="publication-name">${publicationName}</h1>
                <p class="publication-tagline">${publicationTagline}</p>
                <div class="publication-info">
                    ${publicationEmail ? `<div class="info-item"><i class="fas fa-envelope"></i> ${publicationEmail}</div>` : ''}
                    ${publicationPhone ? `<div class="info-item"><i class="fas fa-phone"></i> ${publicationPhone}</div>` : ''}
                    ${publicationAddress ? `<div class="info-item"><i class="fas fa-map-marker-alt"></i> ${publicationAddress}</div>` : ''}
                </div>
            </header>
            
            <section class="articles-section">
                <h2 class="section-title">Latest Articles</h2>
                <p class="section-description">${publicationDescription}</p>
                
                <div class="articles-grid">
                    ${featuredArticles.length > 0 ? `
                        <div class="article-preview-card featured-article">
                            <div class="article-featured-image">
                                ${featuredArticles[0].image ? `
                                    <img src="${featuredArticles[0].image}" alt="${featuredArticles[0].title}">
                                ` : `
                                    <i class="fas fa-image" style="font-size: 3rem;"></i>
                                `}
                            </div>
                            <div class="article-preview-content">
                                <div class="article-preview-header">
                                    <span class="article-preview-category">${featuredArticles[0].category}</span>
                                    <span class="article-preview-date">${featuredArticles[0].date}</span>
                                </div>
                                <h3 class="article-preview-title">${featuredArticles[0].title}</h3>
                                <p class="article-preview-excerpt">${featuredArticles[0].excerpt}</p>
                                <div class="article-preview-footer">
                                    <span class="article-preview-author">By ${featuredArticles[0].author}</span>
                                    <a href="#" class="read-more-btn">Read More</a>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${regularArticles.map(article => `
                        <div class="article-preview-card">
                            <div class="article-featured-image">
                                ${article.image ? `
                                    <img src="${article.image}" alt="${article.title}">
                                ` : `
                                    <i class="fas fa-image" style="font-size: 2rem;"></i>
                                `}
                            </div>
                            <div class="article-preview-content">
                                <div class="article-preview-header">
                                    <span class="article-preview-category">${article.category}</span>
                                    <span class="article-preview-date">${article.date}</span>
                                </div>
                                <h3 class="article-preview-title">${article.title}</h3>
                                <p class="article-preview-excerpt">${article.excerpt}</p>
                                <div class="article-preview-footer">
                                    <span class="article-preview-author">By ${article.author}</span>
                                    <a href="#" class="read-more-btn">Read More</a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <footer class="publication-footer">
                <p>© ${new Date().getFullYear()} ${publicationName}. All rights reserved.</p>
            </footer>
        </div>
    `;
    
    // Apply layout style
    applyLayoutStyle();
}

// Apply selected layout style
function applyLayoutStyle() {
    const previewContent = document.querySelector('.publication-content');
    
    // Reset styles
    previewContent.style.fontFamily = '';
    previewContent.style.color = '';
    previewContent.style.backgroundColor = '';
    
    // Apply font family
    switch(fontFamily) {
        case 'serif':
            previewContent.style.fontFamily = 'Georgia, "Times New Roman", Times, serif';
            break;
        case 'sans-serif':
            previewContent.style.fontFamily = 'Arial, Helvetica, sans-serif';
            break;
        case 'monospace':
            previewContent.style.fontFamily = 'Courier New, Courier, monospace';
            break;
        case 'custom':
            // Would load a Google Font here in a real implementation
            previewContent.style.fontFamily = '"Roboto", sans-serif';
            break;
    }
    
    // Apply color scheme
    switch(colorScheme) {
        case 'classic':
            previewContent.style.color = '#333';
            previewContent.style.backgroundColor = '#fff';
            break;
        case 'dark':
            previewContent.style.color = '#f0f0f0';
            previewContent.style.backgroundColor = '#222';
            break;
        case 'professional':
            previewContent.style.color = '#333';
            previewContent.style.backgroundColor = '#f8f9fa';
            break;
        case 'vibrant':
            previewContent.style.color = '#333';
            previewContent.style.backgroundColor = '#fff';
            break;
    }
    
    // Apply image position (simplified for this example)
    const articleImages = document.querySelectorAll('.article-featured-image');
    articleImages.forEach((img, index) => {
        if (imagePosition === 'left' || (imagePosition === 'alternate' && index % 2 === 0)) {
            img.parentElement.style.display = 'grid';
            img.parentElement.style.gridTemplateColumns = '200px 1fr';
        } else if (imagePosition === 'right' || (imagePosition === 'alternate' && index % 2 === 1)) {
            img.parentElement.style.display = 'grid';
            img.parentElement.style.gridTemplateColumns = '1fr 200px';
            img.style.order = '1';
        } else {
            // Default top position
            img.parentElement.style.display = 'block';
            img.style.order = '';
        }
    });
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
    const publicationName = document.getElementById('publication-name').value;
    const publicationTagline = document.getElementById('publication-tagline').value;
    const publicationDescription = document.getElementById('publication-description').value;
    const publicationEmail = document.getElementById('publication-email').value;
    const publicationPhone = document.getElementById('publication-phone').value;
    const publicationAddress = document.getElementById('publication-address').value;
    
    // Get featured articles and regular articles
    const featuredArticles = articles.filter(article => article.featured);
    const regularArticles = articles.filter(article => !article.featured);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${publicationName}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #1e40af;
            --secondary-color: #93c5fd;
            --text-color: #1e293b;
            --light-text: #64748b;
            --border-color: #e2e8f0;
            --bg-color: #f8f9fa;
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
        .publication-header {
            text-align: center;
            padding: 4rem 0;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 2rem;
        }
        
        .publication-logo {
            width: 150px;
            height: 150px;
            object-fit: contain;
            margin: 0 auto 1rem;
            display: block;
        }
        
        .publication-name {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .publication-tagline {
            font-size: 1.25rem;
            margin-bottom: 1.5rem;
            color: var(--light-text);
        }
        
        .publication-info {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }
        
        /* Articles Section */
        .articles-section {
            padding: 3rem 0;
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .section-title {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: var(--primary-color);
            text-align: center;
            position: relative;
            padding-bottom: 0.5rem;
        }
        
        .section-title:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background-color: var(--primary-color);
        }
        
        .section-description {
            line-height: 1.8;
            color: var(--light-text);
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .article-preview-card {
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s;
            background-color: var(--card-bg);
        }
        
        .article-preview-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .article-featured-image {
            width: 100%;
            height: 200px;
            background-color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #cbd5e1;
            overflow: hidden;
        }
        
        .article-featured-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .article-preview-content {
            padding: 1.5rem;
        }
        
        .article-preview-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            align-items: center;
        }
        
        .article-preview-category {
            background-color: var(--primary-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
        }
        
        .article-preview-date {
            font-size: 0.875rem;
            color: var(--light-text);
        }
        
        .article-preview-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: var(--text-color);
        }
        
        .article-preview-excerpt {
            font-size: 0.875rem;
            color: var(--light-text);
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .article-preview-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .article-preview-author {
            font-size: 0.875rem;
            color: var(--light-text);
        }
        
        .read-more-btn {
            background-color: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.875rem;
            text-decoration: none;
            transition: all 0.2s;
        }
        
        .read-more-btn:hover {
            background-color: #1e3a8a;
        }
        
        /* Featured article styles */
        .featured-article {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .featured-article .article-featured-image {
            height: 350px;
        }
        
        .featured-article .article-preview-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .featured-article .article-preview-title {
            font-size: 1.75rem;
        }
        
        .featured-article .article-preview-excerpt {
            font-size: 1rem;
        }
        
        /* Footer */
        .publication-footer {
            text-align: center;
            padding: 2rem;
            margin-top: 2rem;
            color: var(--light-text);
            border-top: 1px solid var(--border-color);
        }
        
        /* Responsive */
        @media (max-width: 992px) {
            .featured-article {
                grid-template-columns: 1fr;
            }
            
            .featured-article .article-featured-image {
                height: 250px;
            }
        }
        
        @media (max-width: 768px) {
            .articles-grid {
                grid-template-columns: 1fr;
            }
            
            .publication-name {
                font-size: 2rem;
            }
            
            .publication-tagline {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="publication-content">
        <header class="publication-header">
            ${publicationLogo ? `<img src="${publicationLogo}" class="publication-logo" alt="${publicationName}">` : ''}
            <h1 class="publication-name">${publicationName}</h1>
            <p class="publication-tagline">${publicationTagline}</p>
            <div class="publication-info">
                ${publicationEmail ? `<div class="info-item"><i class="fas fa-envelope"></i> ${publicationEmail}</div>` : ''}
                ${publicationPhone ? `<div class="info-item"><i class="fas fa-phone"></i> ${publicationPhone}</div>` : ''}
                ${publicationAddress ? `<div class="info-item"><i class="fas fa-map-marker-alt"></i> ${publicationAddress}</div>` : ''}
            </div>
        </header>
        
        <section class="articles-section">
            <h2 class="section-title">Latest Articles</h2>
            <p class="section-description">${publicationDescription}</p>
            
            <div class="articles-grid">
                ${featuredArticles.length > 0 ? `
                    <div class="article-preview-card featured-article">
                        <div class="article-featured-image">
                            ${featuredArticles[0].image ? `
                                <img src="${featuredArticles[0].image}" alt="${featuredArticles[0].title}">
                            ` : `
                                <i class="fas fa-image" style="font-size: 3rem;"></i>
                            `}
                        </div>
                        <div class="article-preview-content">
                            <div class="article-preview-header">
                                <span class="article-preview-category">${featuredArticles[0].category}</span>
                                <span class="article-preview-date">${featuredArticles[0].date}</span>
                            </div>
                            <h3 class="article-preview-title">${featuredArticles[0].title}</h3>
                            <p class="article-preview-excerpt">${featuredArticles[0].excerpt}</p>
                            <div class="article-preview-footer">
                                <span class="article-preview-author">By ${featuredArticles[0].author}</span>
                                <a href="#" class="read-more-btn">Read More</a>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${regularArticles.map(article => `
                    <div class="article-preview-card">
                        <div class="article-featured-image">
                            ${article.image ? `
                                <img src="${article.image}" alt="${article.title}">
                            ` : `
                                <i class="fas fa-image" style="font-size: 2rem;"></i>
                            `}
                        </div>
                        <div class="article-preview-content">
                            <div class="article-preview-header">
                                <span class="article-preview-category">${article.category}</span>
                                <span class="article-preview-date">${article.date}</span>
                            </div>
                            <h3 class="article-preview-title">${article.title}</h3>
                            <p class="article-preview-excerpt">${article.excerpt}</p>
                            <div class="article-preview-footer">
                                <span class="article-preview-author">By ${article.author}</span>
                                <a href="#" class="read-more-btn">Read More</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        
        <footer class="publication-footer">
            <p>© ${new Date().getFullYear()} ${publicationName}. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>`;
}

// Copy code to clipboard
function copyCodeToClipboard() {
    const fullHtml = generateFullHtml();
    navigator.clipboard.writeText(fullHtml).then(() => {
        alert('Publication code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy code. Please try again.');
    });
}

// Initialize the editor when the page loads
window.addEventListener('DOMContentLoaded', initEditor);