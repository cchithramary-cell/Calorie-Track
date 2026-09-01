// ======================================================
// CALORIETRACK - CALORIE HISTORY
// ======================================================

// ================= ELEMENTS =================

const historyTableBody = document.getElementById("historyTableBody");

const emptyHistory = document.getElementById("emptyHistory");

const daysTracked = document.getElementById("daysTracked");

const averageCalories = document.getElementById("averageCalories");

const highestCalories = document.getElementById("highestCalories");

const lowestCalories = document.getElementById("lowestCalories");

// ================= FILTER =================

const fromDate = document.getElementById("fromDate");

const toDate = document.getElementById("toDate");

const filterBtn = document.getElementById("filterBtn");

const resetFilterBtn = document.getElementById("resetFilterBtn");

// ================= CHART =================

const calorieChart = document.getElementById("calorieChart");

const emptyChart = document.getElementById("emptyChart");

// ======================================================
// GET DAILY GOAL
// ======================================================

function getDailyGoal() {
  const savedGoal = localStorage.getItem("dailyCalorieGoal");

  if (savedGoal !== null && !isNaN(Number(savedGoal))) {
    return Number(savedGoal);
  }

  return 2000;
}

// ======================================================
// GET CALORIE DATA
// ======================================================

function getCalorieData() {
  return JSON.parse(localStorage.getItem("calorieTrackerData")) || {};
}

// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ======================================================
// FORMAT SHORT DATE
// ======================================================

function formatShortDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

// ======================================================
// CALCULATE DAILY CALORIES
// ======================================================

function calculateDailyCalories(meals) {
  let calories = 0;

  meals.forEach(function (food) {
    calories += Number(food.calories) || 0;
  });

  return calories;
}

// ======================================================
// GET STATUS
// ======================================================

function getStatus(calories, goal) {
  if (calories > goal) {
    return {
      text: "Over Goal",

      className: "status-over",
    };
  }

  if (calories >= goal * 0.8) {
    return {
      text: "Within Goal",

      className: "status-good",
    };
  }

  return {
    text: "Below Goal",

    className: "status-under",
  };
}

// ======================================================
// DRAW CALORIE CHART
// ======================================================

