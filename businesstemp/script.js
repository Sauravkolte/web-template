// Initial feature data
const initialFeatures = [
    {
        title: "Strategic Consulting",
        description: "Expert advice to help your business reach its goals and overcome challenges. Our strategic consulting team analyzes your current position and develops actionable plans for sustainable growth.",
        icon: "fas fa-chess"
    },
    {
        title: "Financial Analysis",
        description: "Comprehensive financial analysis to improve your bottom line and increase profitability. We examine cash flow, investment opportunities, and cost-saving measures to optimize your financial health.",
        icon: "fas fa-chart-line"
    },
    {
        title: "Marketing Solutions",
        description: "Effective marketing strategies to help you reach more customers and grow your brand. Our data-driven approach ensures your marketing budget delivers maximum ROI and customer acquisition.",
        icon: "fas fa-bullseye"
    }
];

// DOM elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const featuresContainer = document.getElementById('features-container');
const addFeatureBtn = document.getElementById('add-feature');
const previewContainer = document.getElementById('live-preview');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const fullscreenPreviewBtn = document.getElementById('fullscreen-preview');
const copyCodeBtn = document.getElementById('copy-code');
const previewBtn = document.getElementById('preview-btn');

// Current state
let features = [...initialFeatures];
let currentDesign = {
    primaryColor: '#2563eb',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    buttonStyle: 'rounded'
};

// Initialize the editor
function initEditor() {
    // Render initial features
    renderFeatures();
    
    // Render initial preview
    updatePreview();
    
    // Set up tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
    });
    
    // Set up content editing
    document.querySelectorAll('#content-tab .form-control, #footer-tab .form-control').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    // Add feature button
    addFeatureBtn.addEventListener('click', addNewFeature);
    
    // Preview buttons
    refreshPreviewBtn.addEventListener('click', updatePreview);
    fullscreenPreviewBtn.addEventListener('click', openFullscreenPreview);
    
    // Copy code button
    copyCodeBtn.addEventListener('click', copyCodeToClipboard);
    
    // Preview button
    previewBtn.addEventListener('click', updatePreview);
    
    // Back to templates link
    document.querySelector('.back-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Navigating back to templates...');
    });
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

// Render features list
function renderFeatures() {
    featuresContainer.innerHTML = '';
    
    features.forEach((feature, index) => {
        const featureEl = document.createElement('div');
        featureEl.className = 'feature-card';
        featureEl.innerHTML = `
            <div class="feature-header">
                <span class="feature-title">Feature ${index + 1}: ${feature.title}</span>
                <div class="feature-actions">
                    <button class="feature-btn remove-feature" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="feature-expanded">
                <div class="form-group">
                    <label class="form-label">Feature Title</label>
                    <input type="text" class="form-control feature-title-input" data-index="${index}" value="${feature.title}">
                </div>
                <div class="form-group">
                    <label class="form-label">Feature Description</label>
                    <textarea class="form-control feature-desc-input" data-index="${index}" rows="4">${feature.description}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Feature Icon</label>
                    <select class="form-control feature-icon-input" data-index="${index}">
                        <option value="fas fa-chess" ${feature.icon === 'fas fa-chess' ? 'selected' : ''}>Chess (Strategy)</option>
                        <option value="fas fa-chart-line" ${feature.icon === 'fas fa-chart-line' ? 'selected' : ''}>Chart (Finance)</option>
                        <option value="fas fa-bullseye" ${feature.icon === 'fas fa-bullseye' ? 'selected' : ''}>Target (Marketing)</option>
                        <option value="fas fa-laptop-code" ${feature.icon === 'fas fa-laptop-code' ? 'selected' : ''}>Laptop (Digital)</option>
                        <option value="fas fa-cogs" ${feature.icon === 'fas fa-cogs' ? 'selected' : ''}>Cogs (Operations)</option>
                        <option value="fas fa-users" ${feature.icon === 'fas fa-users' ? 'selected' : ''}>Users (Talent)</option>
                        <option value="fas fa-lightbulb" ${feature.icon === 'fas fa-lightbulb' ? 'selected' : ''}>Lightbulb (Innovation)</option>
                    </select>
                </div>
            </div>
        `;
        
        featuresContainer.appendChild(featureEl);
        
        // Highlight feature on click
        featureEl.addEventListener('click', function(e) {
            // Don't highlight if clicking on a button
            if (!e.target.closest('.feature-btn')) {
                document.querySelectorAll('.feature-card').forEach(card => {
                    card.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
        
        // Set up remove feature
        featureEl.querySelector('.remove-feature').addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            features.splice(index, 1);
            renderFeatures();
            updatePreview();
        });
        
        // Set up feature editing
        featureEl.querySelector('.feature-title-input').addEventListener('input', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            features[index].title = this.value;
            updatePreview();
            // Update the feature header title
            const featureHeader = this.closest('.feature-card').querySelector('.feature-title');
            featureHeader.textContent = `Feature ${index + 1}: ${this.value}`;
        });
        
        featureEl.querySelector('.feature-desc-input').addEventListener('input', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            features[index].description = this.value;
            updatePreview();
        });
        
        featureEl.querySelector('.feature-icon-input').addEventListener('change', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            features[index].icon = this.value;
            updatePreview();
        });
    });
}

// Add new feature
function addNewFeature() {
    features.push({
        title: "New Feature",
        description: "Describe your feature here...",
        icon: "fas fa-lightbulb"
    });
    renderFeatures();
    updatePreview();
    
    // Scroll to the new feature
    const lastFeature = featuresContainer.lastElementChild;
    lastFeature.scrollIntoView({ behavior: 'smooth' });
}

