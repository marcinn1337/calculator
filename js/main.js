let visibleInput
let functionInput
let calcResult
let keyboard
let sidePanel
let hintParagraph
let hints
let hiddenInput
let inputMode
let confirmBtn
let cancelBtn
let x
let y
let turn
let turnedFunction
let base
let calculatedBase
let powExponent
let calculatedExponent
let radicand
let calculatedRadicand
let degree
let calculatedDegree
let forbiddenCharacters
let simpleFunctionCharacters
let numbers

const getElements = () => {
	inputMode = 'defaultMode'
	hiddenInput = ''
	turn = 1
	visibleInput = document.querySelector('.calculator__screen-input')
	functionInput = document.querySelector('.calculator__screen-functionInput')
	calcResult = document.querySelector('.calculator__screen-result')
	keyboard = document.querySelector('.calculator__keyboard')
	sidePanel = document.querySelector('.side-panel')
	hintParagraph = document.querySelector('.calculator__screen-hint')
	confirmBtn = document.querySelector('.btn-confirm')
	cancelBtn = document.querySelector('.btn-cancel')
	forbiddenCharacters = /[,.>|°!%eφπ]/
	numbers = /[0-9]/
	simpleFunctionCharacters = /[+-/*]/
	hints = {
		syntaxError: 'Nie możesz tego wybrać ponieważ składnia będzie nieprawidłowa.',
		degreeRequest: 'Podaj stopnień kąta, następnie zatwierdź klikając <i class="fa-solid fa-check"> :',
		afterReset: 'Zresetowano kalkulator',
		abortedFunction: 'Anulowano wprowadzanie funkcji',
	}
	calc = {
		abortFunction() {
			if (inputMode === 'functionMode') {
				hintParagraph.textContent = hints.abortedFunction
				functionInput.textContent = ''
				inputMode = 'defaultMode'
				turnedFunction = 'off'
				powBase = ''
				calculatedBase = ''
				powExponent = ''
				calculatedExponent = ''
				turn = 1
			}
		},
		resetAll() {
			inputMode = 'functionMode'
			calc.abortFunction()
			hintParagraph.textContent = hints.afterReset
			calcResult.textContent = '='
			visibleInput.textContent = ''
			functionInput.textContent = ''
			hiddenInput = ''
			inputMode = 'defaultMode'
		},
		inputCharacter(target) {
			if (inputMode === 'defaultMode' && target.classList.contains('btn-const')) {
				if (target.classList.contains('const-e')) {
					visibleInput.innerHTML += target.innerHTML
					hiddenInput += eval(Math.E)
				} else if (target.classList.contains('const-pi')) {
					visibleInput.innerHTML += target.innerHTML
					hiddenInput += eval(Math.PI)
				} else if (target.classList.contains('const-phi')) {
					visibleInput.innerHTML += target.innerHTML
					hiddenInput += eval((1 + Math.sqrt(5)) / 2)
				}
			} else if (inputMode === 'defaultMode') {
				hintParagraph.textContent = ''
				visibleInput.innerHTML += target.innerHTML
				hiddenInput += target.textContent
			} else if (inputMode === 'functionMode' && target.classList.contains('btn-const')) {
				if (target.classList.contains('const-e')) {
					functionInput.textContent += eval(Math.E.toFixed(3))
				} else if (target.classList.contains('const-pi')) {
					functionInput.textContent += eval(Math.PI.toFixed(3))
				} else if (target.classList.contains('const-phi')) {
					functionInput.textContent += eval(((1 + Math.sqrt(5)) / 2).toFixed(3))
				}
			} else if (
				inputMode === 'functionMode' &&
				(target.classList.contains('btn-nonfunctional') || target.classList.contains('btn-simple-functional'))
			) {
				functionInput.innerHTML += target.textContent
			}
		},
		exponentiation() {
			inputMode = 'functionMode'
			turnedFunction = 'exponentation'
			functionInput.textContent = ''
			hintParagraph.innerHTML = 'Wprowadź podstawę a następnie zatwierdź klikając <i class="fa-solid fa-check"> :'
		},
		exponentationAfterClick() {
			if (turn === 1 && functionInput.innerHTML !== '') {
				calculatedBase = eval(functionInput.textContent)
				base = functionInput.textContent
				hintParagraph.innerHTML =
					'Podaj wykladnik potęgi a następnie zatwierdź klikając <i class="fa-solid fa-check"> : '
				functionInput.textContent = ''
				turn++
			} else if (turn === 2 && functionInput.innerHTML !== '') {
				calculatedExponent = eval(functionInput.textContent)
				powExponent = functionInput.innerHTML
				hiddenInput += Math.pow(calculatedBase, calculatedExponent)
				if (base.length > 1) {
					visibleInput.innerHTML = `${visibleInput.innerHTML}(${base})<sup>${powExponent}</sup>`
				} else if (base.length === 1) {
					visibleInput.innerHTML = `${visibleInput.innerHTML}${base}<sup>${powExponent}</sup>`
				}
				hintParagraph.textContent = ''
				functionInput.textContent = ''
				turn = 1
				inputMode = 'defaultMode'
				turnedFunction = 'off'
			}
		},
		calculateRoot(x, n) {
			if (n % 2 === 0 && x < 0) {
				hintParagraph.textContent = 'Nie można obliczyć pierwiastka parzystego stopnia z ujemnej liczby!'
			} else if (n % 2 !== 0 && x < 0) {
				x *= -1
				hiddenInput += -1 * Math.pow(x, 1 / n)
			} else {
				hiddenInput += Math.pow(x, 1 / n)
			}
		},
		nthroot() {
			inputMode = 'functionMode'
			turnedFunction = 'root'
			functionInput.textContent === ''
			hintParagraph.innerHTML =
				'Podaj podstawę pierwiastka, następnie zatwierdź klikając <i class="fa-solid fa-check"> :'
		},
		rootAfterClick() {
			if (turn === 1 && functionInput.textContent !== '') {
				calculatedRadicand = eval(functionInput.textContent)
				radicand = functionInput.textContent
				hintParagraph.innerHTML =
					'Podaj stopień pierwiastka a następnie zatwierdź klikając <i class="fa-solid fa-check"> : '
				functionInput.textContent = ''
				turn++
			} else if (turn === 2 && functionInput.textContent !== '') {
				calculatedDegree = eval(functionInput.textContent)
				degree = functionInput.textContent
				calc.calculateRoot(calculatedRadicand, calculatedDegree)
				visibleInput.innerHTML = `${visibleInput.innerHTML}<sup>${degree}</sup>&radic;<span class="radicand">${radicand}</span>`
				functionInput.textContent = ''
				hintParagraph.textContent = ''
				turn = 1
				inputMode = 'defaultMode'
				turnedFunction = 'off'
			}
		},
		absolute() {
			inputMode = 'functionMode'
			turnedFunction = 'absolute'
			functionInput.textContent === ''
			hintParagraph.innerHTML =
				'Podaj wyrażenie z którego chcesz obliczyć wartość bezwzględną, następnie zatwierdź klikając <i class="fa-solid fa-check"> :'
		},
		absoluteAfterClick() {
			hiddenInput += Math.abs(eval(functionInput.textContent))
			visibleInput.innerHTML += `|${functionInput.innerHTML}|`
			functionInput.textContent = ''
			hintParagraph.textContent = ''
			inputMode = 'defaultMode'
			turnedFunction = 'off'
		},
		sin() {
			inputMode = 'functionMode'
			turnedFunction = 'sinus'
			functionInput.textContent === ''
			hintParagraph.innerHTML = hints.degreeRequest
		},
		sinAfterClick() {
			let degree = eval(functionInput.textContent)
			hiddenInput += Math.sin((degree * Math.PI) / 180)
			visibleInput.innerHTML += `sin${functionInput.innerHTML}°`
			functionInput.textContent = ''
			hintParagraph.textContent = ''
			inputMode = 'defaultMode'
			turnedFunction = 'off'
		},
		cos() {
			inputMode = 'functionMode'
			turnedFunction = 'cosinus'
			functionInput.textContent === ''
			hintParagraph.innerHTML = hints.degreeRequest
		},
		cosAfterClick() {
			let degree = eval(functionInput.textContent)
			hiddenInput += Math.cos(degree * (3.14 / 180))
			visibleInput.innerHTML += `cos${functionInput.innerHTML}°`
			functionInput.textContent = ''
			hintParagraph.textContent = ''
			inputMode = 'defaultMode'
			turnedFunction = 'off'
		},
		tg() {
			inputMode = 'functionMode'
			turnedFunction = 'tangent'
			functionInput.textContent === ''
			hintParagraph.innerHTML = hints.degreeRequest
		},
		tgAfterClick() {
			let degree = eval(functionInput.textContent)
			if (degree % 90 === 0 && (degree / 90) % 2 !== 0) {
				hintParagraph.textContent = 'Błąd. Tanges z tego kąta nie istnieje. Podaj stopień kąta jeszcze raz '
				functionInput.textContent = ''
			} else if (degree % 90 === 0 && (degree / 90) % 2 === 0) {
				hiddenInput += 0
				visibleInput.innerHTML += `tg${functionInput.innerHTML}°`
				functionInput.textContent = ''
				hintParagraph.textContent = ''
				inputMode = 'defaultMode'
				turnedFunction = 'off'
			} else {
				hiddenInput += Math.tan(degree * (3.14 / 180))
				visibleInput.innerHTML += `tg${functionInput.innerHTML}°`
				functionInput.textContent = ''
				hintParagraph.textContent = ''
				inputMode = 'defaultMode'
				turnedFunction = 'off'
			}
		},
		ctg() {
			inputMode = 'functionMode'
			turnedFunction = 'cotangent'
			functionInput.textContent === ''
			hintParagraph.innerHTML = hints.degreeRequest
		},
		ctgAfterClick() {
			let degree = eval(functionInput.textContent)
			if (degree % 90 === 0 && (degree / 90) % 2 === 0) {
				hintParagraph.textContent = 'Błąd. Cotangens z tego kąta nie istnieje. Podaj stopień kąta jeszcze raz '
				functionInput.textContent = ''
			} else if (degree % 90 === 0 && (degree / 90) % 2 !== 0) {
				hiddenInput += 0
				visibleInput.innerHTML += `ctg${functionInput.innerHTML}°`
				functionInput.textContent = ''
				hintParagraph.textContent = ''
				inputMode = 'defaultMode'
				turnedFunction = 'off'
			} else {
				hiddenInput += 1 / Math.tan(degree * (3.14 / 180))
				visibleInput.innerHTML += `ctg${functionInput.innerHTML}°`
				functionInput.textContent = ''
				hintParagraph.textContent = ''
				inputMode = 'defaultMode'
				turnedFunction = 'off'
			}
		},
		logarithm() {
			inputMode = 'functionMode'
			turnedFunction = 'logarithm'
			functionInput.textContent === ''
			hintParagraph.innerHTML =
				'Najpierw podaj podstawę logarytmu, następnie zatwierdź klikając <i class="fa-solid fa-check"> :'
		},
		logAfterClick() {
			if (turn === 1 && functionInput.textContent !== '') {
				calculatedBase = eval(functionInput.textContent)
				base = functionInput.textContent
				hintParagraph.innerHTML =
					'Podaj liczbę z której chcesz obliczyć logarytm, następnie zatwierdź klikając <i class="fa-solid fa-check"> : '
				functionInput.textContent = ''
				turn++
			} else if (turn === 2 && functionInput.textContent !== '') {
				calculatedDegree = eval(functionInput.textContent)
				degree = functionInput.textContent
				hiddenInput += Math.log(calculatedDegree) / Math.log(calculatedBase)
				visibleInput.innerHTML += `log<sub>${base}</sub>${degree}`
				functionInput.textContent = ''
				hintParagraph.textContent = ''
				turn = 1
				inputMode = 'defaultMode'
				turnedFunction = 'off'
			}
		},
		factorial() {
			inputMode = 'functionMode'
			turnedFunction = 'factorial'
			functionInput.textContent === ''
			hintParagraph.innerHTML =
				'Podaj liczbę z której chcesz obliczyć silnie, następnie zatwierdź klikając <i class="fa-solid fa-check"> :'
		},
		factAfterClick() {
			let res = 1
			let num = eval(functionInput.textContent)
			for (let i = 2; i <= num; i++) {
				res *= i
			}
			hiddenInput += res
			visibleInput.innerHTML += `${functionInput.innerHTML}!`
			functionInput.textContent = ''
			hintParagraph.textContent = ''
			inputMode = 'defaultMode'
			turnedFunction = 'off'
		},
		percent() {
			inputMode = 'functionMode'
			turnedFunction = 'percent'
			functionInput.textContent === ''
			hintParagraph.innerHTML =
				'Podaj wartość w procentach, następnie zatwierdź klikając <i class="fa-solid fa-check"> :'
		},
		percentAfterClick() {
			hiddenInput += eval(functionInput.textContent) / 100
			visibleInput.innerHTML += `${functionInput.innerHTML}%`
			functionInput.textContent = ''
			hintParagraph.textContent = ''
			inputMode = 'defaultMode'
			turnedFunction = 'off'
		},
	}
}
const checkClick = e => {
	if (
		inputMode === 'defaultMode' &&
		(((e.target.classList.contains('btn-nonfunctional') || e.target.classList.contains('btn-functional')) &&
			visibleInput.innerHTML.charAt(visibleInput.innerHTML.length - 1).match(forbiddenCharacters)) ||
			(e.target.classList.contains('btn-functional') &&
				(visibleInput.innerHTML.charAt(visibleInput.innerHTML.length - 1).match(forbiddenCharacters) ||
					visibleInput.innerHTML.charAt(visibleInput.innerHTML.length - 1).match(numbers))) ||
			(e.target.classList.contains('btn-simple-functional') &&
				visibleInput.innerHTML.charAt(visibleInput.innerHTML.length - 1).match(simpleFunctionCharacters)) ||
			((visibleInput.innerHTML.charAt(visibleInput.innerHTML.length - 1).match(numbers) ||
				visibleInput.innerHTML.charAt(visibleInput.innerHTML.length - 1).match(forbiddenCharacters)) &&
				e.target.classList.contains('btn-const')))
	) {
		hintParagraph.textContent = hints.syntaxError
	} else if (e.target === cancelBtn) {
		calc.abortFunction()
	} else if (e.target.classList.contains('btn-more')) {
		sidePanel.classList.toggle('displayed')
	} else if (e.target.classList.contains('reset')) {
		calc.resetAll()
	} else if (e.target.classList.contains('exponentation') && inputMode !== 'functionMode') {
		calc.exponentiation()
	} else if (e.target.classList.contains('root') && inputMode !== 'functionMode') {
		calc.nthroot()
	} else if (e.target.classList.contains('absolute') && inputMode !== 'functionMode') {
		calc.absolute()
	} else if (e.target.classList.contains('sin') && inputMode !== 'functionMode') {
		calc.sin()
	} else if (e.target.classList.contains('cos') && inputMode !== 'functionMode') {
		calc.cos()
	} else if (e.target.classList.contains('tg') && inputMode !== 'functionMode') {
		calc.tg()
	} else if (e.target.classList.contains('ctg') && inputMode !== 'functionMode') {
		calc.ctg()
	} else if (e.target.classList.contains('log') && inputMode !== 'functionMode') {
		calc.logarithm()
	} else if (e.target.classList.contains('factorial') && inputMode !== 'functionMode') {
		calc.factorial()
	} else if (e.target.classList.contains('btn-result') && hiddenInput !== '') {
		try {
			hintParagraph.textContent = ''
			calcResult.textContent = `= ${eval(hiddenInput)}`
		} catch (error) {
			hintParagraph.textContent = ''
			calcResult.textContent = 'Błąd składni!'
		}
	} else if (e.target === confirmBtn && functionInput.textContent !== '') {
		try {
			switch (turnedFunction) {
				case 'exponentation':
					calc.exponentationAfterClick()
					break
				case 'root':
					calc.rootAfterClick()
					break
				case 'absolute':
					calc.absoluteAfterClick()
					break
				case 'sinus':
					calc.sinAfterClick()
					break
				case 'cosinus':
					calc.cosAfterClick()
					break
				case 'tangent':
					calc.tgAfterClick()
					break
				case 'cotangent':
					calc.ctgAfterClick()
					break
				case 'logarithm':
					calc.logAfterClick()
					break
				case 'factorial':
					calc.factAfterClick()
					break
				case 'percent':
					calc.percentAfterClick()
					break
			}
		} catch (error) {
			hintParagraph.textContent = 'Błąd składni! Zresetuj kalkulator'
		}
	} else if (e.target.classList.contains('btn') && e.target.textContent !== '=') {
		calc.inputCharacter(e.target)
	}
}

const setListeners = () => {
	keyboard.addEventListener('click', checkClick)
	sidePanel.addEventListener('click', checkClick)
}

const main = () => {
	getElements()
	setListeners()
}

main()
