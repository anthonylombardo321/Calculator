//Button elements
let computationDisplay = document.querySelector(".computation-display");
let userDisplay = document.querySelector(".user-display");
let numberButtons = document.querySelectorAll(".number-button");
let operatorButtons = document.querySelectorAll(".operator-button");
let clearButton = document.querySelector(".clear-button");
let deleteButton = document.querySelector(".delete-button");
let negateButton = document.querySelector(".negate-button");
let decimalButton = document.querySelector(".decimal-button");
let equalButton = document.querySelector(".equal-button");

//Button Event Listeners
clearButton.addEventListener('click', clearDisplay);
deleteButton.addEventListener('click', deleteNumber);
negateButton.addEventListener('click', negateInput);
decimalButton.addEventListener('click', addDecimalToInput);
equalButton.addEventListener('click', displayResult);

//Initial Values
let firstOperand = "";
let secondOperand = "";
let operatorValue = "";
let userInput = "0";
let computation = "";


//Functions
window.onload = function() {
    userDisplay.textContent = userInput;
    numberButtons.forEach((numberButton) => {
        numberButton.addEventListener('click', (e) => insertNumberToInput(e.target.textContent));
    });
    operatorButtons.forEach((operatorButton) => {
        operatorButton.addEventListener('click', (e) => insertOperatorToComputation(e.target.textContent));
    })
};

window.addEventListener('keydown', (e) => {
    if(e.key >= "0" && e.key <= "9") {
        numberButtons.forEach((numberButton) => {
            if(numberButton.textContent === e.key) {
                numberButton.classList.add("active");
                insertNumberToInput(e.key);
                setTimeout(() => numberButton.classList.remove("active"), 200);
            }
        });     
    }
    if(e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        operatorButtons.forEach((operatorButton) => {
            if(operatorButton.textContent === e.key) {
                operatorButton.classList.add("active");
                insertOperatorToComputation(e.key);
                setTimeout(() => operatorButton.classList.remove("active"), 200);
            }
        });
    }
    if(e.key === "Delete" || e.key === "Escape") {
        clearButton.style.backgroundColor = "rgb(97, 97, 97)";
        clearDisplay();
        setTimeout(() => clearButton.style.backgroundColor = "red", 200);
    }
    if(e.key === "Backspace") {
        deleteButton.classList.add("active");
        deleteNumber();
        setTimeout(() => deleteButton.classList.remove("active"), 200);
    }
    if(e.key === "Control") {
        negateButton.classList.add("active");
        negateInput();
        setTimeout(() => negateButton.classList.remove("active"), 200);
    }
    if(e.key === ".") {
        decimalButton.classList.add("active");
        addDecimalToInput();
        setTimeout(() => decimalButton.classList.remove("active"), 200);
    }
    if(e.key === "Enter") {
        equalButton.style.backgroundColor = "rgb(97, 97, 97)";
        displayResult();
        setTimeout(() => equalButton.style.backgroundColor = "rgb(45, 45, 218)", 200);
    }
})

function insertNumberToInput(number){
    //If a user types a new number, create a new computation
    if(computation.includes("=")){
        clearDisplay();
        userInput = number;
    }
    else if(userInput === "0" && number !== "0" || Number(userInput) === Number(firstOperand)){
        userInput = number;
    }
    else if(userInput !== "0" && Number(userInput) !== Number(firstOperand)) {
        userInput += number;
    }
    userDisplay.textContent = userInput;
}

function insertOperatorToComputation(operator){
    //If a division by 0 error occurs, do nothing
    if(userInput === "I AM ERROR") return;
    //If user wants to use the previous result as the first operand in a new computation
    if(computation.includes("=")){
        let temp = Number(userInput); //Temporarily stores the result, so it can be stored in firstOperand
        clearDisplay();
        firstOperand = temp;
        operatorValue = operator;
        computation = `${firstOperand} ${operator} `;
        computationDisplay.textContent = computation;
    }
    //This stores the first operand
    if(computation === "" && firstOperand === ""){
        firstOperand = Number(userInput);
        operatorValue = operator;
        computation = `${firstOperand} ${operator} `;
        computationDisplay.textContent = computation;
    }
    //When a user uses another operator, it calculates the result and makes the result the first operand.
    else {
        secondOperand = Number(userInput);
        let result = operate();
        firstOperand = result === "I AM ERROR" ? "I AM ERROR" : Number(result);
        operatorValue = operator;
        computation = `${firstOperand} ${operator} `;
        computationDisplay.textContent = computation;
        userInput = result;
        userDisplay.textContent = userInput;
    }
}

function displayResult(){
    //If a division by 0 error occurs, do nothing
    if(userInput === "I AM ERROR") return;
    //If the user presses enter on a number, it takes the square of that number
    if(computation === "" && userInput !== ""){
        let result = Number(userInput) * Number(userInput);
        firstOperand = Number(userInput);
        secondOperand = Number(userInput);
        computation = `${firstOperand} * ${secondOperand} =`;
        operatorValue = "*";
        userInput = result;
        computationDisplay.textContent = computation;
        userDisplay.textContent = userInput;
    }
    //Display the result
    else if(!computation.includes("=")){
        secondOperand = Number(userInput);
        let result = operate();
        computation += `${userInput} =`
        userInput = result;
        computationDisplay.textContent = computation;
        userDisplay.textContent = userInput;
    }
    //If a user presses enter on a result, it will operate the next result
    else{
        firstOperand = Number(operate());
        let result = operate();
        computation = `${firstOperand} ${operatorValue} ${secondOperand} =`
        userInput = result;
        computationDisplay.textContent = computation;
        userDisplay.textContent = userInput;
    }
}

function operate(){
    if(operatorValue === "+"){
        return firstOperand + secondOperand;
    }
    if(operatorValue === "-"){
        return firstOperand - secondOperand;
    }
    if(operatorValue === "*"){
        return firstOperand * secondOperand;
    }
    if(operatorValue === "/"){
        if(firstOperand === 0 && secondOperand === 0) return "I AM ERROR";
        return firstOperand / secondOperand;
    }
}

function clearDisplay(){
    //Reset values
    firstOperand = "";
    secondOperand = "";
    operator = "";
    userInput = "0";
    computation = "";

    //Revert display to initial state
    computationDisplay.textContent = "";
    userDisplay.textContent = "0";
}

function deleteNumber(){
    if(userInput !== "0"){
        userInput = userInput.slice(0, userInput.length - 1);
        if(userInput === ""){
            userInput = "0";
        }
        userDisplay.textContent = userInput;
    }
}

function negateInput(){
    if(userInput.includes("-")){
        userInput = userInput.slice(1, userInput.length);
    }
    else{
        userInput = "-" + userInput;
    }
    userDisplay.textContent = userInput;
}

function addDecimalToInput(){
    if(userInput.includes(".")) return;
    userInput = userInput + ".";
    userDisplay.textContent = userInput;
}