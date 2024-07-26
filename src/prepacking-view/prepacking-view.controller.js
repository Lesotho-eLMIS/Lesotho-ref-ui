/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name prepacking-view.controller:prepackingViewController
     *
     * @description
     * Controller for managing stock adjustment creation.
     */
    angular
        .module('prepacking-view')
        .controller('prepackingViewController', controller);

    controller.$inject = ['facility', 'user', 'programs', 'Prepacks', 'facilityService', '$state', 'prepackStage'];

    function controller(facility, user, programs, Prepacks, facilityService, $state, prepackStage) {
        var vm = this;

        vm.onInit = onInit;
        vm.prepackDetails = [];
        vm.formatPrepacks = formatPrepacks;
        vm.getFacilityName = getFacilityName;
        vm.getProgramName = getProgramName;
        vm.filterPrepacksForView = filterPrepacksForView;
        vm.prepackDetailsLength = 0;

        function onInit() {
            vm.facility = facility;
            vm.user = user;
            vm.programs = programs;
            vm.prepacks = Prepacks;
            vm.prepackDetails = (prepackStage === "authorise") ? vm.filterPrepacksForView(vm.prepacks) : vm.prepacks;
            // vm.prepackDetails = vm.filterPrepacksForView();
            formatPrepacks();
            vm.prepackDetailsLength = Object.keys(vm.prepackDetails).length;
            //filterPrepacksForAuthorisation();
        }
        onInit();

        async function getFacilityName(facilityId) {
            try {
                const facilityObject = await facilityService.get(facilityId);
                return facilityObject.name;
            } catch (error) {
                console.error("Error:", error);
                return ""; // Or handle the error appropriately
            }
        }

        function getProgramName(programId) {
            let program = vm.programs.find(item => item.id === programId);
            return program.name;
        }

        async function formatPrepacks() {
            for (let key in vm.prepackDetails) {
                if (vm.prepackDetails.hasOwnProperty(key)) {
                    const pack = vm.prepackDetails[key];
                    pack.facilityName = await getFacilityName(pack.facilityId);
                    pack.programName = getProgramName(pack.programId);
                }
            }
        }

        vm.getPrepackLineItems = function (item) {
            if (item.status === 'Rejected') {
                $state.go('openlmis.stockmanagement.prepack.update', {
                    prepackId: item.id,
                    programId: item.programId,
                    facilityId: item.facilityId
                });

            } else {
                $state.go('openlmis.prepacking.details', {
                    id: item.id,
                    programId: item.programId,
                    facilityId: item.facilityId
                });
            }
        }

        function filterPrepacksForView(prepacksObj) {
            const prepacks = Object.values(prepacksObj);
            // Filter out authorised and cancelled prepacking Jobs.
            var filteredPrepacks = prepacks.filter(prepack => prepack.status === "INITIATED");
            const prepacksObject = {};
            filteredPrepacks.forEach(prepack => {
                prepacksObject[prepack.id] = prepack;
            });
            return prepacksObject;
        }
        

    }
})()