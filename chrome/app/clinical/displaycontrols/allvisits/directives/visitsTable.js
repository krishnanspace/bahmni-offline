'use strict';

angular.module('bahmni.clinical')
    .directive('visitsTable', ['patientVisitHistoryService', 'conceptSetService', 'spinner', '$state', '$q', '$bahmniCookieStore', '$rootScope', 'clinicalAppConfigService', 'messagingService', 'retrospectiveEntryService', 'visitFormService',
        function (patientVisitHistoryService, conceptSetService, spinner, $state, $q, $bahmniCookieStore, $rootScope, clinicalAppConfigService, messagingService, retrospectiveEntryService, visitFormService) {
            var controller = function ($scope) {
                $scope.openVisit = function (visit) {
                    if ($scope.$parent.closeThisDialog) {
                        $scope.$parent.closeThisDialog("closing modal");
                    }
                    $state.go('patient.dashboard.visit', {visitUuid: visit.uuid});
                };

                $scope.hasVisits = function () {
                    return $scope.visits && $scope.visits.length > 0;
                };

                $scope.params = angular.extend(
                    {
                        maximumNoOfVisits: 4,
                        title: "Visits"
                    }, $scope.params);

                $scope.noVisitsMessage = "No Visits for this patient.";

                $scope.toggle = function (visit) {
                    visit.isOpen = !visit.isOpen;
                    visit.cacheOpenedHtml = true;
                };

                $scope.filteredObservations = function (observation, observationTemplates) {
                    var observationTemplateArray = [];
                    for (var observationTemplateIndex in observationTemplates) {
                        observationTemplateArray.push(observationTemplates[observationTemplateIndex].display);
                    }

                    var obsArrayFiltered = [];
                    for (var ob in observation) {
                        if (_.includes(observationTemplateArray, observation[ob].concept.display)) {
                            obsArrayFiltered.push(observation[ob])
                        }
                    }
                    return obsArrayFiltered;
                };

                $scope.editConsultation = function (encounter) {
                    showNotApplicablePopup();
                    if ($scope.$parent.closeThisDialog) {
                        $scope.$parent.closeThisDialog("closing modal");
                    }
                    $state.go('patient.dashboard.show.observations', {
                        conceptSetGroupName: "observations",
                        encounterUuid: encounter.uuid
                    });
                };

                $scope.getDisplayName = function(data){
                    var concept = data.concept;
                    var displayName = data.concept.displayString;
                    if(concept.names && concept.names.length === 1 && concept.names[0].name != ""){
                        displayName = concept.names[0].name;
                    }
                    else if(concept.names && concept.names.length === 2){
                        displayName = _.find(concept.names, {conceptNameType: "SHORT"}).name;
                    }
                    return displayName ;

                };

                $scope.getProviderDisplayName = function (encounter) {
                    return encounter.encounterProviders.length > 0 ? encounter.encounterProviders[0].provider.display : null;
                };

                var getVisits = function () {
                    return patientVisitHistoryService.getVisitHistory($scope.patientUuid);
                };

                var getAllObservationTemplates = function () {
                    return conceptSetService.getConcept({
                        name: "All Observation Templates",
                        v: "custom:(setMembers:(display))"
                    })
                };

                var obsFormData = function () {
                    return visitFormService.formData($scope.patientUuid, $scope.params.maximumNoOfVisits);
                };

            $scope.hasVisits = function () {
                return $scope.visits && $scope.visits.length > 0;
            };

            var getVisits = function () {
                return patientVisitHistoryService.getVisitHistory($scope.patientUuid);
            };

            var init = function () {
                return $q.all([getVisits()]).then(function (results) {
                    $scope.visits = results[0].visits;
                    $scope.patient = {uuid: $scope.patientUuid};
                });
            };


            spinner.forPromise(init());

            $scope.params = angular.extend(
                {
                    maximumNoOfVisits: 4,
                    title: "Visits"
                }, $scope.params);

            $scope.noVisitsMessage = "No Visits for this patient.";
        };
        return {
            restrict: 'E',
            controller: controller,
            templateUrl: "displaycontrols/allvisits/views/visitsTable.html",
            scope: {
                params: "=",
                patientUuid: "="
            }
        };
    }]);