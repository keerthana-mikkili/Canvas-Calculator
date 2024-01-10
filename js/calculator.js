const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Define an array of button objects with properties
const buttons = [
    { x: 0, y: 0, width: 249, height: 100, text: "", backgroundColor: "#4e4f52", textColor: "white", border: "#4c4e54" },
    { x: 0, y: 100, width: 49, height: 49, text: "C", backgroundColor: "#5e5f65", textColor: "white", border: "#4c4e54" },
    { x: 50, y: 100, width: 49, height: 49, text: "", backgroundColor: "#5e5f65", textColor: "white", border: "#4c4e54" },
    { x: 100, y: 100, width: 49, height: 49, text: "", backgroundColor: "#5e5f65", textColor: "white", border: "#4c4e54" },
    { x: 150, y: 100, width: 49, height: 49, text: "%", backgroundColor: "#5e5f65", textColor: "white", border: "#4c4e54" },
    { x: 200, y: 100, width: 49, height: 49, text: "/", backgroundColor: "#f9a529", textColor: "white", border: "#4c4e54" },
    { x: 0, y: 150, width: 49, height: 49, text: "(", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 50, y: 150, width: 49, height: 49, text: "7", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 100, y: 150, width: 49, height: 49, text: "8", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 150, y: 150, width: 49, height: 49, text: "9", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 200, y: 150, width: 49, height: 49, text: "*", backgroundColor: "#f9a529", textColor: "white", border: "#4c4e54" },
    { x: 0, y: 200, width: 49, height: 49, text: ")", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 50, y: 200, width: 49, height: 49, text: "4", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 100, y: 200, width: 49, height: 49, text: "5", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 150, y: 200, width: 49, height: 49, text: "6", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 200, y: 200, width: 49, height: 49, text: "-", backgroundColor: "#f9a529", textColor: "white", border: "#4c4e54" },
    { x: 0, y: 250, width: 49, height: 49, text: "Back", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 50, y: 250, width: 49, height: 49, text: "1", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 100, y: 250, width: 49, height: 49, text: "2", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 150, y: 250, width: 49, height: 49, text: "3", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 200, y: 250, width: 49, height: 49, text: "+", backgroundColor: "#f9a529", textColor: "white", border: "#4c4e54" },
    { x: 0, y: 300, width: 149, height: 49, text: "0", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 150, y: 300, width: 49, height: 49, text: ".", backgroundColor: "#7b7a7d", textColor: "white", border: "#4c4e54" },
    { x: 200, y: 300, width: 49, height: 49, text: "=", backgroundColor: "#f9a529", textColor: "white", border: "#4c4e54" }
  ];

// Expression and result variables
let expression = "";
let result = "";

// Function to draw a button
function drawButton(button) {
  ctx.fillStyle = button.backgroundColor;
  ctx.fillRect(button.x, button.y, button.width, button.height);
  ctx.fillStyle = button.textColor;
  ctx.textAlign = 'center';
  ctx.font = "16px Arial";
  if(button.text === "0")
  ctx.fillText(button.text, button.x + 80, button.y + 30);
  else
  ctx.fillText(button.text, button.x + 20, button.y + 30);
}

// Function to check if a point (x, y) is inside a button
function isInsideButton(x, y, button) {
  return x >= button.x && x <= button.x + button.width &&
    y >= button.y && y <= button.y + button.height;
}

// Event listener for mouse click
canvas.addEventListener("click", function (event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  for (let i = 0; i < buttons.length; i++) {
    if (isInsideButton(mouseX, mouseY, buttons[i])) {
      handleButtonClick(buttons[i]);
      break;
    }
  }
});

// Function to calculate the result of an expression
function calculateexpression(expression) {
  const tokens = expression.match(/[0-9.]+|[-+*/%()]/g);

  if (!tokens) return "Invalid Expression";

  try {
    let output = [];
    let operators = [];

    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      '%': 2
    };

    for (let token of tokens) {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length > 0 && operators[operators.length - 1] !== '(') {
          let operator = operators.pop();
          let b = output.pop();
          let a = output.pop();
          output.push(applyOperator(operator, a, b));
        }
        if (operators[operators.length - 1] === '(') {
          operators.pop();
        }
      } else {
        while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[token]) {
          let operator = operators.pop();
          let b = output.pop();
          let a = output.pop();
          output.push(applyOperator(operator, a, b));
        }
        operators.push(token);
      }
    }

    while (operators.length > 0) {
      let operator = operators.pop();
      let b = output.pop();
      let a = output.pop();
      output.push(applyOperator(operator, a, b));
    }

    return output[0];
  } catch (error) {
    return "Invalid Expression";
  }
}

function applyOperator(operator, a, b) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw "Division by zero";
      return a / b;
    case '%':
      return a % b;
    default:
      throw "Invalid operator: " + operator;
  }
}

// Handle button click
function handleButtonClick(button) {
  if (button.text === "=") {
    result = calculateexpression(expression);
  } else if (button.text === "C") {
    expression = "";
    result = "";
  } else if (button.text === "Back") {
    expression = expression.slice(0, -1);
  } else {
    expression += button.text;
  }

  updateDisplay();
}

// Update the display
function updateDisplay() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  buttons.forEach((button) => {
    drawButton(button);
  });
  ctx.font = "12px Arial";
  ctx.fillText(expression, 200, 50);
  ctx.font = "24px Arial";
  ctx.fillText(result, 200, 90);
}


// Initial display
updateDisplay();

//To draw Red button
ctx.beginPath();
ctx.arc(10, 10, 5, 0, 2 * Math.PI);
ctx.fillStyle = "red";
ctx.fill();

//To draw Orange button
ctx.beginPath();
ctx.arc(25, 10, 5, 0, 2 * Math.PI);
ctx.fillStyle = "orange";
ctx.fill();

//To draw Green button
ctx.beginPath();
ctx.arc(40, 10, 5, 0, 2 * Math.PI);
ctx.fillStyle = "green";
ctx.fill();