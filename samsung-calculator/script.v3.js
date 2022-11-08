const expressionDiv = document.querySelector('#calculus-section');
const pError = document.querySelector('.error-messager');

const operations = ['+', '-', '×', '÷', '%'];
let lastExpressionNumber = '';

const addClickListenerById = (object) => {
  const entries = Object.entries(object);
  entries.forEach(([id, callback]) => {
    const element = document.querySelector(`#${id}`);
    element.addEventListener('click', callback);
  })
};

const deleteLastCaractere = () => {
  document.querySelector('#result-section').textContent = '';
  const { textContent: expression } = expressionDiv;
  if (expression) {
    expressionDiv.textContent = expression.substring(0, expression.length - 1);
  }
  lastExpressionNumber = lastExpressionNumber.slice(0, -1);
};

const clearErrorMessage = () => {
  pError.textContent = '';
};

const clearDisplay = () => {
  document.querySelector('#calculus-section').textContent = '';
  document.querySelector('#result-section').textContent = '';
  clearErrorMessage();
  lastExpressionNumber = '';
};

const displayNumber = (event) => {
  let { textContent: expression } = expressionDiv;
  const { target: { textContent: caractere } } = event;
  if (lastExpressionNumber === '0') {
    deleteLastCaractere();
    expression = expressionDiv.textContent;
    lastExpressionNumber = lastExpressionNumber.split(0, -1);
  }
  const lastIndex = lastExpressionNumber.length - 1;
  const lastNumberCaractere = lastExpressionNumber[lastIndex];
  if (expression.length <= 20 && lastNumberCaractere !== ')') {
    expressionDiv.textContent = `${expression}${caractere}`;
    lastExpressionNumber += caractere;
  }
};

const displayOperation = (event) => {
  const { textContent: expression } = expressionDiv;
  const {target: {textContent: operation } } = event;

  const lastIndex = expression.length - 1;
  const lastItemIsNotOperation = !operations.includes(expression[lastIndex]);
  const lastItemIsNotComma = expression[lastIndex] !== ',';
  const validLength = expression.length > 0 && expression.length <= 20;
  const lastItemIsNotParenthesesOpen = expression[lastIndex] !== '(';
  const validLastItem = lastItemIsNotOperation && lastItemIsNotComma 
    && lastItemIsNotParenthesesOpen;

  if (validLastItem && validLength) {
    expressionDiv.textContent = `${expression}${operation}`;
    lastExpressionNumber = '';
  }
};

const addOperationsListener = () => {
  const [, ...allOperators] = document.querySelectorAll('.operations');
  allOperators.forEach((element) =>
    element.addEventListener('click', displayOperation));
};

const addNumbersListener = () => {
  const allNumbers = document.querySelectorAll('.number');
  allNumbers.forEach((button) =>
    button.addEventListener('click', displayNumber));
};

const isNumber = (caractere) => !isNaN(caractere);

const isValidNumberCaractere = (caractere) => {
  const validCaracteres = ["(", ",", ")"];
  return validCaracteres.includes(caractere) || isNumber(caractere);
};

const getFirstDigit = (number) => {
  for (const digit of number) {
    if (isNumber(digit)) return digit;
  }
};

const displayZero = () => {
  const { textContent: expression } = expressionDiv;
  const notStartsWithZero = getFirstDigit(lastExpressionNumber) !== '0';
  const hasComma = expression.includes(',');
  const lastIndex = lastExpressionNumber.length - 1;
  const lastNotParentheses = lastExpressionNumber[lastIndex] !== ')';
  const validCondition = (notStartsWithZero || hasComma) 
    && lastNotParentheses && expression.length <= 20;
  
  if (validCondition) {
    expressionDiv.textContent += '0';
    lastExpressionNumber += '0';
  }
};

const displayComma = () => {
  const { textContent: expression } = expressionDiv;
  const notEmpty = ![expression, lastExpressionNumber].includes('');
  const notPreviousComma = !lastExpressionNumber.includes(',');
  if (notEmpty && notPreviousComma && expression.length <= 20) {
    expressionDiv.textContent += ','
    lastExpressionNumber += ',';
  }
};

const reverse = (numberString) => {
  let reversedNumber = '';
  for (let index = numberString.length - 1; index >= 0; index -= 1) {
    reversedNumber += numberString[index];
  }
  return reversedNumber;
};

