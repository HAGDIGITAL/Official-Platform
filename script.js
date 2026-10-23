/* =========================================
   MOBILE MENU
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });


    const navLinks =
        navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

        });

    });

}


/* =========================================
   CLOSE MENU WHEN CLICK OUTSIDE
========================================= */

document.addEventListener("click", (event) => {

    if (
        navMenu &&
        menuToggle &&
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {

        navMenu.classList.remove("active");

    }

});

/* =========================================
   GENERATE LINK BANYAK TAMU
========================================= */

const generateAll = document.getElementById("generateAll");
const generatedResult = document.getElementById("generatedResult");
const generatedLink = document.getElementById("generatedLink");

if (generateAll) {

    generateAll.addEventListener("click", function () {

        const invitationLink =
            document.getElementById("invitationLink").value.trim();

        const brideName =
            document.getElementById("brideName").value.trim();

        const groomName =
            document.getElementById("groomName").value.trim();

        const guestNames =
            document.getElementById("guestNames").value
            .split("\n")
            .map(name => name.trim())
            .filter(name => name !== "");

        const greetingType =
            document.getElementById("greetingType").value;

        const template =
            greetingTemplates[greetingType];


        /* VALIDASI */

        if (!brideName || !groomName) {
            alert("Silakan masukkan nama kedua mempelai.");
            return;
        }

        if (!invitationLink) {
            alert("Silakan masukkan link undangan.");
            return;
        }

        if (guestNames.length === 0) {
            alert("Silakan masukkan nama tamu.");
            return;
        }

        if (!template) {
            alert("Template ucapan tidak ditemukan.");
            return;
        }


        try {

            generatedLink.innerHTML = "";


            guestNames.forEach(function (guestName, index) {

                /* BUAT LINK PERSONAL */

                const url = new URL(invitationLink);

                url.searchParams.set("to", guestName);

                const finalLink = url.toString();


                /* BUAT PESAN UNDANGAN */

                const message = template.text
                    .replaceAll("{tamu}", guestName)
                    .replaceAll("{mempelai_1}", brideName)
                    .replaceAll("{mempelai_2}", groomName)
                    .replaceAll("{link}", finalLink)
                    .trim();


                /* BUAT ITEM */

                const item = document.createElement("div");

                item.className = "generated-item";


                item.innerHTML = `

                    <div class="guest-number">
                        ${index + 1}
                    </div>

                    <div class="guest-info">

                        <strong>${guestName}</strong>

                        <div class="guest-link">
                            ${finalLink}
                        </div>



                        <div class="guest-actions">

                            <button
                                type="button"
                                class="btn btn-small btn-primary copy-message"
                                data-message="${encodeURIComponent(message)}">
                                Salin
                            </button>


                        <a
                            href="https://wa.me/?text=${encodeURIComponent(message)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn btn-small btn-outline-dark share-message">
                            Bagikan
                        </a>


                        </div>


                                            
                        <label class="guest-status">
                            <input type="checkbox" class="guest-status-checkbox">
                            <span class="guest-status-text">Belum diproses</span>
                        </label>

                    </div>

                `;




                        const statusCheckbox = item.querySelector(".guest-status-checkbox");
                        const statusText = item.querySelector(".guest-status-text");
                        const copyButton = item.querySelector(".copy-message");
                        const shareButton = item.querySelector(".share-message");
                        
                        if (shareButton) {
                            shareButton.addEventListener("click", function (event) {
                                if (statusCheckbox.checked) {
                                    event.preventDefault();
                                    event.stopImmediatePropagation();
                                }
                            }, true);
                        }


                        function updateGuestStatus() {
                            const completed = statusCheckbox.checked;

                            statusText.textContent = completed
                                ? "Selesai diproses"
                                : "Belum diproses";

                            statusText.style.color = completed ? "#267343" : "#666";

                            if (copyButton) {
                                copyButton.disabled = completed;
                            }

                            if (shareButton) {
                                shareButton.style.pointerEvents = completed ? "none" : "auto";
                                shareButton.style.opacity = completed ? "0.5" : "1";
                                shareButton.setAttribute("aria-disabled", completed);
                            }
                        }

                        statusCheckbox.addEventListener("change", updateGuestStatus);

                        updateGuestStatus();




                generatedLink.appendChild(item);

            });


            generatedResult.style.display = "block";


            /* =======================================
               TOMBOL SALIN
            ======================================= */

            document
                .querySelectorAll(".copy-message")
                .forEach(function (button) {

                    button.addEventListener("click", function () {

                        const message =
                            decodeURIComponent(this.dataset.message);

                        navigator.clipboard.writeText(message)
                            .then(() => {

                                this.textContent = "Tersalin!";

                                setTimeout(() => {
                                    this.textContent = "Salin";
                                }, 2000);

                            })
                            .catch(() => {

                                alert("Gagal menyalin pesan.");

                            });

                    });

                });


        } catch (error) {

            console.error(error);

            alert(
                "Link undangan tidak valid.\n\n" +
                "Contoh:\n" +
                "https://hagdigital.id/udin-nabila/"
            );

        }

    });

}

// =======================================
// DATABASE TEMPLATE UCAPAN
// =======================================

const greetingTemplates = {

english: {
    name: "English",

    text: `
With great joy, we invite you to celebrate our wedding:

{mempelai_1} & {mempelai_2}

Dear {tamu},

Please find our wedding invitation and event details through the link below:

{link}

notes : For the best experience, please open the link using Chrome / Firefox / Safari browser.

Your presence and prayers would mean so much to us as we begin this new chapter together.

Thank you, and we look forward to celebrating with you.
`
},


formal: {
    name: "Formal",

    text: `
Yth. {tamu}

Dengan hormat,

Dengan penuh rasa syukur dan kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk berkenan hadir dalam acara pernikahan kami:

{mempelai_1} & {mempelai_2}

Untuk mengetahui informasi lengkap mengenai waktu dan lokasi acara, silakan kunjungi tautan undangan berikut:

{link}

notes : Hasil Maksimal Buka Lewat Browser Chrome / Firefox / Safari

Besar harapan kami atas kehadiran Bapak/Ibu/Saudara/i untuk memberikan doa restu bagi kedua mempelai.

Atas perhatian dan kesediaannya untuk hadir, kami mengucapkan terima kasih.
`
},


    islam: {
        name: "Islami",

        text: `
Assalamu'alaikum Wr. Wb.
Bismillahirrahmanirrahim.

Yth. {tamu}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligussahabat, untuk menghadiri acara pernikahan kami:

{mempelai_1} & {mempelai_2}

Berikut link undangan kami untuk info lengkap dari acara bisa kunjungi:

{link}

Notes : Hasil Maksimal Buka Lewat Browser Chrome / Firefox / Safari

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya dibagikan melalui pesan ini. Terima kasih banyak atas perhatiannya.

Wassalamu'alaikum Wr. Wb.
Terima Kasih.
`
    },


kristen: {
    name: "Kristen",

    text: `
Shalom,

Yth. {tamu}

Dengan penuh rasa syukur kepada Tuhan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi bagian dari sukacita pernikahan kami:

{mempelai_1} & {mempelai_2}

Kiranya Bapak/Ibu/Saudara/i berkenan hadir untuk turut berbagi kebahagiaan dan memberikan doa restu bagi perjalanan hidup baru kami.

Informasi lengkap mengenai acara pernikahan dapat dilihat melalui tautan undangan berikut:

{link}

notes : Hasil Maksimal Buka Lewat Browser Chrome / Firefox / Safari

Merupakan sukacita bagi kami apabila Bapak/Ibu/Saudara/i dapat hadir.

Terima kasih atas perhatian dan doa yang diberikan. Tuhan memberkati.
`
},


 hindu: {
    name: "Hindu",

    text: `
Om Swastyastu,

Yth. {tamu}

Dengan memanjatkan puji syukur ke hadapan Ida Sang Hyang Widhi Wasa, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam upacara pernikahan kami:

{mempelai_1} & {mempelai_2}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi kedua mempelai.

Informasi lengkap mengenai waktu dan tempat pelaksanaan acara dapat dilihat melalui tautan undangan berikut:

{link}

notes : Hasil Maksimal Buka Lewat Browser Chrome / Firefox / Safari

Atas perhatian dan kehadirannya, kami mengucapkan terima kasih.

Om Shanti Shanti Shanti Om.
`
},

 buddha: {
    name: "Buddha",

    text: `
Namo Buddhaya,

Yth. {tamu}

Dengan penuh rasa syukur dan kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu dalam pernikahan kami:

{mempelai_1} & {mempelai_2}

Semoga kebahagiaan dan cinta kasih senantiasa menyertai langkah kami dalam membangun kehidupan rumah tangga yang harmonis.

Informasi lengkap mengenai waktu dan tempat pelaksanaan acara dapat dilihat melalui tautan undangan berikut:

{link}

notes : Hasil Maksimal Buka Lewat Browser Chrome / Firefox / Safari

Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih atas perhatian dan doa restunya.

Namo Buddhaya.
`
},


 konghucu: {
    name: "Konghucu",

    text: `
Salam Kebajikan,

Yth. {tamu}

Dengan penuh rasa syukur dan kebahagiaan, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami:

{mempelai_1} & {mempelai_2}

Kehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan kehormatan dan kebahagiaan bagi kami dalam mengawali kehidupan baru sebagai pasangan suami istri.

Informasi lengkap mengenai waktu dan tempat pelaksanaan acara dapat dilihat melalui tautan undangan berikut:

{link}

notes : Hasil Maksimal Buka Lewat Browser Chrome / Firefox / Safari

Atas perhatian dan kesediaan Bapak/Ibu/Saudara/i untuk hadir, kami mengucapkan terima kasih.

Salam Kebajikan.
`
},

};





// =======================================
// PREVIEW TEMPLATE UCAPAN
// =======================================

const greetingType =
    document.getElementById("greetingType");

const greetingPreview =
    document.getElementById("greetingPreview");


function updateGreetingPreview() {
    const type = greetingType.value;
    const template = greetingTemplates[type];

    if (!template) {
        greetingPreview.textContent = "Template tidak ditemukan.";
        return;
    }

    greetingPreview.textContent = template.text;
}


// =======================================
// AUTO PREVIEW TEMPLATE
// =======================================

if (greetingType && greetingPreview) {

    greetingType.addEventListener(
        "change",
        updateGreetingPreview
    );

    // Tampilkan preview awal
    updateGreetingPreview();
}


const changingWord = document.getElementById("changing-word");

if (changingWord) {

    const words = [
        "MUDAH",
        "CEPAT",
        "PRAKTIS"
    ];

    let wordIndex = 0;

    setInterval(() => {

        changingWord.style.opacity = "0";
        changingWord.style.transform = "translateY(6px)";

        setTimeout(() => {

            wordIndex = (wordIndex + 1) % words.length;

            changingWord.textContent = words[wordIndex];

            changingWord.style.opacity = "1";
            changingWord.style.transform = "translateY(0)";

        }, 300);

    }, 2000);

}

/* =========================================
   MUSIC PLAYER
========================================= */

const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

if (bgMusic && musicButton) {

    bgMusic.loop = true;

    // Coba autoplay
    bgMusic.play().catch(() => {

        const startMusic = () => {
            bgMusic.play();
            musicButton.textContent = "🎵";

            document.removeEventListener("click", startMusic);
            document.removeEventListener("touchstart", startMusic);
        };

        document.addEventListener("click", startMusic);
        document.addEventListener("touchstart", startMusic);
    });

    // TOMBOL ON / OFF
    musicButton.addEventListener("click", () => {

        if (bgMusic.paused) {
            bgMusic.play();
            musicButton.textContent = "🎵";
        } else {
            bgMusic.pause();
            musicButton.textContent = "🔇";
        }

    });

}

const qrisImage = document.getElementById("qrisImage");
const qrisModal = document.getElementById("qrisModal");
const qrisClose = document.getElementById("qrisClose");

if (qrisImage && qrisModal && qrisClose) {

    // Buka fullscreen
    qrisImage.addEventListener("click", () => {
        qrisModal.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    // Tutup fullscreen
    qrisClose.addEventListener("click", () => {
        qrisModal.classList.remove("active");
        document.body.style.overflow = "";
    });

    // Klik area hitam untuk menutup
    qrisModal.addEventListener("click", (e) => {
        if (e.target === qrisModal) {
            qrisModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Tombol ESC untuk menutup
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            qrisModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

}


// ==============================
// FILTER GRUP KATALOG
// ==============================

const groupButtons = document.querySelectorAll(".group-btn");
const catalogCards = document.querySelectorAll(".catalog-card");

groupButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedGroup = button.dataset.group;

        // Ubah tombol aktif
        groupButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Tampilkan template sesuai grup
        // Tampilkan template sesuai grup
        catalogCards.forEach(card => {

            const groups = card.dataset.group
                .split(",")
                .map(group => group.trim());

            if (
                groups.includes(selectedGroup) ||
                groups.includes("all")
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

});


// Tampilkan Premium Foto saat halaman pertama dibuka
// Tampilkan Premium Foto saat halaman pertama dibuka
catalogCards.forEach(card => {

    const groups = card.dataset.group
        .split(",")
        .map(group => group.trim());

    if (
        groups.includes("premium-foto") ||
        groups.includes("all")
    ) {
        card.style.display = "";
    } else {
        card.style.display = "none";
    }

});

// ==============================
// FILTER GRUP BERDASARKAN LINK INDEX
// ==============================

const urlParams = new URLSearchParams(window.location.search);
const temaUrl = urlParams.get("tema");

if (temaUrl) {

    const targetButton = document.querySelector(
        `.group-btn[data-group="${temaUrl}"]`
    );

    if (targetButton) {
        targetButton.click();
    }

}