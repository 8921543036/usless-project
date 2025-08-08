const holidays = {
  "onam": "2025-09-04",
  "christmas": "2025-12-25",
  "new year": "2026-01-01",
  "eid": "2025-03-31",
  "diwali": "2025-10-20",
  "karkkidaka vavu": "2025-08-13"
};

let countdownInterval;

async function findHoliday() {
  const input = document.getElementById("holidayInput").value.toLowerCase().trim();
  
  try {
    // First check local holidays
    const dateStr = holidays[input];
    if (dateStr) {
      updateHolidayDisplay(new Date(dateStr));
      return;
    }

    // If not found locally, try the API
    const currentYear = new Date().getFullYear();
    const response = await fetch(`https://holidayapi.com/v1/holidays?key=e1cd0eca-b99b-4312-b95f-5edab411d40a&country=IN&year=${currentYear}`);
    const data = await response.json();

    console.log(data);
    if (data.holidays) {
      // holidayapi.com returns an object, so we need to flatten it
      const holidayList = Object.values(data.holidays).flat();
      const holiday = holidayList.find(h => h.name.toLowerCase().includes(input));
      if (holiday) {
        updateHolidayDisplay(new Date(holiday.date));
        return;
      }
    }
    
    alert("Holiday not found!");
  } catch (error) {
    console.error("Error fetching holiday data:", error);
    alert("Error searching for holiday. Please try again.");
  }
}

function updateHolidayDisplay(holidayDate) {
  const month = holidayDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  const day = holidayDate.getDate();

  // Update month title
  document.getElementById("monthDisplay").innerText = month;

  // Generate calendar for that month
  generateCalendar(holidayDate, day);

  // Start countdown
  if (countdownInterval) clearInterval(countdownInterval);
  startCountdown(holidayDate);
}

function generateCalendar(date, highlightDay) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // Sunday=0
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
