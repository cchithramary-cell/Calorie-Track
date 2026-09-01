// ======================================================
// CALORIE CALCULATOR
// ======================================================

// ================= ELEMENTS =================

const databaseFoodBtn = document.getElementById("databaseFoodBtn");

const manualFoodBtn = document.getElementById("manualFoodBtn");

const databaseFoodForm = document.getElementById("databaseFoodForm");

const manualFoodForm = document.getElementById("manualFoodForm");

const foodSelect = document.getElementById("foodSelect");

const quantityInput = document.getElementById("quantity");

const unitDisplay = document.getElementById("unitDisplay");

const mealSelect = document.getElementById("mealSelect");

const calculateBtn = document.getElementById("calculateBtn");

const manualFoodName = document.getElementById("manualFoodName");

const manualQuantity = document.getElementById("manualQuantity");

const manualUnit = document.getElementById("manualUnit");

const manualCalories = document.getElementById("manualCalories");

const manualProtein = document.getElementById("manualProtein");

const manualCarbs = document.getElementById("manualCarbs");

const manualFat = document.getElementById("manualFat");

const manualMealSelect = document.getElementById("manualMealSelect");

const manualAddBtn = document.getElementById("manualAddBtn");

const addToMealBtn = document.getElementById("addToMealBtn");

const calculatorMessage = document.getElementById("calculatorMessage");

const resultFood = document.getElementById("resultFood");

const resultQuantity = document.getElementById("resultQuantity");

const resultCalories = document.getElementById("resultCalories");

const resultProtein = document.getElementById("resultProtein");

const resultCarbs = document.getElementById("resultCarbs");

const resultFat = document.getElementById("resultFat");

// ======================================================
// SELECTED DATE
// ======================================================
// Get the date passed from meals.html
//
// Example:
// calculator.html?date=2026-08-28
// ======================================================

const urlParams = new URLSearchParams(window.location.search);

const selectedDate = urlParams.get("date");

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
// FINAL DATE TO SAVE
// ======================================================

const dateToSave = selectedDate || getToday();

// ================= VARIABLES =================

let calculatedFood = null;

// ======================================================
// LOAD FOOD LIST
// ======================================================

function loadFoods() {
  foods.forEach((food) => {
    const option = document.createElement("option");

    option.value = food.id;

    option.textContent = `${food.name} (${food.unit})`;

    foodSelect.appendChild(option);
  });
}

// ======================================================
// CHANGE BETWEEN FOOD LIST AND MANUAL ENTRY
// ======================================================

databaseFoodBtn.addEventListener("click", function () {
  databaseFoodBtn.classList.add("active");

  manualFoodBtn.classList.remove("active");

  databaseFoodForm.style.display = "block";

  manualFoodForm.style.display = "none";

  calculatorMessage.textContent = "";
});

manualFoodBtn.addEventListener("click", function () {
  manualFoodBtn.classList.add("active");

  databaseFoodBtn.classList.remove("active");

  manualFoodForm.style.display = "block";

  databaseFoodForm.style.display = "none";

  calculatorMessage.textContent = "";
});

// ======================================================
// UPDATE UNIT AUTOMATICALLY
// ======================================================

foodSelect.addEventListener("change", function () {
  const selectedFoodId = Number(foodSelect.value);

  const selectedFood = foods.find((food) => food.id === selectedFoodId);

  if (!selectedFood) {
    unitDisplay.textContent = "g";

    return;
  }

  if (selectedFood.unit.includes("ml")) {
    unitDisplay.textContent = "ml";
  } else if (selectedFood.unit.includes("piece")) {
    unitDisplay.textContent = "piece";
  } else if (selectedFood.unit.includes("slice")) {
    unitDisplay.textContent = "slice";
  } else {
    unitDisplay.textContent = "g";
  }
});

// ======================================================
// CALCULATE FOOD FROM DATABASE
// ======================================================

