mqHelper
========

UNMAINTAINED (just keeping it for posterity ;))

Group media queries that have the same declaration without altering the meaning of the css.

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

