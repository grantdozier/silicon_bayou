// Operator Standard Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Task Creation Prototype Demo
    initTaskCreationPrototype();
    
    // Playback State Demo
    initPlaybackDemo();
    
    // AI Alignment Demo
    initAIDemo();
});

// Task Creation Prototype - Zero Friction Flow
function initTaskCreationPrototype() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const emptyState = document.getElementById('emptyState');
    const lockBtn = document.getElementById('lockTasks');
    const clearBtn = document.getElementById('clearTasks');
    
    if (!taskInput || !taskList) return;
    
    let tasks = [];
    let isLocked = false;
    let editingIndex = null;
    
    function updateDisplay() {
        // Update task count
        const count = tasks.length;
        taskCount.textContent = `${count} task${count !== 1 ? 's' : ''}`;
        
        // Show/hide empty state
        if (emptyState) {
            emptyState.style.display = count === 0 ? 'flex' : 'none';
        }
        
        // Enable/disable lock button
        if (lockBtn) {
            lockBtn.disabled = count === 0 || isLocked;
        }
        
        // Render tasks
        renderTasks();
    }
    
    function renderTasks() {
        // Remove existing task items (keep empty state)
        const existingItems = taskList.querySelectorAll('.task-item');
        existingItems.forEach(item => item.remove());
        
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            if (editingIndex === index) {
                taskItem.classList.add('editing');
            }
            
            if (editingIndex === index && !isLocked) {
                // Edit mode
                taskItem.innerHTML = `
                    <span class="task-number">${String(index + 1).padStart(2, '0')}</span>
                    <input type="text" class="task-edit-input" value="${escapeHtml(task)}" data-index="${index}">
                    <button class="task-delete" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                
                // Focus the input after render
                setTimeout(() => {
                    const input = taskItem.querySelector('.task-edit-input');
                    if (input) {
                        input.focus();
                        input.select();
                    }
                }, 0);
            } else {
                // Display mode
                taskItem.innerHTML = `
                    <span class="task-number">${String(index + 1).padStart(2, '0')}</span>
                    <span class="task-text-display">${escapeHtml(task)}</span>
                    ${!isLocked ? `<button class="task-delete" data-index="${index}"><i class="fas fa-trash-alt"></i></button>` : ''}
                `;
            }
            
            taskList.appendChild(taskItem);
        });
        
        // Add event listeners
        addTaskItemListeners();
    }
    
    function addTaskItemListeners() {
        // Click to edit
        taskList.querySelectorAll('.task-text-display').forEach(el => {
            el.addEventListener('click', function() {
                if (isLocked) return;
                const item = this.closest('.task-item');
                const index = Array.from(taskList.querySelectorAll('.task-item')).indexOf(item);
                editingIndex = index;
                renderTasks();
            });
        });
        
        // Edit input handlers
        taskList.querySelectorAll('.task-edit-input').forEach(input => {
            input.addEventListener('keydown', function(e) {
                const index = parseInt(this.dataset.index);
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const newValue = this.value.trim();
                    if (newValue) {
                        tasks[index] = newValue;
                    }
                    editingIndex = null;
                    renderTasks();
                    taskInput.focus();
                } else if (e.key === 'Escape') {
                    editingIndex = null;
                    renderTasks();
                    taskInput.focus();
                }
            });
            
            input.addEventListener('blur', function() {
                const index = parseInt(this.dataset.index);
                const newValue = this.value.trim();
                if (newValue) {
                    tasks[index] = newValue;
                }
                editingIndex = null;
                renderTasks();
            });
        });
        
        // Delete buttons
        taskList.querySelectorAll('.task-delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                tasks.splice(index, 1);
                editingIndex = null;
                updateDisplay();
            });
        });
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Main input - add task on Enter
    taskInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = this.value.trim();
            if (value && !isLocked) {
                tasks.push(value);
                this.value = '';
                updateDisplay();
                // Keep focus on input for rapid entry
                this.focus();
            }
        }
    });
    
    // Lock button
    if (lockBtn) {
        lockBtn.addEventListener('click', function() {
            if (tasks.length === 0) return;
            
            isLocked = true;
            this.innerHTML = '<i class="fas fa-lock"></i> Standard Locked';
            this.classList.add('locked');
            this.disabled = true;
            taskInput.disabled = true;
            taskInput.placeholder = 'Daily standard is locked';
            editingIndex = null;
            renderTasks();
        });
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            tasks = [];
            isLocked = false;
            editingIndex = null;
            taskInput.disabled = false;
            taskInput.placeholder = 'Type a task and press Enter...';
            taskInput.value = '';
            if (lockBtn) {
                lockBtn.innerHTML = '<i class="fas fa-lock"></i> Lock Daily Standard';
                lockBtn.classList.remove('locked');
            }
            updateDisplay();
            taskInput.focus();
        });
    }
    
    // Initial display
    updateDisplay();
    
    // Auto-focus input
    taskInput.focus();
}

// Playback State Demo
function initPlaybackDemo() {
    const deviceScreen = document.getElementById('deviceScreen');
    const playIcon = document.getElementById('playIcon');
    const audioIndicator = document.getElementById('audioIndicator');
    const stateBtns = document.querySelectorAll('.state-btn');
    
    if (!deviceScreen || !audioIndicator || stateBtns.length === 0) return;
    
    const states = {
        playing: {
            screenOn: true,
            audioOn: true,
            iconClass: 'fa-play-circle'
        },
        locked: {
            screenOn: false,
            audioOn: true,
            iconClass: 'fa-lock'
        },
        background: {
            screenOn: false,
            audioOn: true,
            iconClass: 'fa-window-minimize'
        },
        paused: {
            screenOn: false,
            audioOn: false,
            iconClass: 'fa-pause-circle'
        }
    };
    
    function updateState(stateName) {
        const state = states[stateName];
        if (!state) return;
        
        // Update screen
        if (state.screenOn) {
            deviceScreen.classList.remove('locked');
            deviceScreen.innerHTML = `
                <div class="video-player">
                    <i class="fas fa-play-circle"></i>
                    <span class="video-title">Operator Instruction: Module 3</span>
                </div>
            `;
        } else {
            deviceScreen.classList.add('locked');
            deviceScreen.innerHTML = `
                <div class="video-player" style="opacity: 0.3;">
                    <i class="fas ${state.iconClass}"></i>
                    <span class="video-title">${stateName === 'locked' ? 'Screen Locked' : stateName === 'background' ? 'App Backgrounded' : 'Paused'}</span>
                </div>
            `;
        }
        
        // Update audio indicator
        if (state.audioOn) {
            audioIndicator.classList.remove('inactive');
            audioIndicator.innerHTML = '<i class="fas fa-volume-up"></i><span>Audio Active</span>';
        } else {
            audioIndicator.classList.add('inactive');
            audioIndicator.innerHTML = '<i class="fas fa-volume-mute"></i><span>Audio Stopped</span>';
        }
        
        // Update button states
        stateBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.state === stateName) {
                btn.classList.add('active');
            }
        });
    }
    
    stateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            updateState(this.dataset.state);
        });
    });
    
    // Initialize with playing state
    updateState('playing');
}

// AI Alignment Demo - Task Creation Context
function initAIDemo() {
    const scenarioSelect = document.getElementById('creationScenario');
    const generateBtn = document.getElementById('generateResponse');
    const aiOutput = document.getElementById('aiOutput');
    
    if (!scenarioSelect || !generateBtn || !aiOutput) return;
    
    const responses = {
        'no-conditioning': {
            trigger: 'No conditioning task added to daily plan',
            insight: 'Your stated goal is operational endurance, but you\'ve scheduled no conditioning for today.',
            context: 'Yesterday you also skipped conditioning. This is the third consecutive day without physical training.',
            directive: 'Either add a conditioning block now or explicitly acknowledge you are deprioritizing endurance this week.'
        },
        'vague-tasks': {
            trigger: 'Vague task definitions detected',
            insight: 'You\'ve added "work on project" and "do some reading" — these are intentions, not commitments.',
            context: 'Vague tasks have a 73% failure rate in your history. Specific tasks complete at 91%.',
            directive: 'Redefine each task with: duration, specific action, and completion criteria. "Read Chapter 4 of [Book] for 30 minutes" not "do some reading."'
        },
        'overloaded': {
            trigger: 'Overloaded schedule detected (12+ tasks)',
            insight: 'You\'ve scheduled 14 tasks. Your historical completion rate drops to 40% above 8 tasks.',
            context: 'Overcommitment is a form of self-deception. It allows you to feel productive while guaranteeing failure.',
            directive: 'Remove 6 tasks or combine related items. A shorter list executed fully outperforms a long list partially completed.'
        },
        'no-skill': {
            trigger: 'No skill development scheduled',
            insight: 'Your stated phase is "capability expansion" but today\'s plan contains no skill development.',
            context: 'You\'ve skipped skill blocks 4 of the last 7 days while claiming this as a priority.',
            directive: 'Add a minimum 30-minute skill block or update your phase to reflect actual behavior.'
        },
        'repeat-skip': {
            trigger: 'Repeating previously skipped tasks',
            insight: 'You\'ve added "morning conditioning" again — the same task you\'ve skipped 3 days in a row.',
            context: 'Repeating failed commitments without changing conditions is not planning. It\'s hoping.',
            directive: 'Either change the time, reduce the duration, or remove it entirely. Do not add the same task you\'ve proven you won\'t execute.'
        }
    };
    
    generateBtn.addEventListener('click', function() {
        const selectedScenario = scenarioSelect.value;
        const response = responses[selectedScenario];
        
        if (!response) return;
        
        // Show loading state
        aiOutput.innerHTML = `
            <div class="output-placeholder">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Analyzing task creation against stated goals...</span>
            </div>
        `;
        
        // Simulate processing delay
        setTimeout(() => {
            aiOutput.innerHTML = `
                <div class="ai-response">
                    <span class="trigger-label">Alignment Check: ${response.trigger}</span>
                    <div class="response-section">
                        <strong>Insight:</strong>
                        <p>${response.insight}</p>
                    </div>
                    <div class="response-section">
                        <strong>Context:</strong>
                        <p>${response.context}</p>
                    </div>
                    <div class="response-section directive">
                        <strong>Directive:</strong>
                        <p>${response.directive}</p>
                    </div>
                </div>
            `;
        }, 800);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.9)';
    }
});
