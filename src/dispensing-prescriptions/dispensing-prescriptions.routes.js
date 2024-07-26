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

    angular
        .module('dispensing-prescriptions')
        .config(routes);


routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
      
        $stateProvider.state('openlmis.dispensing.prescriptions', {
            isOffline: true,
            url: '/Prescriptions',
            templateUrl: 'dispensing-prescriptions/dispensing-prescriptions.html',
            label: 'dispensingPrescriptions.title',
            priority: 1,
            showInNavigation: true,
            controller: 'dispensingPrescriptionsController',
            controllerAs: 'vm',
            resolve: {
                
                facilities: function(facilityService) {
                        return facilityService.getAllMinimal();
                    },
                facility: function($stateParams, facilityFactory) {
                    // Load the current User's Assigned Facility
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                }
             
            }
        });
    }
})();
