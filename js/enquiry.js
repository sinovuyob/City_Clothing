// ------- Config (edit these if needed) -------
const SEND_EMAIL_AFTER_SAVE = true;           // set to false to disable email handoff
const BUSINESS_EMAIL = "info@cityclothing.com"; // where emails should go
// --------------------------------------------

const form = document.getElementById("enquiryForm");
const successEl = document.getElementById("enquirySuccess");
const errorEl = document.getElementById("enquiryError");

function uid() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `CC-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-${Math.floor(Math.random()*900+100)}`;
}

function getFormValues() {
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    enquiryType: document.getElementById("enquiryType").value.trim(),
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    orderNumber: document.getElementById("orderNumber").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
    consent: document.getElementById("consent").checked
  };
}

function validate(values) {
  if (!values.enquiryType) return "Please select an enquiry type.";
  if (!values.fullName) return "Please enter your full name.";
  if (!values.email) return "Please enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return "Please enter a valid email address.";
  if (!values.subject) return "Please enter a subject.";
  if (!values.message) return "Please enter a message.";
  if (!values.consent) return "Please provide consent to proceed.";
  return null;
}

function saveLocal(values) {
  const key = "cityclothing_enquiries";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.push(values);
  localStorage.setItem(key, JSON.stringify(list));
}

function showAlert(el, msg) {
  el.textContent = msg;
  el.style.display = "block";
  // hide after a short delay
  setTimeout(() => (el.style.display = "none"), 8000);
}

function buildMailto(values) {
  const subject = encodeURIComponent(`[${values.id}] ${values.subject}`);
  const bodyLines = [
    `Enquiry ID: ${values.id}`,
    `Date: ${new Date(values.createdAt).toLocaleString()}`,
    `Type: ${values.enquiryType}`,
    `Name: ${values.fullName}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || "-"}`,
    `Order #: ${values.orderNumber || "-"}`,
    "",
    "Message:",
    values.message
  ];
  const body = encodeURIComponent(bodyLines.join("\n"));
  return `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.style.display = "none";
  successEl.style.display = "none";

  const values = getFormValues();
  const err = validate(values);
  if (err) {
    showAlert(errorEl, err);
    return;
  }

  try {
    saveLocal(values);
    showAlert(successEl, `Thank you! Your enquiry was submitted. Reference: ${values.id}`);
    form.reset();

    if (SEND_EMAIL_AFTER_SAVE) {
      // Handoff to user's email client with prefilled message
      window.location.href = buildMailto(values);
    }
  } catch (e) {
    console.error(e);
    showAlert(errorEl, "Something went wrong while saving your enquiry. Please try again.");
  }
});
