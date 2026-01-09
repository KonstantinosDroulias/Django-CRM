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

// START - CLASS FORM VALIDATOR

class FormValidator {
    constructor() {
        this.errorBorder = ['border-error', 'border-1'];
        this.standardBorder = ['border-gray-300', 'border'];

        this.isValid = true;
    }

    reset() {
        this.isValid = true;
        document.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove(...this.errorBorder);
            el.classList.add(...this.standardBorder);

            const nextEl = el.nextElementSibling;
            if (nextEl && nextEl.classList.contains('validation-msg')) {
                nextEl.remove();
            }
        });
    }

    checkText(element, message = "This field is required") {
        if (!element) return;

        if (element.value.trim() === "") {
            this.showError(element, message);
        }
    }

    checkNumber(element, min = 0, message = "Invalid number") {
        if (!element) return;

        if (element.value === "" || parseFloat(element.value) < min) {
            this.showError(element, message);
        }
    }

    checkEmail(element, message = "Invalid Email") {
        if (!element) return;

        if (element.value.trim() === "" || !element.value.includes('@') || !element.value.includes('.')) {
            this.showError(element, message);
        }
    }

    checkPhone(element, message = "Invalid Phone Number") {
        if (!element) return;

        const len = element.value.trim().length;


        const isValid = (len === 10 || len === 4);

        if (!isValid) {
            this.showError(element, message);
        }
    }

    showError(el, msg) {
        this.isValid = false;

        el.classList.remove(...this.standardBorder);
        el.classList.add(...this.errorBorder);

        if (!el.nextElementSibling || !el.nextElementSibling.classList.contains('validation-msg')) {
            const msgDiv = document.createElement('p');
            msgDiv.className = "validation-msg text-red-500 text-xs mt-1";
            msgDiv.innerText = msg;
            el.parentNode.insertBefore(msgDiv, el.nextSibling);
        }
    }

    passes() {
        return this.isValid;
    }
}

// END - CLASS FORM VALIDATOR