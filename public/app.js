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

document.getElementById("upload-invoices").addEventListener("click", () => {
  readCSV(invoiceFileInput, (data) => {
    invoicesData = data;
    invoiceStatus.textContent = "Invoices uploaded successfully.";
    checkBothFilesUploaded();
    sendToBackend(); // ⬅ sends JSON to backend if both uploaded
  });
});

document.getElementById("upload-payments").addEventListener("click", () => {
  readCSV(paymentFileInput, (data) => {
    paymentsData = data;
    paymentStatus.textContent = "Payments uploaded successfully.";
    checkBothFilesUploaded();
    sendToBackend(); // ⬅ sends JSON to backend if both uploaded
  });
});

// Enable preview only when both files are uploaded
function checkBothFilesUploaded() {
  const ready = invoicesData && paymentsData;
  previewInvoicesBtn.disabled = !ready;
  previewPaymentsBtn.disabled = !ready;
}

// Reminder message
function remindIfMissing() {
  alert("Upload two files");
}

// Read CSV
function readCSV(input, callback) {
  if (!input.files.length) {
    remindIfMissing();
    return;
  }

  Papa.parse(input.files[0], {
    header: true,
    complete: function (results) {
      callback(results.data);
    }
  });
}

// Show only first 5 rows
function previewTable(data, tableElem) {
  let headers = Object.keys(data[0]);
  let firstFive = data.slice(0, 5);

  let thead = tableElem.querySelector("thead");
  let tbody = tableElem.querySelector("tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Create header row
  let trHead = document.createElement("tr");
  headers.forEach(h => {
    let th = document.createElement("th");
    th.textContent = h;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  // Create body rows
  firstFive.forEach(row => {
    let tr = document.createElement("tr");
    headers.forEach(h => {
      let td = document.createElement("td");
      td.textContent = row[h] || "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Preview buttons
previewInvoicesBtn.addEventListener("click", () => {
  if (!invoicesData || !paymentsData) {
    return remindIfMissing();
  }
  previewTable(invoicesData, invoiceTable);
});

previewPaymentsBtn.addEventListener("click", () => {
  if (!invoicesData || !paymentsData) {
    return remindIfMissing();
  }
  previewTable(paymentsData, paymentTable);
});


// 🟦 NEW: Send JSON to backend to save into invoices.json & payments.json
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
