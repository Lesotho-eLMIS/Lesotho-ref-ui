
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
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    angular
        .module('prepacking-view')
        .config(routes);


routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS'];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {
      
        $stateProvider.state('openlmis.prepacking.view', {
            isOffline: true,
            url: '/view',
            templateUrl: 'prepacking-view/prepacking-view.html',
            label: 'prepackingView.label',
            priority: 1,
            showInNavigation: true,
            controller: 'prepackingViewController',
            controllerAs: 'vm',
            accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST],
            resolve: {
                facility: function($stateParams, facilityFactory) {
                    // Load the current User's Assigned Facility
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                },
                user: function(authorizationService) {
                    return authorizationService.getUser();
                },
                programs: function(user, stockProgramUtilService) {
                    var programs =  stockProgramUtilService.getPrograms(user.user_id, STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST);
                    return programs;
                },
                Prepacks: function(facility, prepackingService ) {                         
                   return prepackingService.getPrepacks(facility.id);
                },
                prepackStage: function() {
                    return undefined;
                }
            }           
      
        });
    }
})();
