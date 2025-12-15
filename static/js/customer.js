const assignBtn = document.getElementById("assignBtn");
const employeeOverlay = document.getElementById("employeeOverlay");
const list = document.getElementsByClassName("list");
const employeeOverlayBg = document.getElementById("employeeOverlayBg");

let displayFlag = false;
assignBtn.addEventListener("click", function () {
    if (displayFlag) {
        employeeOverlay.classList.add("hidden");
        employeeOverlayBg.classList.add("hidden");
        displayFlag = false;
    } else {
        employeeOverlay.classList.remove("hidden");
        employeeOverlayBg.classList.remove("hidden");
        displayFlag = true;
    }
})

employeeOverlayBg.addEventListener("click", function () {
    if (displayFlag) {
        employeeOverlay.classList.add("hidden");
        employeeOverlayBg.classList.add("hidden");
        displayFlag = false;
    } else {
        employeeOverlay.classList.remove("hidden");
        employeeOverlayBg.classList.remove("hidden");
        displayFlag = true;
    }
})
