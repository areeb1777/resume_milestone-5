// Form, resume container, and profile preview elements
const form = document.getElementById("resume-form") as HTMLFormElement;
const resumeContainer = document.getElementById("resume") as HTMLDivElement;
const shareableLinkContainer = document.getElementById(
  "shareable-link-container"
) as HTMLDivElement;
const shareableLinkElement = document.getElementById(
  "shareable-link"
) as HTMLAnchorElement;
const downloadPdfButton = document.getElementById(
  "download-pdf"
) as HTMLButtonElement;
const profilePicInput = document.getElementById(
  "profilePic"
) as HTMLInputElement;
const profilePreview = document.getElementById(
  "profilePreview"
) as HTMLImageElement;

// Profile picture preview on file selection
profilePicInput.addEventListener("change", () => {
  const profilePicFile = profilePicInput.files?.[0];
  if (profilePicFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
      profilePreview.src = event.target?.result as string;
      profilePreview.style.display = "block"; // Show the preview image
    };
    reader.readAsDataURL(profilePicFile); // Read the file as Data URL
  }
});

// Form submit event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Collect form values
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const contact = (document.getElementById("contact") as HTMLInputElement)
    .value;
  const degree = (document.getElementById("degree") as HTMLInputElement).value;
  const institution = (
    document.getElementById("institution") as HTMLInputElement
  ).value;
  const gradYear = (document.getElementById("gradYear") as HTMLInputElement)
    .value;
  const skills = (
    document.getElementById("skills") as HTMLInputElement
  ).value.split(",");

  // Check if profile picture file is available and add to resume
  const profilePicFile = profilePicInput.files?.[0];
  if (profilePicFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const profilePicURL = event.target?.result as string;

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
  } else {
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
  const editableElements = resumeContainer.querySelectorAll(
    '[contenteditable="true"]'
  );
  editableElements.forEach((element) => {
    element.addEventListener("input", (event) => {
      const target = event.target as HTMLElement;
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
      (document.getElementById("username") as HTMLInputElement).value =
        username;
      (document.getElementById("name") as HTMLInputElement).value =
        resumeData.name;
      (document.getElementById("email") as HTMLInputElement).value =
        resumeData.email;
      (document.getElementById("contact") as HTMLInputElement).value =
        resumeData.contact;
      (document.getElementById("degree") as HTMLInputElement).value =
        resumeData.degree;
      (document.getElementById("institution") as HTMLInputElement).value =
        resumeData.institution;
      (document.getElementById("gradYear") as HTMLInputElement).value =
        resumeData.gradYear;
      (document.getElementById("skills") as HTMLInputElement).value =
        resumeData.skills.join(", ");
    }
  }
});