function drawCalorieChart(chartData, dailyGoal) {
  if (!calorieChart) {
    return;
  }

  const canvas = calorieChart;

  const wrapper = canvas.parentElement;

  const width = wrapper.clientWidth;

  const height = wrapper.clientHeight;

  if (width === 0 || height === 0) {
    return;
  }

  const devicePixelRatio = window.devicePixelRatio || 1;

  canvas.width = width * devicePixelRatio;

  canvas.height = height * devicePixelRatio;

  canvas.style.width = `${width}px`;

  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");

  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  // ==================================================
  // CLEAR CANVAS
  // ==================================================

  ctx.clearRect(0, 0, width, height);

  if (chartData.length === 0) {
    return;
  }

  // ==================================================
  // CHART DIMENSIONS
  // ==================================================

  const paddingLeft = 55;

  const paddingRight = 25;

  const paddingTop = 25;

  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;

  const chartHeight = height - paddingTop - paddingBottom;

  // ==================================================
  // FIND MAX VALUE
  // ==================================================

  let maxCalories = dailyGoal;

  chartData.forEach(function (item) {
    if (item.calories > maxCalories) {
      maxCalories = item.calories;
    }
  });

  // Add some space above highest value

  maxCalories = Math.ceil(maxCalories / 500) * 500;

  if (maxCalories === 0) {
    maxCalories = 2000;
  }

  // ==================================================
  // DRAW GRID
  // ==================================================

  const gridLines = 5;

  ctx.font = "12px Arial";

  ctx.textAlign = "right";

  ctx.textBaseline = "middle";

  for (let i = 0; i <= gridLines; i++) {
    const y = paddingTop + (chartHeight * i) / gridLines;

    ctx.beginPath();

    ctx.moveTo(paddingLeft, y);

    ctx.lineTo(width - paddingRight, y);

    ctx.strokeStyle = "#edf0f3";

    ctx.lineWidth = 1;

    ctx.stroke();

    const value = maxCalories - (maxCalories * i) / gridLines;

    ctx.fillStyle = "#718096";

    ctx.fillText(`${Math.round(value)}`, paddingLeft - 10, y);
  }

  // ==================================================
  // DRAW GOAL LINE
  // ==================================================

  const goalY =
    paddingTop + chartHeight - (dailyGoal / maxCalories) * chartHeight;

  ctx.beginPath();

  ctx.moveTo(paddingLeft, goalY);

  ctx.lineTo(width - paddingRight, goalY);

  ctx.strokeStyle = "#94a3b8";

  ctx.lineWidth = 1.5;

  ctx.setLineDash([6, 5]);

  ctx.stroke();

  ctx.setLineDash([]);

  // ==================================================
  // X POSITIONS
  // ==================================================

  const pointCount = chartData.length;

  function getX(index) {
    if (pointCount === 1) {
      return paddingLeft + chartWidth / 2;
    }

    return paddingLeft + (chartWidth * index) / (pointCount - 1);
  }

  function getY(calories) {
    return paddingTop + chartHeight - (calories / maxCalories) * chartHeight;
  }

  // ==================================================
  // DRAW AREA
  // ==================================================

  if (chartData.length > 1) {
    ctx.beginPath();

    chartData.forEach(function (item, index) {
      const x = getX(index);

      const y = getY(item.calories);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(getX(chartData.length - 1), paddingTop + chartHeight);

    ctx.lineTo(getX(0), paddingTop + chartHeight);

    ctx.closePath();

    ctx.fillStyle = "rgba(76, 175, 80, 0.08)";

    ctx.fill();
  }

  // ==================================================
  // DRAW LINE
  // ==================================================

  ctx.beginPath();

  chartData.forEach(function (item, index) {
    const x = getX(index);

    const y = getY(item.calories);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.strokeStyle = "#4caf50";

  ctx.lineWidth = 3;

  ctx.lineJoin = "round";

  ctx.lineCap = "round";

  ctx.stroke();

  // ==================================================
  // DRAW POINTS
  // ==================================================

  chartData.forEach(function (item, index) {
    const x = getX(index);

    const y = getY(item.calories);

    // Outer circle

    ctx.beginPath();

    ctx.arc(x, y, 5, 0, Math.PI * 2);

    ctx.fillStyle = "#ffffff";

    ctx.fill();

    ctx.strokeStyle = "#4caf50";

    ctx.lineWidth = 2;

    ctx.stroke();

    // =================================================
    // CALORIE VALUE
    // =================================================

    ctx.font = "600 11px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "bottom";

    ctx.fillStyle = "#182b49";

    ctx.fillText(`${Math.round(item.calories)}`, x, y - 10);
  });

  // ==================================================
  // X AXIS LABELS
  // ==================================================

  ctx.font = "11px Arial";

  ctx.fillStyle = "#718096";

  ctx.textAlign = "center";

  ctx.textBaseline = "top";

  // Avoid too many labels

  let labelStep = 1;

  if (chartData.length > 7) {
    labelStep = Math.ceil(chartData.length / 7);
  }

  chartData.forEach(function (item, index) {
    if (index % labelStep !== 0 && index !== chartData.length - 1) {
      return;
    }

    const x = getX(index);

    ctx.fillText(formatShortDate(item.date), x, paddingTop + chartHeight + 12);
  });
}

// ======================================================
// LOAD HISTORY
// ======================================================

function loadHistory() {
  const calorieData = getCalorieData();

  let dates = Object.keys(calorieData);

  // ==================================================
  // FILTER
  // ==================================================

  const startDate = fromDate.value;

  const endDate = toDate.value;

  if (startDate) {
    dates = dates.filter(function (date) {
      return date >= startDate;
    });
  }

  if (endDate) {
    dates = dates.filter(function (date) {
      return date <= endDate;
    });
  }

  // ==================================================
  // SORT NEWEST FIRST
  // ==================================================

  dates.sort(function (a, b) {
    return new Date(b) - new Date(a);
  });

  // ==================================================
  // NO HISTORY
  // ==================================================

  if (dates.length === 0) {
    historyTableBody.innerHTML = "";

    emptyHistory.style.display = "flex";

    daysTracked.textContent = "0";

    averageCalories.textContent = "0 kcal";

    highestCalories.textContent = "0 kcal";

    lowestCalories.textContent = "0 kcal";

    if (calorieChart) {
      calorieChart.style.display = "none";
    }

    if (emptyChart) {
      emptyChart.style.display = "flex";
    }

    return;
  }

  // ==================================================
  // HISTORY EXISTS
  // ==================================================

  emptyHistory.style.display = "none";

  if (calorieChart) {
    calorieChart.style.display = "block";
  }

  if (emptyChart) {
    emptyChart.style.display = "none";
  }

  historyTableBody.innerHTML = "";

  // ==================================================
  // DAILY GOAL
  // ==================================================

  const dailyGoal = getDailyGoal();

  // ==================================================
  // STATISTICS
  // ==================================================

  let totalCalories = 0;

  let highest = 0;

  let lowest = Infinity;

  // ==================================================
  // CHART DATA
  // ==================================================

  const chartData = [];

  // ==================================================
  // CREATE TABLE ROWS
  // ==================================================

  dates.forEach(function (date) {
    const meals = calorieData[date] || [];

    const calories = calculateDailyCalories(meals);

    // ================= STATISTICS =================

    totalCalories += calories;

    if (calories > highest) {
      highest = calories;
    }

    if (calories < lowest) {
      lowest = calories;
    }

    // ================= CHART DATA =================

    chartData.push({
      date: date,

      calories: calories,
    });

    // ================= STATUS =================

    const status = getStatus(calories, dailyGoal);

    // ==================================================
    // CREATE ROW
    // ==================================================

    const row = document.createElement("tr");

    row.innerHTML = `

            <td>

                <strong>
                    ${formatDate(date)}
                </strong>

            </td>


            <td>

                ${calories.toFixed(1)} kcal

            </td>


            <td>

                ${dailyGoal.toFixed(0)} kcal

            </td>


            <td>

                <span
                    class="status-badge ${status.className}">

                    ${status.text}

                </span>

            </td>


            <td>

                <button
                    type="button"
                    class="view-day-btn"
                    onclick="viewDay('${date}')">

                    View Day

                </button>

            </td>

        `;

    historyTableBody.appendChild(row);
  });

  // ==================================================
  // UPDATE STATISTICS
  // ==================================================

  const numberOfDays = dates.length;

  const average = totalCalories / numberOfDays;

  daysTracked.textContent = numberOfDays;

  averageCalories.textContent = `${average.toFixed(1)} kcal`;

  highestCalories.textContent = `${highest.toFixed(1)} kcal`;

  lowestCalories.textContent = `${lowest.toFixed(1)} kcal`;

  // ==================================================
  // CHART
  // ==================================================

  // Chart should be displayed oldest → newest

  const chartDataSorted = [...chartData].reverse();

  drawCalorieChart(chartDataSorted, dailyGoal);
}

// ======================================================
// VIEW PARTICULAR DAY
// ======================================================

function viewDay(date) {
  window.location.href = `meals.html?date=${encodeURIComponent(date)}`;
}

// ======================================================
// FILTER BUTTON
// ======================================================

filterBtn.addEventListener("click", function () {
  if (fromDate.value && toDate.value && fromDate.value > toDate.value) {
    alert("From date cannot be later than To date.");

    return;
  }

  loadHistory();
});

// ======================================================
// RESET FILTER
// ======================================================

resetFilterBtn.addEventListener("click", function () {
  fromDate.value = "";

  toDate.value = "";

  loadHistory();
});

// ======================================================
// REDRAW CHART WHEN WINDOW RESIZES
// ======================================================

window.addEventListener("resize", function () {
  loadHistory();
});

// ======================================================
// INITIAL LOAD
// ======================================================

loadHistory();
