const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");
const calendar = document.getElementById("calendar");
const selectedDatesBox = document.getElementById("selectedDates");
const cancelBookingBtn = document.getElementById("cancelBooking");

let selectedDates = [];
let bookedDates = ["5-9-2025", "12-9-2025", "18-9-2025", "25-9-2025"];

function populateDropdowns() {
  let currentYear = new Date().getFullYear();
  for (let y = currentYear; y <= currentYear + 2; y++) {
    let option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  months.forEach((m, i) => {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = m;
    monthSelect.appendChild(option);
  });

  yearSelect.value = 2025;
  monthSelect.value = 8; // September (0-indexed)
  generateCalendar();
}

function generateCalendar() {
  calendar.innerHTML = "";
  let year = parseInt(yearSelect.value);
  let month = parseInt(monthSelect.value);
  let daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    let btn = document.createElement("div");
    btn.textContent = day;
    btn.classList.add("day");

    let dateKey = `${day}-${month+1}-${year}`;

    if (bookedDates.includes(dateKey)) {
      btn.classList.add("booked");
    } else {
      btn.classList.add("available");
      btn.onclick = () => toggleDate(dateKey, btn);
    }

    calendar.appendChild(btn);
  }
}

function toggleDate(dateKey, btn) {
  if (selectedDates.includes(dateKey)) {
    selectedDates = selectedDates.filter(d => d !== dateKey);
    btn.classList.remove("selected");
    btn.classList.add("available");
  } else {
    selectedDates.push(dateKey);
    btn.classList.remove("available");
    btn.classList.add("selected");
  }
  selectedDatesBox.value = selectedDates.join(", ");
}

document.getElementById("bookingForm").onsubmit = (e) => {
  e.preventDefault();
  if (selectedDates.length === 0) {
    alert("Please select at least one date!");
    return;
  }
  alert("✅ Booking Confirmed!\nHall: " + document.getElementById("selectedHall").value +
        "\nDates: " + selectedDates.join(", ") +
        "\nPayment: " + document.getElementById("paymentOption").value);
};

cancelBookingBtn.onclick = () => {
  selectedDates = [];
  selectedDatesBox.value = "";
  generateCalendar();
  alert("❌ Booking Cancelled");
};

yearSelect.onchange = generateCalendar;
monthSelect.onchange = generateCalendar;

populateDropdowns();
