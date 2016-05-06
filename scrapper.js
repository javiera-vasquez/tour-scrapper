"use strict";

// Load modules
let cheerio = require('cheerio')

let paramsObj = {
	selector_names: '.ResultQuickNav',
	filter: 'Teams'
}

module.exports = function () {
	return {
		params: paramsObj,
		parseNames: parseNames,
		parseTimes: parseTimes,
		setResults: setResults,
		getResult: getResult
	}
}


function parseNames(html, selector) {
	let list = {};
	let $ = cheerio.load(html);

	$(selector).each((i, el) => {
		//console.log('element', el);
		list[$(el).text()] = $(el).attr('href').split('id=')[1]
	});

	console.log('list => ', list);
	return this.sections = list;
}

function parseTimes(html, id, type, filter) {
	let position = [];
	let $ = cheerio.load(html);
	let selector = '.res' + id + ' li';

	//console.log('parseTimes => ', $(selector)) || $('.res149900 li')

	$(selector).each((i, el) => {
		let obj = {}
		$(el).children('span').each((i, el) => {
			switch(i) {
				case 0:
					obj.position = $(el).text();
				case 1:
					obj.name = $(el).children('a').text();
					obj.team = (type !== filter) ? $(el).children('span').text() : '';
				case 2:
					obj.time = $(el).text();
			}
		});
		position.push(obj);
	});

	return position;
}

function setResults(html) {
	let tmpObj = {};

	// Init obj map
	this.parseNames(html, this.params.selector_names);
	// loop n times for each section
	for (var key in this.sections) {
		console.log('key =>', key, 'value =>', this.sections[key]);
		tmpObj[key] = this.parseTimes(html, this.sections[key], key, this.params.filter);
	}

	// console.log('final obj =>', tmpObj);
	// return the obj map
	return this.stageResults = tmpObj;
}

function getResult() {
	return this.stageResults;
}