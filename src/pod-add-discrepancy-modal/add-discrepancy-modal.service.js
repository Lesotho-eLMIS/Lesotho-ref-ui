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

    /**
     * @ngdoc service
     * @name pod-add-discrepancy-modal.podAddDiscrepancyModalService
     *
     * @description
     * This service will pop up a modal window for user to add discrepancies.
     */
    angular
        .module('pod-add-discrepancy-modal')
        .service('podAddDiscrepancyModalService', service);

    service.$inject = ['openlmisModalService'];

    function service(openlmisModalService) {
      //  this.show = show;
        //this.getDiscrepancies = getDiscrepancies;
        // this.submitQualityDiscrepancies = submitQualityDiscrepancies;

        // // /**
        // //  * @ngdoc method
        // //  * @methodOf pod-add-discrepancy-modal.podAddDiscrepancyModalService
        // //  * @name show
        // //  *
        // //  * @description
        // //  * Shows modal that allows users to choose products.
        // //  *
        // //  * @param  {Array}   availableItems orderable + lot items that can be selected
        // //  * @param  {Array}   selectedItems  orderable + lot items that were added already
        // //  * @return {Promise}                resolved with selected products.
        // //  */
        // // function show() {
        // //     return openlmisModalService.createDialog(
        // //         {
        // //             controller: 'podAddDiscrepancyModalController',
        // //             controllerAs: 'vm',
        // //             templateUrl: 'pod-add-discrepancy-modal/add-discrepancy-modal.html',
        // //             show: true ,
        // //             resolve: {
        // //                 rejectionReasons: function(rejectionReasonService) {
        // //                         // Load rejection Reasons into the controller.
        // //                         return rejectionReasonService.getAll();
                            
        // //                 }, 
        // //                 shipmentType: function () {
        // //                     return shipmentTypeType;
        // //                 }
        // //             }   
        // //         }
        // //     ).promise.finally(function() {
        // //         angular.element('.openlmis-popover').popover('destroy');
        // //     });
        // // }

        // /**
        //  * @ngdoc method
        //  * @methodOf pod-add-discrepancy-modal.podAddDiscrepancyModalService
        //  * @name submitQualityDiscrepancies
        //  *
        //  * @description
        //  * .
        //  */
        // function submitQualityDiscrepancies(discrepancyPayload){
        //     console.log("discrepancyPayload in service");
        //     console.log(discrepancyPayload);
        //     //return discrepancyPayload;
        //     return 3;
        // }

        // /**
        //  * @ngdoc method
        //  * @methodOf pod-add-discrepancy-modal.podAddDiscrepancyModalService
        //  * @name getDiscrepancies
        //  *
        //  * @description
        //  * 
        //  */
        // this.getDiscrepancies = function (discrepancies){
        //     console.log("get discrepancies in service");
        //     console.log(discrepancies);
        //     return discrepancies;
        // }
    }

})();
