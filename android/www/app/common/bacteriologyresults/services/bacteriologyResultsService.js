'use strict';

angular.module('bahmni.common.bacteriologyresults')
    .factory('bacteriologyResultsService', ['$http', function ($http) {

        var getBacteriologyResults = function (data) {
            var params = {
                name: data.conceptNames,
                patientUuid: data.patientUuid,
                v:"full"
        };


            return $http.get(Bahmni.Common.Constants.bahmniBacteriologyResultsUrl, {
                method: "GET",
                params: params,
                withCredentials: true
            });
        };


        var saveBacteriologyResults = function(specimen){
            return $http.post(Bahmni.Common.Constants.bahmniBacteriologyResultsUrl, specimen, {
                withCredentials: true
            })
        };

        return {
            getBacteriologyResults: getBacteriologyResults,
            saveBacteriologyResults: saveBacteriologyResults
        };
    }]);
