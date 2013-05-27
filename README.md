mqHelper
========

Group media queries that have the same declaration without altering the meaning of the css.

Try it online:
Website: http://mqhelper.nokturnalapp.com

Goal:
-----

* Reduce the final file size
* Might improve performance but some tests have shown minimal improvement

-> Better for production


Results:
-------

Once processed the returned result has the following structure:

~~~
var results = {
	mqs: [{
		query: "the mq declaration" (string),
		rules: "the css rules for that mq" (string)
	}],
	stripped: "css code stripped from mq declarations" (string),
	fullCss: "css code where the mqs have been grouped" (string),
	stats: {
		mqFound : number of media queries declarations found (integer),
		mqDefrag : number of media queries declarations after defrag (integer)
	}
};
~~~

results.mqs is an array of js objects that contains the individual media queries declaration with the corresponding css rules.


Status:
-------

* Works well, let me know if you see any issue.


Future:
-------
* Would like to add some minification option to the website.
* If you want to contribute, it would be nice to have the algorithm translated to other languages.
* So it could be part of a production script.


Sources:
--------

* dev folder contains the sources of the mqhelper script and the website
* website folder is what is here: http://mqhelper.nokturnalapp.com
