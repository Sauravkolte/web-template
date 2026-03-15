// Initial data with Indian dishes and rupees symbol
const initialCategories = ["Starters", "Main Course", "Breads", "Desserts", "Beverages"];
const initialMenuItems = [
    {
        name: "Paneer Tikka",
        description: "Cubes of paneer marinated in spices and grilled to perfection",
        price: "₹250",
        category: "Starters",
        tags: ["Vegetarian", "Tandoori"],
        image: ""
    },
    {
        name: "Butter Chicken",
        description: "Tender chicken cooked in a rich tomato and butter gravy",
        price: "₹350",
        category: "Main Course",
        tags: ["Non-Veg", "Popular"],
        image: ""
    },
    {
        name: "Dal Makhani",
        description: "Creamy black lentils slow-cooked with butter and spices",
        price: "₹220",
        category: "Main Course",
        tags: ["Vegetarian", "Signature"],
        image: ""
    },
    {
        name: "Gulab Jamun",
        description: "Soft milk dumplings soaked in rose-flavored sugar syrup",
        price: "₹120",
        category: "Desserts",
        tags: ["Vegetarian", "Sweet"],
        image: ""
    },
    {
        name: "Masala Chai",
        description: "Traditional Indian tea with aromatic spices and milk",
        price: "₹60",
        category: "Beverages",
        tags: ["Hot", "Popular"],
        image: ""
    }
];

// DOM elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const menuContainer = document.getElementById('menu-container');
const categoriesContainer = document.getElementById('categories-container');
const addMenuItemBtn = document.getElementById('add-menu-item');
const addCategoryBtn = document.getElementById('add-category');
const newCategoryInput = document.getElementById('new-category');
const menuCategorySelect = document.getElementById('menu-category');
const previewContainer = document.getElementById('live-preview');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const fullscreenPreviewBtn = document.getElementById('fullscreen-preview');
const restaurantLogoInput = document.getElementById('restaurant-logo');
const logoPreview = document.getElementById('logo-preview');

// Current state
let menuItems = [...initialMenuItems];
let categories = [...initialCategories];
let restaurantLogo = null;