calculateBtn.addEventListener("click", function () {
  const selectedFoodId = Number(foodSelect.value);

  const quantity = Number(quantityInput.value);

  // ---------- VALIDATION ----------

  if (!selectedFoodId) {
    calculatorMessage.textContent = "Please select a food.";

    return;
  }

  if (!quantity || quantity <= 0) {
    calculatorMessage.textContent = "Please enter a valid quantity.";

    return;
  }

  // ---------- FIND FOOD ----------

  const selectedFood = foods.find((food) => food.id === selectedFoodId);

  if (!selectedFood) {
    calculatorMessage.textContent = "Food not found.";

    return;
  }

  let calories;
  let protein;
  let carbs;
  let fat;

  // ==================================================
  // PIECE / SLICE FOOD
  // ==================================================

  if (
    selectedFood.unit.includes("piece") ||
    selectedFood.unit.includes("slice")
  ) {
    calories = selectedFood.calories * quantity;

    protein = selectedFood.protein * quantity;

    carbs = selectedFood.carbs * quantity;

    fat = selectedFood.fat * quantity;
  }

  // ==================================================
  // 100g / 100ml FOOD
  // ==================================================
  else {
    calories = (selectedFood.calories * quantity) / 100;

    protein = (selectedFood.protein * quantity) / 100;

    carbs = (selectedFood.carbs * quantity) / 100;

    fat = (selectedFood.fat * quantity) / 100;
  }

  // ==================================================
  // CREATE FOOD OBJECT
  // ==================================================

  calculatedFood = {
    name: selectedFood.name,

    quantity: quantity,

    unit: unitDisplay.textContent,

    meal: mealSelect.value,

    calories: calories,

    protein: protein,

    carbs: carbs,

    fat: fat,

    type: "database",
  };

  // ==================================================
  // DISPLAY RESULT
  // ==================================================

  displayResult(calculatedFood);

  calculatorMessage.textContent = "Calculation completed!";

  addToMealBtn.disabled = false;
});

// ======================================================
// MANUAL FOOD
// ======================================================

manualAddBtn.addEventListener("click", function () {
  const name = manualFoodName.value.trim();

  const quantity = Number(manualQuantity.value);

  const unit = manualUnit.value;

  const calories = Number(manualCalories.value);

  const protein = Number(manualProtein.value) || 0;

  const carbs = Number(manualCarbs.value) || 0;

  const fat = Number(manualFat.value) || 0;

  const meal = manualMealSelect.value;

  // ---------- VALIDATION ----------

  if (!name) {
    calculatorMessage.textContent = "Please enter the food name.";

    return;
  }

  if (!quantity || quantity <= 0) {
    calculatorMessage.textContent = "Please enter a valid quantity.";

    return;
  }

  if (manualCalories.value === "" || calories < 0) {
    calculatorMessage.textContent = "Please enter the calorie value.";

    return;
  }

  // ==================================================
  // CREATE MANUAL FOOD OBJECT
  // ==================================================

  calculatedFood = {
    name: name,

    quantity: quantity,

    unit: unit,

    meal: meal,

    calories: calories,

    protein: protein,

    carbs: carbs,

    fat: fat,

    type: "manual",
  };

  // ==================================================
  // DISPLAY RESULT
  // ==================================================

  displayResult(calculatedFood);

  calculatorMessage.textContent = "Manual food calculated successfully!";

  addToMealBtn.disabled = false;
});

// ======================================================
// DISPLAY RESULT
// ======================================================

function displayResult(food) {
  resultFood.textContent = food.name;

  resultQuantity.textContent = `${food.quantity} ${food.unit}`;

  resultCalories.textContent = `${food.calories.toFixed(1)} kcal`;

  resultProtein.textContent = `${food.protein.toFixed(1)} g`;

  resultCarbs.textContent = `${food.carbs.toFixed(1)} g`;

  resultFat.textContent = `${food.fat.toFixed(1)} g`;
}

// ======================================================
// ADD TO MEAL
// ======================================================

addToMealBtn.addEventListener("click", function () {
  if (!calculatedFood) {
    calculatorMessage.textContent = "Please calculate or add a food first.";

    return;
  }

  // ==================================================
  // GET EXISTING DATA
  // ==================================================

  let calorieData =
    JSON.parse(localStorage.getItem("calorieTrackerData")) || {};

  // ==================================================
  // CREATE SELECTED DATE IF NOT EXISTS
  // ==================================================

  if (!calorieData[dateToSave]) {
    calorieData[dateToSave] = [];
  }

  // ==================================================
  // ADD FOOD TO SELECTED DATE
  // ==================================================

  calorieData[dateToSave].push(calculatedFood);

  // ==================================================
  // SAVE
  // ==================================================

  localStorage.setItem("calorieTrackerData", JSON.stringify(calorieData));

  // ==================================================
  // SUCCESS MESSAGE
  // ==================================================

  calculatorMessage.textContent = `Food added to ${formatDate(dateToSave)} meals!`;

  // ==================================================
  // REDIRECT TO SAME DATE
  // ==================================================

  setTimeout(function () {
    window.location.href = `meals.html?date=${dateToSave}`;
  }, 700);
});

// ======================================================
// FORMAT DATE FOR MESSAGE
// ======================================================

function formatDate(dateString) {
  const parts = dateString.split("-");

  if (parts.length !== 3) {
    return dateString;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// ======================================================
// LOAD FOOD DATA
// ======================================================

loadFoods();
