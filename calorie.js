const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
let isError = false;

function cleanInputString(str) {
  const regex = /[+-\s]/g; //Todos los +- con o sin espacio (/s) globales (/g)
  return str.replace(regex, ""); //Reemplaza todos los valores dados (str) que son iguales al regex (+-) con un espacio en blanco ("")
}

function isInvalidInput(str) {
  //Evitar que se pongan exponenciales (e) en calorias
  const regex = /\d+e\d+/i; //el exponencial (e) entre dígitos (/d) indiscriminado (/i)
  return str.match(regex); //Devuelve los que sean iguales al regex, o "null" si no hay iguales
}

function addEntry() {
  //Tomar todos los input-containter dentro del Id (#) de lo que se escogió en el dropwdown
  const targetInputContainer = document.querySelector(
    `#${entryDropdown.value} .input-container`
  );
  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1; //Se empieza en cero, se pone el +1;
  //Agregar los inputs al HTML
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories"/>
  `;
  // targetInputContainter.innerHTML+=HTMLString; //Se pierden las entradas anteriores

  //Agregar entradas sin perder el anterior input (insertAdjacentHTML)

  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const breakfastNumberInputs = document.querySelectorAll(
    "#breakfast input[type=number]"
  );
  const lunchNumberInputs = document.querySelectorAll(
    "#lunch input[type=number]"
  );
  const dinnerNumberInputs = document.querySelectorAll(
    "#dinner input[type=number]"
  );
  const snacksNumberInputs = document.querySelectorAll(
    "#snacks input[type=number]"
  );
  const exerciseNumberInputs = document.querySelectorAll(
    "#exercise input[type=number]"
  );

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]); //Se convierte en array el objeto para meterlo en la función

  if (isError) {
    //isError = true;
    return;
  }

  const consumedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories =
    budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";
  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(
    remainingCalories
  )} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;

  output.classList.remove("hide");
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    //Cada objeto de list se llamará "item"
    const currVal = cleanInputString(item.value); //Lamar función de limpiar
    const invalidInputMatch = isInvalidInput(currVal); //Llamar función de errores

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`); //Alerta en pantalla
      isError = true;
      return null;
    }
    calories += Number(currVal); //Number() para que solo llame los numeros
  }
  return calories;
}

function clearForm() {
  const inputContainers = Array.from(
    document.querySelectorAll(".input-container") //Crea un arrary de todo los .input-container
  );

  for (const container of inputContainers) {
    container.innerHTML = "";
  }

  budgetNumberInput.value = "";
  output.innerText = "";
  output.classList.add("hide");
}

addEntryButton.addEventListener("click", addEntry); //Similar a .onClick
calorieCounter.addEventListener("submit", calculateCalories); //Evento submit
clearButton.addEventListener("click", clearForm);
