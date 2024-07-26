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
     * @name stock-prepack.prepackingService
     *
     * @description
     * Responsible for retrieving Prepacking data as well as commiting it to the server.
     */
    angular
        .module('stock-prepack')
        .service('prepackingService', prepackingService);

        prepackingService.$inject = ['$resource','openlmisUrlFactory','pointOfDeliveryManageResource', 'openlmisModalService'];

    function prepackingService($resource,openlmisUrlFactory, pointOfDeliveryManageResource, openlmisModalService ) {

        var promise;
        // Using Resource to Communicate with Prepacking Endpoints

        var resource = $resource(openlmisUrlFactory('/api/prepackingEvents:id'), {}, {
                get: {
                    url: openlmisUrlFactory('/api/prepackingEvents'),
                    method: 'GET',
                    isArray: true
                }, 
                postPrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents'),
                    method: 'POST'
                },
                updatePrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents/:id'),
                    method: 'PUT'
                },
                authorizePrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents/:id/authorize'),
                    method: 'POST',
                    params: { id: '@id' }
                },
                rejectPrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents/:id/reject'),
                    method: 'POST',
                    params: { id: '@id' }
                },
                deletePrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents/:id'),
                    method: 'DELETE',
                    params: { id: '@id' }
                },
                getPrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents/:id'),
                    method: 'GET'
                }
        });

        this.updatePrepacks = updatePrepacks;
        this.getPrepacks = getPrepacks;
        this.getPrepack = getPrepack;
        this.savePrepacks = savePrepacks;
        this.validatePrepackQuantity = validatePrepackQuantity;
        this.filterProductByLot = filterProductByLot;
        this.calculateRemainingStock = calculateRemainingStock;
        this.prepackCalculation = prepackCalculation;
        this.authorizePrepack = authorizePrepack;
        this.deletePrepack = deletePrepack;

        function updatePrepacks(prepackingEvent) {
            return resource.updatePrepackingEvent({ id:prepackingEvent.id }, prepackingEvent).$promise;
        };

        function authorizePrepack(prepackId) {            
            var params = {id: prepackId}
            return resource.authorizePrepackingEvent(params).$promise;
        };

        function getPrepacks(facilityId) {
            var params = {
                facilityId: facilityId
                };
            return resource.get(params).$promise.then(function(response) {
                // Transforming the response to an object if it's an array
                    if (Array.isArray(response)) {
                                    
                        var objectOfPrepacks = response.reduce((result, obj) => {
                        result[obj.id] = obj;
                       
                        return result;
                        }, {});                        
                        return objectOfPrepacks;                         
                    }
               return response; 
             });
        };

        function getPrepack(prepackId) {
            return resource.getPrepackingEvent({ id: prepackId }).$promise;         
        };

        function savePrepacks(params) {
            return resource.postPrepackingEvent(params);
        };

        function deletePrepack(prepackId){
            var params = {id: prepackId};
            return resource.deletePrepackingEvent(params).$promise;
        }

        function  validatePrepackQuantity(lineItem, prepackLineItems){
            let remainingStock = calculateRemainingStock(prepackLineItems, lineItem);
            if(remainingStock <= 0){
            lineItem.$errors.prepackQuantityInvalid = messageService.get(
                'stockPrepackCreation.validatePrepackQuantity');
            }
            else{
            lineItem.$errors.prepackQuantityInvalid = false;
            }
            console.log(prepackLineItems);
            return remainingStock;
        };

        // Takes all the prepack line items and returns only those with product id and lot id same as the those of the current line item
        function filterProductByLot (productsList, lineItem){

            var product = undefined;
            var hasLots = undefined;
           
            hasLots = (lineItem.lotId === null) ? false : true;
            
            if (lineItem.hasOwnProperty('orderableId')) {
                if (!hasLots) {
                    product = productsList.filter(item => (item.lot === null) && item.orderable.id === lineItem.orderableId);
                } else {
                    product = productsList.filter(item => !(item.lot === null) && item.lot.id === lineItem.lotId
                        && item.orderable.id === lineItem.orderableId);
                }
            } else if (lineItem.hasOwnProperty('orderable')) {
                if (!hasLots) {
                    product = productsList.filter(item => (item.lot === null) && item.orderable.id === lineItem.orderable.id);
                } else {
                    product = productsList.filter(item => !(item.lot === null) && item.lot.id === lineItem.lot.id
                        && item.orderable.id === lineItem.orderable.id);
                }
            }
           return product;
        };
   
        //Calculates the remaining stock after a prepack of the lineItems' product type and lot has been created
        function calculateRemainingStock(productsList, lineItem){  
            
            //find line items with the same lot id and product id
            var productType = filterProductByLot(productsList, lineItem);

            console.log("PRODUCT LIST");
            console.log(productType);

            if(productsList.length === 1){
                return lineItem.remainingStock = lineItem.stockOnHand - (lineItem.prepackSize*lineItem.numberOfPrepacks);
            }
            else{
                    let total = 0;
                    productType.forEach(product => {
                        let quantityToPrepack = product.prepackSize * product.numberOfPrepacks;
                        total += quantityToPrepack;
                    });
                    productType.forEach( item => item.remainingStock = item.stockOnHand - total);
                    return total;
                }               
        };
        
        function prepackCalculation(productsList, lineItem){
            var hasLots = undefined;
            lineItem.lot === null ? hasLots = false: hasLots = true;
            var productType = undefined;
            var remaining = undefined;
            console.log(productsList);
            if(!hasLots){
                console.log(hasLots);
                productType =productsList.filter(item => (item.lot === null) && item.orderableId=== lineItem.orderableId);
                console.log(productType);
            }
            else{
                console.log(hasLots);
                productType = productsList.filter(item => !(item.lot === null) && item.lotId=== lineItem.lotId
                    && item.orderableId === lineItem.orderableId);
                    console.log(productType);
            }

            if(productType.length === 1){
                   // return lineItem.remainingStock = 
                // remaining = lineItem.soh - (lineItem.prepackSize*lineItem.numberOfPrepacks); 
                // console.log(lineItem.soh );
                // console.log(lineItem.prepackSize);
                // console.log(lineItem.numberOfPrepacks); 
                // lineItem.remainingStock = remaining;
                // return remaining;
                //return remaining;
                return lineItem.soh
                    //return remaining = productType.stockOnHand - (lineItem.prepackSize*lineItem.numberOfPrepacks);
            }
            else{
                let total = 0;
                        
                productType.forEach(product => {
                    let quantityToPrepack = product.prepackSize * product.numberOfPrepacks;
                    total += quantityToPrepack;
                });
                console.log("TOTAL " + total);
                remaining = lineItem.soh - total;
                productType.forEach( item => item.remainingStock = remaining);
                console.log(productType);
                return remaining;
                   
                       // return lineItem.remainingStock = lineItem.soh - total;
                        //return remaining;
                } 
        }
        
    }
})();