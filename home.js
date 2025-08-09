const holidays = {
  "mannam jayanthi": "2026-01-02",
  "republic day": "2026-01-26",
  "maha shivratri": "2026-02-26",
  "holi": "2026-03-14",
  "eid": "2026-03-31",
  "vishu": "2026-04-14",
  "good friday": "2026-04-18",
  "bakrid": "2026-06-07",
  "karkkidaka vavu": "2026-07-24",
  "independence day": "2025-08-15",
  "onam": "2025-09-04",
  "milad-un-nabi": "2025-09-05",
  "mahanavami": "2025-10-01",
  "gandhi jayanti": "2025-10-02",
  "diwali": "2025-10-20",
  "christmas": "2025-12-25",
  "new year": "2026-01-01"
};

let countdownInterval;


function levenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          matrix[i][j - 1] + 1,     
          matrix[i - 1][j] + 1      
        );
      }
    }
  }

  return matrix[b.length][a.length];
}


function findClosestHoliday(input) {
  input = input.toLowerCase().trim();
  let closest = null;
  let minDistance = Infinity;

  for (const holiday in holidays) {
    const distance = levenshtein(input, holiday);
    if (distance < minDistance && distance <= holiday.length * 0.2) {
      minDistance = distance;
      closest = holiday;
    }
  }

  return closest;
}

function findHoliday() {
  const input = document.getElementById("holidayInput").value;

  const closestHoliday = findClosestHoliday(input);
  if (!closestHoliday) {
    alert("Holiday not found in list!");
    return;
  }

  const holidayDate = new Date(holidays[closestHoliday]);
  updateHolidayDisplay(holidayDate);
}

function updateHolidayDisplay(holidayDate) {
  const month = holidayDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  const day = holidayDate.getDate();

  document.getElementById("monthDisplay").innerText = month;
  generateCalendar(holidayDate, day);

  if (countdownInterval) clearInterval(countdownInterval);
  startCountdown(holidayDate);
}

function generateCalendar(date, highlightDay) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar = document.getElementById("calendarBody");

  calendar.innerHTML = "";
  let dayCounter = 1;

  for (let row = 0; row < 6; row++) {
    let rowHTML = "<tr>";
    for (let col = 0; col < 7; col++) {
      if ((row === 0 && col < firstDay) || dayCounter > daysInMonth) {
        rowHTML += "<td></td>";
      } else {
        const activeClass = (dayCounter === highlightDay) ? "active" : "";
        rowHTML += `<td class="${activeClass}">${dayCounter}</td>`;
        dayCounter++;
      }
    }
    rowHTML += "</tr>";
    calendar.innerHTML += rowHTML;
    if (dayCounter > daysInMonth) break;
  }
}

function startCountdown(targetDate) {
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      document.getElementById("countdown").innerHTML = "🎉 Holiday is here!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function showOtherHolidays(selectedHoliday) {
  const listContainer = document.getElementById("otherHolidays");
  listContainer.innerHTML = ""; 

  const selectedDate = new Date(holidays[selectedHoliday]);
  const holidayEntries = Object.entries(holidays);

  const upcoming = holidayEntries.filter(([name, date]) => {
    return new Date(date) > selectedDate;
  });

  upcoming.sort((a, b) => new Date(a[1]) - new Date(b[1]));

  upcoming.forEach(([name, date]) => {
    const li = document.createElement("li");
    li.textContent = `${name.toUpperCase()} - ${date}`;
    listContainer.appendChild(li);
  });

  if (upcoming.length === 0) {
    listContainer.innerHTML = "<li>No more holidays after this date 🎉</li>";
  }
}



