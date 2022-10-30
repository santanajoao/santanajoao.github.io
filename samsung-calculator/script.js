const expressionDiv = document.querySelector('#calculus-section');

const addClickListenerById = (object) => {
  const entries = Object.entries(object);
  entries.forEach(([id, callback]) => {
    const element = document.querySelector(`#${id}`);
    element.addEventListener('click', callback);
  })
};

const deleteLastLetter = () => {
  document.querySelector('#result-section').innerText = '';
  const { innerText: expression } = expressionDiv;
  if (expression) {
    expressionDiv.innerText = expression.substring(0, expression.length - 1);
  }
};

const clearDisplay = () => {
  document.querySelector('#calculus-section').innerText = '';
  document.querySelector('#result-section').innerText = '';
};

const displayNumber = (event) => {
  let { innerText: expression } = expressionDiv;
  const {target: {innerText: caractere } } = event;
  const lastNumber = getLastExpressionNumber(expression);
  if (lastNumber === '0') {
    deleteLastLetter();
    expression = expressionDiv.innerText;
  }
  if (expression.length <= 20) {
    expressionDiv.innerText = `${expression}${caractere}`;
  }
};

const displayOperation = (event) => {
  const expressions = ['+', '-', '×', '÷', '%'];

  const { innerText: expression } = expressionDiv;
  const {target: {innerText: caractere } } = event;

  const lastIndex = expression.length - 1;
  const lastItemIsNotOperation = !expressions.includes(expression[lastIndex]);
  const lastItemIsNotComma = expression[lastIndex] !== ',';
  const validLength = expression.length > 0 && expression.length <= 20;
  if (lastItemIsNotOperation && validLength && lastItemIsNotComma) {
    expressionDiv.innerText = `${expression}${caractere}`;
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

const getLastExpressionNumber = (expression) => {
  let number = '';
  for (let index = expression.length - 1; index >= 0; index -= 1) {
    const caractere = expression[index];
    if (!isNumber(caractere) && caractere !== ',') {
      break
    }
    number = `${caractere}${number}`;
  }
  return number;
};

const displayZero = () => {
  const { innerText: expression } = expressionDiv;
  const lastNumber = getLastExpressionNumber(expression);
  if (lastNumber[0] !== '0' && expression.length <= 20) {
    expressionDiv.innerText += '0';
  }
};

const displayComma = () => {
  const { innerText: expression } = expressionDiv;
  const lastNumber=  getLastExpressionNumber(expression);
  const notEmpty = ![expression, lastNumber].includes('');
  const notPreviousComma = !lastNumber.includes(',');
  if (notEmpty && notPreviousComma && expression.length <= 20) {
    expressionDiv.innerText += ','
  }  
};

const isValidNumberCaractere = (caractere) => {
  const validCaracteres = [',', '(', ')'];
  return validCaracteres.includes(caractere);
};

const changeSignal = () => {
  // get the signal or operation index
  // check if the number has a negative signal
  // replace de negative signal for '' 
  // or add the negative signal

};

const isSafeExpression = (expression) => {
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

const evaluate = () => {
  let { innerText: expression } = expressionDiv;
  if (expression) {
    expression = expression
      .replaceAll('÷', '/')
      .replaceAll('×', '*')
      .replaceAll('%' ,'/100*')
      .replaceAll(',', '.');
    
    if (isSafeExpression(expression)) {
      const resultDiv = document.querySelector('#result-section');
      const expressionResult = String(eval(expression));
      resultDiv.innerText = expressionResult.replaceAll('.', ',');
    }
  }
};

window.onload = () => {
  const idAndEventCallback = {
    'delete-button': deleteLastLetter,
    'clean': clearDisplay,
    'zero': displayZero,
    'comma': displayComma,
    'signal': changeSignal,
    'parentheses': () => {},
    'equal': evaluate,
  };

  addClickListenerById(idAndEventCallback);
  addNumbersListener();
  addOperationsListener();
};
