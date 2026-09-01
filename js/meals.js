// ======================================================
// DAILY MEAL TRACKER
// ======================================================

// ================= ELEMENTS =================

const dateInput = document.getElementById("dateInput");

const breakfastItems = document.getElementById("breakfastItems");
const lunchItems = document.getElementById("lunchItems");
const snacksItems = document.getElementById("snacksItems");
const dinnerItems = document.getElementById("dinnerItems");

const clearDayBtn = document.getElementById("clearDayBtn");

// ================= SUMMARY =================

const totalCalories = document.getElementById("totalCalories");
const remainingCalories = document.getElementById("remainingCalories");

const totalProtein = document.getElementById("totalProtein");
const totalCarbs = document.getElementById("totalCarbs");
const totalFat = document.getElementById("totalFat");

// ================= MEAL TOTALS =================

const breakfastCalories = document.getElementById("breakfastCalories");
const lunchCalories = document.getElementById("lunchCalories");
const snacksCalories = document.getElementById("snacksCalories");
const dinnerCalories = document.getElementById("dinnerCalories");

// ================= PROGRESS =================

const progressPercentage = document.getElementById("progressPercentage");
const progressFill = document.getElementById("progressFill");

// ================= DAILY GOAL =================

const dailyGoalInput = document.getElementById("dailyGoalInput");
const saveGoalBtn = document.getElementById("saveGoalBtn");
const dailyTargetText = document.getElementById("dailyTargetText");

// ================= DEFAULT GOAL =================

let dailyTarget = 2000;

// ======================================================
// GET TODAY'S DATE
// ======================================================

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
// SAVE DAILY GOAL
// ======================================================

function saveDailyGoal(goal) {
  localStorage.setItem("dailyCalorieGoal", String(goal));
}

// ======================================================
// GET CALORIE DATA
// ======================================================

function getCalorieData() {
  return JSON.parse(localStorage.getItem("calorieTrackerData")) || {};
}

// ======================================================
// SAVE CALORIE DATA
// ======================================================

function saveCalorieData(data) {
  localStorage.setItem("calorieTrackerData", JSON.stringify(data));
}

// ======================================================
// DISPLAY MEALS
// ======================================================

function displayMeals() {
  const selectedDate = dateInput.value;

  const calorieData = getCalorieData();

  const meals = calorieData[selectedDate] || [];

  // ==================================================
  // CLEAR OLD ITEMS
  // ==================================================

  breakfastItems.innerHTML = "";
  lunchItems.innerHTML = "";
  snacksItems.innerHTML = "";
  dinnerItems.innerHTML = "";

  // ==================================================
  // TOTAL VARIABLES
  // ==================================================

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  let proteinKnown = false;
  let carbsKnown = false;
  let fatKnown = false;

  let breakfastTotal = 0;
  let lunchTotal = 0;
  let snacksTotal = 0;
  let dinnerTotal = 0;

  // ==================================================
  // LOOP THROUGH FOODS
  // ==================================================

  meals.forEach((food, index) => {
    // ================= CALORIES =================

    calories += Number(food.calories) || 0;

    // ================= PROTEIN =================

    if (
      food.protein !== null &&
      food.protein !== undefined &&
      food.protein !== ""
    ) {
      protein += Number(food.protein) || 0;
      proteinKnown = true;
    }

    // ================= CARBS =================

    if (food.carbs !== null && food.carbs !== undefined && food.carbs !== "") {
      carbs += Number(food.carbs) || 0;
      carbsKnown = true;
    }

    // ================= FAT =================

    if (food.fat !== null && food.fat !== undefined && food.fat !== "") {
      fat += Number(food.fat) || 0;
      fatKnown = true;
    }

    // ==================================================
    // CREATE FOOD ITEM
    // ==================================================

    const foodItem = document.createElement("div");

    foodItem.className = "meal-food-item";

    foodItem.innerHTML = `
      <div>
        <strong>
          ${food.name}
        </strong>

        <p>
          ${food.quantity} ${food.unit}
        </p>
      </div>

      <div>
        <strong>
          ${Number(food.calories).toFixed(1)} kcal
        </strong>

        <button
          type="button"
          class="delete-food"
          onclick="deleteFood(${index})"
        >
          🗑️
        </button>
      </div>
    `;

    // ==================================================
    // ADD TO CORRECT MEAL
    // ==================================================

    if (food.meal === "Breakfast") {
      breakfastItems.appendChild(foodItem);

      breakfastTotal += Number(food.calories) || 0;
    } else if (food.meal === "Lunch") {
      lunchItems.appendChild(foodItem);

      lunchTotal += Number(food.calories) || 0;
    } else if (food.meal === "Snacks") {
      snacksItems.appendChild(foodItem);

      snacksTotal += Number(food.calories) || 0;
    } else if (food.meal === "Dinner") {
      dinnerItems.appendChild(foodItem);

      dinnerTotal += Number(food.calories) || 0;
    }
  });

  // ==================================================
  // EMPTY MEAL MESSAGES
  // ==================================================

  if (breakfastItems.children.length === 0) {
    breakfastItems.innerHTML = `
      <p class="empty-message">
        No food added yet.
      </p>
    `;
  }

  if (lunchItems.children.length === 0) {
    lunchItems.innerHTML = `
      <p class="empty-message">
        No food added yet.
      </p>
    `;
  }

  if (snacksItems.children.length === 0) {
    snacksItems.innerHTML = `
      <p class="empty-message">
        No food added yet.
      </p>
    `;
  }

  if (dinnerItems.children.length === 0) {
    dinnerItems.innerHTML = `
      <p class="empty-message">
        No food added yet.
      </p>
    `;
  }

  // ==================================================
  // DAILY SUMMARY
  // ==================================================

  totalCalories.textContent = `${calories.toFixed(1)} kcal`;

  const remaining = Math.max(dailyTarget - calories, 0);

  remainingCalories.textContent = `${remaining.toFixed(1)} kcal`;

  // ==================================================
  // NUTRITION SUMMARY
  // ==================================================

  totalProtein.textContent = proteinKnown
    ? `${protein.toFixed(1)} g`
    : "Not provided";

  totalCarbs.textContent = carbsKnown
    ? `${carbs.toFixed(1)} g`
    : "Not provided";

  totalFat.textContent = fatKnown ? `${fat.toFixed(1)} g` : "Not provided";

  // ==================================================
  // MEAL TOTALS
  // ==================================================

  breakfastCalories.textContent = `${breakfastTotal.toFixed(1)} kcal`;

  lunchCalories.textContent = `${lunchTotal.toFixed(1)} kcal`;

  snacksCalories.textContent = `${snacksTotal.toFixed(1)} kcal`;

  dinnerCalories.textContent = `${dinnerTotal.toFixed(1)} kcal`;

  // ==================================================
  // DAILY PROGRESS
  // ==================================================

  let percentage = (calories / dailyTarget) * 100;

  percentage = Math.min(percentage, 100);

  progressPercentage.textContent = `${percentage.toFixed(0)}%`;

  progressFill.style.width = `${percentage}%`;
}

