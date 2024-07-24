// ==UserScript==
// @name         WOŁANIE NA E2 LOOTLOG
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  DZIAŁA TYLKO NA NI
// @author       Nolifequ
// @icon         https://i.imgur.com/dmGpjfi.gif
// @match        https://fobos.margonem.pl/
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Nolif1/lootlog/main/lootlog.user.js
// @updateURL    https://raw.githubusercontent.com/Nolif1/lootlog/main/lootlog.user.js
// ==/UserScript==

(function(initialNpcList) {
    'use strict';

    const messageTextTemplate = "";
    let messageText = "";

    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
    }

    function enterText(selector, text) {
        const textarea = document.querySelector(selector);
        if (textarea) {
            textarea.value = text;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function findLauncherByPartialName(name) {
        const launchers = document.querySelectorAll('.cll-launcher');
        for (let launcher of launchers) {
            if (launcher.getAttribute('data-tip').includes(name)) {
                return launcher;
            }
        }
        return null;
    }

    function sendMessage(npcName, lootlogName) {
        const launcher = findLauncherByPartialName(lootlogName);
        if (launcher) {
            launcher.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            clickElement('#cll-send-msg');
            enterText('#cll-message-textarea', messageTextTemplate + npcName);
            clickElement('#cll-message-send');
        }
    }

    function displayPopup(nick, npc, map) {
        const selectedNpcNames = JSON.parse(localStorage.getItem('selectedNpcNames') || '[]');
        const customLootlogNames = JSON.parse(localStorage.getItem('customLootlogNames') || '{}');
        const defaultLootlogName = localStorage.getItem('lootlogName') || 'MD II';
        const lootlogName = customLootlogNames[npc.nick] || defaultLootlogName;
        if (selectedNpcNames.includes(npc.nick)) {
            messageText = messageTextTemplate + npc.nick;
            sendMessage(npc.nick, lootlogName);
        }
    }

    function createNpcSelector(npcList) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50px';
        container.style.right = '10px';
        container.style.padding = '15px';
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        container.style.zIndex = '10000';
        container.style.maxHeight = '80vh';
        container.style.overflowY = 'auto';
        container.style.width = '300px';

        const lootlogLabel = document.createElement('label');
        lootlogLabel.innerText = 'Nazwa Lootloga (domyślnie MD II):';
        lootlogLabel.style.display = 'block';
        lootlogLabel.style.marginBottom = '8px';
        lootlogLabel.style.fontWeight = 'bold';
        container.appendChild(lootlogLabel);

        const lootlogInput = document.createElement('input');
        lootlogInput.type = 'text';
        lootlogInput.value = localStorage.getItem('lootlogName') || 'MD II';
        lootlogInput.style.width = '94%';
        lootlogInput.style.padding = '8px';
        lootlogInput.style.border = '1px solid #ccc';
        lootlogInput.style.borderRadius = '4px';
        lootlogInput.style.marginBottom = '15px';

        lootlogInput.addEventListener('input', function() {
            localStorage.setItem('lootlogName', lootlogInput.value);
        });

        container.appendChild(lootlogInput);

const button = document.createElement('button');
button.innerHTML = '<img src="https://i.imgur.com/dmGpjfi.gif" alt="Nolifequ" style="width: 32px; height: 48px;">';
button.style.position = 'fixed';
button.style.padding = '5px';
button.style.backgroundColor = 'transparent';
button.style.border = 'none';
button.style.cursor = 'pointer';
button.style.zIndex = '10001';

const savedButtonPosition = JSON.parse(localStorage.getItem('buttonPosition') || '{"top": 10, "right": 10}');
button.style.top = savedButtonPosition.top + 'px';
button.style.right = savedButtonPosition.right + 'px';

button.onmousedown = function(event) {
    event.preventDefault();
    let shiftX = event.clientX - button.getBoundingClientRect().left;
    let shiftY = event.clientY - button.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        let newLeft = pageX - shiftX;
        let newTop = pageY - shiftY;

        // Constrain within viewport
        newLeft = Math.min(document.documentElement.clientWidth - button.offsetWidth, Math.max(0, newLeft));
        newTop = Math.min(document.documentElement.clientHeight - button.offsetHeight, Math.max(0, newTop));

        button.style.left = newLeft + 'px';
        button.style.top = newTop + 'px';
        button.style.right = 'auto';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    button.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        button.onmouseup = null;

        const buttonPosition = {
            top: button.getBoundingClientRect().top,
            right: document.documentElement.clientWidth - button.getBoundingClientRect().right
        };
        localStorage.setItem('buttonPosition', JSON.stringify(buttonPosition));
    };
};

button.ondragstart = function() {
    return false;
};

window.addEventListener('resize', function() {
    let top = parseInt(button.style.top);
    let right = parseInt(button.style.right);
    if (top + button.offsetHeight > document.documentElement.clientHeight) {
        button.style.top = (document.documentElement.clientHeight - button.offsetHeight) + 'px';
    }
    if (right + button.offsetWidth > document.documentElement.clientWidth) {
        button.style.right = (document.documentElement.clientWidth - button.offsetWidth) + 'px';
    }
});

document.body.appendChild(button);

        button.addEventListener('click', () => {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        });
        document.body.appendChild(button);

        const title = document.createElement('h4');
        title.style.marginTop = '0';
        title.style.fontSize = '12px';
        title.style.fontWeight = 'bold';
        container.appendChild(title);

        const listContainer = document.createElement('div');
        listContainer.style.marginBottom = '15px';
        listContainer.style.position = 'relative';

        const npcImages = {
    'Mushita': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/st-puma.gif',
    'Kotołak Tropiciel': 'https://micc.garmory-cdn.cloud/obrazki/npc/e1/kotolak_lowca.gif',
    'Shae Phu': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/demonszef.gif',
    'Zorg Jednooki Baron': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-e2-zorg.gif',
    'Władca rzek': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobmag2.gif',
    'Gobbos': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobsamurai.gif',
    'Tyrtajos': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/dzik.gif',
    'Tollok Shimger': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_shimger.gif',
    'Szczęt alias Gładki': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-szczet.gif',
    'Razuglag Oklash': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/razuglag.gif',
    'Agar': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/glut_agar.gif',
    'Foverk Turrim': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/kobold07.gif',
    'Owadzia Matka': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/zadlak-e2-owadzia-matka.gif',
    'Vari Kruger': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll11.gif',
    'Furruk Kozug': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll12.gif',
    'Jotun': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/kam_olbrzym-b.gif',
    'Tollok Utumutu': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_jask_utumatu.gif',
    'Tollok Atamatu': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_jask_atamatu.gif',
    'Lisz': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/lisz_demilisze.gif',
    'Grabarz świątynny': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/nieu_mnich_grabarz.gif',
    'Wielka Stopa': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/wlochacze_wielka_stopa.gif',
    'Podły zbrojmistrz': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/magaz_zbrojmistrz.gif',
    'Choukker': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/dlawiciel5.gif',
    'Nadzorczyni krasnoludów': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/nadzorczyni_krasnoludow.gif',
    'Morthen': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/krasnolud_boss.gif',
    'Leśne Widmo': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/lesne_widmo.gif',
    'Żelazoręki Ohydziarz': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/ugrape2.gif',
    'Goplana': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/goplana.gif',
    'Gnom Figlid': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnom_figlid.gif',
    'Centaur Zyfryd': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/cent-zyfryd.gif',
    'Kambion': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/kambion.gif',
    'Jertek Moxos': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/moloch-jertek.gif',
    'Miłośnik rycerzy': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_rycerzy.gif',
    'Miłośnik magii': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_magii.gif',
    'Miłośnik łowców': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_lowcow.gif',
    'Łowca czaszek': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/alghul-czaszka-1a.gif',
    'Ozirus Władca Hieroglifów': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/mumia-ozirus.gif',
    'Wójt Fistuła': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral05.gif',
    'Krab pustelnik': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/krab_big3.gif',
    'Królowa Śniegu': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/krolowa-sniegu.gif',
    'Teściowa Rumcajsa': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral08.gif',
    'Ifryt': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/magradit_ifryt.gif',
    'Młody Jack Truciciel': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat01.gif',
    'Helga Opiekunka Rumu': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat-2b.gif',
    'Henry Kaprawe Oko': 'https://micc.garmory-cdn.cloud/obrazki/npc/e1/pirat5b.gif',
    'Burkog Lorulk': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/orkczd.gif',
    'Sheba Orcza Szamanka': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/r_orc_sheba.gif',
    'Grubber Ochlaj': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/grubber-ochlaj.gif',
    'Berserker Amuno': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/amuno.gif',
    'Stworzyciel': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/stworzyciel.gif',
    'Fodug Zolash': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/fodug_zolash.gif',
    'Mistrz Worundriel': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/worundriel02.gif',
    'Goons Asterus': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/mechgoblin4.gif',
    'Adariel': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri_adariel.gif',
    'Duch Władcy Klanów': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/duch_wladcy_kl.gif',
    'Ogr Stalowy Pazur': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/ogr_drapak.gif',
    'Bragarth Myśliwy Dusz': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/praork_low_elita.gif',
    'Fursharag Pożeracz Umysłów': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/praork_mag_elita.gif',
    'Ziuggrael Strażnik Królowej': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/praork_woj_elita.gif',
    'Lusgrathera Królowa Pramatka': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/prakrolowa.gif',
    'Borgoros Garamir III': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/minotaur-elita.gif',
    'Chryzoprenia': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/chryzoprenia.gif',
    'Cerasus': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/drzewoe2.gif',
    'Czempion Furboli': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/forbol03.gif',
    'Torunia Ankelwald': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/thuz-patr1.gif',
    'Breheret Żelazny Łeb': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/draki-breheret-1b.gif',
    'Mysiur Myświórowy Król': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/krolszczur.gif',
    'Sadolia Nadzorczyni Hurys': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sadolia.gif',
    'Gothardus Kolekcjoner Głów': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-gothardus.gif',
    'Annaniel Wysysacz Marzeń': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-annaniel.gif',
    'Sataniel Skrytobójca': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sataniel.gif',
    'Bergermona Krwawa Hrabina': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-bergermona.gif',
    'Zufulus Smakosz Serc': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-zufulus.gif',
    'Marlloth Malignitas': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/marlloth.gif',
    'Mocny Maddoks': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/maddok5.gif',
    'Arachniregina Colosseus': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/regina-e2.gif',
    'Pancerny Maddok': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/maddok_roz.gif',
    'Silvanasus': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/silvanasus.gif',
    'Dendroculus': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/dendroculus.gif',
    'Tolypeutes': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/bolita.gif',
    'Cuaitl Citlalin': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/maho-cuaitl.gif',
    'Pogardliwa Sybilla': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri2_witch_e2.gif',
    'Yaotl': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/mahoplowca.gif',
    'Quetzalcoatl': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/quetzalcoatl.gif',
    'Chopesz': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/chopesh2.gif',
    'Neferkar Set': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/szkiel_set.gif',
    'Terrozaur': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/terrorzaur_pus.gif',
    'Vaenra Charkhaam': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smoczyca.gif',
    'Chaegd Agnrakh': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smokoszef.gif',
    'Nymphemonia': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/nymphemonia.gif',
    'Artenius': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu03.gif',
    'Furion': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu02.gif',
    'Zorin': 'https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu01.gif'
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginBottom = '15px';
        buttonContainer.style.textAlign = 'center';

        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'Zaznacz all';
        selectAllBtn.style.marginRight = '5px';
        selectAllBtn.style.padding = '5px 10px';
        selectAllBtn.style.border = 'none';
        selectAllBtn.style.borderRadius = '4px';
        selectAllBtn.style.backgroundColor = '#189a21';
        selectAllBtn.style.color = 'white';
        selectAllBtn.style.cursor = 'pointer';
        selectAllBtn.style.fontWeight = 'bold';
        selectAllBtn.addEventListener('click', () => {
            const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = true);
            localStorage.setItem('selectedNpcNames', JSON.stringify(npcList));
        });

        const deselectAllBtn = document.createElement('button');
        deselectAllBtn.textContent = 'Odznacz all';
        deselectAllBtn.style.padding = '5px 10px';
        deselectAllBtn.style.border = 'none';
        deselectAllBtn.style.borderRadius = '4px';
        deselectAllBtn.style.backgroundColor = '#9a2118';
        deselectAllBtn.style.color = 'white';
        deselectAllBtn.style.cursor = 'pointer';
        deselectAllBtn.style.fontWeight = 'bold';
        deselectAllBtn.addEventListener('click', () => {
            const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
            localStorage.setItem('selectedNpcNames', JSON.stringify([]));
        });

        buttonContainer.appendChild(selectAllBtn);
        buttonContainer.appendChild(deselectAllBtn);
        container.appendChild(buttonContainer);

        npcList.forEach(npc => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.marginBottom = '8px';
            label.style.padding = '8px';
            label.style.border = '1px solid #ccc';
            label.style.borderRadius = '4px';
            label.style.backgroundColor = 'rgba(249, 249, 249, 0.8)';
            label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            label.style.transition = 'background-color 0.3s ease';
            label.style.position = 'relative';

            label.addEventListener('mouseover', () => {
                label.style.backgroundColor = 'rgba(249, 249, 249, 1)';
            });

            label.addEventListener('mouseout', () => {
                label.style.backgroundColor = 'rgba(249, 249, 249, 0.8)';
            });

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = npc;
            checkbox.style.marginRight = '10px';
            checkbox.style.transform = 'scale(1.2)';
            checkbox.style.transition = 'transform 0.2s ease';

            checkbox.addEventListener('change', function() {
                const selectedOptions = Array.from(listContainer.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
                localStorage.setItem('selectedNpcNames', JSON.stringify(selectedOptions));
            });

            checkbox.addEventListener('mouseover', () => {
                checkbox.style.transform = 'scale(1.4)';
            });

            checkbox.addEventListener('mouseout', () => {
                checkbox.style.transform = 'scale(1.2)';
            });

            const savedNpcNames = JSON.parse(localStorage.getItem('selectedNpcNames') || '[]');
            if (savedNpcNames.includes(npc)) {
                checkbox.checked = true;
            }

            label.appendChild(checkbox);

            if (npcImages[npc]) {
                const img = document.createElement('img');
                img.src = npcImages[npc];
                img.alt = npc;
                img.style.marginLeft = '10px';

                img.onload = function() {
                    if (img.height > 64) {
                        img.style.height = '64px';
                        img.style.width = 'auto';
                    }
                };

                label.appendChild(img);
            }

            const npcName = document.createElement('span');
            npcName.style.position = 'absolute';
            npcName.style.right = '10px';
            npcName.style.bottom = '10px';
            npcName.textContent = npc;
            label.appendChild(npcName);

            const customLootlogNames = JSON.parse(localStorage.getItem('customLootlogNames') || '{}');
            const npcCustomLootlogName = customLootlogNames[npc] || '';

            const customLootlogLabel = document.createElement('span');
            customLootlogLabel.style.position = 'absolute';
            customLootlogLabel.style.top = '10px';
            customLootlogLabel.style.right = '10px';
            customLootlogLabel.style.fontSize = '10px';
            customLootlogLabel.style.backgroundColor = '#fff';
            customLootlogLabel.style.padding = '2px 4px';
            customLootlogLabel.style.border = '1px solid #ccc';
            customLootlogLabel.style.borderRadius = '4px';
            customLootlogLabel.textContent = npcCustomLootlogName ? `${npcCustomLootlogName}` : '';

            label.appendChild(customLootlogLabel);

            listContainer.appendChild(label);

            label.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                const customLootlogName = prompt(`Wprowadź nazwę lootloga dla ${npc}:`);
                const customLootlogNames = JSON.parse(localStorage.getItem('customLootlogNames') || '{}');

                if (customLootlogName) {
                    customLootlogNames[npc] = customLootlogName;
                } else {
                    delete customLootlogNames[npc];
                }

                localStorage.setItem('customLootlogNames', JSON.stringify(customLootlogNames));
                customLootlogLabel.textContent = customLootlogName ? `${customLootlogName}` : '';
            });
        });

        container.appendChild(listContainer);

        const footer = document.createElement('div');
        footer.style.textAlign = 'right';
        footer.style.fontSize = '10px';
        footer.style.color = '#666';
        footer.style.marginTop = '10px';

        const footerText = document.createElement('span');
        footerText.textContent = 'dodatek stworzony przez Nolifequ';

        const footerLink = document.createElement('a');
        footerLink.href = 'https://discordapp.com/users/442051476928593920/';
        footerLink.target = '_blank';
        footerLink.style.marginLeft = '5px';

        const footerImage = document.createElement('img');
        footerImage.src = 'https://i.imgur.com/dmGpjfi.gif';
        footerImage.alt = 'Nolifequ';
        footerImage.style.width = '16px';
        footerImage.style.height = '24px';
        footerImage.style.verticalAlign = 'middle';

        footerLink.appendChild(footerImage);
        footer.appendChild(footerText);
        footer.appendChild(footerLink);
        container.appendChild(footer);

        container.style.display = 'none';
        document.body.appendChild(container);
    }

    function start() {
        if (document.cookie.includes('interface=ni')) {
            if (!window.Engine?.npcs?.check) {
                setTimeout(start, 1500);
                return;
            }
            window.API.addCallbackToEvent('newNpc', function(npc) {
                if (JSON.parse(localStorage.getItem('selectedNpcNames') || '[]').includes(npc.d.nick)) {
                    displayPopup(window.Engine.hero.nick, npc.d, window.Engine.map.d);
                }
            });
        } else {
            const oldNewNpc = window.newNpc;
            window.newNpc = function(npcs) {
                oldNewNpc(npcs);
                for (const npc of npcs) {
                    if (JSON.parse(localStorage.getItem('selectedNpcNames') || '[]').includes(npc.nick)) {
                        displayPopup(window.hero.nick, npc, window.map);
                    }
                }
            };
        }
    }

    createNpcSelector(initialNpcList);

    window.addEventListener('load', start);

})([
'Mushita',
'Kotołak Tropiciel',
'Shae Phu',
'Zorg Jednooki Baron',
'Władca rzek',
'Gobbos',
'Tyrtajos',
'Tollok Shimger',
'Szczęt alias Gładki',
'Razuglag Oklash',
'Agar',
'Foverk Turrim',
'Owadzia Matka',
'Vari Kruger',
'Furruk Kozug',
'Jotun',
'Tollok Utumutu',
'Tollok Atamatu',
'Lisz',
'Grabarz świątynny',
'Wielka Stopa',
'Podły zbrojmistrz',
'Choukker',
'Nadzorczyni krasnoludów',
'Morthen',
'Leśne Widmo',
'Żelazoręki Ohydziarz',
'Goplana',
'Gnom Figlid',
'Centaur Zyfryd',
'Kambion',
'Jertek Moxos',
'Miłośnik rycerzy',
'Miłośnik magii',
'Miłośnik łowców',
'Łowca czaszek',
'Ozirus Władca Hieroglifów',
'Wójt Fistuła',
'Krab pustelnik',
'Królowa Śniegu',
'Teściowa Rumcajsa',
'Ifryt',
'Młody Jack Truciciel',
'Helga Opiekunka Rumu',
'Henry Kaprawe Oko',
'Burkog Lorulk',
'Sheba Orcza Szamanka',
'Grubber Ochlaj',
'Berserker Amuno',
'Stworzyciel',
'Fodug Zolash',
'Mistrz Worundriel',
'Goons Asterus',
'Adariel',
'Duch Władcy Klanów',
'Ogr Stalowy Pazur',
'Bragarth Myśliwy Dusz',
'Fursharag Pożeracz Umysłów',
'Ziuggrael Strażnik Królowej',
'Lusgrathera Królowa Pramatka',
'Borgoros Garamir III',
'Chryzoprenia',
'Cerasus',
'Czempion Furboli',
'Torunia Ankelwald',
'Breheret Żelazny Łeb',
'Mysiur Myświórowy Król',
'Sadolia Nadzorczyni Hurys',
'Gothardus Kolekcjoner Głów',
'Annaniel Wysysacz Marzeń',
'Sataniel Skrytobójca',
'Bergermona Krwawa Hrabina',
'Zufulus Smakosz Serc',
'Marlloth Malignitas',
'Mocny Maddoks',
'Arachniregina Colosseus',
'Pancerny Maddok',
'Silvanasus',
'Dendroculus',
'Tolypeutes',
'Cuaitl Citlalin',
'Pogardliwa Sybilla',
'Yaotl',
'Quetzalcoatl',
'Chopesz',
'Neferkar Set',
'Terrozaur',
'Vaenra Charkhaam',
'Chaegd Agnrakh',
'Nymphemonia',
'Artenius',
'Furion',
'Zorin'
]);
