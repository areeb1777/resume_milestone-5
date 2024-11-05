"use strict";
// Form, resume container, and profile preview elements
const form = document.getElementById("resume-form");
const resumeContainer = document.getElementById("resume");
const shareableLinkContainer = document.getElementById("shareable-link-container");
const shareableLinkElement = document.getElementById("shareable-link");
const downloadPdfButton = document.getElementById("download-pdf");
const profilePicInput = document.getElementById("profilePic");
const profilePreview = document.getElementById("profilePreview");
// Profile picture preview on file selection
profilePicInput.addEventListener("change", () => {
    var _a;
    const profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (profilePicFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            profilePreview.src = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            profilePreview.style.display = "block"; // Show the preview image
        };
        reader.readAsDataURL(profilePicFile); // Read the file as Data URL
    }
});
// Form submit event listener
form.addEventListener("submit", (e) => {
    var _a;
    e.preventDefault();
    // Collect form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact")
        .value;
    const degree = document.getElementById("degree").value;
    const institution = document.getElementById("institution").value;
    const gradYear = document.getElementById("gradYear")
        .value;
    const skills = document.getElementById("skills").value.split(",");
    // Check if profile picture file is available and add to resume
    const profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (profilePicFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            const profilePicURL = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            // Dynamically update the resume with form data and profile picture
            resumeContainer.innerHTML = `
        <div class="profile">
          <img src="${profilePicURL}" alt="Profile Picture" class="profile-pic">
          <h1>${name}</h1>
          <p>${email} | ${contact}</p>
        </div>
        
        <div class="education">
          <h2> <i class="fa-solid fa-graduation-cap"></i> Education</h2>
          <p>${degree}, ${institution} (${gradYear})</p>
        </div>
        
        <div class="skills">
          <h2> <i class="fa-solid fa-gear"></i> Skills</h2>
          <ul>${skills.map((skill) => `<li>${skill.trim()}</li>`).join("")}</ul>
        </div>
      `;
            resumeContainer.style.display = "block";
        };
        reader.readAsDataURL(profilePicFile);
    }
    else {
        // Display resume without profile picture if not selected
        resumeContainer.innerHTML = `
      <div class="profile">
        <h1>${name}</h1>
        <p>${email} | ${contact}</p>
      </div>
      
      <div class="education">
        <h2> <i class="fa-solid fa-graduation-cap"></i> Education</h2>
        <p>${degree}, ${institution} (${gradYear})</p>
      </div>
      
      <div class="skills">
        <h2> <i class="fa-solid fa-gear"></i> Skills</h2>
        <ul>${skills.map((skill) => `<li>${skill.trim()}</li>`).join("")}</ul>
      </div>
    `;
        resumeContainer.style.display = "block";
        makeSectionsEditable();
    }
});
// Function to enable contenteditable for resume sections
function makeSectionsEditable() {
    const editableElements = resumeContainer.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach((element) => {
        element.addEventListener("input", (event) => {
            const target = event.target;
            console.log("Content updated:", target.textContent);
        });
    });
}
// Handle PDF download
downloadPdfButton.addEventListener("click", () => {
    window.print(); // This opens the print dialog to allow saving as PDF
});
// Prefill the form based on the username in the URL
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    if (username) {
        // Autofill form if data is found in localStorage
        const savedResumeData = localStorage.getItem(username);
        if (savedResumeData) {
            const resumeData = JSON.parse(savedResumeData);
            document.getElementById("username").value =
                username;
            document.getElementById("name").value =
                resumeData.name;
            document.getElementById("email").value =
                resumeData.email;
            document.getElementById("contact").value =
                resumeData.contact;
            document.getElementById("degree").value =
                resumeData.degree;
            document.getElementById("institution").value =
                resumeData.institution;
            document.getElementById("gradYear").value =
                resumeData.gradYear;
            document.getElementById("skills").value =
                resumeData.skills.join(", ");
        }
    }
});
