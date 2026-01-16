const people = [
	{ name: "L", perc: 18 },
	{ name: "G", perc: 24 },
	{ name: "S", perc: 24 },
	{ name: "D", perc: 34 }
];

const percDiv = document.getElementById("perc");
const appDiv = document.getElementById("app");

// 1. GENERAZIONE HTML DINAMICO
function init() {
	let percHtml = "";
	people.forEach(p => {
		percHtml += `
		<div class="row">
		<div>${p.name}</div>
		<input type="number" id="perc_${p.name}" class="input-data" value="${p.perc}">
		<div class="col-num" style="text-align: left;">%</div>
		</div>`;
	});
	percDiv.innerHTML = percHtml;

	let appHtml = "";
	people.forEach((p, index) => {
		const auto = index === 1 ? "autofocus" : "";
		appHtml += `
		<div class="row">
		<div>${p.name}</div>
		<input type="number"
		id="in_${p.name}"
		class="input-peso input-data"
		value=""
		placeholder="0"
		${auto}>
		<div id="out_${p.name}" class="col-num">0</div>
		</div>`;
	});
	appDiv.innerHTML = appHtml;

	attachEvents();
	calc();
}

// 2. AGGANCIO EVENTI
function attachEvents() {
	const allInputs = document.querySelectorAll(".input-data");
	const pesoInputs = document.querySelectorAll(".input-peso");

	allInputs.forEach(input => {
		input.addEventListener("input", calc);
		input.addEventListener("focus", function () {
			setTimeout(() => { this.select(); }, 10);
		});
	});

	// Gestione tasti Invio e TAB per ciclo infinito
	pesoInputs.forEach((input, index) => {
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === "Tab") {
				// Se è l'ultimo campo ("D") e premi Tab (senza Shift) o Enter
				if (index === pesoInputs.length - 1 && !e.shiftKey) {
					e.preventDefault();
					pesoInputs[0].focus();
				}
				// Se premi Enter negli altri campi
				else if (e.key === "Enter") {
					e.preventDefault();
					pesoInputs[index + 1].focus();
				}
			}
		});
	});
}

// 3. LOGICA DI CALCOLO
function calc() {
	let percTotal = 0;
	let assegnatoFinora = 0;

	// Calcolo e validazione percentuali
	people.forEach(p => {
		const inputEl = document.getElementById("perc_" + p.name);
        const val = inputEl ? inputEl.value : p.perc; // Controllo esistenza
        p.perc = Number(val);
        percTotal += p.perc;
	});

	const percTotEl = document.getElementById("percTot");
	percTotEl.innerText = percTotal + "%";
	percTotEl.className = percTotal === 100 ? "ok" : "warn";

	// Calcolo totale peso inserito
	let total = 0;
	people.forEach(p => {
		const val = document.getElementById("in_" + p.name).value;
		total += val === "" ? 0 : Number(val);
	});
	document.getElementById("tot").innerText = total;

	// Calcolo differenze per ogni persona
	people.forEach((p, index) => {
		const val = document.getElementById("in_" + p.name).value;
		const curr = val === "" ? 0 : Number(val);
		let diff;

		if (index < people.length - 1) {
			const target = Math.round(total * (p.perc / 100));
			assegnatoFinora += target;
			diff = target - curr;
		} else {
			// L'ultima persona riceve il residuo per evitare errori di arrotondamento
			const targetUltimo = total - assegnatoFinora;
			diff = targetUltimo - curr;
		}

		const out = document.getElementById("out_" + p.name);
		if (diff > 0) {
			out.innerText = "+" + diff;
			out.className = "col-num pos";
		} else if (diff < 0) {
			out.innerText = diff;
			out.className = "col-num neg";
		} else {
			out.innerText = "0";
			out.className = "col-num";
		}
	});
}

// Avvio
// Avvolgi tutto in un listener di caricamento
window.addEventListener('load', () => {
    init();
});