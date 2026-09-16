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
                                class="btn btn-small btn-outline-dark">
                                Bagikan
                            </a>

                        </div>

                    </div>

                `;


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

    umum: {
        name: "Umum",

        text: `
Dengan penuh kebahagiaan, kami mengundang
Bapak/Ibu/Saudara/i untuk menghadiri acara
pernikahan kami:

{mempelai_1} & {mempelai_2}

Yth. {tamu}

Berikut link undangan kami untuk informasi
lengkap mengenai acara pernikahan:

{link}

Merupakan suatu kebahagiaan bagi kami apabila
Bapak/Ibu/Saudara/i berkenan hadir dan
memberikan doa serta restu.

Terima kasih atas perhatian dan doanya.
`
    },


    formal: {
        name: "Formal",

        text: `
Yth. {tamu}

Dengan hormat,

Kami bermaksud mengundang Bapak/Ibu/Saudara/i
untuk menghadiri acara pernikahan:

{mempelai_1} & {mempelai_2}

Informasi lengkap mengenai acara dapat
dilihat melalui link berikut:

{link}

Kehadiran serta doa restu Bapak/Ibu/Saudara/i
merupakan suatu kehormatan dan kebahagiaan
bagi kami.

Atas perhatian dan kehadirannya,
kami mengucapkan terima kasih.
`
    },


    islam: {
        name: "Islami",

        text: `
Assalamu'alaikum Wr. Wb.

Bismillahirrahmanirrahim.

Yth. {tamu}

Tanpa mengurangi rasa hormat, perkenankan kami
mengundang Bapak/Ibu/Saudara/i, teman sekaligus
sahabat, untuk menghadiri acara pernikahan kami:

{mempelai_1} & {mempelai_2}

Berikut link undangan kami untuk info lengkap
dari acara bisa kunjungi:

{link}

Merupakan suatu kebahagiaan bagi kami apabila
Bapak/Ibu/Saudara/i berkenan untuk hadir dan
memberikan doa restu.

Mohon maaf perihal undangan hanya dibagikan
melalui pesan ini. Terima kasih banyak atas
perhatiannya.

Wassalamu'alaikum Wr. Wb.
Terima Kasih.
`
    },


    kristen: {
        name: "Kristen",

        text: `
Salam sejahtera.

Yth. {tamu}

Dengan penuh sukacita, kami mengundang
Bapak/Ibu/Saudara/i untuk hadir dalam
perayaan pernikahan kami:

{mempelai_1} & {mempelai_2}

Untuk informasi lengkap mengenai acara,
silakan kunjungi link berikut:

{link}

Kehadiran dan doa restu Bapak/Ibu/Saudara/i
akan menjadi sukacita bagi kami.

Terima kasih atas perhatian dan doanya.
`
    },


    hindu: {
        name: "Hindu",

        text: `
Om Swastyastu.

Yth. {tamu}

Dengan penuh rasa syukur dan kebahagiaan,
kami mengundang Bapak/Ibu/Saudara/i untuk
hadir dalam upacara pernikahan kami:

{mempelai_1} & {mempelai_2}

Informasi lengkap mengenai acara dapat
dilihat melalui link berikut:

{link}

Kehadiran serta doa restu Bapak/Ibu/Saudara/i
akan menjadi kebahagiaan bagi kami.

Om Shanti Shanti Shanti Om.
`
    },


    buddha: {
        name: "Buddha",

        text: `
Namo Buddhaya.

Yth. {tamu}

Dengan penuh kebahagiaan, kami mengundang
Bapak/Ibu/Saudara/i untuk hadir dalam
acara pernikahan kami:

{mempelai_1} & {mempelai_2}

Informasi lengkap mengenai acara dapat
dilihat melalui link berikut:

{link}

Kehadiran dan doa restu Bapak/Ibu/Saudara/i
merupakan kebahagiaan bagi kami.

Terima kasih atas perhatian dan doa restunya.
`
    },


    konghucu: {
        name: "Konghucu",

        text: `
Salam Kebajikan.

Yth. {tamu}

Dengan penuh kebahagiaan, kami mengundang
Bapak/Ibu/Saudara/i untuk hadir dalam
acara pernikahan kami:

{mempelai_1} & {mempelai_2}

Informasi lengkap mengenai acara dapat
dilihat melalui link berikut:

{link}

Kehadiran serta doa restu Bapak/Ibu/Saudara/i
akan menjadi kebahagiaan bagi kami.

Terima kasih atas perhatian dan doa restunya.
`
    }

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