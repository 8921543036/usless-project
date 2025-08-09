const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");

// Holiday data with date, history, and fun fact
const holidays = {
  "christmas": {
    date: "2025-12-25",
    history: "Christmas celebrates the birth of Jesus Christ, observed on December 25th since the 4th century.",
    funFact: "Did you know? The tradition of Christmas trees dates back to 16th-century Germany!"
  },
  "republic day": {
    date: "2026-01-26",
    history: "Republic Day marks the date on which the Constitution of India came into effect on 26 January 1950.",
    funFact: "The Republic Day parade in Delhi is a grand celebration showcasing India's cultural heritage."
  },
  "diwali": {
    date: "2025-10-20",
    history: "Diwali, the festival of lights, symbolizes the spiritual victory of light over darkness.",
    funFact: "Diwali is celebrated by millions with fireworks, sweets, and lighting lamps."
  },
  // Add more holidays here if needed
};

let lastQueriedHoliday = null;

// Utility to append message
function appendMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("bubble");
  msgDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
  msgDiv.textContent = message;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle quick suggestion button clicks
function sendQuick(text) {
  appendMessage(text, "user");
  const lowerText = text.toLowerCase();

  if (lowerText === "next holiday") {
    if (!lastQueriedHoliday) {
      appendMessage("Please ask about a holiday first.", "bot");
      return;
    }
    const nextHoliday = getNextHoliday(lastQueriedHoliday);
    if(nextHoliday === null) {
      appendMessage(`No upcoming holidays after ${capitalize(lastQueriedHoliday)}. 🎉`, "bot");
    } else {
      appendMessage(`The next holiday after ${capitalize(lastQueriedHoliday)} is ${capitalize(nextHoliday)} on ${holidays[nextHoliday].date}.`, "bot");
    }
  } else if (lowerText === "holiday fun fact") {
    if (!lastQueriedHoliday) {
      appendMessage("Please ask about a holiday first.", "bot");
      return;
    }
    appendMessage(holidays[lastQueriedHoliday].funFact, "bot");
  } else if (lowerText.startsWith("history of")) {
    if (!lastQueriedHoliday) {
      appendMessage("Please ask about a holiday first.", "bot");
      return;
    }
    appendMessage(holidays[lastQueriedHoliday].history, "bot");
  } else {
    // If user clicks a holiday button from quick suggestions
    const holidayName = lowerText.trim();
    if(holidays[holidayName]){
      lastQueriedHoliday = holidayName;
      appendMessage(`Sure! What do you want to know about ${capitalize(holidayName)}? You can ask for "Next Holiday", "Holiday Fun Fact", or "History of ${capitalize(holidayName)}".`, "bot");
    } else {
      appendMessage("Sorry, I don't have information on that holiday.", "bot");
    }
  }
}

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Get next holiday after the given holiday
function getNextHoliday(currentHoliday) {
  const currentDate = new Date(holidays[currentHoliday].date);
  const upcoming = Object.entries(holidays)
    .filter(([name, data]) => new Date(data.date) > currentDate)
    .sort((a, b) => new Date(a[1].date) - new Date(b[1].date));
  if (upcoming.length === 0) {
    return null;
  }
  return upcoming[0][0];
}

// Handle sending a message typed in input box
function sendMessage() {
  const text = userInput.value.trim().toLowerCase();
  if (!text) return;
  appendMessage(text, "user");
  userInput.value = "";

  
  const foundHoliday = Object.keys(holidays).find(h => text.includes(h));
  if (foundHoliday) {
    lastQueriedHoliday = foundHoliday;
    appendMessage(`Sure! What do you want to know about ${capitalize(foundHoliday)}? You can ask for "Next Holiday", "Holiday Fun Fact", or "History of ${capitalize(foundHoliday)}".`, "bot");
  } else if (text === "next holiday" || text === "holiday fun fact" || text.startsWith("history of")) {
   
    sendQuick(text);
  } else {
    appendMessage("Sorry, I don't have information on that holiday. Try asking about Christmas, Diwali, or Republic Day.", "bot");
  }
}
