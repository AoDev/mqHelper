/* Author: Kevin Purnelle

	MqHelper website app
*/


var App = (function ($) {

	"use strict";

	var app = {};

	app.options = {
		stripped : null,
		groups : null,
		normal : true,
		position : "bottom",
		minify : {
			basic: false,
			zeros: false,
			rgbcolors: false,
			oldIeCompatibility: false
		}
	}

	app.results = {}

	/* Add some css code example in the source textarea
	--------------------------------------------------------------- */
	function setSourceExample() {

		var exampleSource = " /*Example*/\n.somerule {\n    color: rgb(100,250,90);\n}\n@media screen and (    max-width:979px){\n	.rule979-one {\n		background-color: #ccddee;\n		color: rgb(255,255,255)\n	}\n	.rule979-two {\n		opacity:0.5;\n		margin: 15px 0px 15px 10px\n	}\n}\n@media screen and (max-width:480px){\n	.rule480-one {\n		property1:value;\n		property2:value\n	}\n	.rule480-two {\n		property1:value;\n		property2:value\n	}\n}\n@media screen AND (max-width:979px){\n	.rule979-again {\n		property1:value;\n	}\n}\n@media screen and (max-width:480px){\n	.rule480-again {\n		property1:value;\n		property2:value\n	}\n	.rule480-again2 {\n		property1:value;\n		property2:value\n	}\n}\n@media screen and (max-width:979px){\n	.rule979-again2 {\n		property1:value;\n	}\n}";
		app.$.source.val(exampleSource)
	}


	/* Get the needed DOM objects, bind events to UI, set example
	--------------------------------------------------------------- */
	app.init = function () {

		// dom
		app.$ = {
			optionsWrapper : $('#processOptions'),
			form : $('#mqh-form'),
			groups : $('#groups'),
			normal : $('#normal'),
			resultsWrapper : $('#results-container'),
			source : $('#textarea-source-code'),
			stripped : $('#stripped'),
			invisiblesAndComments: $('#invisiblesAndComments'),
			zeros: $('#zeros'),
			rgbcolors: $('#rgbcolors'),
			oldIeCompatibility: $('#oldIeCompatibility'),
			btnToggleOptions: $('#btn-toggle-options')
		}

		app.$.optionsWrapper.hide()

		// events
		app.$.normal.on('click', function (event) {
			app.options.normal = $(this).is(':checked')
		})

		app.$.stripped.on('click', function (event) {
			app.options.stripped = $(this).is(':checked')
		})

		app.$.groups.on('click', function (event) {
			app.options.groups = $(this).is(':checked')
		})

		app.$.invisiblesAndComments.on('click', function (event) {
			app.options.minify.basic = $(this).is(':checked')
		})

		app.$.zeros.on('click', function (event) {
			app.options.minify.zeros = $(this).is(':checked')
		})

		app.$.rgbcolors.on('click', function (event) {
			app.options.minify.rgbcolors = $(this).is(':checked')
		})

		app.$.oldIeCompatibility.on('click', function (event) {
			app.options.minify.oldIeCompatibility = $(this).is(':checked')
		})

		app.$.btnToggleOptions.on('click', function (event) {
			app.$.optionsWrapper.toggle()
		})

		app.$.form.on('submit', app.processCss)

		// set example
		setSourceExample()
	}


	/* Process css when the form submit button is clicked
	--------------------------------------------------------------- */
	app.processCss = function processCss(event) {
		event.preventDefault()
		app.results = MqHelper.process(app.$.source.val())
		// if (app.options.minify.basic) {
		// 	app.results.fullCss = XemMinifier.process(app.results.fullCss, app.options.minify)
		// }
		app.$.resultsWrapper.html(app.resultToHtml(app.results))
		app.getAndDisplayStats()

		setTimeout(function () {
			var $statsWrapper = $('.stats-wrapper');
			$statsWrapper.fadeOut(250, function () {
				$statsWrapper.remove()
			})
		}, 10000)
	}


	/* Get and Display stats
	--------------------------------------------------------------- */
	app.getAndDisplayStats = function () {

		var html = "";
		var sourceSize = app.$.source.val().length;
		var resultSize = app.results.fullCss.length;

		html += '<div class="stats-wrapper">'
		html += '<h3 class="title">Results stats</h3>'
		html += '<ul>'
		html += '<li>'
		html += "Source size: " + sourceSize + " bytes"
		html += '</li>'
		html += '<li>'
		html += "Result size: " + resultSize + " bytes"
		html += '</li>'
		html += '<li>'
		html += "Media queries found in source: " + app.results.stats.mqFound
		html += '</li>'
		html += '<li>'
		html += "Media queries after defrag: " + app.results.stats.mqDefrag
		html += '</li>'
		html += '</ul>'
		html += '</div>'

		$('body').append(html)
	}

	/* Build some markup that contains the results ready for display
	--------------------------------------------------------------- */
	app.resultToHtml = function(result, options) {

		var html = "";
		var ordered = "";
		var code = "";
		var minifyOptions = {};

		if (app.options.normal) {

			html += "<h2> Your code with grouped media queries </h2>";

			code = app.results.fullCss

			html += "<div>";
			html += "<textarea>";
			html += code;
			html += "</textarea>";
			html += "</div>";
		}

		if (app.options.stripped || app.options.groups) {

			html += "<h2> Individual results </h2>";

			// css without media queries
			if (app.options.stripped) {

				html += "<h3> Code stripped from media queries </h3>";
				html += "<div>";
				html += "<textarea>";
				html += app.results.stripped;
				html += "</textarea>";
				html += "</div>";
			}

			// individual grouped media queries
			if (app.options.groups) {

				html += "<div>"

				for (var i = 0, len = app.results.mqs.length ; i < len ; i++) {

					html += "<h3>" + app.results.mqs[i].query + "</h3>";
					html += "<textarea>";
					html += app.results.mqs[i].query + " {\n";
					html += app.results.mqs[i].rules + "\n}";
					html += "</textarea>";
				}

				html += "</div>"
			}
		}

		return html
	}

	// Init the app when DOM is ready
	$().ready(function () {
		app.init()
	})

	return app;

}(window.jQuery));

