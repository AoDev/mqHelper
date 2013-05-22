/* --------------------------------------------------------------
* Media Query Helper (mqHelper)
*
* Author: Kevin Purnelle
* Source at: https://github.com/AoDev/mqHelper
*
* ------------------------------------------------------------- */

var MqHelper = (function () {

	"use strict";

	var mqRegex = new RegExp(/(@media[^\{]*)\{(([^\{\}]*\{[^\{\}]*\})*)[^\}]*\}/gi);
	var mqh = {};
	var stats = {
		mqFound : 0,
		mqDefrag : 0
	};
	var results = {
		mqs: null,
		stripped: null,
		fullCss: null,
		stats: stats
	};

	/* Process the css source
	--------------------------------------------------------------- */
	mqh.process = function process(css) {

		var curr_match;
		var matches = [];

		//reset
		stats.mqFound = 0
		stats.mqDefrag = 0

		//get the code stripped from the media queries
		results.stripped = css.replace(mqRegex, '').trim()

		//get and group media queries
		while (curr_match = mqRegex.exec(css)) {

			curr_match[1] = normalizeQuery(curr_match[1])
			matches.push([curr_match[1],curr_match[2]])
			stats.mqFound++
		}

		matches.sort(compareQueries)
		results.mqs = groupQueries(matches)
		results.fullCss = buildCss()
		stats.mqDefrag = results.mqs.length

		return results
	}


	/* return the css code built from separated results
	--------------------------------------------------------------- */
	function buildCss() {

		var ordered = "";

		if (results.mqs !== null) {

			for (var i = 0, len = results.mqs.length ; i < len ; i++) {

				ordered += results.mqs[i].query + " {\n"
				ordered += results.mqs[i].rules + "\n}\n"
			}
		}

		return (results.stripped + "\n" + ordered)
	}


	/* custom compare function for media queries
	--------------------------------------------------------------- */
	function compareQueries(a,b) {

		return a[0].localeCompare(b[0]);
	}


	/* Normalize the query declaration
	--------------------------------------------------------------- */
	function normalizeQuery(str) {

		str = str.toLowerCase().trim().replace(/\s{2,}/g, ' ')
		str = str.replace( /\(\s/g,'(' )
		str = str.replace( /\s\)/g,')' )

		return str
	}


	/* group the rules that are bound to the same media query
	--------------------------------------------------------------- */
	function groupQueries(arr) {

		var curr_mediaquery = {};
		var result = [];

		if (arr.length > 0) {

			curr_mediaquery.query = arr[0][0]
			curr_mediaquery.rules = ""

			for (var i = 0, len = arr.length; i < len; i++) {

				if (arr[i][0] === curr_mediaquery.query) {

					curr_mediaquery.rules += arr[i][1]
				}
				else {

					result.push(jQuery.extend({},curr_mediaquery))
					curr_mediaquery.query = arr[i][0]
					curr_mediaquery.rules = arr[i][1]
				}
			}
			result.push(curr_mediaquery)
			//the last media-query needs to be pushed after the loop
		}
		else {

			result = null
		}

		return result
	}

	// return our mqhelper module
	return mqh

}());
















