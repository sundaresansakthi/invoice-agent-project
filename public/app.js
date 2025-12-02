let invoicesData = null;
let paymentsData = null;

const invoiceFileInput = document.getElementById("invoices-file");
const paymentFileInput = document.getElementById("payments-file");

const previewInvoicesBtn = document.getElementById("preview-invoices");
const previewPaymentsBtn = document.getElementById("preview-payments");

const invoiceTable = document.getElementById("invoice-table");
const paymentTable = document.getElementById("payment-table");

const invoiceStatus = document.getElementById("invoices-status");
const paymentStatus = document.getElementById("payments-status");


// ----------------------------------------------
// Show MULTIPLE selected file names
// ----------------------------------------------
function showSelectedFiles(inputElem, targetId) {
  const fileList = Array.from(inputElem.files).map(f => f.name);
  document.getElementById(targetId).textContent =
    fileList.length ? `Selected: ${fileList.join(", ")}` : "";
}

invoiceFileInput.addEventListener("change", () => {
  showSelectedFiles(invoiceFileInput, "invoices-file-name");
});

paymentFileInput.addEventListener("change", () => {
  showSelectedFiles(paymentFileInput, "payments-file-name");
});


// ----------------------------------------------
// Upload Invoices
// ----------------------------------------------
document.getElementById("upload-invoices").addEventListener("click", () => {
  readCSV(invoiceFileInput, (data) => {
    invoicesData = data;
    invoiceStatus.textContent = "Invoices uploaded successfully.";
    checkBothFilesUploaded();
    sendToBackend();
  });
});

// ----------------------------------------------
// Upload Payments
// ----------------------------------------------
document.getElementById("upload-payments").addEventListener("click", () => {
  readCSV(paymentFileInput, (data) => {
    paymentsData = data;
    paymentStatus.textContent = "Payments uploaded successfully.";
    checkBothFilesUploaded();
    sendToBackend();
  });
});


// ----------------------------------------------
// Ensure preview only works when BOTH uploaded
// ----------------------------------------------
function checkBothFilesUploaded() {
  const ready = invoicesData && paymentsData;
  previewInvoicesBtn.disabled = !ready;
  previewPaymentsBtn.disabled = !ready;
}

function remindIfMissing() {
  alert("Upload two files");
}


// ----------------------------------------------
// MULTI-FILE CSV Reader (merges all CSVs)
// ----------------------------------------------
function readCSV(input, callback) {
  if (!input.files.length) {
    remindIfMissing();
    return;
  }

  const files = Array.from(input.files);   // Multiple files support 🌿
  let combinedRows = [];
  let loadedCount = 0;

  files.forEach(file => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        combinedRows = combinedRows.concat(results.data);
        loadedCount++;

        // When ALL files are parsed → return merged dataset
        if (loadedCount === files.length) {
          callback(combinedRows);
        }
      }
    });
  });
}


// ----------------------------------------------
// Preview Table (shows first 5 rows)
// ----------------------------------------------
function previewTable(data, tableElem) {
  if (!data.length) return;

  let headers = Object.keys(data[0]);
  let snippet = data.slice(0, 5);

  let thead = tableElem.querySelector("thead");
  let tbody = tableElem.querySelector("tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Headers
  let headerRow = document.createElement("tr");
  headers.forEach(h => {
    let th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Rows
  snippet.forEach(row => {
    let tr = document.createElement("tr");
    headers.forEach(h => {
      let td = document.createElement("td");
      td.textContent = row[h] || "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}


// ----------------------------------------------
// Preview Buttons
// ----------------------------------------------
previewInvoicesBtn.addEventListener("click", () => {
  if (!invoicesData || !paymentsData) return remindIfMissing();
  previewTable(invoicesData, invoiceTable);
});

previewPaymentsBtn.addEventListener("click", () => {
  if (!invoicesData || !paymentsData) return remindIfMissing();
  previewTable(paymentsData, paymentTable);
});


// ----------------------------------------------
// Send datasets to backend (/save-json)
// ----------------------------------------------
function sendToBackend() {
  if (!invoicesData || !paymentsData) return;

  fetch("/save-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      invoices: invoicesData,
      payments: paymentsData
    })
  })
  .then(res => res.json())
  .then(result => {
    console.log("Backend save response:", result);
  })
  .catch(err => console.error("Save error:", err));
}
