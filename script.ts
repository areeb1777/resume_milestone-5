// Form and resume container elements
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

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Collect form values
  const username = (document.getElementById("username") as HTMLInputElement)
    .value;
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
  const profilePicInput = document.getElementById(
    "profilePic"
  ) as HTMLInputElement;
  const profilePicFile = profilePicInput.files?.[0];

  if (profilePicFile) {
    const reader = new FileReader();

    // When the file is read successfully
    reader.onload = (event) => {
      const profilePicURL = event.target?.result as string;

      // Dynamically update the resume with form data and profile picture
      renderResume(
        name,
        email,
        contact,
        degree,
        institution,
        gradYear,
        skills,
        profilePicURL
      );
    };

    // Read the profile picture file as a Data URL
    reader.readAsDataURL(profilePicFile);
  } else {
    // If no profile picture is selected, display resume without it
    renderResume(
      name,
      email,
      contact,
      degree,
      institution,
      gradYear,
      skills,
      null
    );
  }

  // Generate a shareable URL based on username
  const shareableURL = `${window.location.origin}?username=${encodeURIComponent(
    username
  )}`;

  // Display the shareable link
  shareableLinkContainer.style.display = "block";
  shareableLinkElement.href = shareableURL;
  shareableLinkElement.textContent = shareableURL;
});

// Function to render the resume content
function renderResume(
  name: string,
  email: string,
  contact: string,
  degree: string,
  institution: string,
  gradYear: string,
  skills: string[],
  profilePicURL: string | null
) {
  resumeContainer.innerHTML = `
  <div class="profile">
  ${
    profilePicURL
      ? `<img src="${profilePicURL}" alt="Profile Picture" class="profile-pic">`
      : ""
  }
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
