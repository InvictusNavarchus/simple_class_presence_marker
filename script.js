// Student names data
const studentNames = [
    "ADIBA AISYAH PUTRI",
    "ADILA BELA SAPUTRI",
    "AHMAD NUR ALAMSYAH",
    "AISYA PUTRI NUR HIDAYATI",
    "AL GHOZALI ANTONIO BAYUMI AKBAR",
    "ANANTA PRAMUDITA IKA PRASETYAS",
    "ANYA AZARIA YUAS",
    "CHINDY DIKA DWIYANTI",
    "DERY SETIAWAN",
    "DEWI AULIYA FEBIYANTI",
    "DHIYA ATHIYYAH KULTSUM",
    "DIANA HANIFATUNISA",
    "EIVA SYAIDATUNNISA",
    "ELZA RAFOEL",
    "FARHAN ADITYA NUGRAHA",
    "INTAN NURAENI",
    "KIKI PADILAH",
    "MAHARANI WIDYA PRAMITHA",
    "MAULIDA NUR AFIFAH",
    "MULAWARMAN",
    "NADHIFAH RAHMAH CITRA",
    "NANDA RIZKA",
    "NAUFAL ALYASDIANSYAH SAPUTRA",
    "NORMA DAMAYANTI",
    "NURAINUN AL ZELDA",
    "RAIDA PUTRI NADIA",
    "RAISYA AULIA PRAMESWARI SA'DIY",
    "RANGGA SETIAWAN",
    "RAZZAN FAZRUL FALAH",
    "SALSA DENABEL HARDIMAN",
    "SAVIRA ADELIA",
    "SELMA ADELIA FITRIAH",
    "SHABRINA AZ-ZAHRA",
    "SHAFANA FADILA",
    "SILVI HOLIFAH",
    "SILVIATI APASTA",
    "TASYA SASA SABILAH",
    "TUBAGUS RESTU TAURA FADILAH",
    "ZAHROTUL KAMILA",
    "ZAKIYAH RASIKHATUN NASIROH",
    "ZALFFA FADHILATUL ADZANI"
];

// Status codes
const STATUS = {
    UNCHECKED: 0,
    PRESENT: 1,
    PERMITTED: 2,
    SICK: 3,
    ABSENT: 4
};

// Initialize state with a function instead of a global variable
let attendanceData = null;

function getInitialState() {
    return {
        subject: '',
        date: '',
        day: '',
        time: '',
        students: {}
    };
}

// DOM elements
const currentDateEl = document.getElementById('current-date');
const currentDayEl = document.getElementById('current-day');
const currentTimeEl = document.getElementById('current-time');
const subjectNameEl = document.getElementById('subject-name');
const studentListEl = document.getElementById('student-list');
const exportTxtBtn = document.getElementById('export-txt');
const copyClipboardBtn = document.getElementById('copy-clipboard');

// Initialize the app
function init() {
    // Load data from localStorage FIRST
    loadFromLocalStorage();
    
    // If no data was loaded, initialize with default state
    if (!attendanceData) {
        attendanceData = getInitialState();
    }
    
    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update time every minute
    
    // Initialize student list with default values if not loaded
    initializeStudentList();
    
    // Render student list
    renderStudentList();
    
    // Set up event listeners
    setupEventListeners();
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    const timeStr = now.toLocaleTimeString('en-US', timeOptions);
    
    currentDateEl.textContent = dateStr;
    currentDayEl.textContent = dayOfWeek;
    currentTimeEl.textContent = timeStr;
    
    attendanceData.date = dateStr;
    attendanceData.day = dayOfWeek;
    attendanceData.time = timeStr;
    
    saveToLocalStorage();
}

// Initialize student list
function initializeStudentList() {
    if (Object.keys(attendanceData.students).length === 0) {
        studentNames.forEach(name => {
            attendanceData.students[name] = STATUS.UNCHECKED;
        });
    }
}

// Render student list
function renderStudentList() {
    studentListEl.innerHTML = '';
    
    studentNames.forEach((name, index) => {
        const status = attendanceData.students[name] || STATUS.UNCHECKED;
        
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        
        const studentNumber = document.createElement('div');
        studentNumber.className = 'student-number';
        studentNumber.textContent = (index + 1) + '.';
        
        const studentName = document.createElement('div');
        studentName.className = 'student-name';
        studentName.textContent = name;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'attendance-checkbox';
        checkbox.dataset.name = name;
        
        updateCheckboxStyle(checkbox, status);
        
        studentItem.appendChild(studentNumber);
        studentItem.appendChild(studentName);
        studentItem.appendChild(checkbox);
        studentListEl.appendChild(studentItem);
    });
}

// Update checkbox style based on status
function updateCheckboxStyle(checkbox, status) {
    checkbox.className = 'attendance-checkbox';
    checkbox.checked = status !== STATUS.UNCHECKED;
    
    if (status === STATUS.PRESENT) {
        checkbox.classList.add('present');
    } else if (status === STATUS.PERMITTED) {
        checkbox.classList.add('permitted');
    } else if (status === STATUS.SICK) {
        checkbox.classList.add('sick');
    } else if (status === STATUS.ABSENT) {
        checkbox.classList.add('absent');
    }
}

