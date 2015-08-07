/**
 * The array module provides helper methods for iterating and working with arrays. Unless explicitly called out, the
 * objects must be 'real' arrays, not just objects with length properties.
 * @module array
 */

/**
 * The array class provides utility methods which iterate over array-like objects. These methods
 * do not work with associative arrays, see oop module for object handling methods.
 * @class array
 */
(function () {

    var self,
        // use native method if available, if not substitute functionality.
        map = Array.map ?
                function (array, func, scope) {
                    return array.map(func, scope);
                } :
                function (array, func, scope) {
                    var i,
                        len = array.length,
                        results = array.concat();

                    for (i = 0; i < len; i += 1) {
                        if (array.hasOwnProperty(i)) {
                            results[i] = func.call(scope, array[i], i, array);
                        }
                    }
                    return results;
                },
        forEach = Array.forEach ?
                function (array, func, scope) {
                    array.forEach(func, scope);
                } :
                function (array, func, scope) {
                    var i,
                        len = array.length;
                    scope = scope || window;
                    for (i = 0; i < len; i += 1) {
                        func.call(scope, array[i], i, array);
                    }
                },
        indexOf = Array.indexOf ?
                function (array, needle, start) {
                    return array.indexOf(needle, start);
                } :
                function (array, needle, start) {
                    var i,
                        len = array.length;
                    start = start || 0;
                    for (i = start; i < len; i += 1) {
                        if (array[i] === needle) {
                            return i;
                        }
                    }
                    return -1;
                },
        some = Array.some ?
                function (array, func, scope) {
                    return array.some(func, scope);
                } :
                function (array, func, scope) {
                    var i,
                        len = array.length;
                    scope = scope || window;
                    for (i = 0; i < len; i += 1) {
                        if (func.call(scope, array[i], i, array)) {
                            return true;
                        }
                    }
                    return false;
                },
        filter = Array.filter ?
                function (array, func, scope) {
                    return array.filter(func, scope);
                } :
                function (array, func, scope) {
                    var i, j,
                        matches = [],
                        len = array.length;
                    scope = scope || window;

                    for (i = 0, j = len; i < j; i += 1) {
                        if (!func.call(scope, array[i], i, array)) {
                            continue;
                        }
                        matches.push(array[i]);
                    }
                    return matches;
                },

        /**
         * Utility which builds and caches sort functions, used by objectSort
         * @Class SortManager
         */
        SortManager = {
            /**
             * cache for sort functions
             * @property cachedSortFunctions
             */
            cachedSortFunctions: {},
            /**
             * Generates a new function to sort an array
             * @method buildSortFunction
             * @param {Array} criteria array of criterion to sort by
             * @returns {Function}
             */
            buildSortFunction: function (criteria) {
                /*jslint evil: true*/
                var functionBody = [],
                    criterion,
                    field,
                    type,
                    i;
                functionBody.push("    var val = 0, aIsNotSet, bIsNotSet, aVal, bVal;");
                for (i = 0; i < criteria.length; i += 1) {
                    criterion = criteria[i];
                    field = criterion.field;
                    type = criterion.type;

                    functionBody.push("    aIsNotSet = (a." + field + " === null || a." + field + " === undefined);");
                    functionBody.push("    bIsNotSet = (b." + field + " === null || b." + field + " === undefined);");

                    if (type == "number") {
                        functionBody.push("   aVal = aIsNotSet ? 0 : a." + field + ";");
                        functionBody.push("   bVal = bIsNotSet ? 0 : b." + field + ";");
                        functionBody.push("    val = a." + field + " -  b." + field + ";");
                    } else if (type == "boolean") {
                        functionBody.push("   aVal = aIsNotSet ? false : a." + field + ";");
                        functionBody.push("   bVal = bIsNotSet ? false : b." + field + ";");
                        functionBody.push("    val = (a." + field + "*-1) -  (b." + field + "*-1);");
                    } else {
                        // assume type is string
                        // assume ignoreCase unless explicitly set to false
                        if (criterion.ignoreCase !== false) {
                            field = field + ".toLowerCase()";
                        }
                        functionBody.push("   aVal = aIsNotSet ? '' : a." + field + ";");
                        functionBody.push("   bVal = bIsNotSet ? '' : b." + field + ";");
                        functionBody.push("    val = (bVal < aVal) - (aVal < bVal);");
                    }
                    functionBody.push("    if (val != 0) {");
                    if (criterion.direction === "desc") {
                        functionBody.push("        return val * -1;");
                    } else {
                        functionBody.push("        return val;");
                    }
                    functionBody.push("    }");
                }

                functionBody.push("  return val;");
                return new Function("a", "b", functionBody.join("\n"));
            },
            /**
             * Looks for cached sort function, generates new one if not found
             * @method getSortFunction
             * @param {Array} array the array to be sorted
             * @param {Array|Object} criteria either a single criterion object, or an array of criterion objects
             * @returns {Function}
             */
            getSortFunction: function (array, criteria) {
                var cacheKey, sortFunction;

                // if array is empty, just return any ole function and save the cpu
                if (array.length === 0) {
                    return function () {
                        return 0;
                    };
                }

                // if single criterion passed in, turn into an array
                if (typeof criteria == "object" && !criteria.length) {
                    criteria = [criteria];
                }

                cacheKey = JSON.stringify(criteria);

                sortFunction = SortManager.cachedSortFunctions[cacheKey];

                if (!sortFunction) {
                    sortFunction = SortManager.buildSortFunction(criteria);
                    SortManager.cachedSortFunctions[cacheKey] = sortFunction;
                }

                return sortFunction;
            }
        },
        /**
         * Utility which builds and caches filter functions, used by objectFilter
         * @Class FilterManger
         */
        FilterManager = {
            /**
             * maps human readable words to js operators
             * @property operatorMap
             */
            operatorMap: {
                equals: "===",
                notEquals: "!==",
                greaterThan: ">",
                lessThan: "<",
                greaterThanEquals: ">=",
                lessThanEquals: "<="
            },
            /**
             * Cache for filter functions
             * @property cachedFilterFunctions
             */
            cachedFilterFunctions: {},

            /**
             * Determines object type and calls correct method
             * @method processCriteria
             * @param {Object} criteria - either a criteria group or a specific criterion
             * @returns {String}
             */
            processCriteria: function (criteria) {
                var result;
                if (criteria.matchType) {
                    result = FilterManager.processCriteriaGroup(criteria);
                } else {
                    result = FilterManager.processCriterion(criteria);
                }
                if (result === null) {
                    // if filter group does not have any criteria, group returns true
                    result = "true";
                }
                return result;
            },
            /**
             * Logic to process a criteria group and generate multiple js conditionals.
             * criteriaGroup must contain
             *   -matchType: {String} [all, any]
             *   -criteria: {Array} an array of criteria object
             * @method processCriteriaGroup
             * @param {Object} criteriaGroup
             * @returns {string}
             */
            processCriteriaGroup: function (criteriaGroup) {
                var criteria = criteriaGroup.criteria,
                    len = criteria.length,
                    operator = criteriaGroup.matchType == "all" ? "&&" : "||",
                    conditions = [],
                    result,
                    i;

                for (i = 0; i < len; i += 1) {
                    result = FilterManager.processCriteria(criteria[i]);
                    if (result) {
                        conditions.push(result);
                    }
                }
                // no conditions, do not create an empty set of parens
                if (conditions.length === 0) {
                    return null;
                }
                return "(" + conditions.join(" " + operator + " ") + ")";
            },
            /**
             * Logic to turn a single criterion into js condition.
             * criterion properties (all required, except for ignoreCase):
             *   -type: {String } [string, boolean, number]
             *   -field: {String} name field to filter
             *   -value: {Mixed} value to filter by
             *   -operator: {String} [equals, notEquals, greaterThan, lessThan, greaterThanEquals, lessThanEquals, contains]
             *   -ignoreCase: {Boolean} optional, defaults to false
             * @method processCriterion
             * @param {Object} criterion
             * @returns {string}
             */
            processCriterion: function (criterion) {
                var condition = [],
                    quoteChar = criterion.type == "string" ? '"' : '',
                    thisField = criterion.field,
                    thisValue = criterion.value,
                    thisOperator = FilterManager.operatorMap[criterion.operator];

                if (criterion.type == "string" && criterion.ignoreCase) {
                    thisValue = thisValue.toLowerCase();
                    thisField = thisField + ".toLowerCase()";
                }
                if (criterion.operator == "contains") {
                    condition.push("(item." + criterion.field + " && item." + thisField + ".indexOf(\"" + thisValue + "\") > -1)");
                } else if (criterion.type == "boolean") {
                    condition.push("item." + criterion.field + " === " + thisValue);
                } else if (criterion.type == "number") {
                    condition.push("item." + thisField + thisOperator + thisValue);
                } else if (thisOperator) {
                    condition.push("(item." + criterion.field + " && item." + thisField + thisOperator + quoteChar + thisValue + quoteChar + ")");
                } else {
                    throw "InvalidOperator: '" + criterion.operator + "' is not a valid operator for use with '" + criterion.field + "' array.objectFilter";
                }
                return condition.join(" ");
            },
            /**
             * Generates a new function to filter an array
             * @method buildFilterFunction
             * @param {Object} criteria - either a criteria group or a specific criterion
             * @returns {Function}
             */
            buildFilterFunction: function (criteria) {
                /*jslint evil: true*/
                var functionBody = "return " + FilterManager.processCriteria(criteria) + ";";

                return new Function("item", functionBody);
            },
            /**
             * Looks for existing function in cache, or creates a new one
             * @method getFilterFunction
             * @param array - the array to be filtered
             * @param criteria - either a criteria group or a specific criterion
             * @returns {Function}
             */
            getFilterFunction: function (array, criteria) {
                var cacheKey, filterFunction;

                if (array.length === 0) {
                    return function () { return true; };
                }

                cacheKey = JSON.stringify(criteria);

                filterFunction = FilterManager.cachedFilterFunctions[cacheKey];

                if (!filterFunction) {
                    filterFunction = FilterManager.buildFilterFunction(criteria);
                    FilterManager.cachedFilterFunctions[cacheKey] = filterFunction;
                }
                return filterFunction;
            }
        };

    self = {
        /**
         * Maps items from one array to a new array
         * @method map
         * @param {Array} array An array to iterate over
         * @param {Function} func The function which will be run on each item.
         * @param {Object} scope optional, defines scope which function should be run in
         * @return {Array} The newly created array
         */
        map: function (array, func, scope) {
            return map(array, func, scope);
        },
        /**
         * Locates the index of an item in an array, -1 if not found
         * @method indexOf
         * @param {Array} array
         * @param {Object} needle
         * @param {Number} start
         * @return {Number}
         */
        indexOf: function (array, needle, start) {
            return indexOf(array, needle, start);
        },
        /**
         * Creates a copy of an array (or array-like object)
         * @method copy
         * @param {Array} array
         * @return {Array}
         */
        copy: function (array) {
            return Array.prototype.slice.call(array, 0);
        },
        /**
         * Creates a new array in a random order
         * @method shuffle
         * @param {Array} array
         * @return {Array}
         */
        shuffle: function (array) {
            var copy = self.copy(array),
                len = copy.length,
                temp,
                i;

            // While there remain elements to shuffle
            while (len) {
                // Pick a remaining element
                i = Math.floor(Math.random() * len);
                len -= 1;
                // And swap it with the current element.
                temp = copy[len];
                copy[len] = copy[i];
                copy[i] = temp;
            }
            return copy;
        },
        /**
         * Iterates over an array and calls the specified function for each item
         * @method forEach
         * @param {Array} array the array to iterate over
         * @param {Function} func The function to be run on each iteration
         * @param {Object} scope optional, defaults to window
         */
        forEach: function (array, func, scope) {
            forEach(array, func, scope);
        },
        /**
         * Uses function to filter an array (see objectFilter for working with complex objects with multiple filter criteria)
         * @method filter
         * @param {Array} array the array to be filtered
         * @param {Function} func the function which returns true if item matches some criteria
         * @param {Object} scope optional, defaults to window
         */
        filter: function (array, func, scope) {
            return filter(array, func, scope);
        },
        /**
         * Returns true if any single item in the list matches the criteria of the function
         * @method some
         * @param {Array} array the array
         * @param {Function} func the function which returns true if item matches some criteria
         * @param {Object} scope optional, defaults to window
         * @returns {Boolean}
         */
        some: function (array, func, scope) {
            return some(array, func, scope);
        },
        /**
         * Removes an item from an array.
         * @method remove
         * @param {Array} array
         * @param {Object} item the item too be removed from the array
         * @returns {boolean} true if item found and removed, otherwise false
         */
        remove: function (array, item) {
            var idx = self.indexOf(array, item);
            if (idx > -1) {
                array.splice(idx, 1);
                return true;
            }
            return false;
        },
        /**
         * Provides ability to filter an array of objects with n number of criteria
         * @method objectFilter
         * @param {Array} array - an array of objects to be filtered
         * @param {Object} criteria - Either a single criteria object or a criteria group  (criteria groups may be nested)
         * @param {Object} scope - optional, defaults to window
         * @example
         *  var myArray [
         *      {name: "Jim", age: 12, location: "NY"},
         *      {name: "Jane", age: 15, location: "NJ"},
         *      {name: "Rick", age: 18, location: "VT"},
         *      {name: "Jen", age: 10, location: "VT"},
         *      {name: "Eric", age: 18, location: "NY"},
         *      {name: "Michael", age: 24, location: "NY"},
         *  ];
         *
         *
         *  // returns array of all people 18 or older in NY
         *  var filtered = array.objectFilter(myArray, {
         *      matchType: "all",
         *      criteria: [
         *          {field: "location", value: "NY", operator: "equals},
         *          {field: "age", value: 18, operator: "greatThanEquals"}
         *      ]
         *  });
         *
         */
        // todo: provide better support for arrays and nested objects.
        objectFilter: function (array, criteria, scope) {
            return self.filter(array, FilterManager.getFilterFunction(array, criteria), scope);
        },
        /**
         * Returns a new array, sorted based on the specified criteria
         * @param {Array} array
         * @param {Object|Array} criteria Either a single criterion object, or an array of criterion objects
         * @returns {Array}
         * @example
         *  var myArray [
         *      {name: "Jim", age: 12, location: "NY"},
         *      {name: "Jane", age: 15, location: "NJ"},
         *      {name: "Rick", age: 18, location: "VT"},
         *      {name: "Jen", age: 10, location: "VT"},
         *      {name: "Eric", age: 18, location: "NY"},
         *      {name: "Michael", age: 24, location: "NY"},
         *  ];
         *
         *  // basic usage, sort by name case-insensitive
         *  arrayApi.objectSort(myArray, {field: "name"});
         *
         *  // sort with multiple criteria
         *  arrayApi.objectSort(myArray, [
         *      {field: "age", direction: "desc", type: "number"},
         *      {field: "name"}
         *  ]);
         *  // all possible criterion fields
         *  {
         *      field: "fieldName", // required, name of field to sort by
         *      type: "string",     // [string, number, boolean] - defaults to string
         *      direction: "asc",   // [asc, desc] - defaults to asc
         *      ignoreCase: true    // [true, false] - defaults to true
         *  }
         */
        objectSort: function (array, criteria) {
            // copy array, as we do not want to rearrange the original one
            var newArray = self.copy(array);
            newArray.sort(SortManager.getSortFunction(array, criteria));
            return newArray;
        }

        // todo: add as needed - every, removeAt, etc...
    };


    PerfTest.ArrayUtils = self;
}());