// ======================================================
// DELETE FOOD
// ======================================================

function deleteFood(index) {
  const selectedDate = dateInput.value;

  const calorieData = getCalorieData();

  if (!calorieData[selectedDate]) {
    return;
  }

  calorieData[selectedDate].splice(index, 1);

  // Remove date if no foods remain

  if (calorieData[selectedDate].length === 0) {
    delete calorieData[selectedDate];
  }

  saveCalorieData(calorieData);

  displayMeals();
}

// ======================================================
// CLEAR SELECTED DAY
// ======================================================

clearDayBtn.addEventListener("click", function () {
  const selectedDate = dateInput.value;

  const calorieData = getCalorieData();

  if (!calorieData[selectedDate]) {
    alert("No meals found for this date.");

    return;
  }

  const confirmClear = confirm(
    "Are you sure you want to clear all meals for this day?",
  );

  if (!confirmClear) {
    return;
  }

  delete calorieData[selectedDate];

  saveCalorieData(calorieData);

  displayMeals();
});

// ======================================================
// DATE CHANGE
// ======================================================

dateInput.addEventListener("change", function () {
  displayMeals();
});

// ======================================================
// ADD FOOD BUTTON
// ======================================================
// IMPORTANT:
// Pass the currently selected date to calculator.html
// ======================================================

const addFoodBtn = document.querySelector(".date-section .primary-btn");

addFoodBtn.addEventListener("click", function (event) {
  event.preventDefault();

  const selectedDate = dateInput.value;

  if (!selectedDate) {
    alert("Please select a date first.");

    return;
  }

  window.location.href = `calculator.html?date=${selectedDate}`;
});

// ======================================================
// SAVE DAILY GOAL
// ======================================================

saveGoalBtn.addEventListener("click", function () {
  const newGoal = Number(dailyGoalInput.value);

  // ================= VALIDATION =================

  if (!newGoal || newGoal < 500) {
    alert("Please enter a calorie goal of at least 500 kcal.");

    return;
  }

  if (newGoal > 10000) {
    alert("Please enter a calorie goal below 10000 kcal.");

    return;
  }

  // ================= SAVE =================

  dailyTarget = newGoal;

  saveDailyGoal(dailyTarget);

  // ================= UPDATE UI =================

  dailyTargetText.textContent = `${dailyTarget} kcal`;

  displayMeals();

  alert("Daily calorie goal saved successfully!");
});

// ======================================================
// INITIAL LOAD
// ======================================================

// ================= LOAD GOAL =================

dailyTarget = getDailyGoal();

dailyGoalInput.value = dailyTarget;

dailyTargetText.textContent = `${dailyTarget} kcal`;

// ================= LOAD DATE =================

const urlParams = new URLSearchParams(window.location.search);

const dateFromHistory = urlParams.get("date");

if (dateFromHistory) {
  dateInput.value = dateFromHistory;
} else {
  dateInput.value = getToday();
}

// ================= DISPLAY =================

displayMeals();
