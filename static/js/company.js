const companyValidator = new FormValidator();

    const editForm = document.getElementById('customerEditForm');

    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();

            companyValidator.reset();

            const companyName = document.getElementById('company-name');
            const vatId = document.getElementById('vat-id');

            companyValidator.checkText(companyName, "Company Name is required");
            companyValidator.checkText(vatId, "VAT ID is required");

            if (companyValidator.passes()) {
                this.submit();
            } else {
                console.log("Validation failed");
            }
        });
    }