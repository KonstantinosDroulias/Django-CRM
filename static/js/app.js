// START SIDEBAR LOGIC

const sidebar = document.getElementById('sidebar');
const navLinkTexts = document.querySelectorAll('.nav-link-text');
const collapseBtn = document.getElementById('collapseBtn');
const collapseIcon = document.getElementById('collapseIcon');
const expandIcon = document.getElementById('expandIcon');
const copyrightText = document.getElementById('copyrightText');
const profileQuickInfo = document.getElementById('profile-quick-info');


let isCollapsed = false;
collapseBtn.addEventListener('click', () => {
  isCollapsed = !isCollapsed;

  navLinkTexts.forEach(text => {
    text.classList.toggle('hidden', isCollapsed); // Just Learned about toggle
  });

  copyrightText.classList.toggle('hidden', isCollapsed);
  collapseIcon.classList.toggle('hidden', isCollapsed);
  expandIcon.classList.toggle('hidden', !isCollapsed);
  profileQuickInfo.classList.toggle('hidden', isCollapsed);

  sidebar.classList.toggle('w-full', !isCollapsed);
});

// END SIDEBAR LOGIC

// GET COOKIE IS AI CODE GENERATED
function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name + "=")) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return null;
}

const csrftoken = getCookie("csrftoken");
// END OF AI GENERATED CODE