/* Author: Kevin Purnelle

*/
"use strict";

var APP = {
	$ : {
		form : $('#test-form'),
		groups : $('#groups'),
		normal : $('#normal'),
		position : $('input:radio[name=mqposition]'),
		resultsWrapper : $('#results-container'),
		source : $('#textarea-source-code'),
		stripped : $('#stripped')
	},
	options : {
		stripped : null,
		groups : null,
		normal : true,
		position : "bottom"
	},
	mqRegex : new RegExp(/(@media[^\{]*)\{(([^\{\}]*\{[^\{\}]*\})*)[^\}]*\}/gi)
};


$(document).ready(function() {

	setSourceExample()

	APP.$.normal.on('click', function (event) {

		APP.options.normal = $(this).is(':checked')
	})

	APP.$.stripped.on('click', function (event) {

		APP.options.stripped = $(this).is(':checked')
	})

	APP.$.groups.on('click', function (event) {

		APP.options.groups = $(this).is(':checked')
	})

	APP.$.position.on('click', function (event) {

		APP.options.position = $(this).val()
	})

	APP.$.form.on('submit', function (event) {

		var result;

		event.preventDefault()
		result = process(APP.$.source.val())
		APP.$.resultsWrapper.html(resultToHtml(result))
	})
});


/* Process the css source
--------------------------------------------------------------- */
function process(css) {

	var curr_match;
	var matches = [];
	var grouped_queries;
	var stripped = "";
	var mqs = {}

	//get the code stripped from the media queries
	stripped = css.replace(APP.mqRegex, '').trim()

	//get and group media queries
	while (curr_match = APP.mqRegex.exec(css)) {

		curr_match[1] = normalizeQuery(curr_match[1]);
		matches.push([curr_match[1],curr_match[2]]);
	}

	matches.sort(compareQueries);
	grouped_queries = groupQueries(matches);

	return {
		mqs : grouped_queries,
		stripped: stripped
	}
}

/* Normalize the query declaration
--------------------------------------------------------------- */
function normalizeQuery(str) {

	str = str.toLowerCase().trim().replace(/\s{2,}/g, ' ')
	str = str.replace( /\(\s/g,'(' )
		str = str.replace( /\s\)/g,')' )

		return str
	}

/* custom compare function for media queries
--------------------------------------------------------------- */
function compareQueries(a,b) {

	return a[0].localeCompare(b[0]);
}



/* group the rules that are bound to the same media query
--------------------------------------------------------------- */
function groupQueries(arr) {

	var curr_mediaquery = {};
	var result = [];

	if (arr.length > 0) {

		curr_mediaquery.query = arr[0][0];
		curr_mediaquery.rules = "";

		for (var i = 0, len = arr.length; i < len; i++) {

			if (arr[i][0] === curr_mediaquery.query) {
				curr_mediaquery.rules += arr[i][1];
			}
			else {
				result.push(jQuery.extend({},curr_mediaquery));
				curr_mediaquery.query = arr[i][0];
				curr_mediaquery.rules = arr[i][1];
			}
		}
		result.push(curr_mediaquery);
		//the last media-query needs to be pushed after the loop
	}
	else {

		result = null;
	}

	return result;
}


/* Build some markup that contains the results ready for display
--------------------------------------------------------------- */
function resultToHtml(result, options) {

	var html = "";
	var ordered = "";


	if (APP.options.normal) {

		html += "<h2> Your code with grouped media queries </h2>";

		if (APP.options.position === "bottom") {

			ordered += result.stripped + "\n";

			for (var i = 0, len = result.mqs.length ; i < len ; i++) {

				ordered += result.mqs[i].query + " {\n";
				ordered += result.mqs[i].rules + "\n}\n";
			}
		}
		else {

			for (var i = 0, len = result.mqs.length ; i < len ; i++) {

				ordered += result.mqs[i].query + " {\n";
				ordered += result.mqs[i].rules + "\n}\n";
			}

			ordered += "\n" + result.stripped;
		}

		html += "<div>";
		html += "<textarea>";
		html += ordered;
		html += "</textarea>";
		html += "</div>";
	}


	if (APP.options.stripped || APP.options.groups) {

		html += "<h2> Individual results </h2>";


		// css without media queries
		if (APP.options.stripped) {

			html += "<h3> Code stripped from media queries </h3>";
			html += "<div>";
			html += "<textarea>";
			html += result.stripped;
			html += "</textarea>";
			html += "</div>";
		}

		// individual grouped media queries
		if (APP.options.groups) {

			html += "<div>"

			for (var i = 0, len = result.mqs.length ; i < len ; i++) {

				html += "<h3>" + result.mqs[i].query + "</h3>";
				html += "<textarea>";
				html += result.mqs[i].query + " {\n";
				html += result.mqs[i].rules + "\n}";
				html += "</textarea>";
			}

			html += "</div>"
		}
	}

	return html
}

/* Add some css code example in the source textarea
--------------------------------------------------------------- */
function setSourceExample() {

	var exampleSource = " /*Example*/\n	.somerule {\n	property1:value;\n}\n@media screen and (    max-width:979px){\n	.rule979-one {\n		property1:value;\n		property2:value\n	}\n	.rule979-two {\n		property1:value;\n		property2:value\n	}\n}\n@media screen and (max-width:480px){\n	.rule480-one {\n		property1:value;\n		property2:value\n	}\n	.rule480-two {\n		property1:value;\n		property2:value\n	}\n}\n@media screen AND (max-width:979px){\n	.rule979-again {\n		property1:value;\n	}\n}\n@media screen and (max-width:480px){\n	.rule480-again {\n		property1:value;\n		property2:value\n	}\n	.rule480-again2 {\n		property1:value;\n		property2:value\n	}\n}\n@media screen and (max-width:979px){\n	.rule979-again2 {\n		property1:value;\n	}\n}";
	APP.$.source.val(exampleSource)
}
