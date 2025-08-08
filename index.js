// Wait for the page to load
window.onload = function () {
  setTimeout(function () {
    // Start fading out the welcome screen
    document.getElementById("introseen").style.opacity = 0;

    // Wait for fade-out to complete before redirecting
    setTimeout(function () {
      window.location.href = "home.html"; // Replace with your target page
    }, 200); // Match this with CSS transition duration
  }, 2000); // Show welcome screen for 2 seconds before fade starts
};
