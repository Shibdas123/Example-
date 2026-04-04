(function () {

    if (window.autoBuyerRunning) return;
    window.autoBuyerRunning = true;

    (async function () {

        function getUserUID() {
            for (let k of Object.keys(localStorage)) {
                try {
                    let val = localStorage.getItem(k);
                    if (!val) continue;

                    try {
                        let obj = JSON.parse(val);

                        if (obj?.memberId) return String(obj.memberId).trim();
                        if (obj?.value?.memberId) return String(obj.value.memberId).trim();

                    } catch {}
                } catch {}
            }
            return null;
        }

        const userID = getUserUID();

        if (!userID) {
            alert("Access Denied ❌");
            window.autoBuyerRunning = false;
            return;
        }

        try {
            const res = await fetch("https://raw.githubusercontent.com/Shibdas123/Example-/main/Access.json?nocache=" + Date.now());
            const data = await res.json();

            const allowed = data.allowedUIDs.map(x => String(x).trim());

            if (!allowed.includes(userID)) {
                alert("Access Denied ❌");
                window.autoBuyerRunning = false;
                return;
            }

            alert("Access Granted ✅");
            startMain();

        } catch (err) {
            alert("Access check failed ❌");
            window.autoBuyerRunning = false;
            return;
        }

    })();


    function startMain() {

        let running = false;
        let targetAmount = 1000;
        let panel = null;

        // 🔔 IMPROVED ALARM SYSTEM
        let lastSignature = "";
        let lastTriggerTime = 0;
        let audio = null;
        let alarmInterval = null;

        function startAlarm() {
            if (alarmInterval) return;

            alarmInterval = setInterval(() => {
                try {
                    audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
                    audio.volume = 1;
                    audio.play();
                } catch {}
            }, 1200);
        }

        function stopAlarm() {
            if (alarmInterval) {
                clearInterval(alarmInterval);
                alarmInterval = null;
            }
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }

        function getSignature() {
            let txt = document.body.innerText || "";
            return txt.slice(0, 300); // smaller = more stable
        }

        // 🔥 SMART OBSERVER (NO SPAM)
        const observer = new MutationObserver(() => {
            if (!running) return;

            let now = Date.now();
            let current = getSignature();

            let changeAmount = Math.abs(current.length - lastSignature.length);

            // only trigger if BIG change + cooldown
            if (
                current !== lastSignature &&
                changeAmount > 50 &&                // ignore small updates
                now - lastTriggerTime > 4000       // cooldown 4 sec
            ) {
                lastSignature = current;
                lastTriggerTime = now;

                startAlarm();
                updateStatus("Page Changed 🔔");

                // stop after 5 sec
                setTimeout(stopAlarm, 2000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        function reactClick(el) {
            try {
                const key = Object.keys(el).find(k => k.startsWith("__reactProps"));
                if (key && el[key]?.onClick) {
                    el[key].onClick({ target: el });
                } else {
                    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                }
            } catch {
                el.click();
            }
        }

        function updateStatus(msg) {
            let s = document.getElementById("status");
            if (s) s.innerText = msg;
        }

        function getDefaultBtn() {
            return Array.from(document.querySelectorAll("div, button"))
                .find(el => el.innerText.trim() === "Default");
        }

        function extractAmount(text) {
            let match = text.match(/₹\s?(\d+(\.\d+)?)/);
            return match ? parseFloat(match[1]) : null;
        }

        function isSuccess() {
            return document.body.innerText.includes("Order submitted") ||
                   document.body.innerText.includes("Processing");
        }

        function isFailed() {
            return document.body.innerText.includes("Limited by functionality");
        }

        function closePopup() {
            document.querySelectorAll("button, div").forEach(el => {
                let txt = (el.innerText || "").toLowerCase();
                if (txt.includes("close") || txt.includes("ok") || txt.includes("cancel")) {
                    reactClick(el);
                }
            });

            document.querySelectorAll(".ant-modal, .modal, [role='dialog']").forEach(m => {
                m.remove();
            });
        }

        function scanAndBuy() {
            let rows = document.querySelectorAll("div");

            for (let row of rows) {
                let txt = row.innerText || "";
                let amount = extractAmount(txt);

                if (amount !== null && amount === Number(targetAmount)) {
                    let btn = Array.from(row.querySelectorAll("button"))
                        .find(b => /buy/i.test(b.innerText));

                    if (btn) {
                        updateStatus("Buying " + amount);
                        reactClick(btn);
                        return true;
                    }
                }
            }
            return false;
        }

        function loop() {
            if (!running) return;

            let defBtn = getDefaultBtn();

            if (defBtn) {
                reactClick(defBtn);
                updateStatus("Refreshing...");
            } else {
                updateStatus("Default not found");
            }

            setTimeout(() => {

                scanAndBuy();

                if (isSuccess()) {
                    updateStatus("Success");
                    closePopup();
                    stopAlarm();
                    running = false;

                    if (panel) panel.remove();
                    window.autoBuyerRunning = false;
                    return;
                }

                if (isFailed()) {
                    updateStatus("Retry...");
                    closePopup();
                }

                setTimeout(loop, 250);

            }, 120);
        }

        panel = document.createElement("div");

        panel.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #0a0a0a;
            color: #fff;
            padding: 12px;
            border-radius: 10px;
            z-index: 999999;
            width: 220px;
            box-shadow: 0 0 12px #00ffcc;
            font-family: Arial;
            cursor: grab;
        `;

        panel.innerHTML = `
            <div id="dragHandle" style="margin-bottom:6px;cursor:grab;">🎯 Drag Me</div>

            <input id="amt" type="number" value="1000"
            style="width:100%;margin-bottom:6px;padding:6px;background:#111;color:#00ffcc;border:2px solid #00ffcc;border-radius:6px;text-align:center;"/>

            <div id="status" style="margin-bottom:6px;font-size:12px;color:#ccc;">
                Idle
            </div>

            <button id="start" style="width:48%;background:green;color:#fff;border:none;padding:6px;border-radius:5px;">
                Start
            </button>

            <button id="stop" style="width:48%;background:red;color:#fff;border:none;padding:6px;border-radius:5px;">
                Stop
            </button>
        `;

        document.body.appendChild(panel);

        document.getElementById("start").onclick = () => {
            targetAmount = Number(document.getElementById("amt").value);
            running = true;
            lastSignature = getSignature();
            updateStatus("Started...");
            loop();
        };

        document.getElementById("stop").onclick = () => {
            running = false;
            stopAlarm();
            updateStatus("Stopped");
        };

    }

})();
