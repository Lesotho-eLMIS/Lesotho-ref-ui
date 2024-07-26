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
        .module('prepacking-details')
        .config(routes);


routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS'];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {
      
        $stateProvider.state('openlmis.prepacking.details', {
            isOffline: true,
            url: '/details/:facilityId?programId?id', // To include prepack id 
            templateUrl: 'prepacking-details/prepacking-details.html',
            controller: 'prepackingDetailsController',
            controllerAs: 'vm',
            resolve: {
                facilities: function(facilityService) {
                    var paginationParams = {};
                      
                    var queryParams = {
                        "type":"warehouse"
                      };
                      return facilityService.query(paginationParams, queryParams)
                      .then(function(result) {
                          return result.content; // Return Facilities of Type = Warehouse
                      })
                      .catch(function(error) {
                          // Handle any errors that may occur during the query
                          console.error("Error:", error);
                          return [];
                      });                    
                 },
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
                prepack: function($stateParams, prepackingService) {
                    return prepackingService.getPrepack($stateParams.id);
                },
                products: function($stateParams, orderableGroupService){
                        return orderableGroupService
                            .findAvailableProductsAndCreateOrderableGroups($stateParams.programId, $stateParams.facilityId, false);
                }
             
            }
        });
    }
})();
