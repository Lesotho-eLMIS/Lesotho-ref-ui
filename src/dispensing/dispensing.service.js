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
     * @name dispensing.dispensingService
     *
     * @description
     * Responsible for dispensing data as well as commiting it to the server.
     */
    angular
        .module('requisition-search')
        .service('dispensingService', dispensingService);

        dispensingService.$inject = ['$resource','openlmisUrlFactory', 'notificationService', 'confirmService','openlmisModalService'];

    function dispensingService($resource,openlmisUrlFactory, notificationService, confirmService, openlmisModalService ) {

        var promise,
            POD_FACILITIES = 'dispensingPatientsFacilities';
           // Using Resource to Communicate with dispensing Endpoints

            var resource = $resource(openlmisUrlFactory('/api/patient:id'), {}, {
                get: {
                    url: openlmisUrlFactory('/api/patient'),
                    method: 'GET',
                    isArray: true
                }, 
                postPatientEvent: {
                    url: openlmisUrlFactory('/api/patient'),
                    method: 'POST'
                },
                updatePatientEvent: {
                    url: openlmisUrlFactory('/api/patient:id'),
                    method: 'PUT'
                }, 
                search: {
                    url: openlmisUrlFactory('/api/patient'),
                    method: 'GET'
                },            
            });

        this.show = show;
 
        this.submitPatientInfo = submitPatientInfo; // To post data POD Manage payload
        this.getPatients = getPatients; //To retrieve PODs from the database
        
        var patients = [];     

        /**
         * @ngdoc method
         * @methodOf point-of-delivery.pointOfDeliveryService
         * @name getPatients
         *
         * @description
         * Retrieves POD records from the server.
         *
         * @param  {String}     Facility UUID
         * @return {Promise}    POD promise
         */

        function getPatients(patientParams) {
            var params = {
                patientNumber: patientParams.patientNumber,
                firstName: patientParams.firstName,
                lastName: patientParams.lastName,
                dateOfBirth: patientParams.dateOfBirth,
                nationalId: patientParams.nationalId,
                facilityId:patientParams.facilityId
            };
            console.log("Dispensing Service");
            console.log(params);
            return resource.get(params).$promise.then(function(response) {
                //Transforming the response to an object if it's an array
                    if (Array.isArray(response)) {
                                    
                        var objectOfPatients = response.reduce((result, obj) => {
                        result[obj.id] = obj;
                       
                        return result;
                        }, {});                        
                        return objectOfPatients;                         
                    }
               return response; 
             });
        };
 
        function submitPatientInfo(patientInfo){
            
            var payload = {
                "facilityId": patientInfo.homeFacility,
                "personDto": {
                    "nationalId": patientInfo.nationalID,
                    "firstName": patientInfo.firstName,
                    "lastName": patientInfo.lastName,
                    "nickName": patientInfo.nickName,
                    "sex": patientInfo.sex,
                    "dateOfBirth": patientInfo.DOB,
                    "isDobEstimated": patientInfo.isDobEstimated,
                    "physicalAddress": patientInfo.physicalAddress,
                    "nextOfKinFullName": patientInfo.nextOfKinNames,
                    "nextOfKinContact": patientInfo.nextOfKinContact,
                    "motherMaidenName": patientInfo.motherMaidenName,
                    "deceased": patientInfo.deceased,
                    "retired": patientInfo.retired,
                    "contacts": [
                        {
                            "contactType": patientInfo.contact.contactType,
                            "contactValue": patientInfo.contact.contactValue
                        }
                    ]
                },
                "medicalHistory": [
                    {
                        "type": "Diagnosis",
                        "history": "Diagnosed with letsoejane."
                    },
                    {
                        "type": "Treatment",
                        "history": "O sebelisa hloella-hape (iphinde futhi)."
                    }
                ]
            }
            return resource.postPatientEvent(payload);
        }

        /**
         * @ngdoc method
         * @methodOf point-of-delivery.pointOfDeliveryService
         * @name show
         *
         * @description
         * Shows modal that allows users to add discrepancies.
         *
         * @param  {Array}   rejectionReasons 
         * @param  {String}   shipmentType  
         * @return {Promise}                resolved with discrepancies.
         */
        function show (shipmentType) {
            return openlmisModalService.createDialog(
                {
                    controller: 'dispensingPrescriptionDetailsModalController',
                    controllerAs: 'vm',
                    templateUrl: 'dispensing-prescription-details-modal/dispensing-prescription-details-modal.html',
                    show: true ,
                    resolve: {
                        rejectionReasons: function(rejectionReasonService) {
                                // Load rejection Reasons into the controller.
                                return rejectionReasonService.getAll();
                            
                        }, 
                        shipmentType: function () {
                            return shipmentType;
                        }
                    }   
                }
            ).promise.finally(function() {
                angular.element('.openlmis-popover').popover('destroy');
            });
        }
        
    }
})();