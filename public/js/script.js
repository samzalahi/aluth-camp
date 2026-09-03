// 1. Function to handle the smooth fade-out and removal animation
function dismissAlert(alertBox) {
  if (!alertBox || alertBox.classList.contains("opacity-0")) return;

  // Trigger Tailwind transition classes
  alertBox.classList.add("opacity-0", "scale-95");

  // Physically remove the element from the DOM after the animation completes (300ms)
  setTimeout(() => {
    alertBox.remove();
  }, 300);
}

// 2. Manual Dismiss: Listen for clicks on the close button
document.addEventListener("click", function (event) {
  const dismissButton = event.target.closest('[data-dismiss="alert"]');
  if (dismissButton) {
    const alertBox = dismissButton.closest(".alert");
    dismissAlert(alertBox);
  }
});

// 3. Auto-Dismiss: Find all existing alerts on page load and set a 5-second timer
document.addEventListener("DOMContentLoaded", function () {
  const activeAlerts = document.querySelectorAll(".alert");

  activeAlerts.forEach((alertBox) => {
    setTimeout(() => {
      dismissAlert(alertBox);
    }, 5000); // 5000 milliseconds = 5 seconds
  });
});