const removeNegativeOnNumber = (number) => {
  const reversedNumber = reverse(number);
  const positiveNumber = reversedNumber.replace('-(', '').replace(')', '');
  return reverse(positiveNumber);
};

const removeNegativeOnExpression = (lastNumber) => {
  const { textContent: expression } = expressionDiv;
  const positiveNumber = removeNegativeOnNumber(lastNumber);
  const reversedExpression = reverse(expression);
  const resultExpression = reversedExpression.replace(
    reverse(lastNumber), reverse(positiveNumber)
  );
  expressionDiv.textContent = reverse(resultExpression);
  lastExpressionNumber = lastExpressionNumber.slice(2, -1);
}

const addNegativeOnExpression = (lastNumber) => {
  const { textContent: expression } = expressionDiv;
  const negativeLastNumber = `(-${lastNumber})`;
  const reversedExpression = reverse(expression);
  const resultExpression = reversedExpression.replace(
    reverse(lastNumber), reverse(negativeLastNumber)
  );
  expressionDiv.textContent = reverse(resultExpression);
  lastExpressionNumber = `(-${lastExpressionNumber})`;
};

const changeSignal = () => {
  if (lastExpressionNumber.includes('(-')) {
    removeNegativeOnExpression(lastExpressionNumber);
  } else if (lastExpressionNumber !== '' && lastExpressionNumber !== '0') {
    addNegativeOnExpression(lastExpressionNumber);
  }
};

const isSafeExpression = (expression) => {
  /* A função eval executa código JavaScript podendo ser insegura. Essa função testa se a expressão contem apenas os caracteres matemáticos esperados */
  const securityTest = expression
  .replaceAll('+', '')
  .replaceAll('-', '')
  .replaceAll('*', '')
  .replaceAll('/', '')
  .replaceAll('(', '')
  .replaceAll(')', '')
  .replaceAll('.', '')
  .replace(/[0-9]/g, '');

  return securityTest === '';
};

const changeOperations = (expression) => {
  return expression
  .replaceAll('÷', '/')
  .replaceAll('×', '*')
  .replaceAll('%' ,'/100*')
  .replaceAll(',', '.');
};

const evaluateAndDisplay = (expression) => {
  const resultDiv = document.querySelector('#result-section');
  let expressionResult = String(eval(expression)).replaceAll('.', ',');
  if (resultDiv.textContent === expressionResult) {
    resultDiv.textContent = '';
    if (expressionResult.includes('-')) {
      expressionResult = `(${expressionResult})`
    }
    expressionDiv.textContent = expressionResult;
    lastExpressionNumber = expressionResult;
  } else {
    resultDiv.textContent = expressionResult;
  }
};

const evaluate = () => {
  let { textContent: expression } = expressionDiv;
  if (expression) {
    expression = changeOperations(expression);
    if (isSafeExpression(expression)) {
      try {
        pError.textContent = '';
        evaluateAndDisplay(expression);
      } catch (error) {
        pError.textContent = 'Expressão inválida';
      }
    }
  }
};

const hasOpenParentheses = (expression) => {
  let opened = 0;
  for (const caractere of expression) {
    if (caractere === '(') opened += 1;
    if (caractere === ')') opened -= 1;
  }
  return opened !== 0;
}

const displayParentheses = () => {
  const { textContent: expression } = expressionDiv;
  const lastIndex = expression.length - 1;
  const lastCaractere = expression[lastIndex];

  const closeValidLastCaractere = isNumber(lastCaractere) 
    || lastCaractere === ')';

  const openValidLastCaractere = [...operations, undefined, '(']
    .includes(lastCaractere)
  
  if (openValidLastCaractere && expression.length <= 20) {
    expressionDiv.textContent += '(';
    lastExpressionNumber += '(';
  } else if (closeValidLastCaractere && hasOpenParentheses(expression)) {
    expressionDiv.textContent += ')';
    lastExpressionNumber += ')';
  }
};

window.onload = () => {
  const idAndEventCallback = {
    'delete-button': deleteLastCaractere,
    'clean': clearDisplay,
    'zero': displayZero,
    'comma': displayComma,
    'signal': changeSignal,
    'parentheses': displayParentheses,
    'equal': evaluate,
  };

  addClickListenerById(idAndEventCallback);
  addNumbersListener();
  addOperationsListener();
};
