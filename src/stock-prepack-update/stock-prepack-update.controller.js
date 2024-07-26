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
     * @name prepack-update.controller:prepackUpdateController
     *
     * @description
     * Controller for managing prepack updates View.
     */
    angular
      .module('stock-prepack-update')
      .controller('prepackUpdateController', prepackUpdateController);
  
      prepackUpdateController.$inject = ['$scope','facility', 'user', 'programs', 'prepack','products','orderableGroups','$state', 'prepackingService', 'notificationService', 'confirmService','orderableGroupService', 'messageService'];

    function prepackUpdateController($scope,facility, user, programs,  prepack, products, orderableGroups,$state, prepackingService,notificationService, confirmService, orderableGroupService, messageService){
        var vm = this;

        vm.onInit = onInit;
        vm.prepackLineItems = [];
        vm.getLineItemsDetails = getLineItemsDetails;
        vm.filterProductByLot = filterProductByLot;
     //   vm.changePrepackStatus = changePrepackStatus; 
        vm.selectedOrderableHasLots = false; 
        vm.prepack = undefined;
        vm.calculateRemainingStock = calculateRemainingStock;
        vm.addProduct = addProduct;
        vm.selectedOrderableGroup  = undefined;
        vm.orderableGroups = undefined;
        vm.lots = undefined;
      //  vm.authorizePrepack = authorizePrepack;
        
        function onInit(){
            vm.orderableGroups = orderableGroups;
            vm.facility = facility;            
            vm.user = user;
            vm.prepack = prepack;
            vm.programs = programs;
            vm.prepackLineItems = prepack.lineItems;
            vm.productInfo = products;
            vm.prepackedProducts = getLineItemsDetails();
            console.log(vm.selectedOrderableGroup);
        }

        onInit();

        function addProduct() {
            var selectedItem;
            selectedItem = orderableGroupService.findByLotInOrderableGroup(
                vm.selectedOrderableGroup,
                vm.selectedLot
            );
              
            vm.prepackedProducts.unshift(
                _.extend(
                  {
                    $errors: {},
                    $previewSOH: selectedItem.stockOnHand,
                    batchNumber: selectedItem.displayLotMessage,
                    expiryDate : selectedItem.lot? selectedItem.lot.expirationDate : null,
                    productName: selectedItem.orderable.fullProductName,
                    productCode: selectedItem.orderable.productCode,
                    soh: selectedItem.stockOnHand,
                    lotId: selectedItem.lot? selectedItem.lot.id : null,
                    orderableId: selectedItem.orderable.id
                  },
                  selectedItem
                  //copyDefaultValue()
                )
              );

            //vm.selectedOrderableGroup = undefined;
            //vm.selectedLot = undefined;

            console.log(vm.prepackedProducts)
          }

        vm.validatePrepackQuantity = function(lineItem){
            console.log("VALIDATING")
            console.log(vm.prepackedProducts);
            return prepackingService.prepackCalculation(vm.prepackedProducts, lineItem);
        }

        vm.orderableSelectionChanged = function () {
            //reset selected lot, so that lot field has no default value
            vm.selectedLot = null;
      
            //initiateNewLotObject();
            //vm.canAddNewLot = false;
      
            //same as above
            $scope.productForm.$setUntouched();
      
            //make form good as new, so errors won't persist
            $scope.productForm.$setPristine();
      
            vm.lots = orderableGroupService.lotsOf(
              vm.selectedOrderableGroup,
              false // We do not add new lots during prepacking
            );
            vm.selectedOrderableHasLots = vm.lots.length > 0;
            console.log();
            console.log()
        };

        // function changePrepackStatus(newStatus) {           
        //     var buttonContext = "";
        //     var questionContext = "";
        //     var successMsgContext = "";

        //     if(newStatus === "Authorised"){
        //         buttonContext = "Authorise";
        //         questionContext = "authorise";
        //         successMsgContext = "authorised"
        //     }else if(newStatus === "Cancelled"){
        //         buttonContext = "Cancel";
        //         questionContext = "cancel";
        //         successMsgContext = "cancelled"
        //     }else if(newStatus === "Rejected"){
        //         buttonContext = "Reject";
        //         questionContext = "reject";
        //         successMsgContext = "rejected"
        //     }else if(newStatus === "Edited"){
        //         buttonContext = "Edit";
        //         questionContext = "edit";
        //         successMsgContext = "edited"
        //         vm.prepack.lineItems = vm.prepackedProducts;
        //     }
        //     else{
        //         notificationService.error('Unknown Prepack Status Detected.');
        //         console.error("Unknown Prepack Status Detected");
        //     }
        //     confirmService
        //         .confirm("Are you sure you want to "+questionContext+" this prepacking job?", buttonContext)
        //         .then(function () {
        //            vm.prepack.status = newStatus;
        //            prepackingService.updatePrepacks(vm.prepack.id, vm.prepack)
        //           .then(function(response) {
        //             // Success callback
        //             notificationService.success('Prepacking job '+successMsgContext+'.');
        //             $state.go('openlmis.prepacking.view');
        //             }
        //           )
        //           .catch(function(error) {
        //               // Error callback
        //               notificationService.error('Failed to '+questionContext+'.');
        //               console.error('Error occurred:', error);
                  
        //           });
        //         });
    
        // }

      vm.editPrepack = function () {
        console.log(vm.prepack);
        confirmService.confirm('Do you wish to confirm the adjustments?')
          .then(function () {
            prepackingService.updatePrepacks(vm.prepack)
              .then(function (response) {
                console.log(response);
                // Success callback
                notificationService.success('Prepacking updated Successfully');
                $state.go('openlmis.prepacking.view');
              })
          })
          .catch(function (error) {
            // Error callback
            notificationService.error('Failed to update ' + error + '.');
            console.error('Error occurred:', error);

          });
      }


        vm.remove = function (lineItem) {
            lineItem.prepackSize = 0;
            lineItem.numberOfPrepacks = 0;
            prepackingService.prepackCalculation(vm.prepackedProducts, lineItem);
            console.log(vm.prepackedProducts)
            var index = vm.prepackedProducts.indexOf(lineItem);
            vm.prepackedProducts.splice(index, 1);
      
            //vm.search();
        };

        function getLineItemsDetails(){

            var productsArray = _.flatten(vm.productInfo);            
            var haslots = undefined;
            vm.prepackLineItems.forEach(item => {
              console.table(item)
                item.lotId === null ? haslots = true: haslots = false;              
                var productDetails = prepackingService.filterProductByLot(productsArray, item);//haslots)
                // .find(lineItem => ((lineItem.orderable.id === item.orderableId
                //             && lineItem.lot.id === item.lotId))); 
                console.table(productDetails);
                item.productName = productDetails[0].orderable.fullProductName;
                item.productCode = productDetails[0].orderable.productCode;
                item.batchNumber = productDetails[0].lot? productDetails[0].lot.lotCode : null;
                item.expiryDate = productDetails[0].expirationDate? productDetails[0].lot.expirationDate : null;
                item.soh = productDetails[0].stockOnHand;
                item.remainingStock = prepackingService.prepackCalculation(vm.prepackLineItems, item);
            });         
            return(vm.prepackLineItems);  
        }

        function filterProductByLot (productsList, lotIsNull){

            if(!lotIsNull)
            {
                return productsList.filter(item => !(item.lot === null));
            }
            else{
                return productsList.filter(item => item.lot === null);
            }
        }

        
        function calculateRemainingStock(productsList, lotIsNull, lineItem){   
            var productType = filterProductByLot(productsList, lotIsNull).find(product => ((product.orderable.id === lineItem.orderableId
                && product.lot.id === lineItem.lotId)));  
                return lineItem.remainingStock = productType.stockOnHand - (lineItem.prepackSize*lineItem.numberOfPrepacks);
            
          }
    }
})()