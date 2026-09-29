function loadResearchResults() {
    return JSON.parse(localStorage.getItem("aiResponsibleResults")) || [];
}

function displayResearchDashboard() {
    const results = loadResearchResults();
    const total = document.getElementById("researchTotalResults");
    const average = document.getElementById("researchAverageScore");

    if (results.length === 0) {
        total.textContent = "Chưa có dữ liệu trên thiết bị này (dữ liệu tự xóa khi có mã học sinh mới).";
        average.textContent = "";
        if (window.RaiBackground) window.RaiBackground.setWarning(false);
        return;
    }

        const latest = results[results.length - 1];
    const totalQuestions = latest.totalQuestions || questions.length;
    const avgScale10 = typeof latest.average === "number"
        ? latest.average
        : Number(((latest.score / totalQuestions) * 10).toFixed(2));

    total.textContent = "Mã học sinh gần nhất trên thiết bị này: " + latest.studentCode;
    average.textContent = "Điểm: " + latest.score + "/" + totalQuestions +
        " (thang 10: " + avgScale10.toFixed(2) + ")";
}

function displayResearchResults() {
    const results = loadResearchResults();
    const container = document.getElementById("researchResults");
    container.innerHTML = "";

    if (results.length === 0) {
        container.textContent = "Chưa có dữ liệu trên thiết bị này.";
        return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Mã HS</th>
                <th>Thời gian</th>
                <th>Điểm</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    results.forEach(function(result) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${result.studentCode}</td>
            <td>${result.attempt}</td>
            <td>${result.score}/${result.totalQuestions}</td>
        `;
        tbody.appendChild(row);
    });

    container.appendChild(table);
}

function analyzeResearchBehaviors() {
    const results = loadResearchResults();
    const statistics = {};

    for (const behavior in behaviors) {
        statistics[behavior] = 0;
    }

    results.forEach(function(result) {
        for (const behavior in result.behaviorResults) {
            if (result.behaviorResults[behavior] === 0) {
                statistics[behavior]++;
            }
        }
    });

    return statistics;
}

function displayResearchBehaviorAnalysis() {
    const results = loadResearchResults();
    const container = document.getElementById("researchBehaviorAnalysis");
    container.innerHTML = "";

    if (results.length === 0) {
        container.textContent = "Chưa có dữ liệu.";
        return;
    }

    const statistics = analyzeResearchBehaviors();

    for (const behavior in statistics) {
        const p = document.createElement("p");
        const status = statistics[behavior] > 0 ? "cần chú ý" : "đã đạt";
        p.textContent = behavior + " (" + behaviors[behavior] + "): " + status;
        container.appendChild(p);
    }
}

function refreshResearchView() {
    displayResearchDashboard();
    displayResearchResults();
    displayResearchBehaviorAnalysis();
}

const clearDataButton = document.getElementById("clearDataButton");
if (clearDataButton) {
    clearDataButton.addEventListener("click", function () {
        const confirmed = confirm("Xóa dữ liệu lần làm bài gần nhất trên thiết bị này? Hành động này không thể hoàn tác.");
        if (confirmed) {
            localStorage.removeItem("aiResponsibleResults");
            refreshResearchView();
        }
    });
}

refreshResearchView();
