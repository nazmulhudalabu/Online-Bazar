document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "khati_soday_addresses";

    const addressList = document.getElementById("addressList");
    const form = document.getElementById("addressForm");
    const modalElement = document.getElementById("addressModal");

    const modal = modalElement
        ? bootstrap.Modal.getOrCreateInstance(modalElement)
        : null;

    let editIndex = -1;

    let addresses = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

    /*==========================
      Save LocalStorage
    ==========================*/

    function saveAddresses() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(addresses)
        );

    }

    /*==========================
      Render Address Cards
    ==========================*/

    function renderAddresses() {

        if (!addressList) return;

        addressList.innerHTML = "";

        if (addresses.length === 0) {

            addressList.innerHTML = `

                <div class="col-12">

                    <div class="alert alert-info text-center">

                        <i class="bi bi-geo-alt"></i>

                        No Address Found.

                    </div>

                </div>

            `;

            return;

        }

        addresses.forEach((item, index) => {

            const card = document.createElement("div");

            card.className = "col-md-6 col-lg-6";

            card.innerHTML = `

            <div class="address-card">

                ${item.default
                    ? `<span class="address-badge">Default</span>`
                    : ""
                }

                <h5 class="address-title">

                    ${item.label}

                </h5>

                <p>

                    <strong>${item.name}</strong><br>

                    ${item.address}<br>

                    ${item.division}<br>

                    ${item.phone}

                </p>

                <div class="address-actions">

                    <button
                        class="btn btn-outline-success btn-sm edit-btn"
                        data-index="${index}">

                        <i class="bi bi-pencil"></i>

                        Edit

                    </button>

                    <button
                        class="btn btn-outline-danger btn-sm delete-btn"
                        data-index="${index}">

                        <i class="bi bi-trash"></i>

                        Delete

                    </button>

                    ${
                        !item.default
                        ? `
                        <button
                            class="btn btn-green btn-sm default-btn"
                            data-index="${index}">

                            Set Default

                        </button>
                        `
                        : ""
                    }

                </div>

            </div>

            `;

            addressList.appendChild(card);

        });

    }

    /*==========================
  Event Delegation
==========================*/

addressList.addEventListener("click", function (e) {

    const button = e.target.closest("button");

    if (!button) return;

    const index = Number(button.dataset.index);

    /*==========================
      Delete Address
    ==========================*/

    if (button.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this address?")) {

            addresses.splice(index, 1);

            // If no default address remains,
            // make the first one default.
            if (
                addresses.length > 0 &&
                !addresses.some(item => item.default)
            ) {
                addresses[0].default = true;
            }

            saveAddresses();

            renderAddresses();

        }

        return;

    }

    /*==========================
      Set Default
    ==========================*/

    if (button.classList.contains("default-btn")) {

        addresses.forEach(item => {

            item.default = false;

        });

        addresses[index].default = true;

        saveAddresses();

        renderAddresses();

        return;

    }

    /*==========================
      Edit Address
    ==========================*/

    if (button.classList.contains("edit-btn")) {

        editIndex = index;

        const item = addresses[index];

        form.name.value = item.name;

        form.phone.value = item.phone;

        form.address.value = item.address;

        form.label.value = item.label;

        form.division.value = item.division;

        if (form.default) {

            form.default.checked = item.default;

        }

        if (modal) {

            modal.show();

        }

    }

});

/*==========================
  Form Submit
==========================*/

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const address = {

        name: form.name.value.trim(),

        phone: form.phone.value.trim(),

        division: form.division.value,

        address: form.address.value.trim(),

        label: form.label.value,

        default:
            addresses.length === 0 ||
            (form.default && form.default.checked)

    };

    /*==========================
      Validation
    ==========================*/

    if (
        address.name === "" ||
        address.phone === "" ||
        address.address === ""
    ) {

        alert("Please fill all required fields.");

        return;

    }

    /*==========================
      Phone Validation
    ==========================*/

    const phoneRegex = /^01\d{9}$/;

    if (!phoneRegex.test(address.phone)) {

        alert("Please enter a valid Bangladeshi phone number.");

        return;

    }

    /*==========================
      If Default Selected
    ==========================*/

    if (address.default) {

        addresses.forEach(item => {

            item.default = false;

        });

    }

    /*==========================
      Add New Address
    ==========================*/

    if (editIndex === -1) {

        addresses.push(address);

    }

    /*==========================
      Update Address
    ==========================*/

    else {

        address.default = address.default
            ? true
            : addresses[editIndex].default;

        addresses[editIndex] = address;

        editIndex = -1;

    }

    saveAddresses();

    renderAddresses();

    form.reset();

    if (modal) {

        modal.hide();

    }

});

/*==========================
  Reset Form When Modal Closes
==========================*/

if (modalElement) {

    modalElement.addEventListener("hidden.bs.modal", () => {

        form.reset();

        editIndex = -1;

    });

}

/*==========================
  Helper Functions
==========================*/

// Get default address
function getDefaultAddress() {

    return addresses.find(item => item.default);

}

// Total addresses
function totalAddresses() {

    return addresses.length;

}

/*==========================
  First Render
==========================*/

renderAddresses();

});