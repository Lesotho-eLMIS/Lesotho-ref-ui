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

(function() {

    'use strict';

    angular.module('dispensing-patient-form').config(routes);

    routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS'];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {

        $stateProvider.state('openlmis.dispensing.patients.form', {
            label: 'dispensingPatientForm.title',
            url: '/form/:id',
            accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST],
            resolve: {
                // facilities: function(facilityService) {
                //     return facilityService.getAllMinimal();
                // },
                // patient: function(patientService, $stateParams) {
                //     return new patientService().get($stateParams.id);
                // }
                facility: function(facilityFactory, $stateParams) {
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                }
            },
            views: {
                '@openlmis': {
                    controller: 'patientFormController',
                    templateUrl: 'dispensing-patient-form/patient-form.html',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
