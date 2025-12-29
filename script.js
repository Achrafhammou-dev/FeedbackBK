const CONFIG = {
  GOOGLE_SHEETS_URL: "https://script.google.com/macros/s/AKfycbyZZamu-TlfA-uS6oYvPqzrY7s8p-lHq2otBtR17lksFD7-1aWvwWOS9tPnNgd-A8m_/exec" // <-- ضع الرابط ديالك هنا
};
async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

document.getElementById("complaintForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("fileUpload");
  let filesBase64 = [];

  for (let file of fileInput.files) {
    let base64 = await toBase64(file);
    filesBase64.push({
      name: file.name,
      content: base64
    });
  }

  const data = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    orderNumber: document.getElementById("orderNumber").value,
    complaintCategory: document.getElementById("complaintCategory").value,
    complaintDetails: document.getElementById("complaintDetails").value,
    files: filesBase64   // ✅ add files here
  };

  let res = await fetch(CONFIG.GOOGLE_SHEETS_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  let result = await res.json();
  if (result.result === "success") {
    document.getElementById("complaintForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";
  } else {
    alert("❌ Error: " + result.message);
  }
});
