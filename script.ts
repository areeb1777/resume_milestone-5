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

profilePicInput.addEventListener("change", () => {
  const profilePicFile = profilePicInput.files?.[0];
  if (profilePicFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
      profilePreview.src = event.target?.result as string;
      profilePreview.style.display = "block";
    };
    reader.readAsDataURL(profilePicFile);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

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

  const profilePicFile = profilePicInput.files?.[0];
  if (profilePicFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const profilePicURL = event.target?.result as string;

      updateResume(
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
    reader.readAsDataURL(profilePicFile);
  } else {
    updateResume(name, email, contact, degree, institution, gradYear, skills);
  }

  generateShareableLink(name);
});

function updateResume(
  name: string,
  email: string,
  contact: string,
  degree: string,
  institution: string,
  gradYear: string,
  skills: string[],
  profilePicURL: string = ""
) {
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
  const editableSections = resumeContainer.querySelectorAll(
    ".profile, .education, .skills"
  );
  editableSections.forEach((section) => {
    section.setAttribute("contenteditable", "true");
    section.addEventListener("input", () => {
      console.log("Content updated:", section.innerHTML);
    });
  });
}

function generateShareableLink(username: string) {
  const resumeData = {
    name: (document.getElementById("name") as HTMLInputElement).value,
    email: (document.getElementById("email") as HTMLInputElement).value,
    contact: (document.getElementById("contact") as HTMLInputElement).value,
    degree: (document.getElementById("degree") as HTMLInputElement).value,
    institution: (document.getElementById("institution") as HTMLInputElement)
      .value,
    gradYear: (document.getElementById("gradYear") as HTMLInputElement).value,
    skills: (document.getElementById("skills") as HTMLInputElement).value.split(
      ","
    ),
  };

  localStorage.setItem(username, JSON.stringify(resumeData));
  const shareableLink = `${window.location.origin}?username=${username}`;
  shareableLinkElement.href = shareableLink;
  shareableLinkElement.textContent = shareableLink;
  shareableLinkContainer.style.display = "block";
}

downloadPdfButton.addEventListener("click", () => {
  const resumeContent = document.getElementById("resume");

  if (!resumeContent) return;

  const printWindow = window.open("", "", "height=600,width=800");

  if (printWindow) {
    printWindow.document.write(
      "<html><head><title>Resume</title></head><body>"
    );
    printWindow.document.write(resumeContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  } else {
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
