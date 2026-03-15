// Initial data for the course
const initialOutcomes = [
    "Understand HTML structure and semantics",
    "Style web pages with CSS",
    "Add interactivity with JavaScript",
    "Build responsive layouts",
    "Debug web applications"
];

const initialModules = [
    {
        title: "Introduction to HTML",
        description: "Learn the basics of HTML and how to structure web content",
        type: "lesson",
        duration: "45 min",
        content: "HTML is the standard markup language for creating web pages..."
    },
    {
        title: "HTML Quiz",
        description: "Test your knowledge of HTML fundamentals",
        type: "quiz",
        duration: "20 min",
        questions: 10
    },
    {
        title: "CSS Basics",
        description: "Learn how to style your web pages with CSS",
        type: "lesson",
        duration: "60 min",
        content: "CSS (Cascading Style Sheets) is used to style and layout web pages..."
    }
];

// DOM elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const modulesContainer = document.getElementById('modules-container');
const outcomesContainer = document.getElementById('outcomes-container');
const addModuleBtn = document.getElementById('add-module');
const addOutcomeBtn = document.getElementById('add-outcome');
const newOutcomeInput = document.getElementById('new-outcome');
const moduleTypeSelect = document.getElementById('module-type');
const previewContainer = document.getElementById('live-preview');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const fullscreenPreviewBtn = document.getElementById('fullscreen-preview');
const courseImageInput = document.getElementById('course-image');
const imagePreview = document.getElementById('image-preview');
const copyCodeBtn = document.getElementById('copy-code');
const previewBtn = document.getElementById('preview-btn');
const courseTitleInput = document.getElementById('course-title');
const courseSubtitleInput = document.getElementById('course-subtitle');
const courseDescriptionInput = document.getElementById('course-description');
const courseDurationInput = document.getElementById('course-duration');
const courseLevelInput = document.getElementById('course-level');
const coursePrerequisitesInput = document.getElementById('course-prerequisites');

// Current state
let modules = [...initialModules];
let outcomes = [...initialOutcomes];
let courseImage = null;

// Initialize the editor
function initEditor() {
    // Render initial outcomes
    renderOutcomes();
    
    // Render initial modules
    renderModules();
    
    // Render initial preview
    updatePreview();
    
    // Set up tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
    });
    
    // Set up content editing
    const contentInputs = [
        courseTitleInput, courseSubtitleInput, courseDescriptionInput,
        courseDurationInput, courseLevelInput, coursePrerequisitesInput
    ];
    
    contentInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    // Course image upload
    courseImageInput.addEventListener('change', handleImageUpload);
    
    // Add module button
    addModuleBtn.addEventListener('click', addNewModule);
    
    // Add outcome button
    addOutcomeBtn.addEventListener('click', addNewOutcome);
    
    // Preview buttons
    refreshPreviewBtn.addEventListener('click', updatePreview);
    fullscreenPreviewBtn.addEventListener('click', openFullscreenPreview);
    previewBtn.addEventListener('click', updatePreview);
    
    // Back to templates link
    document.querySelector('.back-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Navigating back to templates...');
    });
    
    // Copy code button
    copyCodeBtn.addEventListener('click', copyCodeToClipboard);
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            courseImage = event.target.result;
            imagePreview.style.display = 'block';
            imagePreview.innerHTML = `<img src="${courseImage}" alt="Course Preview">`;
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

// Render learning outcomes
function renderOutcomes() {
    outcomesContainer.innerHTML = '';
    
    outcomes.forEach((outcome, index) => {
        const outcomeEl = document.createElement('div');
        outcomeEl.className = 'outcome-tag';
        outcomeEl.innerHTML = `
            ${outcome}
            <span class="remove-outcome" data-index="${index}">
                <i class="fas fa-times"></i>
            </span>
        `;
        
        outcomesContainer.appendChild(outcomeEl);
        
        // Set up remove outcome
        outcomeEl.querySelector('.remove-outcome').addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            outcomes.splice(index, 1);
            renderOutcomes();
            updatePreview();
        });
    });
}

// Add new outcome
function addNewOutcome() {
    const newOutcome = newOutcomeInput.value.trim();
    if (newOutcome && !outcomes.includes(newOutcome)) {
        outcomes.push(newOutcome);
        newOutcomeInput.value = '';
        renderOutcomes();
        updatePreview();
    }
}

