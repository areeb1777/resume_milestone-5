"use strict";
// Form and resume container elements
const form = document.getElementById("resume-form");
const resumeContainer = document.getElementById("resume");
const shareableLinkContainer = document.getElementById("shareable-link-container");
const shareableLinkElement = document.getElementById("shareable-link");
const downloadPdfButton = document.getElementById("download-pdf");
// Handle form submission
form.addEventListener("submit", (e) => {
    var _a;
    e.preventDefault();
    // Collect form values
    const username = document.getElementById("username")
        .value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact")
        .value;
    const degree = document.getElementById("degree").value;
    const institution = document.getElementById("institution").value;
    const gradYear = document.getElementById("gradYear")
        .value;
    const skills = document.getElementById("skills").value.split(",");
    // Save form data in localStorage
    const resumeData = {
        name,
        email,
        contact,
        degree,
        institution,
        gradYear,
        skills,
    };
    localStorage.setItem(username, JSON.stringify(resumeData));
    // Handle profile picture
    const profilePicInput = document.getElementById("profilePic");
    const profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (profilePicFile) {
        const reader = new FileReader();
        // When the file is read successfully
        reader.onload = (event) => {
            var _a;
            const profilePicURL = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            // Dynamically update the resume with form data and profile picture
            renderResume(name, email, contact, degree, institution, gradYear, skills, profilePicURL);
        };
        // Read the profile picture file as a Data URL
        reader.readAsDataURL(profilePicFile);
    }
    else {
        // If no profile picture is selected, display resume without it
        renderResume(name, email, contact, degree, institution, gradYear, skills, null);
    }
    // Generate a shareable URL based on username
    const shareableURL = `${window.location.origin}?username=${encodeURIComponent(username)}`;
    // Display the shareable link
    shareableLinkContainer.style.display = "block";
    shareableLinkElement.href = shareableURL;
    shareableLinkElement.textContent = shareableURL;
});
// Function to render the resume content
function renderResume(name, email, contact, degree, institution, gradYear, skills, profilePicURL) {
    resumeContainer.innerHTML = `
  <div class="profile">
  ${profilePicURL
        ? `<img src="${profilePicURL}" alt="Profile Picture" class="profile-pic">`
        : ""}
  <h1 contenteditable="true">${name}</h1>
  <p contenteditable="true">${email} | ${contact}</p>
  </div>
  
  <div class="education">
  <h2><i class="fa-solid fa-graduation-cap"></i> Education</h2>
  <p contenteditable="true">${degree}, ${institution} (${gradYear})</p>
  </div>
  
  <div class="skills">
  <h2><i class="fa-solid fa-gear"></i> Skills</h2>
  <ul>${skills
        .map((skill) => `<li contenteditable="true">${skill.trim()}</li>`)
        .join("")}</ul>
  </div>
  `;
    // Display the resume
    resumeContainer.style.display = "block";
    // Make sections editable
    makeSectionsEditable();
}
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
