// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

const minWeightInput = document.querySelector(".minweight__input");
const maxWeightInput = document.querySelector(".maxweight__input");

const divStartingStrings = {
	index: "index",
	kind: "kind",
	color: "color",
	weight: "weight (кг)"
};

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (fruits) => {
	// очищаем fruitsList от вложенных элементов,
	// чтобы заполнить актуальными данными из fruits

	fruitsList.innerHTML = "";

	for (let i = 0; i < fruits.length; i++) {
		// формируем новый элемент <li> при помощи document.createElement,
		// и добавляем в конец списка fruitsList при помощи document.appendChild
		let li = document.createElement("li");
		let liDiv = document.createElement("div");

		let divIndex = document.createElement("div"),
			divKind = document.createElement("div"),
			divColor = document.createElement("div"),
			divWeight = document.createElement("div");

		divIndex.innerHTML = divStartingStrings.index + ": " + i;
		divKind.innerHTML = divStartingStrings.kind + ": " + fruits[i].kind;
		divColor.innerHTML = divStartingStrings.color + ": " + fruits[i].color;
		divWeight.innerHTML = divStartingStrings.weight + ": " + fruits[i].weight;

		liDiv.appendChild(divIndex);
		liDiv.appendChild(divKind);
		liDiv.appendChild(divColor);
		liDiv.appendChild(divWeight);

		liDiv.classList.add("fruit__info");

		li.appendChild(liDiv);

		let liColorClass = "fruit_";

		switch (fruits[i].color?.toLowerCase()) {
			case "фиолетовый":
				liColorClass += "violet";
				break;
			case "зеленый":
			case "зелёный":
				liColorClass += "green";
				break;
			case "розово-красный":
			case "розово красный":
				liColorClass += "carmazin";
				break;
			case "желтый":
			case "жёлтый":
				liColorClass += "yellow";
				break;
			case "светло-коричневый":
			case "светло коричневый":
				liColorClass += "lightbrown";
				break;

			default:
				// по умолчанию будет чёрный цвет
				liColorClass += "black";
				break;
		}

		li.classList.add("fruit__item", liColorClass);

		fruitsList.appendChild(li);
	}
};

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
	let originalFruits = JSON.parse(JSON.stringify(fruits));
	let result = [];

	while (fruits.length > 0) {
		// находим случайный элемент из fruits, используя getRandomInt
		// вырезаем его из fruits и вставляем в result.
		// ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
		// (массив fruits будет уменьшатся, а result заполняться)

		let indexToRemove = getRandomInt(0, fruits.length - 1);
    	let deleted = fruits[indexToRemove];
    	result.push(deleted);
    	fruits.splice(indexToRemove, 1);
	}

	if (JSON.stringify(originalFruits) === JSON.stringify(result)) {
		alert("Неудача! Не удалось перемешать массив, так как он не перемешался вообще. Попробуйте ещё раз.");
	}
	
	fruits = result;
};

shuffleButton.addEventListener('click', () => {
	shuffleFruits();
	display(fruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
	let result = [];
	result = fruits.filter((item) => {
		let minWeightValue = +minWeightInput.value;
		let maxWeightValue = +maxWeightInput.value;
		return (+item.weight >= minWeightValue) && (+item.weight <= maxWeightValue);
	});

	return result;
};

filterButton.addEventListener('click', () => {
	let tmpFruits = JSON.parse(JSON.stringify(fruits));
	fruits = filterFruits();
	display(fruits);
	fruits = tmpFruits;
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
	return a.color > b.color;
};

const sortAPI = {
	bubbleSort(arr, comparation) {
		const n = arr.length;
		// внешняя итерация по элементам
		for (let i = 0; i < n - 1; i++) {
			// внутренняя итерация для перестановки элемента в конец массива
			for (let j = 0; j < n - 1 - i; j++) {
				// сравниваем элементы
				if (comparation(arr[j], arr[j + 1])) {
					// делаем обмен элементов
					let temp = arr[j + 1];
					arr[j + 1] = arr[j];
					arr[j] = temp;
				}
			}
		}
	},

	quickSort(arr, comparation) {
		function quickSort(arr) {
			if (arr.length <= 1) {
				return arr;
			}

			const pivot = arr[arr.length - 1];
			const leftList = [];
			const rightList = [];

			for (let i = 0; i < arr.length - 1; i++) {
				if (comparation(pivot, arr[i])) {
					leftList.push(arr[i]);
				} else {
					rightList.push(arr[i]);
				}
			}

			return [...quickSort(leftList), pivot, ...quickSort(rightList)];
		}

		arr = quickSort(arr);
		fruits = arr;

		return arr;
	},

	// выполняет сортировку и производит замер времени
	startSort(sort, arr, comparation) {
		const start = new Date().getTime();
		sort(arr, comparation);
		const end = new Date().getTime();
		sortTime = `${end - start} ms`;
	},
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
	sortKind = (sortKind === "bubbleSort") ? "quickSort" : "bubbleSort";
	sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
	sortTimeLabel.textContent = "sorting...";
	const sort = sortAPI[sortKind];
	sortAPI.startSort(sort, fruits, comparationColor);
	display(fruits);
	sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
	// создание и добавление нового фрукта в массив fruits
	// необходимые значения берем из kindInput, colorInput, weightInput
	let kind = kindInput.value,
		color = colorInput.value,
		weight = weightInput.value;

	if (!kind) {
		alert("Пожалуйста, заполните поле kind.");
		return;
	}

	if (!color) {
		alert("Пожалуйста, заполните поле color.");
		return;
	}

	if (!weight) {
		alert("Пожалуйста, заполните поле weight.");
		return;
	}

	let fruit = { kind, color, weight };

	fruits.push(fruit);

	display(fruits);
});
