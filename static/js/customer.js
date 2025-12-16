const assignBtn = document.getElementById("assignBtn");
const employeeOverlay = document.getElementById("employeeOverlay");
const list = document.getElementsByClassName("list");
const employeeOverlayBg = document.getElementById("employeeOverlayBg");

const deleteTrigger = document.getElementById("deleteTrigger");
const confirmModule = document.getElementById("confirmModule");
const deleteCancel = document.getElementById("deleteCancel");
const deleteBtn = document.getElementById("deleteBtn");
const confirmOverlay = document.getElementById("confirmOverlay");

let confirmFlag = false;
deleteTrigger.addEventListener("click", function (event) {
    if (!confirmFlag) {
        confirmModule.classList.remove("hidden");
        confirmOverlay.classList.remove("hidden");
        confirmFlag = true;
    }
})

function closeConfirm() {
    if (confirmFlag) {
        confirmModule.classList.add("hidden");
        confirmOverlay.classList.add("hidden");
        confirmFlag = false;
    }
}

deleteCancel.addEventListener("click", closeConfirm)
confirmOverlay.addEventListener("click", closeConfirm)




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
