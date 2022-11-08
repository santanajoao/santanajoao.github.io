const expressionDiv = document.querySelector('#calculus-section');
const pError = document.querySelector('.error-messager');

const operations = ['+', '-', '×', '÷', '%'];

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
};

const clearErrorMessage = () => {
  pError.textContent = '';
};

const clearDisplay = () => {
  document.querySelector('#calculus-section').textContent = '';
  document.querySelector('#result-section').textContent = '';
  clearErrorMessage();
};

const displayNumber = (event) => {
  let { textContent: expression } = expressionDiv;
  const {target: {textContent: caractere } } = event;
  const lastNumber = getLastExpressionNumber(expression);
  if (lastNumber === '0') {
    deleteLastCaractere();
    expression = expressionDiv.textContent;
  }
  if (expression.length <= 20) {
    expressionDiv.textContent = `${expression}${caractere}`;
  }
};

const displayOperation = (event) => {
  const { textContent: expression } = expressionDiv;
  const {target: {textContent: caractere } } = event;

  const lastIndex = expression.length - 1;
  const lastItemIsNotOperation = !operations.includes(expression[lastIndex]);
  const lastItemIsNotComma = expression[lastIndex] !== ',';
  const validLength = expression.length > 0 && expression.length <= 20;
  const lastItemIsNotParenthesesOpen = expression[lastIndex] !== '(';
  const validLastItem = lastItemIsNotOperation && lastItemIsNotComma 
    && lastItemIsNotParenthesesOpen;

  if (validLastItem && validLength) {
    expressionDiv.textContent = `${expression}${caractere}`;
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

const getLastExpressionNumber = () => {
  const { textContent: expression } = expressionDiv;
  let number = '';
  for (let index = expression.length - 1; index >= 0; index -= 1) {
    const caractere = expression[index];
    const isNegativeSign = (caractere === '-' && expression[index - 1] === '(');
    if (!isValidNumberCaractere(caractere) && !isNegativeSign) {
      break;
    }
    number = `${caractere}${number}`
  }
  return number;
};

const getFirstDigit = (number) => {
  for (const digit of number) {
    if (isNumber(digit)) return digit;
  }
};

const displayZero = () => {
  const { textContent: expression } = expressionDiv;
  const lastNumber = getLastExpressionNumber(expression);
  const notStartsWithZero = getFirstDigit(lastNumber) !== '0';
  console.log(getFirstDigit(lastNumber));
  const hasComma = expression.includes(',');
  if ((notStartsWithZero || hasComma) && expression.length <= 20) {
    expressionDiv.textContent += '0';
  }
};

const displayComma = () => {
  const { textContent: expression } = expressionDiv;
  const lastNumber=  getLastExpressionNumber(expression);
  const notEmpty = ![expression, lastNumber].includes('');
  const notPreviousComma = !lastNumber.includes(',');
  if (notEmpty && notPreviousComma && expression.length <= 20) {
    expressionDiv.textContent += ','
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
}

const addNegativeOnExpression = (lastNumber) => {
  const { textContent: expression } = expressionDiv;
  const negativeLastNumber = `(-${lastNumber})`;
  const reversedExpression = reverse(expression);
  const resultExpression = reversedExpression.replace(
    reverse(lastNumber), reverse(negativeLastNumber)
  );
  expressionDiv.textContent = reverse(resultExpression);
};

const changeSignal = () => {
  const lastNumber = getLastExpressionNumber();
  if (lastNumber.includes('(-')) {
    removeNegativeOnExpression(lastNumber);
  } else if (lastNumber !== '' && lastNumber !== '0') {
    addNegativeOnExpression(lastNumber);
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
  } else if (closeValidLastCaractere && hasOpenParentheses(expression)) {
    expressionDiv.textContent += ')';
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
