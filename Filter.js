(function () {

    if (window.autoBuyerRunning) return;
    window.autoBuyerRunning = true;

    // ===== ACCESS CONTROL (SAFE INSERT) =====
    (async () => {

        function getUserUID() {
            for (let k of Object.keys(localStorage)) {
                try {
                    let val = localStorage.getItem(k);
                    if (!val) continue;

                    try {
                        let obj = JSON.parse(val);

                        if (obj?.memberId) return String(obj.memberId);
                        if (obj?.value?.memberId) return String(obj.value.memberId);

                    } catch {}
                } catch {}
            }
            return null;
        }

        const userID = getUserUID();
        console.log("Detected UID:", userID);

        if (!userID) {
            alert("❌ UID not found");
            window.autoBuyerRunning = false;
            throw new Error("STOP");
        }

        try {
            const res = await fetch("https://raw.githubusercontent.com/Shibdas123/Example-/main/Access.json");
            const data = await res.json();

            if (!data.allowedUIDs.includes(userID)) {
                alert("⛔ Access Denied");
                window.autoBuyerRunning = false;
                throw new Error("STOP");
            }

            console.log("✅ Access Granted:", userID);

        } catch (err) {
            alert("⚠️ Access check failed");
            window.autoBuyerRunning = false;
            throw new Error("STOP");
        }

    })();

    // ===== ORIGINAL CODE =====

    let running = false;
    let targetAmount = 1000; // ✅ UPDATED
    let panel = null;

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

    // ===== CREATE PANEL =====
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

    // ===== DRAG FUNCTION =====
    let isDragging = false;
    let offsetY = 0;

    const dragHandle = document.getElementById("dragHandle");

    dragHandle.addEventListener("touchstart", e => {
        isDragging = true;
        offsetY = e.touches[0].clientY - panel.getBoundingClientRect().top;
    });

    document.addEventListener("touchmove", e => {
        if (!isDragging) return;
        let y = e.touches[0].clientY - offsetY;
        panel.style.top = y + "px";
        panel.style.bottom = "auto";
    });

    document.addEventListener("touchend", () => {
        isDragging = false;
    });

    dragHandle.addEventListener("mousedown", e => {
        isDragging = true;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        let y = e.clientY - offsetY;
        panel.style.top = y + "px";
        panel.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // ===== CONTROLS =====
    document.getElementById("start").onclick = () => {
        targetAmount = Number(document.getElementById("amt").value);
        running = true;
        updateStatus("Started...");
        loop();
    };

    document.getElementById("stop").onclick = () => {
        running = false;
        updateStatus("Stopped");
    };

})();
