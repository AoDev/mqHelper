/* Author: Kevin Purnelle

*/

var MqHelper = (function () {

	"use strict";

	var mqRegex = new RegExp(/(@media[^\{]*)\{(([^\{\}]*\{[^\{\}]*\})*)[^\}]*\}/gi);
	var mqh = {};

	/* Process the css source
	--------------------------------------------------------------- */
	mqh.process = function process(css) {

		var curr_match;
		var matches = [];
		var grouped_queries;
		var stripped = "";
		var mqs = {}

		//get the code stripped from the media queries
		stripped = css.replace(mqRegex, '').trim()

		//get and group media queries
		while (curr_match = mqRegex.exec(css)) {

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

	// return our mqhelper module
	return mqh

}());
















