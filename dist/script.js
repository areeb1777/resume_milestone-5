"use strict";
const form = document.getElementById("resume-form");
const resumeContainer = document.getElementById("resume");
const shareableLinkContainer = document.getElementById("shareable-link-container");
const shareableLinkElement = document.getElementById("shareable-link");
const downloadPdfButton = document.getElementById("download-pdf");
const profilePicInput = document.getElementById("profilePic");
const profilePreview = document.getElementById("profilePreview");
profilePicInput.addEventListener("change", () => {
    var _a;
    const profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (profilePicFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            profilePreview.src = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            profilePreview.style.display = "block";
        };
        reader.readAsDataURL(profilePicFile);
    }
});
form.addEventListener("submit", (e) => {
    var _a;
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact")
        .value;
    const degree = document.getElementById("degree").value;
    const institution = document.getElementById("institution").value;
    const gradYear = document.getElementById("gradYear")
        .value;
    const skills = document.getElementById("skills").value.split(",");
    const profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (profilePicFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            const profilePicURL = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            updateResume(name, email, contact, degree, institution, gradYear, skills, profilePicURL);
        };
        reader.readAsDataURL(profilePicFile);
    }
    else {
        updateResume(name, email, contact, degree, institution, gradYear, skills);
    }
    generateShareableLink(name);
});
function updateResume(name, email, contact, degree, institution, gradYear, skills, profilePicURL = "") {
    const profilePicHTML = profilePicURL
        ? `<img src="${profilePicURL}" alt="Profile Picture" class="profile-pic">`
        : "";
    resumeContainer.innerHTML = `
    <div class="profile">
      ${profilePicHTML}
      <h1>${name}</h1>
      <p>${email} | ${contact}</p>
    </div>
    
    <div class="education">
      <h2><i class="fa-solid fa-graduation-cap"></i> Education</h2>
      <p>${degree}, ${institution} (${gradYear})</p>
    </div>
    
    <div class="skills">
      <h2><i class="fa-solid fa-gear"></i> Skills</h2>
      <ul>${skills.map((skill) => `<li>${skill.trim()}</li>`).join("")}</ul>
    </div>
  `;
    resumeContainer.style.display = "block";
    makeSectionsEditable();
}
function makeSectionsEditable() {
    const editableSections = resumeContainer.querySelectorAll(".profile, .education, .skills");
    editableSections.forEach((section) => {
        section.setAttribute("contenteditable", "true");
        section.addEventListener("input", () => {
            console.log("Content updated:", section.innerHTML);
        });
    });
}
function generateShareableLink(username) {
    const resumeData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        contact: document.getElementById("contact").value,
        degree: document.getElementById("degree").value,
        institution: document.getElementById("institution")
            .value,
        gradYear: document.getElementById("gradYear").value,
        skills: document.getElementById("skills").value.split(","),
    };
    localStorage.setItem(username, JSON.stringify(resumeData));
    const shareableLink = `${window.location.origin}?username=${username}`;
    shareableLinkElement.href = shareableLink;
    shareableLinkElement.textContent = shareableLink;
    shareableLinkContainer.style.display = "block";
}
downloadPdfButton.addEventListener("click", () => {
    const resumeContent = document.getElementById("resume");
    if (!resumeContent)
        return;
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
        printWindow.document.write("<html><head><title>Resume</title></head><body>");
        printWindow.document.write(resumeContent.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
    }
    else {
        console.error("Failed to open print window.");
    }
});
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    if (username) {
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