// Render course modules
function renderModules() {
    modulesContainer.innerHTML = '';
    
    modules.forEach((module, index) => {
        const moduleEl = document.createElement('div');
        moduleEl.className = 'module-card';
        moduleEl.innerHTML = `
            <div class="module-header">
                <span class="module-title">${index + 1}. ${module.title}</span>
                <div class="module-actions">
                    <button class="module-btn expand-module" data-index="${index}">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button class="module-btn remove-module" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="module-expanded">
                <div class="form-group">
                    <label class="form-label">Module Title</label>
                    <input type="text" class="form-control module-title-input" data-index="${index}" value="${module.title}">
                </div>
                <div class="form-group">
                    <label class="form-label">Module Type</label>
                    <select class="form-control module-type-select" data-index="${index}">
                        <option value="lesson" ${module.type === 'lesson' ? 'selected' : ''}>Lesson</option>
                        <option value="quiz" ${module.type === 'quiz' ? 'selected' : ''}>Quiz</option>
                        <option value="assignment" ${module.type === 'assignment' ? 'selected' : ''}>Assignment</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Duration</label>
                    <input type="text" class="form-control module-duration-input" data-index="${index}" value="${module.duration}">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control module-desc-input" data-index="${index}" rows="4">${module.description}</textarea>
                </div>
                ${module.type === 'lesson' ? `
                    <div class="form-group">
                        <label class="form-label">Content</label>
                        <textarea class="form-control module-content-input" data-index="${index}" rows="6">${module.content}</textarea>
                    </div>
                ` : ''}
                ${module.type === 'quiz' ? `
                    <div class="form-group">
                        <label class="form-label">Number of Questions</label>
                        <input type="number" class="form-control module-questions-input" data-index="${index}" value="${module.questions}">
                    </div>
                ` : ''}
            </div>
        `;
        
        modulesContainer.appendChild(moduleEl);
        
        // Set up expand/collapse
        const expandBtn = moduleEl.querySelector('.expand-module');
        const expandedContent = moduleEl.querySelector('.module-expanded');
        
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
        
        // Set up remove module
        moduleEl.querySelector('.remove-module').addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            modules.splice(index, 1);
            renderModules();
            updatePreview();
        });
        
        // Set up module editing
        const titleInput = moduleEl.querySelector('.module-title-input');
        titleInput.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            modules[index].title = this.value;
            updatePreview();
            // Update the module header title
            const moduleHeader = this.closest('.module-card').querySelector('.module-title');
            moduleHeader.textContent = `${index + 1}. ${this.value}`;
        });
        
        const typeSelect = moduleEl.querySelector('.module-type-select');
        typeSelect.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            modules[index].type = this.value;
            // Update the module structure based on type
            renderModules();
            updatePreview();
        });
        
        const durationInput = moduleEl.querySelector('.module-duration-input');
        durationInput.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            modules[index].duration = this.value;
            updatePreview();
        });
        
        const descInput = moduleEl.querySelector('.module-desc-input');
        descInput.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            modules[index].description = this.value;
            updatePreview();
        });
        
        if (module.type === 'lesson') {
            const contentInput = moduleEl.querySelector('.module-content-input');
            contentInput.addEventListener('input', function() {
                const index = parseInt(this.getAttribute('data-index'));
                modules[index].content = this.value;
            });
        }
        
        if (module.type === 'quiz') {
            const questionsInput = moduleEl.querySelector('.module-questions-input');
            questionsInput.addEventListener('input', function() {
                const index = parseInt(this.getAttribute('data-index'));
                modules[index].questions = parseInt(this.value) || 0;
                updatePreview();
            });
        }
    });
}

// Add new module
function addNewModule() {
    const moduleType = moduleTypeSelect.value;
    const newModule = {
        title: `New ${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)}`,
        description: `Description of the ${moduleType}`,
        type: moduleType,
        duration: "30 min"
    };
    
    if (moduleType === 'lesson') {
        newModule.content = "Add your lesson content here...";
    } else if (moduleType === 'quiz') {
        newModule.questions = 5;
    }
    
    modules.push(newModule);
    renderModules();
    updatePreview();
    
    // Scroll to the new module
    const lastModule = modulesContainer.lastElementChild;
    lastModule.scrollIntoView({ behavior: 'smooth' });
    
    // Expand the new module
    const expandBtn = lastModule.querySelector('.expand-module');
    const expandedContent = lastModule.querySelector('.module-expanded');
    expandedContent.classList.add('active');
    const icon = expandBtn.querySelector('i');
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
}

