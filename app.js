(function () {
  const yearSel = document.getElementById('yearSelect');
  const monthSel = document.getElementById('monthSelect');
  const cal = document.getElementById('calendar');
  const datesInput = document.getElementById('datesInput');
  const datesText = document.getElementById('selectedDatesText');

  const thisYear = new Date().getFullYear();
  // Years range: current .. current+2
  for (let y = thisYear; y <= thisYear + 2; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSel.appendChild(opt);
  }

  const monthNames = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  monthNames.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = i + 1; // 1..12
    opt.textContent = m;
    monthSel.appendChild(opt);
  });

  const today = new Date();
  yearSel.value = today.getFullYear();
  monthSel.value = today.getMonth() + 1;

  let selected = new Set();  // stores YYYY-MM-DD
  let bookedSet = new Set(); // current month booked dates

  function ymd(y, m, d) {
    return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  function renderCalendar() {
    cal.innerHTML = '';

    const y = parseInt(yearSel.value, 10);
    const m = parseInt(monthSel.value, 10); // 1..12

    const firstDow = new Date(y, m - 1, 1).getDay(); // 0..6 Sun..Sat
    const daysInMonth = new Date(y, m, 0).getDate();

    // Weekday header
    const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    weekdays.forEach(w => {
      const h = document.createElement('div');
      h.className = 'cell head';
      h.textContent = w;
      cal.appendChild(h);
    });

    // Leading blanks
    for (let i = 0; i < firstDow; i++) {
      const blank = document.createElement('div');
      blank.className = 'cell blank';
      cal.appendChild(blank);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell day';

      const isToday =
        d === today.getDate() &&
        m === (today.getMonth() + 1) &&
        y === today.getFullYear();

      const id = ymd(y, m, d);
      cell.textContent = d;

      if (bookedSet.has(id)) {
        cell.classList.add('booked');
        cell.disabled = true;
      } else {
        cell.classList.add('available');
      }
      if (selected.has(id)) cell.classList.add('selected');
      if (isToday) cell.classList.add('today');

      cell.addEventListener('click', () => {
        if (bookedSet.has(id)) return;
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
        updateSelectedUI();
        renderCalendar();
      });

      cal.appendChild(cell);
    }

    // Push trailing blanks to complete the final week grid if you want fixed rows
  }

  function updateSelectedUI() {
    const arr = Array.from(selected).sort();
    datesInput.value = arr.join(',');
    datesText.value = arr.join(', ');
  }

  async function loadBooked() {
    const y = parseInt(yearSel.value, 10);
    const m = parseInt(monthSel.value, 10);
    const hallId = window.HALL_ID;
    const res = await fetch(`api/get_booked.php?hall_id=${hallId}&year=${y}&month=${m}`);
    const json = await res.json();
    bookedSet = new Set(json.booked || []);
    renderCalendar();
  }

  yearSel.addEventListener('change', loadBooked);
  monthSel.addEventListener('change', loadBooked);

  // Initial
  loadBooked();

  // Keep hall name sticky across pages (nice-to-have)
  const storedHall = localStorage.getItem('selectedHall');
  if (storedHall && document.getElementById('hallName')) {
    document.getElementById('hallName').textContent = storedHall;
    const hallInput = document.getElementById('hallInput');
    if (hallInput) hallInput.value = storedHall;
  }
})();
