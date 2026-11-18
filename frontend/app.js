const clock = document.querySelector("#clock");

function updateClock() {
  const formatted = new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
  clock.textContent = `${formatted} SAST`;
}

updateClock();
setInterval(updateClock, 30_000);