// Update the preview
function updatePreview() {
    const courseTitle = courseTitleInput.value;
    const courseSubtitle = courseSubtitleInput.value;
    const courseDescription = courseDescriptionInput.value;
    const courseDuration = courseDurationInput.value;
    const courseLevel = courseLevelInput.value;
    const coursePrerequisites = coursePrerequisitesInput.value;
    
    previewContainer.innerHTML = `
        <div class="course-content">
            <header class="course-header">
                ${courseImage ? `<img src="${courseImage}" class="course-image" alt="${courseTitle}">` : ''}
                <h1 class="course-title">${courseTitle}</h1>
                <p class="course-subtitle">${courseSubtitle}</p>
                <div class="course-info">
                    ${courseDuration ? `<div class="info-item"><i class="fas fa-clock"></i> ${courseDuration}</div>` : ''}
                    ${courseLevel ? `<div class="info-item"><i class="fas fa-signal"></i> ${courseLevel}</div>` : ''}
                    ${coursePrerequisites ? `<div class="info-item"><i class="fas fa-book"></i> ${coursePrerequisites}</div>` : ''}
                </div>
            </header>
            
            <section class="course-section">
                <h2 class="section-title">About This Course</h2>
                <p class="section-description">${courseDescription}</p>
                
                <div class="outcomes-list">
                    <h3 class="outcomes-title">What You'll Learn</h3>
                    <div class="outcomes-grid">
                        ${outcomes.map(outcome => `
                            <div class="outcome-item">
                                <span class="outcome-icon"><i class="fas fa-check-circle"></i></span>
                                <span>${outcome}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="course-modules-list">
                    <h3 class="section-title">Course Curriculum</h3>
                    
                    ${modules.map((module, index) => `
                        <div class="module-item">
                            <div class="module-item-header">
                                <div class="module-item-type">
                                    ${module.type === 'lesson' ? '<i class="fas fa-book-open"></i>' : ''}
                                    ${module.type === 'quiz' ? '<i class="fas fa-question-circle"></i>' : ''}
                                    ${module.type === 'assignment' ? '<i class="fas fa-tasks"></i>' : ''}
                                </div>
                                <h4 class="module-item-title">${index + 1}. ${module.title}</h4>
                                <span class="module-item-duration">${module.duration}</span>
                            </div>
                            <div class="module-item-content">
                                <p class="module-item-description">${module.description}</p>
                                ${module.type === 'quiz' ? `<p class="quiz-info"><i class="fas fa-question"></i> ${module.questions} questions</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <footer class="course-footer">
                <p>© ${new Date().getFullYear()} ${courseTitle}. All rights reserved.</p>
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
    const courseTitle = courseTitleInput.value;
    const courseSubtitle = courseSubtitleInput.value;
    const courseDescription = courseDescriptionInput.value;
    const courseDuration = courseDurationInput.value;
    const courseLevel = courseLevelInput.value;
    const coursePrerequisites = coursePrerequisitesInput.value;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseTitle} | Online Course</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #4a6cf7;
            --secondary-color: #6c757d;
            --text-color: #212529;
            --light-text: #6c757d;
            --border-color: #dee2e6;
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
        .course-header {
            text-align: center;
            padding: 4rem 0;
            background: linear-gradient(135deg, var(--primary-color), #3a56d4);
            color: white;
        }
        
        .course-image {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .course-title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .course-subtitle {
            font-size: 1.25rem;
            margin-bottom: 1.5rem;
            opacity: 0.9;
        }
        
        .course-info {
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
        
        /* Course Sections */
        .course-section {
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
        
        /* Learning Outcomes */
        .outcomes-list {
            margin-bottom: 3rem;
        }
        
        .outcomes-title {
            font-size: 1.5rem;
            color: var(--text-color);
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .outcomes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .outcome-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1rem;
            background-color: var(--card-bg);
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .outcome-icon {
            color: var(--primary-color);
            font-size: 1.25rem;
            margin-top: 0.2rem;
        }
        
        /* Course Modules */
        .course-modules-list {
            margin-top: 3rem;
        }
        
        .module-item {
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s;
            margin-bottom: 1.5rem;
            background-color: var(--card-bg);
        }
        
        .module-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }
        
        .module-item-header {
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            cursor: pointer;
        }
        
        .module-item-type {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 1.2rem;
        }
        
        .module-item-content {
            padding: 0 1.5rem 1.5rem 1.5rem;
        }
        
        .module-item-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            flex-grow: 1;
        }
        
        .module-item-description {
            font-size: 0.9rem;
            color: var(--light-text);
        }
        
        .module-item-duration {
            font-size: 0.8rem;
            color: var(--secondary-color);
        }
        
        .quiz-info {
            background: #f0f7ff;
            padding: 0.3rem 0.5rem;
            border-radius: 4px;
            display: inline-block;
            font-size: 0.8rem;
            color: #2c6ecb;
            margin-top: 0.5rem;
        }
        
        .quiz-info i {
            margin-right: 0.3rem;
        }
        
        /* Footer */
        .course-footer {
            text-align: center;
            padding: 2rem;
            background-color: var(--primary-color);
            color: white;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .course-title {
                font-size: 2rem;
            }
            
            .course-subtitle {
                font-size: 1rem;
            }
            
            .outcomes-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="course-header">
        ${courseImage ? `<img src="${courseImage}" class="course-image" alt="${courseTitle}">` : ''}
        <h1 class="course-title">${courseTitle}</h1>
        <p class="course-subtitle">${courseSubtitle}</p>
        <div class="course-info">
            ${courseDuration ? `<div class="info-item"><i class="fas fa-clock"></i> ${courseDuration}</div>` : ''}
            ${courseLevel ? `<div class="info-item"><i class="fas fa-signal"></i> ${courseLevel}</div>` : ''}
            ${coursePrerequisites ? `<div class="info-item"><i class="fas fa-book"></i> ${coursePrerequisites}</div>` : ''}
        </div>
    </header>
    
    <section class="course-section">
        <h2 class="section-title">About This Course</h2>
        <p class="section-description">${courseDescription}</p>
        
        <div class="outcomes-list">
            <h3 class="outcomes-title">What You'll Learn</h3>
            <div class="outcomes-grid">
                ${outcomes.map(outcome => `
                    <div class="outcome-item">
                        <span class="outcome-icon"><i class="fas fa-check-circle"></i></span>
                        <span>${outcome}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="course-modules-list">
            <h3 class="section-title">Course Curriculum</h3>
            
            ${modules.map((module, index) => `
                <div class="module-item">
                    <div class="module-item-header">
                        <div class="module-item-type">
                            ${module.type === 'lesson' ? '<i class="fas fa-book-open"></i>' : ''}
                            ${module.type === 'quiz' ? '<i class="fas fa-question-circle"></i>' : ''}
                            ${module.type === 'assignment' ? '<i class="fas fa-tasks"></i>' : ''}
                        </div>
                        <h4 class="module-item-title">${index + 1}. ${module.title}</h4>
                        <span class="module-item-duration">${module.duration}</span>
                    </div>
                    <div class="module-item-content">
                        <p class="module-item-description">${module.description}</p>
                        ${module.type === 'quiz' ? `<p class="quiz-info"><i class="fas fa-question"></i> ${module.questions} questions</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
    
    <footer class="course-footer">
        <p>© ${new Date().getFullYear()} ${courseTitle}. All rights reserved.</p>
    </footer>
</body>
</html>`;
}

// Copy code to clipboard
async function copyCodeToClipboard() {
    try {
        const fullHtml = generateFullHtml();
        await navigator.clipboard.writeText(fullHtml);
        
        // Visual feedback
        const copyBtn = document.getElementById('copy-code');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.classList.add('btn-success');
        copyBtn.classList.remove('btn-outline');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('btn-success');
            copyBtn.classList.add('btn-outline');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
        
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = generateFullHtml();
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                const copyBtn = document.getElementById('copy-code');
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('btn-success');
                copyBtn.classList.remove('btn-outline');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('btn-success');
                    copyBtn.classList.add('btn-outline');
                }, 2000);
            } else {
                alert('Failed to copy code. Please copy manually.');
            }
        } catch (err) {
            alert('Failed to copy code. Please copy manually.');
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// Initialize the editor when the page loads
window.addEventListener('DOMContentLoaded', initEditor);