// Toggle attendance status
function toggleAttendance(name) {
    let currentStatus = attendanceData.students[name];
    
    // Cycle through statuses
    switch (currentStatus) {
        case STATUS.UNCHECKED:
            attendanceData.students[name] = STATUS.PRESENT;
            break;
        case STATUS.PRESENT:
            attendanceData.students[name] = STATUS.PERMITTED;
            break;
        case STATUS.PERMITTED:
            attendanceData.students[name] = STATUS.SICK;
            break;
        case STATUS.SICK:
            attendanceData.students[name] = STATUS.ABSENT;
            break;
        case STATUS.ABSENT:
            attendanceData.students[name] = STATUS.UNCHECKED;
            break;
        default:
            attendanceData.students[name] = STATUS.PRESENT;
    }
    
    saveToLocalStorage();
    return attendanceData.students[name];
}

// Set up event listeners
function setupEventListeners() {
    // Subject name change
    subjectNameEl.addEventListener('input', function(e) {
        attendanceData.subject = e.target.value;
        saveToLocalStorage();
    });
    
    // Load subject from localStorage if available
    if (attendanceData.subject) {
        subjectNameEl.value = attendanceData.subject;
    }
    
    // Student attendance checkboxes
    studentListEl.addEventListener('click', function(e) {
        if (e.target.classList.contains('attendance-checkbox')) {
            const name = e.target.dataset.name;
            const newStatus = toggleAttendance(name);
            updateCheckboxStyle(e.target, newStatus);
        }
    });
    
    // Export to TXT
    exportTxtBtn.addEventListener('click', exportToTxt);
    
    // Copy to clipboard
    copyClipboardBtn.addEventListener('click', copyToClipboard);
}

// Export to TXT
function exportToTxt() {
    const subject = attendanceData.subject || 'Untitled Subject';
    const date = attendanceData.date;
    const day = attendanceData.day;
    
    let content = `${subject} Attendance\n`;
    content += `${date} (${day})\n\n`;
    
    const presentStudents = [];
    const permittedStudents = [];
    const sickStudents = [];
    const absentStudents = [];
    
    for (const name of studentNames) {
        const status = attendanceData.students[name];
        if (status === STATUS.PRESENT) {
            presentStudents.push(name);
        } else if (status === STATUS.PERMITTED) {
            permittedStudents.push(name);
        } else if (status === STATUS.SICK) {
            sickStudents.push(name);
        } else if (status === STATUS.ABSENT) {
            absentStudents.push(name);
        }
    }
    
    content += `PRESENT (${presentStudents.length}):\n`;
    presentStudents.forEach((name, index) => content += `${index + 1}. ${name}\n`);
    
    content += `\nPERMITTED (${permittedStudents.length}):\n`;
    permittedStudents.forEach((name, index) => content += `${index + 1}. ${name}\n`);
    
    content += `\nSICK (${sickStudents.length}):\n`;
    sickStudents.forEach((name, index) => content += `${index + 1}. ${name}\n`);
    
    content += `\nABSENT (${absentStudents.length}):\n`;
    absentStudents.forEach((name, index) => content += `${index + 1}. ${name}\n`);
    
    // Create download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject.replace(/\s+/g, '_')}_Attendance_${date.replace(/,\s/g, '_').replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Copy to clipboard
function copyToClipboard() {
    const subject = attendanceData.subject || 'Untitled Subject';
    const date = attendanceData.date;
    const day = attendanceData.day;
    
    let content = `${subject} Attendance\n`;
    content += `${date} (${day})\n\n`;
    
    const presentStudents = [];
    const permittedStudents = [];
    const sickStudents = [];
    const absentStudents = [];
    
    for (const name of studentNames) {
        const status = attendanceData.students[name];
        if (status === STATUS.PRESENT) {
            presentStudents.push(name);
        } else if (status === STATUS.PERMITTED) {
            permittedStudents.push(name);
        } else if (status === STATUS.SICK) {
            sickStudents.push(name);
        } else if (status === STATUS.ABSENT) {
            absentStudents.push(name);
        }
    }
    
    content += `PRESENT (${presentStudents.length}):\n`;
    presentStudents.forEach((name, index) => content += `${index + 1}. ${name}\n`);
    
    content += `\nPERMITTED (${permittedStudents.length}):\n`;
    permittedStudents.forEach((name, index) => content += `${index + 1}. ${name}\n`);
    
    content += `\nSICK (${sickStudents.length}):\n`;
    sickStudents.forEach((name, index) => content += `${index + 1}. ${name}\n`);
    
    content += `\nABSENT (${absentStudents.length}):\n`;
    absentStudents.forEach((name, index) => content += `${index + 1}. ${name}\n`);
    
    navigator.clipboard.writeText(content).then(() => {
        alert('Attendance copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}

// Save to local storage
function saveToLocalStorage() {
    try {
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Load from local storage
function loadFromLocalStorage() {
    try {
        const storedData = localStorage.getItem('attendanceData');
        if (storedData) {
            attendanceData = JSON.parse(storedData);
            console.log("Loaded data from localStorage:", attendanceData);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);