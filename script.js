// Firebase SDKs (FREE)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -------------------------
// DOM Elements
// -------------------------
const form = document.getElementById('applicationForm');
const fileInput = document.getElementById('resume');
const dropZone = document.getElementById('dropZone');
const fileNameDisplay = document.getElementById('fileName');
const btn = form.querySelector('button[type="submit"]');
const originalBtnHTML = btn.innerHTML;

// -------------------------
// Firebase Setup
// -------------------------
const firebaseConfig = {
  apiKey: "AIzaSyB4Ajp8B1UXOsfWFus5Vlr60vLCQBX7g2k",
  authDomain: "genesis-applications.firebaseapp.com",
  projectId: "genesis-applications",
  storageBucket: "genesis-applications.firebasestorage.app",
  messagingSenderId: "387196127500",
  appId: "1:387196127500:web:414f36dbf2852f53eb2129"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =========================
// File Upload UI Interaction (cosmetic only)
// =========================
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    const fileName = e.target.files[0].name;
    fileNameDisplay.textContent = fileName;
    fileNameDisplay.classList.add('text-cyan-400');
    dropZone.style.borderColor = 'var(--primary)';
    dropZone.style.background = 'rgba(0, 212, 255, 0.1)';
  } else {
    fileNameDisplay.textContent = 'Click or drag file to upload';
    fileNameDisplay.classList.remove('text-cyan-400');
    dropZone.style.borderColor = '';
    dropZone.style.background = '';
  }
});

// =========================
// Drag-and-Drop Visual Feedback
// =========================
['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-active'), false);
});
['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-active'), false);
});

// =========================
// Form Submission with Firestore
// =========================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Loading state
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  btn.disabled = true;
  btn.classList.add('opacity-75', 'cursor-not-allowed');

  try {
    // ---- Get form values ----
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // ---- Save to Firestore ----
    await addDoc(collection(db, 'applications'), {
      fullName,
      email,
      phone,
      createdAt: serverTimestamp()
    });

    // ---- Success UI ----
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Sent Successfully!';
    btn.classList.remove('from-cyan-500', 'to-blue-600');
    btn.classList.add('bg-green-500', 'hover:bg-green-600');

    // ---- Reset Form After Delay ----
    setTimeout(() => {
      form.reset();
      fileNameDisplay.textContent = 'Click or drag file to upload';
      fileNameDisplay.classList.remove('text-cyan-400');
      dropZone.style.borderColor = '';
      dropZone.style.background = '';

      btn.innerHTML = originalBtnHTML;
      btn.disabled = false;
      btn.classList.remove('opacity-75', 'cursor-not-allowed', 'bg-green-500', 'hover:bg-green-600');
      btn.classList.add('from-cyan-500', 'to-blue-600');

    }, 2000);

  } catch (error) {
    console.error("Submission error:", error);
    alert(error.message);

    btn.innerHTML = originalBtnHTML;
    btn.disabled = false;
    btn.classList.remove('opacity-75', 'cursor-not-allowed');
  }
});
