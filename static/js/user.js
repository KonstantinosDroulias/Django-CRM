const validator = new FormValidator();

const addUserBtn = document.getElementById('addUserBtn');

if (addUserBtn) {
    addUserBtn.addEventListener('click', function (e) {
        // Reset Validation Styles
        validator.reset();

        // Get Variables
        const form = document.getElementById('userForm');

        // Note: We don't need userId for creating
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const role = document.getElementById('role');
        const password = document.getElementById('password');
        const confirmPass = document.getElementById('confirm_password');
        const phone = document.getElementById('phone');
        const firstName = document.getElementById('first_name');
        const lastName = document.getElementById('last_name');

        // Validate Fields
        validator.checkText(username, "Username is required");
        validator.checkText(firstName, "First name is required");
        validator.checkText(lastName, "Last name is required");
        validator.checkEmail(email, "Enter a valid email");
        validator.checkPhone(phone, 'Enter a valid phone number 4 or 10 digits')
        validator.checkText(role, "Role is required");

        // Strict Password Validation for Creation
        validator.checkText(password, "Password is required");

        if (password.value.length > 0 && password.value.length < 8) {
            validator.showError(password, "At least 8 characters");
        }

        if (password.value !== confirmPass.value) {
            validator.showError(confirmPass, "Passwords do not match");
        }

        // Check Result
        if (validator.passes()) {
            form.submit();
        } else {
            console.log("Validation failed");
        }
    });
}

const saveUserBtn = document.getElementById('saveUserBtn');

if (saveUserBtn) {
    saveUserBtn.addEventListener('click', function (e) {
        // Stop default action just in case type gets changed to submit
        e.preventDefault();

        // 1. Reset Styles
        validator.reset();

        // 2. Get Variables
        const form = document.getElementById('userForm');

        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const role = document.getElementById('role');
        const phone = document.getElementById('phone');
        const firstName = document.getElementById('first_name');
        const lastName = document.getElementById('last_name');

        // 3. Validate Fields
        validator.checkText(username, "Username is required");
        validator.checkText(firstName, "First name is required");
        validator.checkText(lastName, "Last name is required");
        validator.checkEmail(email, "Enter a valid email");
        validator.checkText(role, "Role is required");

        // Optional Phone Check
        if (phone.value.trim() !== "") {
            validator.checkPhone(phone, "Phone must be 10 digits");
        }

        // 4. Check Result & Submit
        if (validator.passes()) {
            form.submit();
        } else {
            console.log("Validation failed");
        }
    });
}