// Update the preview
function updatePreview() {
    const companyName = document.getElementById('company-name').value;
    const tagline = document.getElementById('tagline').value;
    const ctaText = document.getElementById('cta-text').value;
    const aboutTitle = document.getElementById('about-title').value;
    const aboutContent = document.getElementById('about-content').value;
    const featuresTitle = document.getElementById('features-title').value;
    const footerText = document.getElementById('footer-text').value;
    const footerAdditional = document.getElementById('footer-additional').value;
    
    previewContainer.innerHTML = `
        <style>
            .preview-content {
                font-family: ${currentDesign.fontFamily};
            }
            .preview-title-main {
                color: ${currentDesign.primaryColor};
            }
            .preview-cta {
                background-color: ${currentDesign.primaryColor};
                border-radius: ${currentDesign.buttonStyle === 'square' ? '0' : currentDesign.buttonStyle === 'pill' ? '9999px' : '0.375rem'};
            }
            .preview-cta:hover {
                background-color: ${shadeColor(currentDesign.primaryColor, -20)};
            }
            .preview-section-title:after {
                background-color: ${currentDesign.primaryColor};
            }
            .preview-feature-title i {
                color: ${currentDesign.primaryColor};
            }
        </style>
        
        <div class="preview-hero">
            <h1 class="preview-title-main">${companyName}</h1>
            <p class="preview-subtitle">${tagline}</p>
            <button class="preview-cta">${ctaText}</button>
        </div>
        
        <div class="preview-section">
            <h2 class="preview-section-title">${aboutTitle}</h2>
            <p class="preview-section-content">${aboutContent}</p>
        </div>
        
        <div class="preview-section">
            <h2 class="preview-section-title">${featuresTitle}</h2>
            <div class="preview-features">
                ${features.map(feature => `
                    <div class="preview-feature">
                        <h3 class="preview-feature-title"><i class="${feature.icon}"></i> ${feature.title}</h3>
                        <p class="preview-feature-desc">${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="preview-footer">
            ${footerText}<br>
            ${footerAdditional}
        </div>
    `;
}

// Helper function to shade colors
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3), 16);
    let G = parseInt(color.substring(3,5), 16);
    let B = parseInt(color.substring(5,7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);

    const RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

// Open preview in fullscreen
function openFullscreenPreview() {
    const htmlCode = generateFullHtml();
    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlCode);
    newWindow.document.close();
}

// Generate full HTML for export
function generateFullHtml() {
    const companyName = document.getElementById('company-name').value;
    const tagline = document.getElementById('tagline').value;
    const ctaText = document.getElementById('cta-text').value;
    const aboutTitle = document.getElementById('about-title').value;
    const aboutContent = document.getElementById('about-content').value;
    const featuresTitle = document.getElementById('features-title').value;
    const footerText = document.getElementById('footer-text').value;
    const footerAdditional = document.getElementById('footer-additional').value;
    
    let buttonClass = '';
    switch(currentDesign.buttonStyle) {
        case 'square':
            buttonClass = 'border-radius: 0;';
            break;
        case 'pill':
            buttonClass = 'border-radius: 9999px;';
            break;
        default:
            buttonClass = 'border-radius: 0.375rem;';
    }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${companyName}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: ${currentDesign.primaryColor};
            --secondary-color: ${shadeColor(currentDesign.primaryColor, -20)};
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
            font-family: ${currentDesign.fontFamily};
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
        
        /* Hero Section */
        .hero {
            text-align: center;
            padding: 4rem 0;
            background-color: #f8fafc;
        }
        
        .hero-title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        .hero-subtitle {
            font-size: 1.25rem;
            color: var(--light-text);
            margin-bottom: 1.5rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            ${buttonClass}
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .cta-button:hover {
            background-color: var(--secondary-color);
        }
        
        /* Content Sections */
        .section {
            padding: 3rem 0;
        }
        
        .section-title {
            font-size: 1.75rem;
            margin-bottom: 1rem;
            position: relative;
            padding-bottom: 0.5rem;
        }
        
        .section-title:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background-color: var(--primary-color);
        }
        
        .section-content {
            line-height: 1.6;
            color: var(--light-text);
        }
        
        /* Features Grid */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .feature-card {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 1.5rem;
            transition: all 0.2s;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.05);
        }
        
        .feature-title {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
            color: var(--text-color);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .feature-title i {
            color: var(--primary-color);
        }
        
        .feature-desc {
            color: var(--light-text);
            line-height: 1.6;
        }
        
        /* Footer */
        .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
            text-align: center;
            color: var(--light-text);
            font-size: 0.875rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <section class="hero">
            <h1 class="hero-title">${companyName}</h1>
            <p class="hero-subtitle">${tagline}</p>
            <button class="cta-button">${ctaText}</button>
        </section>
        
        <section class="section">
            <h2 class="section-title">${aboutTitle}</h2>
            <div class="section-content">
                ${aboutContent}
            </div>
        </section>
        
        <section class="section">
            <h2 class="section-title">${featuresTitle}</h2>
            <div class="features-grid">
                ${features.map(feature => `
                    <div class="feature-card">
                        <h3 class="feature-title"><i class="${feature.icon}"></i> ${feature.title}</h3>
                        <p class="feature-desc">${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        
        <footer class="footer">
            ${footerText}<br>
            ${footerAdditional}
        </footer>
    </div>
</body>
</html>`;
}

// Copy code to clipboard
function copyCodeToClipboard() {
    const htmlCode = generateFullHtml();
    navigator.clipboard.writeText(htmlCode).then(() => {
        alert('HTML code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy code. Please try again.');
    });
}

// Initialize the editor when DOM is loaded
document.addEventListener('DOMContentLoaded', initEditor);