// Initialize the editor
function initEditor() {
    // Render initial categories
    renderCategories();
    updateCategorySelect();
    
    // Render initial menu items
    renderMenuItems();
    
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
    
    // Restaurant logo upload
    restaurantLogoInput.addEventListener('change', handleLogoUpload);
    
    // Add menu item button
    addMenuItemBtn.addEventListener('click', addNewMenuItem);
    
    // Add category button
    addCategoryBtn.addEventListener('click', addNewCategory);
    
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
            restaurantLogo = event.target.result;
            logoPreview.style.display = 'block';
            logoPreview.innerHTML = `<img src="${restaurantLogo}" alt="Logo Preview">`;
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
    menuCategorySelect.innerHTML = '';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        menuCategorySelect.appendChild(option);
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

// Render menu items
function renderMenuItems() {
    menuContainer.innerHTML = '';
    
    menuItems.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'menu-card';
        itemEl.innerHTML = `
            <div class="menu-header">
                <span class="menu-title">${index + 1}. ${item.name}</span>
                <div class="menu-actions">
                    <button class="menu-btn expand-menu" data-index="${index}">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button class="menu-btn remove-menu" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="menu-expanded">
                <div class="form-group">
                    <label class="form-label">Item Name</label>
                    <input type="text" class="form-control menu-name-input" data-index="${index}" value="${item.name}">
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-control menu-category-select" data-index="${index}">
                        ${categories.map(cat => 
                            `<option value="${cat}" ${cat === item.category ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Price (in ₹)</label>
                    <input type="text" class="form-control menu-price-input" data-index="${index}" value="${item.price}">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control menu-desc-input" data-index="${index}" rows="4">${item.description}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Tags (comma separated)</label>
                    <input type="text" class="form-control menu-tags-input" data-index="${index}" value="${item.tags.join(', ')}">
                </div>
                <div class="form-group menu-image-upload">
                    <label class="form-label">Item Image</label>
                    <div class="image-upload-container">
                        <input type="file" class="form-control menu-image-input" data-index="${index}" accept="image/*">
                        <button class="btn btn-outline clear-image-btn" data-index="${index}" ${!item.image ? 'disabled' : ''}>
                            <i class="fas fa-times"></i> Clear Image
                        </button>
                    </div>
                    <div class="image-preview-container" data-index="${index}" style="${item.image ? '' : 'display: none;'}">
                        <img src="${item.image || ''}" class="menu-image-preview" style="${item.image ? 'display: block;' : 'display: none;'}">
                    </div>
                </div>
            </div>
        `;
        
        menuContainer.appendChild(itemEl);
        
        // Set up expand/collapse
        const expandBtn = itemEl.querySelector('.expand-menu');
        const expandedContent = itemEl.querySelector('.menu-expanded');
        
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
        
        // Set up remove menu item
        itemEl.querySelector('.remove-menu').addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            menuItems.splice(index, 1);
            renderMenuItems();
            updatePreview();
        });
        
        // Set up menu item editing
        itemEl.querySelector('.menu-name-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            menuItems[index].name = this.value;
            updatePreview();
            // Update the menu header title
            const menuHeader = this.closest('.menu-card').querySelector('.menu-title');
            menuHeader.textContent = `${index + 1}. ${this.value}`;
        });
        
        itemEl.querySelector('.menu-category-select').addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            menuItems[index].category = this.value;
            updatePreview();
        });
        
        itemEl.querySelector('.menu-price-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            // Ensure price starts with ₹
            let price = this.value;
            if (!price.startsWith('₹')) {
                price = '₹' + price.replace(/[^0-9]/g, '');
            }
            menuItems[index].price = price;
            this.value = price;
            updatePreview();
        });
        
        itemEl.querySelector('.menu-desc-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            menuItems[index].description = this.value;
            updatePreview();
        });
        
        itemEl.querySelector('.menu-tags-input').addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            menuItems[index].tags = this.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            updatePreview();
        });
        
        // Set up menu image upload
        const imageInput = itemEl.querySelector('.menu-image-input');
        const imagePreviewContainer = itemEl.querySelector('.image-preview-container');
        const imagePreview = itemEl.querySelector('.menu-image-preview');
        const clearImageBtn = itemEl.querySelector('.clear-image-btn');
        
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const index = parseInt(this.getAttribute('data-index'));
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    menuItems[index].image = event.target.result;
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
            menuItems[index].image = '';
            imagePreview.src = '';
            imagePreviewContainer.style.display = 'none';
            imageInput.value = '';
            this.disabled = true;
            updatePreview();
        });
    });
}

// Add new menu item
function addNewMenuItem() {
    if (categories.length === 0) {
        alert('Please add at least one category first!');
        return;
    }
    
    menuItems.push({
        name: "New Item",
        description: "Describe your menu item here...",
        price: "₹0",
        category: categories[0],
        tags: [],
        image: ""
    });
    renderMenuItems();
    updatePreview();
    
    // Scroll to the new item
    const lastItem = menuContainer.lastElementChild;
    lastItem.scrollIntoView({ behavior: 'smooth' });
    
    // Expand the new item
    const expandBtn = lastItem.querySelector('.expand-menu');
    const expandedContent = lastItem.querySelector('.menu-expanded');
    expandedContent.classList.add('active');
    const icon = expandBtn.querySelector('i');
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
}

// Update the preview
function updatePreview() {
    const restaurantName = document.getElementById('restaurant-name').value;
    const restaurantTagline = document.getElementById('restaurant-tagline').value;
    const restaurantDescription = document.getElementById('restaurant-description').value;
    const restaurantPhone = document.getElementById('restaurant-phone').value;
    const restaurantAddress = document.getElementById('restaurant-address').value;
    const restaurantHours = document.getElementById('restaurant-hours').value;
    
    // Group menu items by category
    const menuByCategory = {};
    categories.forEach(category => {
        menuByCategory[category] = menuItems.filter(item => item.category === category);
    });
    
    previewContainer.innerHTML = `
        <div class="restaurant-content">
            <header class="restaurant-header">
                ${restaurantLogo ? `<img src="${restaurantLogo}" class="restaurant-logo" alt="${restaurantName}">` : ''}
                <h1 class="restaurant-name">${restaurantName}</h1>
                <p class="restaurant-tagline">${restaurantTagline}</p>
                <div class="restaurant-info">
                    ${restaurantPhone ? `<div class="info-item"><i class="fas fa-phone"></i> ${restaurantPhone}</div>` : ''}
                    ${restaurantAddress ? `<div class="info-item"><i class="fas fa-map-marker-alt"></i> ${restaurantAddress}</div>` : ''}
                    ${restaurantHours ? `<div class="info-item"><i class="fas fa-clock"></i> ${restaurantHours}</div>` : ''}
                </div>
            </header>
            
            <section class="menu-section">
                <h2 class="section-title">Our Menu</h2>
                <p class="section-description">${restaurantDescription}</p>
                
                ${Object.entries(menuByCategory)
                    .filter(([category, items]) => items.length > 0)
                    .map(([category, items]) => `
                        <div class="menu-category">
                            <h3 class="category-title">${category}</h3>
                            <div class="menu-items-grid">
                                ${items.map(item => `
                                    <div class="menu-item-card">
                                        ${item.image ? `
                                            <div class="menu-item-image">
                                                <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
                                            </div>
                                        ` : `
                                            <div class="menu-item-image">
                                                <i class="fas fa-utensils" style="font-size: 2rem;"></i>
                                            </div>
                                        `}
                                        <div class="menu-item-details">
                                            <div class="menu-item-header">
                                                <h4 class="menu-item-name">${item.name}</h4>
                                                <span class="menu-item-price">${item.price}</span>
                                            </div>
                                            <p class="menu-item-description">${item.description}</p>
                                            ${item.tags.length > 0 ? `
                                                <div class="menu-item-tags">
                                                    ${item.tags.map(tag => `<span class="menu-tag">${tag}</span>`).join('')}
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
            </section>
            
            <footer class="restaurant-footer">
                <p>© ${new Date().getFullYear()} ${restaurantName}. All rights reserved.</p>
            </footer>
        </div>
    `;
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
    const restaurantName = document.getElementById('restaurant-name').value;
    const restaurantTagline = document.getElementById('restaurant-tagline').value;
    const restaurantDescription = document.getElementById('restaurant-description').value;
    const restaurantPhone = document.getElementById('restaurant-phone').value;
    const restaurantAddress = document.getElementById('restaurant-address').value;
    const restaurantHours = document.getElementById('restaurant-hours').value;
    
    // Group menu items by category
    const menuByCategory = {};
    categories.forEach(category => {
        menuByCategory[category] = menuItems.filter(item => item.category === category);
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurantName} | Menu</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #e63946;
            --secondary-color: #a8dadc;
            --text-color: #1d3557;
            --light-text: #457b9d;
            --border-color: #f1faee;
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
        .restaurant-header {
            text-align: center;
            padding: 4rem 0;
            background: linear-gradient(135deg, var(--primary-color), #c1121f);
            color: white;
        }
        
        .restaurant-logo {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            margin: 0 auto 1.5rem;
            display: block;
        }
        
        .restaurant-name {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .restaurant-tagline {
            font-size: 1.25rem;
            margin-bottom: 1.5rem;
            opacity: 0.9;
        }
        
        .restaurant-info {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        /* Menu Sections */
        .menu-section {
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
        
        .menu-category {
            margin-bottom: 3rem;
        }
        
        .category-title {
            font-size: 1.5rem;
            color: var(--text-color);
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--secondary-color);
        }
        
        /* Menu Items */
        .menu-items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
        }
        
        .menu-item-card {
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s;
            display: flex;
            background-color: var(--card-bg);
        }
        
        .menu-item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .menu-item-image {
            width: 120px;
            height: 120px;
            background-color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--light-text);
            flex-shrink: 0;
        }
        
        .menu-item-details {
            padding: 1rem;
            flex-grow: 1;
        }
        
        .menu-item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .menu-item-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-color);
        }
        
        .menu-item-price {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .menu-item-description {
            font-size: 0.875rem;
            color: var(--light-text);
            margin-bottom: 0.5rem;
        }
        
        .menu-item-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .menu-tag {
            background-color: var(--secondary-color);
            color: var(--text-color);
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.75rem;
        }
        
        /* Footer */
        .restaurant-footer {
            text-align: center;
            padding: 2rem;
            background-color: var(--primary-color);
            color: white;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .restaurant-name {
                font-size: 2rem;
            }
            
            .restaurant-tagline {
                font-size: 1rem;
            }
            
            .menu-item-card {
                flex-direction: column;
            }
            
            .menu-item-image {
                width: 100%;
                height: 150px;
            }
            
            .menu-items-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="restaurant-header">
        ${restaurantLogo ? `<img src="${restaurantLogo}" class="restaurant-logo" alt="${restaurantName}">` : ''}
        <h1 class="restaurant-name">${restaurantName}</h1>
        <p class="restaurant-tagline">${restaurantTagline}</p>
        <div class="restaurant-info">
            ${restaurantPhone ? `<div class="info-item"><i class="fas fa-phone"></i> ${restaurantPhone}</div>` : ''}
            ${restaurantAddress ? `<div class="info-item"><i class="fas fa-map-marker-alt"></i> ${restaurantAddress}</div>` : ''}
            ${restaurantHours ? `<div class="info-item"><i class="fas fa-clock"></i> ${restaurantHours}</div>` : ''}
        </div>
    </header>
    
    <section class="menu-section">
        <h2 class="section-title">Our Menu</h2>
        <p class="section-description">${restaurantDescription}</p>
        
        ${Object.entries(menuByCategory)
            .filter(([category, items]) => items.length > 0)
            .map(([category, items]) => `
                <div class="menu-category">
                    <h3 class="category-title">${category}</h3>
                    <div class="menu-items-grid">
                        ${items.map(item => `
                            <div class="menu-item-card">
                                ${item.image ? `
                                    <div class="menu-item-image">
                                        <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
                                    </div>
                                ` : `
                                    <div class="menu-item-image">
                                        <i class="fas fa-utensils" style="font-size: 2rem;"></i>
                                    </div>
                                `}
                                <div class="menu-item-details">
                                    <div class="menu-item-header">
                                        <h4 class="menu-item-name">${item.name}</h4>
                                        <span class="menu-item-price">${item.price}</span>
                                    </div>
                                    <p class="menu-item-description">${item.description}</p>
                                    ${item.tags.length > 0 ? `
                                        <div class="menu-item-tags">
                                            ${item.tags.map(tag => `<span class="menu-tag">${tag}</span>`).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
    </section>
    
    <footer class="restaurant-footer">
        <p>© ${new Date().getFullYear()} ${restaurantName}. All rights reserved.</p>
    </footer>
</body>
</html>`;
}

// Copy code to clipboard
function copyCodeToClipboard() {
    const fullHtml = generateFullHtml();
    navigator.clipboard.writeText(fullHtml).then(() => {
        alert('Menu code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy code. Please try again.');
    });
}

// Initialize the editor when the page loads
window.addEventListener('DOMContentLoaded', initEditor);