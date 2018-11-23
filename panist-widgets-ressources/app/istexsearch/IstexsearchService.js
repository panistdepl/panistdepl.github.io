

app.factory('istexSearchService', ['$http', '$rootScope', function ($http, $rootScope) {
    return {
        search: function (scope) {

            // We create the url to call
            var url = $rootScope.istexConfigDefault.istexApi; //vd panis
            var idc = $rootScope.istexConfigDefault.idc; //On réscupére le trigramme couperin
            url += "/document/?q=";
            var query = (scope.query) ? scope.query.toString() : "";
            var advanced = this.advancedSearch(scope.advancedQuery);
            url += (query != "") ? query : "*";
            url += (advanced != "") ? advanced : "";
            if (idc) {
                url += " AND grantees.raw:" + idc;
            } else {
                url = $rootScope.istexConfigDefault.istexApi;
                return $http.jsonp(url);
            }

            url += " &output=*";


            url += "&stats=1";
            if ($rootScope.defaultSort) {
                url += "&sortBy=" + $rootScope.defaultSort;
            } else if ($rootScope.istexConfigDefault.defaultSort) {
                url += "&sortBy=" + $rootScope.istexConfigDefault.defaultSort;
            }
            var operator = "&defaultOperator=" + $rootScope.istexConfigDefault.operator;
            var facets = "&facet=" + $rootScope.istexConfigDefault.facetsToLoad.join();
            var size = "&size=" + $rootScope.istexConfigDefault.pageSize;
            url += operator + facets + size + "&sid=istex-widgets";

            // We save the url
            $rootScope.currentPageURI = url;

            // We calculate the request time
            $rootScope.searchTimeA = new Date().getTime();

            return $http.jsonp(url + "&callback=JSON_CALLBACK");

        },
        advancedSearch: function (advancedQuery) {
            var advanced = "";
            for (var prop in advancedQuery) {
                if (Object.prototype.hasOwnProperty.call(advancedQuery, prop) && advancedQuery[prop] != "") {
                    advanced += " AND " + prop + ":" + advancedQuery[prop];
                }
            }
            return advanced;
        }
    }
}]);