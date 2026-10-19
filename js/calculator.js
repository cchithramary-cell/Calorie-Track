// ======================================================
// CALORIE CALCULATOR - USER-SPECIFIC STORAGE
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

// ================= SELECTED DATE =================
const urlParams = new URLSearchParams(window.location.search);
const selectedDate = urlParams.get("date");

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const dateToSave = selectedDate || getToday();
let calculatedFood = null;

// ================= LOAD FOOD LIST =================
function loadFoods() {
  if (!Array.isArray(foods) || !foodSelect) return;

  // Prevent duplicate options if this function is called again.
  foodSelect.innerHTML = '<option value="">Select food</option>';

  foods.forEach((food) => {
    const option = document.createElement("option");
    option.value = food.id;
    option.textContent = `${food.name} (${food.unit})`;
    foodSelect.appendChild(option);
  });
}

// ================= SWITCH INPUT MODES =================
if (databaseFoodBtn) {
  databaseFoodBtn.addEventListener("click", function () {
    databaseFoodBtn.classList.add("active");
    manualFoodBtn?.classList.remove("active");
    if (databaseFoodForm) databaseFoodForm.style.display = "block";
    if (manualFoodForm) manualFoodForm.style.display = "none";
    if (calculatorMessage) calculatorMessage.textContent = "";
  });
}

if (manualFoodBtn) {
  manualFoodBtn.addEventListener("click", function () {
    manualFoodBtn.classList.add("active");
    databaseFoodBtn?.classList.remove("active");
    if (manualFoodForm) manualFoodForm.style.display = "block";
    if (databaseFoodForm) databaseFoodForm.style.display = "none";
    if (calculatorMessage) calculatorMessage.textContent = "";
  });
}

// ================= UPDATE UNIT =================
if (foodSelect) {
  foodSelect.addEventListener("change", function () {
    const selectedFoodId = Number(foodSelect.value);
    const selectedFood = Array.isArray(foods)
      ? foods.find((food) => food.id === selectedFoodId)
      : null;

    if (!selectedFood) {
      if (unitDisplay) unitDisplay.textContent = "g";
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
}

// ================= CALCULATE DATABASE FOOD =================
if (calculateBtn) {
  calculateBtn.addEventListener("click", function () {
    const selectedFoodId = Number(foodSelect?.value);
    const quantity = Number(quantityInput?.value);

    if (!selectedFoodId) {
      calculatorMessage.textContent = "Please select a food.";
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      calculatorMessage.textContent = "Please enter a valid quantity.";
      return;
    }

    const selectedFood = Array.isArray(foods)
      ? foods.find((food) => food.id === selectedFoodId)
      : null;

    if (!selectedFood) {
      calculatorMessage.textContent = "Food not found.";
      return;
    }

    let calories;
    let protein;
    let carbs;
    let fat;

    if (
      selectedFood.unit.includes("piece") ||
      selectedFood.unit.includes("slice")
    ) {
      calories = Number(selectedFood.calories) * quantity;
      protein = Number(selectedFood.protein) * quantity;
      carbs = Number(selectedFood.carbs) * quantity;
      fat = Number(selectedFood.fat) * quantity;
    } else {
      calories = (Number(selectedFood.calories) * quantity) / 100;
      protein = (Number(selectedFood.protein) * quantity) / 100;
      carbs = (Number(selectedFood.carbs) * quantity) / 100;
      fat = (Number(selectedFood.fat) * quantity) / 100;
    }

    calculatedFood = {
      name: selectedFood.name,
      quantity,
      unit: unitDisplay?.textContent || selectedFood.unit,
      meal: mealSelect?.value || "Breakfast",
      calories,
      protein,
      carbs,
      fat,
      type: "database",
    };

    displayResult(calculatedFood);
    calculatorMessage.textContent = "Calculation completed!";
    if (addToMealBtn) addToMealBtn.disabled = false;
  });
}

// ================= ADD MANUAL FOOD =================
if (manualAddBtn) {
  manualAddBtn.addEventListener("click", function () {
    const name = manualFoodName?.value.trim() || "";
    const quantity = Number(manualQuantity?.value);
    const unit = manualUnit?.value || "g";
    const calories = Number(manualCalories?.value);
    const protein =
      manualProtein?.value === "" ? 0 : Number(manualProtein?.value);
    const carbs = manualCarbs?.value === "" ? 0 : Number(manualCarbs?.value);
    const fat = manualFat?.value === "" ? 0 : Number(manualFat?.value);
    const meal = manualMealSelect?.value || "Breakfast";

    if (!name) {
      calculatorMessage.textContent = "Please enter the food name.";
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      calculatorMessage.textContent = "Please enter a valid quantity.";
      return;
    }
    if (
      manualCalories?.value === "" ||
      !Number.isFinite(calories) ||
      calories < 0
    ) {
      calculatorMessage.textContent = "Please enter a valid calorie value.";
      return;
    }
    if (
      ![protein, carbs, fat].every(
        (value) => Number.isFinite(value) && value >= 0,
      )
    ) {
      calculatorMessage.textContent =
        "Protein, carbs, and fat must be zero or positive numbers.";
      return;
    }

    calculatedFood = {
      name,
      quantity,
      unit,
      meal,
      calories,
      protein,
      carbs,
      fat,
      type: "manual",
    };

    displayResult(calculatedFood);
    calculatorMessage.textContent = "Manual food calculated successfully!";
    if (addToMealBtn) addToMealBtn.disabled = false;
  });
}

// ================= DISPLAY RESULT =================
function displayResult(food) {
  if (resultFood) resultFood.textContent = food.name;
  if (resultQuantity)
    resultQuantity.textContent = `${food.quantity} ${food.unit}`;
  if (resultCalories)
    resultCalories.textContent = `${Number(food.calories).toFixed(1)} kcal`;
  if (resultProtein)
    resultProtein.textContent = `${Number(food.protein).toFixed(1)} g`;
  if (resultCarbs)
    resultCarbs.textContent = `${Number(food.carbs).toFixed(1)} g`;
  if (resultFat) resultFat.textContent = `${Number(food.fat).toFixed(1)} g`;
}

// ================= ADD FOOD TO USER'S MEALS =================
if (addToMealBtn) {
  addToMealBtn.addEventListener("click", function () {
    if (!calculatedFood) {
      calculatorMessage.textContent = "Please calculate or add a food first.";
      return;
    }

    // This helper is defined in auth.js and uses the logged-in user's email.
    const storageKey = getUserStorageKey("calorieTrackerData");
    if (!storageKey) {
      calculatorMessage.textContent = "Please log in before adding food.";
      return;
    }

    let calorieData = {};
    try {
      const savedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (
        savedData &&
        typeof savedData === "object" &&
        !Array.isArray(savedData)
      ) {
        calorieData = savedData;
      }
    } catch {
      calorieData = {};
    }

    if (!Array.isArray(calorieData[dateToSave])) {
      calorieData[dateToSave] = [];
    }

    calorieData[dateToSave].push({ ...calculatedFood });
    localStorage.setItem(storageKey, JSON.stringify(calorieData));
    calculatorMessage.textContent = `Food added to ${formatDate(dateToSave)} meals!`;

    window.setTimeout(function () {
      window.location.href = `meals.html?date=${encodeURIComponent(dateToSave)}`;
    }, 700);
  });
}

// ================= FORMAT DATE =================
function formatDate(dateString) {
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// ================= INITIALIZE =================
loadFoods();
if (addToMealBtn) addToMealBtn.disabled = true;
