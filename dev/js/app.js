
var App = (function ($) {

	"use strict";

	var app = {};

	app.options = {
		stripped : null,
		groups : null,
		normal : true,
		position : "bottom"
	}

	/* Build some markup that contains the results ready for display
	--------------------------------------------------------------- */
	app.resultToHtml = function(result, options) {

		var html = "";
		var ordered = "";

		if (app.options.normal) {

			html += "<h2> Your code with grouped media queries </h2>";

			if (app.options.position === "bottom") {

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

		if (app.options.stripped || app.options.groups) {

			html += "<h2> Individual results </h2>";

			// css without media queries
			if (app.options.stripped) {

				html += "<h3> Code stripped from media queries </h3>";
				html += "<div>";
				html += "<textarea>";
				html += result.stripped;
				html += "</textarea>";
				html += "</div>";
			}

			// individual grouped media queries
			if (app.options.groups) {

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
		app.$.source.val(exampleSource)
	}


	/* Get the needed objects, bind events to UI
	--------------------------------------------------------------- */
	app.init = function () {

		app.$ = {
			form : $('#test-form'),
			groups : $('#groups'),
			normal : $('#normal'),
			position : $('input:radio[name=mqposition]'),
			resultsWrapper : $('#results-container'),
			source : $('#textarea-source-code'),
			stripped : $('#stripped')
		}

		app.$.normal.on('click', function (event) {
			app.options.normal = $(this).is(':checked')
		})

		app.$.stripped.on('click', function (event) {
			app.options.stripped = $(this).is(':checked')
		})

		app.$.groups.on('click', function (event) {
			app.options.groups = $(this).is(':checked')
		})

		app.$.position.on('click', function (event) {
			app.options.position = $(this).val()
		})

		app.$.form.on('submit', function (event) {

			var result;

			event.preventDefault()
			result = MqHelper.process(app.$.source.val())
			app.$.resultsWrapper.html(app.resultToHtml(result))
		})

		setSourceExample()
	}

	// Init the app when DOM is ready
	$().ready(function () {
		app.init()
	})

	return app;

}(window.jQuery));

