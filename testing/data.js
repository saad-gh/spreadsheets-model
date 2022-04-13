// dummySkusStock
const dummySKUsStock = [
  { sku : "SS1", cid : 1, location : "unicon", qty___ctn : 6, qty__ctns_ : 100, qty__total_ : 600 },
  { sku : "SS2", cid : 1, location : "unicon", qty___ctn : 6, qty__ctns_ : 100, qty__total_ : 600 }
]

// test matches
const query1 = { a : 1, b : 2 }
const data5 = [{ a : 1 }, { a : 1, b : 2 }, { a : 3 }]
const expected1 = [null, 1, null]
const expected2 = [0, 1, null]
const expected3 = [null, null, 2]
const expected4 = [0, null, 2]

const query2 = { a : 2 }
const data6 = [{ a : 1 }, { a : 2, b : 2 }, { a : 3 }]
const expected5 = [null, null, 2]
const expected6 = [null, 1, 2]
const expected7 = [0, null, null]
const expected8 = [0, 1, null]

// standardize
const expected = "Transition 3";

// model
const row15 = {
  sid: 1,
  type: 'b2b',
  date: new Date(),
  cid: 13,
  warehouse: 'unicon',
  sku: 'IS-OTS6-LVXE',
  qty_per_ctn: 4,
  qty_ctns: -36,
}
const row16 = {
  sid: 1,
  type: 'b2b',
  date: new Date(),
  cid: 13,
  warehouse: 'unicon',
  sku: 'IS-OTS6-LVXE',
  qty_per_ctn: 4,
  qty_ctns: -36,
}
const filterCriteria1 = { sid : 2 }
const filterCriteria2 = { sid : 1 }

// T6
// const previousStateObjects_T6_1 = [ '{"TransportResult":{"TransportStatus":"CONFIRMING"},"Items":[{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Confirm Transport"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Confirm Transport"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Confirm Transport"}]}' ]

// const synced_T6_1 = [{"DownloadURL":"http://www.labels.url.com","Items":[{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Confirm Transport"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Confirm Transport"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Confirm Transport"}]}]

// const tableData_T6_1 = [
//   {"custom_col_0":"","shipping_id":1,"sku":"SS1","shipping_id_amazon":"S1","state":"Get Labels","dowload_URL":"http://www.labels.url.com","error":""},
//   {"custom_col_0":"","shipping_id":1,"sku":"SS2","shipping_id_amazon":"S1","state":"Get Labels","dowload_URL":"http://www.labels.url.com","error":""},
//   {"custom_col_0":"","shipping_id":1,"sku":"SS3","shipping_id_amazon":"S1","state":"Get Labels","dowload_URL":"http://www.labels.url.com","error":""}
// ]

// const response_T6_1 = {
//   response : {
//     "DownloadURL": "http://www.labels.url.com"
//   },
//   getContentText : function(){ return JSON.stringify(this.response)},
//   getResponseCode : function() { return 200 }  
// }

// // T5
// const tableData_T5_1 = 	[ '{"TransportResult":{"TransportStatus":"ESTIMATING"},"Items":[{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Estimate Transport"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Estimate Transport"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Estimate Transport"}]}' ]

// const previousStateObjects_T5_1 = [ '{"TransportResult":{"TransportStatus":"ESTIMATING"},"Items":[{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Estimate Transport"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Estimate Transport"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Estimate Transport"}]}' ]

// // T4
// const tableData_T4_1 = 	[
//   {"custom_col_0":"","shipping_id":1,"sku":"SS1","shipping_id_amazon":"S1","state":"Estimate Transport","error":""},
//   {"custom_col_0":"","shipping_id":1,"sku":"SS2","shipping_id_amazon":"S1","state":"Estimate Transport","error":""},
//   {"custom_col_0":"","shipping_id":1,"sku":"SS3","shipping_id_amazon":"S1","state":"Estimate Transport","error":""}
// ]

// const previousStateObjects_T4_1 = [ '{"TransportResult":{"TransportStatus":"WORKING"},"Items":[{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Transport Details"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Transport Details"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Transport Details"}]}' ]

// const synced_T4_1 = [{"TransportResult":{"TransportStatus":"ESTIMATING"},"Items":[{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Transport Details"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Transport Details"},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Transport Details"}]}]

const dummySKUs = [
  { sku : "SS1", l : 20, b : 20, h : 20, expiration_date : new Date() },
  { sku : "SS2", l : 20, b : 20, h : 20, expiration_date : "" },
  { sku : "SS3", l : 20, b : 20, h : 20, expiration_date : "" }
]
// T3
// const tableData_T3_1 = 	[
//   {"custom_col_0":"","shipping_id":1,"sku":"SS1","shipping_id_amazon":"S1","state":"Transport Details","error":""},
//   {"custom_col_0":"","shipping_id":1,"sku":"SS2","shipping_id_amazon":"S1","state":"Transport Details","error":""},
//   {"custom_col_0":"","shipping_id":1,"sku":"SS3","shipping_id_amazon":"S1","state":"Transport Details","error":""}
// ]

// const previousStateObjects_T3_1 = [ '{"Items":[{"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Shipping"},{"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Shipping"},{"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Shipping"}],"shipping_id_amazon":"S1","ShipmentId":"S1"}' ]

// const payloads_T3_1 = [
//   {"IsPartnered":true,
//   "ShipmentType":"SP",
//   "TransportDetails":
//   {"PartneredSmallParcelData":{"PackageList":[
//     {"Dimensions":{ "Length": 20, "Width": 20, "Height" : 20, "Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"}},
//     {"Dimensions":{ "Length": 20, "Width": 20, "Height" : 20, "Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"}},
//     {"Dimensions":{ "Length": 20, "Width": 20, "Height" : 20, "Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"}}
// ]}}}]

// const merged_T3_1 = [
//   {"Items":[
//     {"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5},
//     {"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5},
//     {"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5}]}]

// const synced_T3_1 = [
//   {"TransportResult":{"TransportStatus":"WORKING"},"Items":[{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS1","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":""},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS2","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":""},{"Dimensions":{"Length":20,"Width":20,"Height":20,"Unit":"inches"},"Weight":{"Value":10,"Unit":"kilograms"},"ShipmentId":"S1","SellerSKU":"SS3","shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"QuantityShipped":5,"QuantityInCase":5,"qty__total__planned":5,"qty__total_":5,"qty__total___shipment":15,"qty___ctn":5,"error":""}]}
// ]

// const request_T3_1 = {
//   "IsPartnered": true,
//   "ShipmentType": "SP",
//   "TransportDetails": {
//     "PartneredSmallParcelData": {
//       "PackageList": [
//         {
//           "Dimensions": {
//             "Length": 11,
//             "Width": 11,
//             "Height": 11,
//             "Unit": "inches"
//           },
//           "Weight": {
//             "Value": 11,
//             "Unit": "pounds"
//           }
//         }
//       ],
//       "CarrierName": "string"
//     },
//     "NonPartneredSmallParcelData": {
//       "CarrierName": "USPS",
//       "PackageList": [
//         {
//           "TrackingId": "werwrwerwrwrer"
//         }
//       ]
//     },
//     "PartneredLtlData": {
//       "Contact": {
//         "Name": "Test1",
//         "Phone": "234-343-3434",
//         "Email": "abc@test.com",
//         "Fax": "234-343-3434"
//       },
//       "BoxCount": 1,
//       "SellerFreightClass": "50",
//       "FreightReadyDate": "2020-03-27",
//       "PalletList": [
//         {
//           "Dimensions": {
//             "Length": 13,
//             "Width": 13,
//             "Height": 13,
//             "Unit": "inches"
//           },
//           "Weight": {
//             "Value": 13,
//             "Unit": "pounds"
//           },
//           "IsStacked": true
//         }
//       ],
//       "TotalWeight": {
//         "Value": 13,
//         "Unit": "pounds"
//       },
//       "SellerDeclaredValue": {
//         "CurrencyCode": "USD",
//         "Value": 20
//       }
//     },
//     "NonPartneredLtlData": {
//       "CarrierName": "USPS",
//       "ProNumber": "3746274"
//     }
//   }
// }

// const response_T3_1 = {
//   response : {"TransportResult": {
//     "TransportStatus": "WORKING"
//   }},
//   getContentText : function(){ return JSON.stringify(this.response)},
//   getResponseCode : function() { return 200 }  
// }


// // T4
// const request_T4_1 = {}

// const response_T4_1 = {
//   response : {"TransportResult": {
//     "TransportStatus": "ESTIMATING"
//   }},
//   getContentText : function(){ return JSON.stringify(this.response)},
//   getResponseCode : function() { return 200 }  
// }

// // T5
// const request_T5_1 = {}

// const response_T5_1 = {
//   response : {"TransportResult": {
//     "TransportStatus": "CONFIRMING"
//   }},
//   getContentText : function(){ return JSON.stringify(this.response)},
//   getResponseCode : function() { return 200 }  
// }


// shipping workflow
const error_transition2_1 = { 'Transition 12': '{"ShipmentId":"S2","DestinationFulfillmentCenterId":"D1","Items":[{"SellerSKU":"SS1","shipping_id_amazon":"S2","shipping_id_local":2,"destinationFulfillmentCenterId":"D1","Quantity":5,"qty__total__planned":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Shipping Plan"},{"SellerSKU":"SS2","shipping_id_amazon":"S2","shipping_id_local":2,"destinationFulfillmentCenterId":"D1","Quantity":5,"qty__total__planned":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Shipping Plan"},{"SellerSKU":"SS3","shipping_id_amazon":"S2","shipping_id_local":2,"destinationFulfillmentCenterId":"D1","Quantity":5,"qty__total__planned":5,"qty__total___shipment":15,"qty___ctn":5,"error":"","state":"Shipping Plan"}],"EstimatedBoxContentsFee":{"TotalUnits":15},"shipping_id_local":2,"LabelPrepPreference":"SELLER_LABEL","ShipFromAddress":{"types":"transfer","warehouses":"p2p","Name":"abc","AddressLine1":"def","AddressLine2":"ghi","DistrictOrCounty":"jkl","City":"mno","StateOrProvinceCode":"pqr","CountryCode":"st","PostalCode":"123"}}' }

const transition2_1 = { 'Transition 21': '{"ShipmentId":"S1","Items":[{"ShipmentId":"S1","SellerSKU":"SS1","QuantityShipped":5,"QuantityInCase":5,"shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"qty__total__planned":5,"qty__total___shipment":15,"qty___ctn":5,"qty__total_":5,"error":"","state":"Shipping"},{"ShipmentId":"S1","SellerSKU":"SS2","QuantityShipped":5,"QuantityInCase":5,"shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"qty__total__planned":5,"qty__total___shipment":15,"qty___ctn":5,"qty__total_":5,"error":"","state":"Shipping"},{"ShipmentId":"S1","SellerSKU":"SS3","QuantityShipped":5,"QuantityInCase":5,"shipping_id_amazon":"S1","shipping_id_local":1,"destinationFulfillmentCenterId":"D1","Quantity":5,"qty__total__planned":5,"qty__total___shipment":15,"qty___ctn":5,"qty__total_":5,"error":"","state":"Shipping"}],"shipping_id_amazon":"S1"}' }

// const synced_T2_1 = [{
//     "ShipmentId": "S1",
//     "Items": [{
//         "ShipmentId": "S1",
//         "SellerSKU": "SS1",
//         "QuantityShipped": 5,
//         "QuantityInCase": 5,
//         "shipping_id_amazon": "S1",
//         "shipping_id_local": 1,
//         "destinationFulfillmentCenterId": "D1",
//         "Quantity": 5,
//         "qty__total__planned": 5,
//         "qty__total___shipment": 15,
//         "qty___ctn": 5,
//         "qty__total_": 5,
//         "error": ""
//     }, {
//         "ShipmentId": "S1",
//         "SellerSKU": "SS2",
//         "QuantityShipped": 5,
//         "QuantityInCase": 5,
//         "shipping_id_amazon": "S1",
//         "shipping_id_local": 1,
//         "destinationFulfillmentCenterId": "D1",
//         "Quantity": 5,
//         "qty__total__planned": 5,
//         "qty__total___shipment": 15,
//         "qty___ctn": 5,
//         "qty__total_": 5,
//         "error": ""
//     }, {
//         "ShipmentId": "S1",
//         "SellerSKU": "SS3",
//         "QuantityShipped": 5,
//         "QuantityInCase": 5,
//         "shipping_id_amazon": "S1",
//         "shipping_id_local": 1,
//         "destinationFulfillmentCenterId": "D1",
//         "Quantity": 5,
//         "qty__total__planned": 5,
//         "qty__total___shipment": 15,
//         "qty___ctn": 5,
//         "qty__total_": 5,
//         "error": ""
//     }],
//     "shipping_id_amazon": "S1"
// }, {
//     "error": true,
//     "Items": [{
//         "qty__total_": 5,
//         "qty__total___shipment": 15,
//         "ShipmentId": "S2",
//         "SellerSKU": "SS1",
//         "QuantityShipped": 5,
//         "QuantityInCase": 5,
//         "shipping_id_amazon": "S2",
//         "shipping_id_local": 2,
//         "destinationFulfillmentCenterId": "D1",
//         "Quantity": 5,
//         "qty__total__planned": 5,
//         "qty___ctn": 5,
//         "error": "Invalid Request Parameters"
//     }, {
//         "qty__total_": 5,
//         "qty__total___shipment": 15,
//         "ShipmentId": "S2",
//         "SellerSKU": "SS2",
//         "QuantityShipped": 5,
//         "QuantityInCase": 5,
//         "shipping_id_amazon": "S2",
//         "shipping_id_local": 2,
//         "destinationFulfillmentCenterId": "D1",
//         "Quantity": 5,
//         "qty__total__planned": 5,
//         "qty___ctn": 5,
//         "error": "Invalid Request Parameters"
//     }, {
//         "qty__total_": 5,
//         "qty__total___shipment": 15,
//         "ShipmentId": "S2",
//         "SellerSKU": "SS3",
//         "QuantityShipped": 5,
//         "QuantityInCase": 5,
//         "shipping_id_amazon": "S2",
//         "shipping_id_local": 2,
//         "destinationFulfillmentCenterId": "D1",
//         "Quantity": 5,
//         "qty__total__planned": 5,
//         "qty___ctn": 5,
//         "error": "Invalid Request Parameters"
//     }]
// }]

const synced_T1_2 = [{
  ShipmentId : "S1",
  DestinationFulfillmentCenterId : "D1",
  Items : [
    {
      SellerSKU : "SS1",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS2",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS3",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    }
  ],
  EstimatedBoxContentsFee : { TotalUnits : 15 },
  shipping_id_local : 1,
  LabelPrepPreference: "SELLER_LABEL",
  ShipFromAddress : {
    types: "transfer",
    warehouses : "p2p",
    Name: "abc",
    AddressLine1: "def",
    AddressLine2: "ghi",
    DistrictOrCounty: "jkl",
    City: "mno",
    StateOrProvinceCode: "pqr",
    CountryCode: "st",
    PostalCode: "123"
  }
},{
  ShipmentId : "S2",
  DestinationFulfillmentCenterId : "D1",
  Items : [
    {
      SellerSKU : "SS1",
      shipping_id_amazon : "S2",
      shipping_id_local : 2,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS2",
      shipping_id_amazon : "S2",
      shipping_id_local : 2,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS3",
      shipping_id_amazon : "S2",
      shipping_id_local : 2,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    }
  ],
  EstimatedBoxContentsFee : { TotalUnits : 15 },
  shipping_id_local : 2,
  LabelPrepPreference: "SELLER_LABEL",
  ShipFromAddress : {
    types: "transfer",
    warehouses : "p2p",
    Name: "abc",
    AddressLine1: "def",
    AddressLine2: "ghi",
    DistrictOrCounty: "jkl",
    City: "mno",
    StateOrProvinceCode: "pqr",
    CountryCode: "st",
    PostalCode: "123"
  }
}]

const tableData2 = [
  {"custom_col_0":"","shipping_id":1,"sku":"SS1", "qty__total_":5, "state":"Shipping", "qty__total___shipment":15,"error":"", "shipping_id_amazon": "S1"},
  {"custom_col_0":"","shipping_id":1,"sku":"SS2", "qty__total_":5, "state":"Shipping", "qty__total___shipment":15,"error":"", "shipping_id_amazon": "S1"},
  {"custom_col_0":"","shipping_id":1,"sku":"SS3", "qty__total_":5, "state":"Shipping", "qty__total___shipment":15,"error":"", "shipping_id_amazon": "S1"}
]

const table_T2_1 = [
  {"custom_col_0":"","shipping_id":1,"sku":"SS1","qty__total_":5,"qty__total___shipment":15,"state":"Shipping","shipping_id_amazon":"S1","error":""},
  {"custom_col_0":"","shipping_id":1,"sku":"SS2","qty__total_":5,"qty__total___shipment":15,"state":"Shipping","shipping_id_amazon":"S1","error":""},
  {"custom_col_0":"","shipping_id":1,"sku":"SS3","qty__total_":5,"qty__total___shipment":15,"state":"Shipping","shipping_id_amazon":"S1","error":""},
  {"custom_col_0":"","shipping_id":2,"sku":"SS1","qty__total_":5,"qty__total___shipment":15,"state":"Shipping Plan","shipping_id_amazon":"S2","error":"Invalid Request Parameters"},
  {"custom_col_0":"","shipping_id":2,"sku":"SS2","qty__total_":5,"qty__total___shipment":15,"state":"Shipping Plan","shipping_id_amazon":"S2","error":"Invalid Request Parameters"},
  {"custom_col_0":"","shipping_id":2,"sku":"SS3","qty__total_":5,"qty__total___shipment":15,"state":"Shipping Plan","shipping_id_amazon":"S2","error":"Invalid Request Parameters"}
]

const syncWorkflow7 = [
  {
    "Items":[
      {
        "ShipmentId":"S1",
        SellerSKU : "SS1",
        shipping_id_amazon : "S1",
        shipping_id_local : 1,      
        destinationFulfillmentCenterId : 'D1',
        Quantity : 5,
        "QuantityShipped":5,"QuantityInCase":5,
        qty__total__planned : 5,
        qty__total_ : 5,
        qty__total___shipment : 15,
        qty___ctn : 5,
        error: ""
      },
      {
        "ShipmentId":"S1",
        SellerSKU : "SS2",
        shipping_id_amazon : "S1",
        shipping_id_local : 1,      
        destinationFulfillmentCenterId : 'D1',
        Quantity : 5,
        "QuantityShipped":5,"QuantityInCase":5,
        qty__total__planned : 5,
        qty__total_ : 5,
        qty__total___shipment : 15,
        qty___ctn : 5,
        error: ""
      },
      {
        "ShipmentId":"S1",
        SellerSKU : "SS3",
        shipping_id_amazon : "S1",
        shipping_id_local : 1,      
        destinationFulfillmentCenterId : 'D1',
        Quantity : 5,
        "QuantityShipped":5,"QuantityInCase":5,
        qty__total__planned : 5,
        qty__total_ : 5,
        qty__total___shipment : 15,
        qty___ctn : 5,
        error: ""
      }
    ],
    "shipping_id_amazon":"S1",
    "ShipmentId":"S1"
  }
]

const syncWorkflowT11 = [
  {
    "Items":[
      {
        "ShipmentId":"S1",
        SellerSKU : "SS1",
        shipping_id_amazon : "S1",
        shipping_id_local : 1,      
        destinationFulfillmentCenterId : 'D1',
        Quantity : 5,
        "QuantityShipped":5,"QuantityInCase":5,
        qty__total__planned : 5,
        qty__total_ : 5,
        qty__total___shipment : 15,
        qty___ctn : 5,
        error: ""
      },
      {
        "ShipmentId":"S1",
        SellerSKU : "SS2",
        shipping_id_amazon : "S1",
        shipping_id_local : 1,      
        destinationFulfillmentCenterId : 'D1',
        Quantity : 5,
        "QuantityShipped":5,"QuantityInCase":5,
        qty__total__planned : 5,
        qty__total_ : 5,
        qty__total___shipment : 15,
        qty___ctn : 5,
        error: ""
      },
      {
        "ShipmentId":"S1",
        SellerSKU : "SS3",
        shipping_id_amazon : "S1",
        shipping_id_local : 1,      
        destinationFulfillmentCenterId : 'D1',
        Quantity : 5,
        "QuantityShipped":5,"QuantityInCase":5,
        qty__total__planned : 5,
        qty__total_ : 5,
        qty__total___shipment : 15,
        qty___ctn : 5,
        error: ""
      }
    ],
    "shipping_id_amazon":"S1",
    "ShipmentId":"S1"
  }
]

const syncWorkflow8 = [{
  ShipmentId : "S1",
  DestinationFulfillmentCenterId : "D1",
  Items : [
    {
      SellerSKU : "SS1",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS2",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS3",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    }
  ],
  EstimatedBoxContentsFee : { TotalUnits : 15 },
  shipping_id_local : 1,
  LabelPrepPreference: "SELLER_LABEL",
  ShipFromAddress : {
    types: "transfer",
    warehouses : "p2p",
    Name: "",
    AddressLine1: "",
    AddressLine2: "",
    DistrictOrCounty: "",
    City: "",
    StateOrProvinceCode: "",
    CountryCode: "",
    PostalCode: ""
  }
}]

const responses_T2_1 = [
  {
    response : { "ShipmentId" : "S1" } ,
    getResponseCode : function(){ return 200 },
    getContentText : function(){ return JSON.stringify(this.response) }
  }, {
    response : undefined ,
    getResponseCode : function(){ return 400 },
    getContentText : function(){ return JSON.stringify(this.response) }
  }
]


const shippingResponses3 = [
  {
    response : { "ShipmentId" : "S1" } ,
    getResponseCode : function(){ return 200 },
    getContentText : function(){ return JSON.stringify(this.response) }
  }
]

const shippingResponses2 = {
  "ShipmentId" : "S1"
}

// state manager
const tableData1 = [
  {"custom_col_0":"","shipping_id":1,"sku":"SS1","qty___ctn":5,"qty__total_":"","qty__total__required":"","p2p":"","unicon":"","uk":"","state":"Shipping Plan","qty__total__planned":5,"qty__total___shipment":15,"error":""},
  {"custom_col_0":"","shipping_id":1,"sku":"SS2","qty___ctn":5,"qty__total_":"","qty__total__required":"","p2p":"","unicon":"","uk":"","state":"Shipping Plan","qty__total__planned":5,"qty__total___shipment":15,"error":""},
  {"custom_col_0":"","shipping_id":1,"sku":"SS3","qty___ctn":5,"qty__total_":"","qty__total__required":"","p2p":"","unicon":"","uk":"","state":"Shipping Plan","qty__total__planned":5,"qty__total___shipment":15,"error":""}
]

// workflow shipping
const syncWorkflow6 = [{
  ShipmentId : "S1",
  DestinationFulfillmentCenterId : "D1",
  Items : [
    {
      SellerSKU : "SS1",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS2",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS3",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    }
  ],
  EstimatedBoxContentsFee : { TotalUnits : 15 },
  shipping_id_local : 1,
  LabelPrepPreference: "SELLER_LABEL",
  ShipFromAddress : {
    types: "transfer",
    warehouses : "p2p",
    Name: "abc",
    AddressLine1: "def",
    AddressLine2: "ghi",
    DistrictOrCounty: "jkl",
    City: "mno",
    StateOrProvinceCode: "pqr",
    CountryCode: "st",
    PostalCode: "123"
  }
}]

const shippingPayloads2 = [{"InboundShipmentHeader":{"ShipmentName":"ERP Dev " + (new Date().toISOString().split("T")[0]),"ShipFromAddress":{"Name":"abc","AddressLine1":"def","City":"mno","StateOrProvinceCode":"pqr","CountryCode":"st","PostalCode":"123"},"DestinationFulfillmentCenterId":"D1","ShipmentStatus":"WORKING","LabelPrepPreference":"SELLER_LABEL","AreCasesRequired":true,"IntendedBoxContentsSource":"2D_BARCODE"},"InboundShipmentItems":[{"ShipmentId":"S1","SellerSKU":"SS1","QuantityShipped":5,"QuantityInCase":5},{"ShipmentId":"S1","SellerSKU":"SS2","QuantityShipped":5,"QuantityInCase":5},{"ShipmentId":"S1","SellerSKU":"SS3","QuantityShipped":5,"QuantityInCase":5}],"MarketplaceId":"A1PA6795UKMFR9"}]

const payloads_T2_1 = [{
  "InboundShipmentHeader":{
    "ShipmentName":"ERP Dev " + (new Date().toISOString().split("T")[0]),
    "ShipFromAddress":{"Name":"abc","AddressLine1":"def","City":"mno","StateOrProvinceCode":"pqr","CountryCode":"st","PostalCode":"123"},
    "DestinationFulfillmentCenterId":"D1","ShipmentStatus":"WORKING","LabelPrepPreference":"SELLER_LABEL","AreCasesRequired":true,"IntendedBoxContentsSource":"2D_BARCODE"
  },
  "InboundShipmentItems":[
    {"ShipmentId":"S1","SellerSKU":"SS1","QuantityShipped":5,"QuantityInCase":5},
    {"ShipmentId":"S1","SellerSKU":"SS2","QuantityShipped":5,"QuantityInCase":5},
    {"ShipmentId":"S1","SellerSKU":"SS3","QuantityShipped":5,"QuantityInCase":5}
  ],
  "MarketplaceId":"A1PA6795UKMFR9"},{
  "InboundShipmentHeader":{
    "ShipmentName":"ERP Dev " + (new Date().toISOString().split("T")[0]),
    "ShipFromAddress":{"Name":"","AddressLine1":"","City":"mno","StateOrProvinceCode":"pqr","CountryCode":"st","PostalCode":"123"},
    "DestinationFulfillmentCenterId":"D1","ShipmentStatus":"WORKING","LabelPrepPreference":"SELLER_LABEL","AreCasesRequired":true,"IntendedBoxContentsSource":"2D_BARCODE"
  },
  "InboundShipmentItems":[
    {"ShipmentId":"S2","SellerSKU":"SS1","QuantityShipped":5,"QuantityInCase":5},
    {"ShipmentId":"S2","SellerSKU":"SS2","QuantityShipped":5,"QuantityInCase":5},
    {"ShipmentId":"S2","SellerSKU":"SS3","QuantityShipped":5,"QuantityInCase":5}
  ],
  "MarketplaceId":"A1PA6795UKMFR9"}
]

const stateObjectsShippingPlan1 = []

const shippingPayloads1 = [{
  "InboundShipmentHeader": {
    "ShipmentName": "43545345",
    "ShipFromAddress": {
      "Name": "35435345",
      "AddressLine1": "123 any st",
      "DistrictOrCounty": "Washtenaw",
      "City": "Ann Arbor",
      "StateOrProvinceCode": "Test",
      "CountryCode": "US",
      "PostalCode": "48103"
    },
    "DestinationFulfillmentCenterId": "AEB2",
    "AreCasesRequired": true,
    "ShipmentStatus": "WORKING",
    "LabelPrepPreference": "SELLER_LABEL",
    "IntendedBoxContentsSource": "NONE"
  },
  "InboundShipmentItems": [
    {
      "ShipmentId": "345453",
      "SellerSKU": "34534545",
      "FulfillmentNetworkSKU": "435435435",
      "QuantityShipped": 0,
      "QuantityReceived": 0,
      "QuantityInCase": 0,
      "ReleaseDate": "2020-04-23",
      "PrepDetailsList": [
        {
          "PrepInstruction": "Polybagging",
          "PrepOwner": "AMAZON"
        }
      ]
    }
  ],
  "MarketplaceId": "MarketplaceId"
}]

const shippingResponses1 = [
  {
    "ShipmentId": "ShipmentId"
  }
]


// helper
// getBlocks
const data4 = [
  {
    sid : 1
  },
  {
    sid : 1
  },
  {
    sid : 2
  },
  {
    sid : 2
  },
  {
    sid : 3
  }
]

const data4Expected = [[0,2], [2,4], [4, 5]]

const data3 = [
  {
    sid: 1,
    type: 'b2b',
    date: new Date(),
    cid: 13,
    warehouse: 'unicon',
    sku: 'IS-OTS6-LVXE',
    qty_per_ctn: 4,
    qty_ctns: -36,
  },
  {
    sid: 2,
    type: 'b2b',
    date: new Date(),
    cid: 14,
    warehouse: 'p2p',
    sku: 'T4-BDHN-OQSC',
    qty_per_ctn: 8,
    qty_ctns: -5,
  },
  {
    sid: 3,
    type: 'b2b',
    date: new Date(),
    cid: 15,
    warehouse: 'p2p',
    sku: 'PV-G72N-WCJL',
    qty_per_ctn: 15,
    qty_ctns: -42,
  }
]

const expectedData3 = [0]

const singleRow1 = {
  sid: 1,
  type: 'b2b',
  date: new Date(),
  cid: 13,
  warehouse: 'unicon',
  sku: 'IS-OTS6-LVXE',
  qty_per_ctn: 4,
  qty_ctns: -36,
}

const singleRow2 = {
  sid: 2,
  type: 'b2b',
  date: new Date(),
  cid: 14,
  warehouse: 'p2p',
  sku: 'T4-BDHN-OQSC',
  qty_per_ctn: 8,
  qty_ctns: -5,
}

const singleRow3 = {
  sid: 3,
  type: 'b2b',
  date: new Date(),
  cid: 15,
  warehouse: 'p2p',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 15,
  qty_ctns: -42,
}

const singleRow4 = {
  sid: 4,
  type: 'b2b',
  date: new Date(),
  cid: 18,
  warehouse: 'p2p',
  sku: 'T4-BDHN-OQSC',
  qty_per_ctn: 38,
  qty_ctns: -10,
}

const singleRow5 = {
  sid: 5,
  type: 'b2b',
  date: new Date(),
  cid: 21,
  warehouse: 'p2p',
  sku: '4A-YZCU-J00Q',
  qty_per_ctn: 50,
  qty_ctns: -90,
}

const multipleRows = [singleRow1, singleRow2]

const row1 = {
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 'C12',
  warehouse: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row2 = {
  sid: 'S1',
  type: 'b2b',
  date: new Date(),
  cid: 'C13',
  warehouse: 'p2p',
  sku: 'IS-OTS6-LVXE',
  qty_per_ctn: 4,
  qty_ctns: -36,
}

// rid provided
const row3 = {
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 1,
  warehouse: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row4 = {
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 2,
  warehouse: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row5 = {
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 1,
  location: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row6 = {
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 2,
  location: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row9 = {
  new : 'new',
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 2,
  warehouse: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row10 = {
  new : 'new',
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 1,
  location: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row11 = {
  new : 'new',
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 2,
  location: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row12 = {
  new : 'new1',
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 2,
  warehouse: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row13 = {
  new : 'new2',
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 1,
  location: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row14 = {
  new : 'new3',
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 2,
  location: 'unicon',
  sku: 'PV-G72N-WCJL',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row7 = {
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 1,
  location: 'unicon',
  sku: 'IS-OTS6-LVXE',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

const row8 = {
  rid: 'L1',
  sid: 'S2',
  type: 'fba shipment',
  date: new Date(),
  cid: 2,
  location: 'unicon',
  sku: 'IS-OTS6-LVXE',
  qty_per_ctn: 6,
  qty_ctns: -12,
}

// sheet table data
const tableData = [
  ['a', 'b', 'c'],
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]

const modelData = [
  { a: 1, b: 2, c: 3 },
  { a: 4, b: 5, c: 6 },
  { a: 7, b: 8, c: 9 }
]

const modelData2 = [
  { a: 1, b: 1 },
  { a: 1, b: 2 },
  { a: 1, b: 3 },
]

// fba shipping configuration and requirements
// name maps to schema key
const serializedWarehouse = [
  { "name": "cid", "value": "2" },
  { "name": "warehouse", "value": "p2p" }
]

const serializedRequirements_1 = [{ "name": "sku&qty (total)", "value": "4A-YZCU-J00Q\t25\r\nIS-OTS6-LVXE\t25" }]
const serializedRequirements_2 = [{ "name": "sku&qty (total)", "value": "\r\nIS-OTS6-LVXE\t45\r\n\r\n" }]
const serializedRequirements_3 = [{ "name": "sku&qty (total)", "value": "4A-YZCU-J00Q\t25\r\nIS-OTS6-LVXE" }]
const serializedRequirements_4 = [{ "name": "sku&qty (total)", "value": "4A-YZCU-J00Q\t25\r\n\t25" }]

// fba shipping suggestions

// qty < 1 CID
// qty / ctn = 1
// configuration / requirements
const cnfg1 = { warehouse: "all", cid: "", sku: "3H-O7DG-BSV6", qty__total_: 400 }
// output
const suggestions1 = [
  { sku: "3H-O7DG-BSV6", cid: 4, location: 'unicon', qty___ctn: 6, qty__ctns_: 67 }
]

// qty = 1 CID
// qty / ctn = 1
// configuration / requirements
const cnfg2 = { warehouse: "all", cid: "", sku: "3H-O7DG-BSV6", qty__total_: 600 }
// output
const suggestions2 = [
  { sku: "3H-O7DG-BSV6", cid: 4, location: 'unicon', qty___ctn: 6, qty__ctns_: 100 }
]

// qty > 1 CID
// qty / ctn = 1
// configuration / requirements
const cnfg3 = { warehouse: "all", cid: "", sku: "3H-O7DG-BSV6", qty__total_: 700 }
// output
const suggestions3 = [
  { sku: "3H-O7DG-BSV6", cid: 5, location: 'unicon', qty___ctn: 6, qty__ctns_: 17 },
  { sku: "3H-O7DG-BSV6", cid: 4, location: 'unicon', qty___ctn: 6, qty__ctns_: 100 }
]

// qty > 1 CID
// qty / ctn > 1
const cnfg4 = { warehouse: "all", cid: "", sku: "4A-YZCU-J00Q", qty__total_: 1000 }
// output
const suggestions4 = [
  { sku: "4A-YZCU-J00Q", cid: 2, location: 'unicon', qty___ctn: 6, qty__ctns_: 17 },
  { sku: "4A-YZCU-J00Q", cid: 1, location: 'unicon', qty___ctn: 9, qty__ctns_: 100 }
]

// qty > 1 CID
// same CID among different wh
const cnfg5 = { warehouse: "all", cid: "", sku: "4A-YZCU-J00Q", qty__total_: 700 }
// output
const suggestions5 = [
  { sku: "4A-YZCU-J00Q", cid: 2, location: 'unicon', qty___ctn: 6, qty__ctns_: 50 },
  { sku: "4A-YZCU-J00Q", cid: 2, location: 'unicon', qty___ctn: 6, qty__ctns_: 67 }
]

// qty >> 1 CID
const cnfg6 = { warehouse: "all", cid: "", sku: "3H-O7DG-BSV6", qty__total_: 1205 }
// output
const suggestions6 = [
  { sku: "3H-O7DG-BSV6", cid: 5, location: 'unicon', qty___ctn: 6, qty__ctns_: 100 },
  { sku: "3H-O7DG-BSV6", cid: 4, location: 'unicon', qty___ctn: 6, qty__ctns_: 100 }
]

const suggestions7 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "IS-OTS6-LVXE", "cid": 3, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "IS-OTS6-LVXE", "cid": 2, "location": "p2p", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "IS-OTS6-LVXE", "cid": 1, "location": "p2p", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "4A-YZCU-J00Q", "cid": 2, "location": "unicon", "qty___ctn": 6, "qty__ctns_": 100 },
  { "sku": "4A-YZCU-J00Q", "cid": 2, "location": "p2p", "qty___ctn": 6, "qty__ctns_": 50 },
  { "sku": "4A-YZCU-J00Q", "cid": 1, "location": "unicon", "qty___ctn": 9, "qty__ctns_": 300 },
  { "sku": "3H-O7DG-BSV6", "cid": 5, "location": "unicon", "qty___ctn": 6, "qty__ctns_": 100 },
  { "sku": "3H-O7DG-BSV6", "cid": 4, "location": "unicon", "qty___ctn": 6, "qty__ctns_": 100 }
]


// ASSIGNING SHIPPING IDS

// case: - 1 sku
const suggestions8 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3 }
]
const shippingIds8 = [1];

// case: - 1 skus different qty / ctn
const suggestions9 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3 },
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3 },
]
const shippingIds9 = [1, 2];

// case: - 1 sku different warehouses
const suggestions11 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3 },
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "p2p", "qty___ctn": 4, "qty__ctns_": 3 }
]
const shippingIds11 = [1, 2];

// case: - 1 sku different warehouses different quantities
const suggestions12 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3 },
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "p2p", "qty___ctn": 5, "qty__ctns_": 3 }
]
const shippingIds12 = [1, 2];

// case: - 2 skus different qty / ctn
const suggestions13 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3 },
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3 },
  { "sku": "4A-YZCU-J00Q", "cid": 2, "location": "unicon", "qty___ctn": 6, "qty__ctns_": 3 },
  { "sku": "4A-YZCU-J00Q", "cid": 2, "location": "unicon", "qty___ctn": 7, "qty__ctns_": 3 }
]
const shippingIds13 = [1, 1, 2, 2];

// case: - 2 skus different warehouses
const suggestions14 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3 },
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "p2p", "qty___ctn": 4, "qty__ctns_": 3 },
  { "sku": "4A-YZCU-J00Q", "cid": 2, "location": "unicon", "qty___ctn": 6, "qty__ctns_": 3 },
  { "sku": "4A-YZCU-J00Q", "cid": 2, "location": "p2p", "qty___ctn": 6, "qty__ctns_": 3 }
]
const shippingIds14 = [1, 1, 2, 2];

// case: - 1 sku threshold
const suggestions15 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 201 }
]
const shippingIds15 = [1, 2];

// case: - 1 shipment threshold
const suggestions16 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "4A-YZCU-J00Q", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "3H-O7DG-BSV6", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 1 }
]
const shippingIds16 = [1, 1, 2]

// Note: Can result in 2 or 3 shipments. 
// 3 if, because of threshold, "3H-O7DG-BSV6" is excluded from shipment. Since 
// it cannot combine with the other "3H-O7DG-BSV6" which has different qty / ctn.
// 2 if either "IS-OTS6-LVXE" or "IS-OTS6-LVXE" is excluded. Since it can combine with
// the other "3H-O7DG-BSV6"
// case: - 2 shipment same warehouse exceeding threshold
const suggestions17 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "4A-YZCU-J00Q", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "3H-O7DG-BSV6", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "3H-O7DG-BSV6", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 100 }
]
const shippingIds17 = [1, 1, 2, 3];

// case: - 2 shipment different warehouse exceeding threshold
const suggestions18 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100 },
  { "sku": "3H-O7DG-BSV6", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 101 },
  { "sku": "3H-O7DG-BSV6", "cid": 4, "location": "p2p", "qty___ctn": 5, "qty__ctns_": 100 },
  { "sku": "4A-YZCU-J00Q", "cid": 4, "location": "p2p", "qty___ctn": 4, "qty__ctns_": 101 }
]
const shippingIds18 = [1, 2, 3, 4];

// case: - 1 skus different qty / ctn x 2
const suggestions19 = [
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3 },
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3 },
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3 }
]
const shippingIds19 = [1, 2, 2];

// create shipping
// TODO: optional parameter testing
// case: 1 shipping 1 item
const suggestions20 = [
  { "shipping_id": 1, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3, "qty__total_": 12 }
]

const expectedRequests20 = [
  {
    "ShipFromAddress":{"Name":"","AddressLine1":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
    "LabelPrepPreference":"SELLER_LABEL",
    "InboundShipmentPlanRequestItems":[
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":12,"QuantityInCase":4,"ASIN":"B07D294G3N","Condition":"NewItem"}
    ]
  }
]

// case: 1 shipping 2 items
const suggestions21 = [
  { "shipping_id": 1, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3, "qty__total_": 12 },
  { "shipping_id": 1, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3, "qty__total_": 15 }
]

const expectedRequests21 = [
  {
    "ShipFromAddress":{"Name":"","AddressLine1":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
    "LabelPrepPreference":"SELLER_LABEL",
    "InboundShipmentPlanRequestItems":[
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":12,"QuantityInCase":4,"ASIN":"B07D294G3N","Condition":"NewItem"}, 
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":15,"QuantityInCase":5,"ASIN":"B07D294G3N","Condition":"NewItem"}
    ]
  }
]

// case: 2 shipping 1 item
const suggestions23 = [
  { "shipping_id": 1, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3, "qty__total_": 12 },
  { "shipping_id": 2, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3, "qty__total_": 15 }
]

const expectedRequests23 = [
  {
    "ShipFromAddress":{"Name":"","AddressLine1":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
    "LabelPrepPreference":"SELLER_LABEL",
    "InboundShipmentPlanRequestItems":[
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":12,"QuantityInCase":4,"ASIN":"B07D294G3N","Condition":"NewItem"}
    ]
  },
  {
    "ShipFromAddress":{"Name":"","AddressLine1":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
    "LabelPrepPreference":"SELLER_LABEL",
    "InboundShipmentPlanRequestItems":[
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":15,"QuantityInCase":5,"ASIN":"B07D294G3N","Condition":"NewItem"}
    ]
  }
]

// case: 2 shipping 2 items
const suggestions24 = [
  { "shipping_id": 1, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3, "qty__total_": 12 },
  { "shipping_id": 1, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3, "qty__total_": 15 },
  { "shipping_id": 2, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3, "qty__total_": 15 },
  { "shipping_id": 2, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3, "qty__total_": 15 }
]

const expectedRequests24 = [
  {"ShipFromAddress":{"Name":"","AddressLine1":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
  "LabelPrepPreference":"SELLER_LABEL",
  "InboundShipmentPlanRequestItems":[
    {"SellerSKU":"IS-OTS6-LVXE","Quantity":12,"QuantityInCase":4,"ASIN":"B07D294G3N","Condition":"NewItem"},
    {"SellerSKU":"IS-OTS6-LVXE","Quantity":15,"QuantityInCase":5,"ASIN":"B07D294G3N","Condition":"NewItem"}]
  },
  {
    "ShipFromAddress":{"Name":"","AddressLine1":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
    "LabelPrepPreference":"SELLER_LABEL",
    "InboundShipmentPlanRequestItems":[
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":15,"QuantityInCase":5,"ASIN":"B07D294G3N","Condition":"NewItem"},
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":15,"QuantityInCase":5,"ASIN":"B07D294G3N","Condition":"NewItem"}
    ]
  }
]

// test workflow
// payload
const suggestions26 = [
  { "shipping_id": 1, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 3, "qty__total_": 12 },
  { "shipping_id": 1, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3, "qty__total_": 15 },
  { "shipping_id": 2, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3, "qty__total_": 15 },
  { "shipping_id": 2, "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 5, "qty__ctns_": 3, "qty__total_": 15 }
]

const expectedRequests26 = [
  {"ShipFromAddress":{"Name":"","AddressLine1":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
  "LabelPrepPreference":"SELLER_LABEL",
  "InboundShipmentPlanRequestItems":[
    {"SellerSKU":"IS-OTS6-LVXE","Quantity":12,"QuantityInCase":4,"ASIN":"B07D294G3N","Condition":"NewItem"},
    {"SellerSKU":"IS-OTS6-LVXE","Quantity":15,"QuantityInCase":5,"ASIN":"B07D294G3N","Condition":"NewItem"}]
  },
  {
    "ShipFromAddress":{"Name":"","AddressLine1":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
    "LabelPrepPreference":"SELLER_LABEL",
    "InboundShipmentPlanRequestItems":[
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":15,"QuantityInCase":5,"ASIN":"B07D294G3N","Condition":"NewItem"},
      {"SellerSKU":"IS-OTS6-LVXE","Quantity":15,"QuantityInCase":5,"ASIN":"B07D294G3N","Condition":"NewItem"}
    ]
  }
]

// sync
// case: 1 plan
const responses1 = [
  {
    response : { InboundShipmentPlans : [{
      ShipmentId : "S1",
      DestinationFulfillmentCenterId : "D1",
      Items : [
        { SellerSKU : "SS1", Quantity : 5 },
        { SellerSKU : "SS2", Quantity : 5 },
        { SellerSKU : "SS3", Quantity : 5 }
      ],
      EstimatedBoxContentsFee : { TotalUnits : 15 }
    }] },
    getResponseCode : function() { return 200 },
    getContentText : function() { return JSON.stringify(this.response) }
  }
]

const suggestions27 = [
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS1",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS2",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS3",
    location : 'p2p'
  }
]

const syncWorkflow1 = [{
  ShipmentId : "S1",
  DestinationFulfillmentCenterId : "D1",
  Items : [
    {
      SellerSKU : "SS1",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS2",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS3",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    }
  ],
  EstimatedBoxContentsFee : { TotalUnits : 15 },
  shipping_id_local : 1,
  LabelPrepPreference: "SELLER_LABEL",
  ShipFromAddress : {
    types: "transfer",
    warehouses : "p2p",
    Name: "",
    AddressLine1: "",
    AddressLine2: "",
    DistrictOrCounty: "",
    City: "",
    StateOrProvinceCode: "",
    CountryCode: "",
    PostalCode: ""
  }
}]

// case: 2 plans
const responses2 = [
  {
    response : { InboundShipmentPlans : [{
      ShipmentId : "S1",
      DestinationFulfillmentCenterId : "D1",
      Items : [
        { SellerSKU : "SS1", Quantity : 5 },
        { SellerSKU : "SS2", Quantity : 5 },
        { SellerSKU : "SS3", Quantity : 5 }
      ],
      EstimatedBoxContentsFee : { TotalUnits : 15 }
    }] },
    getResponseCode : function() { return 200 },
    getContentText : function() { return JSON.stringify(this.response) }
  },
  {
    response : { InboundShipmentPlans : [{
      ShipmentId : "S2",
      DestinationFulfillmentCenterId : "D1",
      Items : [
        { SellerSKU : "SS1", Quantity : 6 }
      ],
      EstimatedBoxContentsFee : { TotalUnits : 6 }
    }] },
    getResponseCode : function() { return 200 },
    getContentText : function() { return JSON.stringify(this.response) }
  }
]

const suggestions28 = [
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS1",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS2",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS3",
    location : 'p2p'
  },
  {
    shipping_id : 2,
    qty___ctn : 6,
    sku : "SS1",
    location : 'p2p'
  },
]

const syncWorkflow2 = [
  {
  ShipmentId : "S1",
  DestinationFulfillmentCenterId : "D1",
  Items : [
    {
      SellerSKU : "SS1",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS2",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    },
    {
      SellerSKU : "SS3",
      shipping_id_amazon : "S1",
      shipping_id_local : 1,      
      destinationFulfillmentCenterId : 'D1',
      Quantity : 5,
      qty__total__planned : 5,
      qty__total___shipment : 15,
      qty___ctn : 5,
      error: ""
    }
  ],
  EstimatedBoxContentsFee : { TotalUnits : 15 },
  shipping_id_local : 1,
  LabelPrepPreference: "SELLER_LABEL",
  ShipFromAddress : {
    types: "transfer",
    warehouses : "p2p",
    Name: "",
    AddressLine1: "",
    AddressLine2: "",
    DistrictOrCounty: "",
    City: "",
    StateOrProvinceCode: "",
    CountryCode: "",
    PostalCode: ""
  }
},
{
  ShipmentId : "S2",
  DestinationFulfillmentCenterId : "D1",
  Items : [
  {
    SellerSKU : "SS1",
    shipping_id_amazon : "S2",
    shipping_id_local : 2,
    destinationFulfillmentCenterId : 'D1',
    Quantity : 6,
    qty__total__planned : 6,
    qty__total___shipment : 6,
    qty___ctn : 6,
    error: ""
  }
  ],
  EstimatedBoxContentsFee : { TotalUnits : 6 },
  shipping_id_local : 2,
  LabelPrepPreference: "SELLER_LABEL",
  ShipFromAddress : {
    types: "transfer",
    warehouses : "p2p",
    Name: "",
    AddressLine1: "",
    AddressLine2: "",
    DistrictOrCounty: "",
    City: "",
    StateOrProvinceCode: "",
    CountryCode: "",
    PostalCode: ""
  }
}
]

// case: 1 error invalid request parameters
const responses3 = [
  {
    response : undefined,
    getResponseCode : function() { return 400 },
    getContentText : function() { return JSON.stringify(this.response) }
  }
]

const suggestions29 = [
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS1",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS2",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS3",
    location : 'p2p'
  }
]

const syncWorkflow3 = [{
  error : true,
  Items : [
  {
    shipping_id_local : 1,
    SellerSKU : "SS1",
    error: "Invalid Request Parameters"
  },
  {
    shipping_id_local : 1,
    SellerSKU : "SS2",
    error: "Invalid Request Parameters"
  },
  {
    shipping_id_local : 1,
    SellerSKU : "SS3",
    error: "Invalid Request Parameters"
  }
  ]
}]

// case: 1 error unknown
const responses4 = [
  {
    response : undefined,
    getResponseCode : function() { return 500 },
    getContentText : function() { return JSON.stringify(this.response) }
  }
]

const suggestions30 = [
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS1",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS2",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS3",
    location : 'p2p'
  }
]

const syncWorkflow4 = [
  {
    error : true,
    Items : [
      {
        shipping_id_local : 1,
        SellerSKU : "SS1",
        error: "Unknown Error. Response Code: 500"
      },
      {
        shipping_id_local : 1,
        SellerSKU : "SS2",
        error: "Unknown Error. Response Code: 500"
      },
      {
        shipping_id_local : 1,
        SellerSKU : "SS3",
        error: "Unknown Error. Response Code: 500"
      }
    ]
  }
]

// case: 1 error and 1 valid
const responses5 = [
  {
    response : undefined,
    getResponseCode : function() { return 500 },
    getContentText : function() { return JSON.stringify(this.response) }
  },
  {
    response : { InboundShipmentPlans : [{
      ShipmentId : "S2",
      DestinationFulfillmentCenterId : "D1",
      Items : [
        { SellerSKU : "SS1", Quantity : 6 }
      ],
      EstimatedBoxContentsFee : { TotalUnits : 6 }
    }] },
    getResponseCode : function() { return 200 },
    getContentText : function() { return JSON.stringify(this.response) }
  }
]

const suggestions31 = [
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS1",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS2",
    location : 'p2p'
  },
  {
    shipping_id : 1,
    qty___ctn : 5,
    sku : "SS3",
    location : 'p2p'
  },
  {
    shipping_id : 2,
    qty___ctn : 5,
    sku : "SS1",
    location : 'p2p'
  },
]

const syncWorkflow5 = [{
  error : true,
  Items : [
    {
      shipping_id_local : 1,
      SellerSKU : "SS1",
      error: "Unknown Error. Response Code: 500"
    },
    {
      shipping_id_local : 1,
      SellerSKU : "SS2",
      error: "Unknown Error. Response Code: 500"
    },
    {
      shipping_id_local : 1,
      SellerSKU : "SS3",
      error: "Unknown Error. Response Code: 500"
    }
  ]
},
{
  ShipmentId : "S2",
  DestinationFulfillmentCenterId : "D1",
  Items : [
    {
      SellerSKU : "SS1",
      shipping_id_amazon : "S2",
      shipping_id_local : 2,
      destinationFulfillmentCenterId : 'D1',
      Quantity : 6,
      qty__total__planned : 6,
      qty__total___shipment : 6,
      qty___ctn : 5,
      error: ""
    }
  ],
  EstimatedBoxContentsFee : { TotalUnits : 6 },
  shipping_id_local : 2,
  LabelPrepPreference: "SELLER_LABEL",
  ShipFromAddress : {
    types: "transfer",
    warehouses : "p2p",
    Name: "",
    AddressLine1: "",
    AddressLine2: "",
    DistrictOrCounty: "",
    City: "",
    StateOrProvinceCode: "",
    CountryCode: "",
    PostalCode: ""
  }
}]

const shippingRequestSandbox1 =  {
                        "InboundShipmentHeader": {
                          "ShipmentName": "43545345",
                          "ShipFromAddress": {
                            "Name": "35435345",
                            "AddressLine1": "123 any st",
                            "DistrictOrCounty": "Washtenaw",
                            "City": "Ann Arbor",
                            "StateOrProvinceCode": "Test",
                            "CountryCode": "US",
                            "PostalCode": "48103"
                          },
                          "DestinationFulfillmentCenterId": "AEB2",
                          "AreCasesRequired": true,
                          "ShipmentStatus": "WORKING",
                          "LabelPrepPreference": "SELLER_LABEL",
                          "IntendedBoxContentsSource": "NONE"
                        },
                        "InboundShipmentItems": [
                          {
                            "ShipmentId": "345453",
                            "SellerSKU": "34534545",
                            "FulfillmentNetworkSKU": "435435435",
                            "QuantityShipped": 0,
                            "QuantityReceived": 0,
                            "QuantityInCase": 0,
                            "ReleaseDate": "2020-04-23",
                            "PrepDetailsList": [
                              {
                                "PrepInstruction": "Polybagging",
                                "PrepOwner": "AMAZON"
                              }
                            ]
                          }
                        ],
                        "MarketplaceId": "MarketplaceId"
                      }
const shippingResponseSandbox1 = {
                    "ShipmentId": "ShipmentId"
                  } 

// Basic Auth
const serializedData5 = [
  {"name":"username", "value":""},
  {"name":"password", "value":""}
]

const basicAuth1 = {
  "username" : "",
  "password" : ""
}

const stockData = [
  { "sku": "3H-O7DG-BSV6", "cid": 4, "location": "unicon", "qty___ctn": 6, "qty__ctns_": 100, "qty__total_": 600, "item": "Hanging Pot Big Matt White" },
  { "sku": "3H-O7DG-BSV6", "cid": 5, "location": "unicon", "qty___ctn": 6, "qty__ctns_": 100, "qty__total_": 600, "item": "Hanging Pot Big Matt White" },
  { "sku": "4A-YZCU-J00Q", "cid": 1, "location": "unicon", "qty___ctn": 9, "qty__ctns_": 100, "qty__total_": 900, "item": "Hanging Pot Matt Grey" },
  { "sku": "4A-YZCU-J00Q", "cid": 2, "location": "p2p", "qty___ctn": 6, "qty__ctns_": 50, "qty__total_": 300, "item": "Hanging Pot Matt Grey" },
  { "sku": "4A-YZCU-J00Q", "cid": 2, "location": "unicon", "qty___ctn": 6, "qty__ctns_": 100, "qty__total_": 600, "item": "Hanging Pot Matt Grey" },
  { "sku": "IS-OTS6-LVXE", "cid": 1, "location": "p2p", "qty___ctn": 4, "qty__ctns_": 100, "qty__total_": 400, "item": "Hanging Pot Basic Glossy White" },
  { "sku": "IS-OTS6-LVXE", "cid": 2, "location": "p2p", "qty___ctn": 4, "qty__ctns_": 100, "qty__total_": 400, "item": "Hanging Pot Basic Glossy White" },
  { "sku": "IS-OTS6-LVXE", "cid": 3, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100, "qty__total_": 400, "item": "Hanging Pot Basic Glossy White" },
  { "sku": "IS-OTS6-LVXE", "cid": 4, "location": "unicon", "qty___ctn": 4, "qty__ctns_": 100, "qty__total_": 400, "item": "Hanging Pot Basic Glossy White" },
  { "sku": "PV-G72N-WCJL", "cid": 2, "location": "unicon", "qty___ctn": 9, "qty__ctns_": 200, "qty__total_": 1800, "item": "KZ Eimer 3L Silber" },
  { "sku": "T4-BDHN-OQSC", "cid": 5, "location": "p2p", "qty___ctn": 56, "qty__ctns_": 9, "qty__total_": 504, "item": "VH X7L Black" }
]

const settingsData1 = [
  {"types":"fba","warehouses":"all","Name":"","AddressLine1":"","AddressLine2":"","DistrictOrCounty":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
  {"types":"transfer","warehouses":"p2p","Name":"","AddressLine1":"","AddressLine2":"","DistrictOrCounty":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
  {"types":"fbm","warehouses":"unicon","Name":"","AddressLine1":"","AddressLine2":"","DistrictOrCounty":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
  {"types":"storage","warehouses":"uk","Name":"","AddressLine1":"","AddressLine2":"","DistrictOrCounty":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
  {"types":"b2b","warehouses":"","Name":"","AddressLine1":"","AddressLine2":"","DistrictOrCounty":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""},
  {"types":"initial","warehouses":"","Name":"","AddressLine1":"","AddressLine2":"","DistrictOrCounty":"","City":"","StateOrProvinceCode":"","CountryCode":"","PostalCode":""}
]

const pimData1 = [
  {"sku":"IS-OTS6-LVXE","asin":"B07D294G3N","Condition":"NewItem","PrepInstruction":"PolyBagging","PrepOwner":"AMAZON"}
]

const createInboundShipmentPlanSandboxData1 = [
  {"LabelPrepPreference":"SELLER_LABEL","ShipToCountryCode":"","ShipToCountrySubdivisionCode":""}
]

const sandboxResponseData1 = {
  "InboundShipmentPlans":[
    {"ShipmentId":"ShipmentId","DestinationFulfillmentCenterId":"ABE2","ShipToAddress":{"Name":"John Doe","AddressLine1":"123 any s","AddressLine2":"","DistrictOrCounty":"Wayne","City":"Detroit",
    "StateOrProvinceCode":"MI","CountryCode":"US","PostalCode":"48110"},"LabelPrepType":"NO_LABEL","Items":[{"SellerSKU":"SellerSKU","FulfillmentNetworkSKU":"FulfillmentNetworkSKU","Quantity":10,
    "PrepDetailsList":[{"PrepInstruction":"Polybagging","PrepOwner":"AMAZON"}]}],"EstimatedBoxContentsFee":{"TotalUnits":10,"FeePerUnit":{"CurrencyCode":"USD","Value":10},
    "TotalFee":{"CurrencyCode":"USD","Value":10}}}
  ]
}

const sandboxRequestData1 = {
  "ShipFromAddress": {
    "Name": "Name",
    "AddressLine1": "123 any st",
    "AddressLine2": "AddressLine2",
    "DistrictOrCounty": "Washtenaw",
    "City": "Ann Arbor",
    "StateOrProvinceCode": "MI",
    "CountryCode": "US",
    "PostalCode": "48188"
  },
  "LabelPrepPreference": "SELLER_LABEL",
  "ShipToCountryCode": "ShipToCountryCode",
  "ShipToCountrySubdivisionCode": "ShipToCountrySubdivisionCode",
  "InboundShipmentPlanRequestItems": [
    {
      "SellerSKU": "SellerSKU",
      "ASIN": "ASIN",
      "Condition": "NewItem",
      "Quantity": 1,
      "QuantityInCase": 1,
      "PrepDetailsList": [
        {
          "PrepInstruction": "Polybagging",
          "PrepOwner": "AMAZON"
        }
      ]
    }
  ]
}

const planRequestData0 = {
  "ShipFromAddress": {"Name":"Unicon GmbH","AddressLine1":"Ludwig Erhard Str. 4","City":"Bremen","StateOrProvinceCode":"Bremen","CountryCode":"DE","PostalCode":28197},
  "LabelPrepPreference":"SELLER_LABEL",
  "InboundShipmentPlanRequestItems":
  [
    {"SellerSKU":"3H-O7DG-BSV6","Quantity":24,"QuantityInCase":6,"ASIN":"B07TVJZZRP","Condition":"NewItem"},
    {"SellerSKU":"4A-YZCU-J00Q","Quantity":27,"QuantityInCase":9,"ASIN":"B07TWMWFJL","Condition":"NewItem"},
    {"SellerSKU":"IS-OTS6-LVXE","Quantity":20,"QuantityInCase":4,"ASIN":"B07D294G3N","Condition":"NewItem"},
    {"SellerSKU":"PV-G72N-WCJL","Quantity":27,"QuantityInCase":9,"ASIN":"B07KPLZ9G8","Condition":"NewItem"}
  ]
}

const planRequestData1 = {
  "ShipFromAddress": {"Name":"Unicon GmbH","AddressLine1":"Ludwig Erhard Str. 4","City":"Bremen","StateOrProvinceCode":"Bremen","CountryCode":"DE","PostalCode":28197},
  "LabelPrepPreference":"SELLER_LABEL",
  "InboundShipmentPlanRequestItems":
  [
    {"SellerSKU":"3H-O7DG-BSV","Quantity":24,"QuantityInCase":6,"ASIN":"B07TVJZZRP","Condition":"NewItem"}
  ]
}

const planRequestData2 = {
  "ShipFromAddress": {"Name":"Unicon GmbH","AddressLine1":"Ludwig Erhard Str. 4","City":"Bremen","StateOrProvinceCode":"Bremen","CountryCode":"DE","PostalCode":28197},
  "LabelPrepPreference":"SELLER_LABEL",
  "InboundShipmentPlanRequestItems":
  [
    {"SellerSKU":"3H-O7DG-BSV6","Quantity":24783274823492349234,"QuantityInCase":6,"ASIN":"B07TVJZZRP","Condition":"NewItem"}
  ]
}

const planRequestData2b = {
  "ShipFromAddress": {"Name":"Unicon GmbH","AddressLine1":"Ludwig Erhard Str. 4","City":"Bremen","StateOrProvinceCode":"Bremen","CountryCode":"DE","PostalCode":28197},
  "LabelPrepPreference":"SELLER_LABEL",
  "InboundShipmentPlanRequestItems":
  [
    {"SellerSKU":"3H-O7DG-BSV6","Quantity":0,"QuantityInCase":6,"ASIN":"B07TVJZZRP","Condition":"NewItem"}
  ]
}

const planRequestData3 = {
  "ShipFromAddress": {"Name":"Unicon GmbH","AddressLine1":"Ludwig Erhard Str. 4","City":"Bremen","StateOrProvinceCode":"Bremen","CountryCode":"DE","PostalCode":28197},
  "LabelPrepPreference":"SELLER_LABEL",
  "InboundShipmentPlanRequestItems":
  [
    {"SellerSKU":"3H-O7DG-BSV6","Quantity":24,"QuantityInCase":6,"ASIN":"07TVJZZRP","Condition":"NewItem"}
  ]
}

const planRequestData4 = {
  "ShipFromAddress": {"Name":"Unicon GmbH","AddressLine1":"Ludwig Erhard Str. 4","City":"Bremen","StateOrProvinceCode":"Bremen","CountryCode":"DE","PostalCode":28197},
  "LabelPrepPreference":"SELLER_LABEL",
  "InboundShipmentPlanRequestItems":
  [
    {"SellerSKU":"3H-O7DG-BSV6","Quantity":24,"QuantityInCase":6,"ASIN":"B07TVJZZRP","Condition":"ewItem"}
  ]
}

const planRequestData5 = {
  "ShipFromAddress": {"Name":"Unicon GmbH","AddressLine1":"Ludwig Erhard Str. 4","City":"Bremen","StateOrProvinceCode":"Bremen","CountryCode":"DE","PostalCode":28197},
  "LabelPrepPreference":"ELLER_LABEL",
  "InboundShipmentPlanRequestItems":
  [
    {"SellerSKU":"3H-O7DG-BSV6","Quantity":24,"QuantityInCase":6,"ASIN":"B07TVJZZRP","Condition":"NewItem"}
  ]
}

const planRequestData6 = {
  "ShipFromAddress": {"Name":"Unicon GmbH","AddressLine1":"Ludwig Erhard Str. 4","City":"Bremen","StateOrProvinceCode":"Bremen","CountryCode":"DE","PostalCode":28197},
  "InboundShipmentPlanRequestItems":
  [
    {"SellerSKU":"3H-O7DG-BSV6","Quantity":24,"QuantityInCase":6,"ASIN":"B07TVJZZRP","Condition":"NewItem"}
  ]
}

// AttachCreateShippingPlanAPIFields
const suggestions25 = [{ sku : "3H-O7DG-BSV6", location : "unicon" }]
const expectedSuggestions25 = [{ 
  sku : "3H-O7DG-BSV6", 
  location : "unicon",
  "ASIN" : "B07TVJZZRP",
  "Condition" : "NewItem",
  "ShipFromAddress.Name" : "Unicon GmbH",
  "ShipFromAddress.AddressLine1" : "Ludwig Erhard Str. 4",
  "ShipFromAddress.City" : "Bremen",
  "ShipFromAddress.StateOrProvinceCode" : "Bremen",
  "ShipFromAddress.CountryCode" : "DE",
  "ShipFromAddress.PostalCode" : 28197,
  "LabelPrepPreference" : "SELLER_LABEL"
}]

// Helper flatten and unflatten

// Helper make unique
const data2 = ["a", "b", "a", "c", "c"]
const expectedData2 = ["a", "b", "a_1", "c", "c_2"]

// BatchRequest

const singleRow1_ = {
  sid: 1,
  type: 'b2b'
}

// adding
const singleRow2_ = {
  sid: 2,
  type: 'b2b'
}

// with date
const singleRow3_ = {
  sid: 3,
  type: 'b2b',
  date: new Date()
}

const singleRow4_ = {
  sid: 4,
  type: 'b2c',
  date: new Date()
}

const singleRow5_ = {
  sid: 5,
  type: 'b2c'
}

// adding
const singleRow6_ = {
  sid: 6,
  type: 'b2c'
}

// with date
const singleRow7_ = {
  sid: 7,
  type: 'b2b',
  date: new Date()
}

const singleRow8_ = {
  sid: 8,
  type: 'b2b',
  date: new Date()
}

/**
 * Test Table instances
 */
const setTestTables = () => {
  if (this.SCHEMAS === undefined) setSchemas()

  // test tables sheet
  // const testingTablesSheet = getSheetById(CONFIG.SS, 944181883)
  this.testingTablesSheet = getSheetById(CONFIG.SS, 944181883)

  // this.SameHeader = new WritableTable({
  //   // table params
  //   table: {
  //     name: 'SameHeader',
  //     groupRow: false
  //   }

  //   // model schema
  //   , model: SCHEMAS.SameHeader

  //   // sheet
  //   , sheet: this.testingTablesSheet
  // })

  this.TABLE_UIDs = new WritableTable({
    // table params
    table: {
      name: 'Test_UIDs',
      groupRow: false
    }

    // model schema
    , model: SCHEMAS.TABLE_UIDs

    // sheet
    , sheet: this.testingTablesSheet
  })

  this.TABLE_1 = new WritableTable({
    // table params
    table: {
      name: 'Table 1',
      groupRow: false
    }

    // model schema
    , model: SCHEMAS.TABLE_1

    // sheet
    , sheet: this.testingTablesSheet
  })

  this.TABLE_2 = new WritableTable({
    // table params
    table: {
      name: 'Table 2',
      groupRow: false
    }

    // model schema
    , model: SCHEMAS.TABLE_2

    // sheet
    , sheet: this.testingTablesSheet
  })

  this.TABLE_3 = new WritableTable({
    // table params
    table: {
      name: 'Table 3',
      groupRow: true
    }

    // model schema
    , model: SCHEMAS.TABLE_3

    // sheet
    , sheet: this.testingTablesSheet
  })

  this.TABLE_4 = new WritableTable({
    // table params
    table: {
      name: 'Table 4',
      groupRow: false
    }

    // model schema
    , model: SCHEMAS.TABLE_4

    // sheet
    , sheet: this.testingTablesSheet
  })

  this.PlaceholderTable_ = new WritableTable({
    // table params
    table: {
      name: 'Placeholder',
      groupRow: false,
      isLastRowTemplate: true
    }

    // model params
    , model: SCHEMAS.Placeholder

    // sheet
    , sheet: this.testingTablesSheet
  })

  this.TABLE_5 = new WritableTable({
    // table params
    table: {
      name: 'Table 5',
      groupRow: false
    }

    // model schema
    , model: SCHEMAS.TABLE_5

    // sheet
    , sheet: this.testingTablesSheet
  })

  this.BatchRequestModel = new WritableTable({
    // table params
    table: {
      name: 'BatchRequestModel',
      groupRow: false
    }

    // model schema
    , model: SCHEMAS.BatchRequestModel

    // sheet
    , sheet: this.testingTablesSheet
  })

  this.TABLE_1.next = this.TABLE_2
  this.TABLE_2.next = this.TABLE_3
  this.TABLE_3.next = this.TABLE_4
  this.TABLE_4.next = this.TABLE_UIDs
  this.TABLE_UIDs.next = this.PlaceholderTable_
  this.PlaceholderTable_.next = this.TABLE_5
  this.TABLE_5.next = this.BatchRequestModel
}

setTestTables.bind(this)

setupSchemasTest = () => {
  return {
    params: [
      // schema name
      'name',
      // props
      'header',
      'uniqueId',
      'autoIncrease'
    ],
    schemas: CONFIG.SS.getSheetByName('SCHEMAS v2').getDataRange().getValues(),
    schemaCollection: {}
  }
}

const setupISWT1Test = () => {
  // Inbound Shipment Workflow Transition 1
  this.ISWT1 = new WritableTable({
    // table params
    table : {
      name : 'Transition 1',
      groupRow : true,
      isLastRowTemplate : true
    }

    // model schema
    , model : new BypassStrictSchemaCheck({      
        shipping_id : "shipping id",
        sku :	"sku",
        qty___ctn : "qty / ctn",
        qty__total_ :	"qty (total)",
        qty__total__required :	"qty (total) required",
        p2p :	"p2p",
        unicon :	"unicon",
        uk : "uk",
        state :	"state",
        qty__total__planned :	"qty (total) planned",
        qty__total___shipment :	"qty (total) / shipment",
        error :	"error"
      })

    // sheet
    , sheet : getSheetById(CONFIG.SS, 1566128718)
  })
}

const setupStateManagerTest = () => {
  PropertiesService.getScriptProperties().deleteAllProperties()
  this.SM = new StateManager("Transition 1", PropertiesService.getScriptProperties())
}

const setupCreateShippingPlanTest = () => {

  // setting up tables
  setupSettings()
  
  setupISWT1Test()

  setupStateManagerTest()

  this.PIM = new WritableTable({
    // table params
    table : {
      name : 'PIM',
      groupRow : true      
    }

    // model schema
    , model : new Model(SCHEMAS.PIM)

    // sheet
    , sheet : getSheetById(CONFIG.SS, 1545081712)
  })

  this.CreateInboundShipmentPlan = new WritableTable({
    // table params
    table : {
      name : 'createInboundShipmentPlan',
      groupRow : false
    }

    // model schema
    , model : new Model(SCHEMAS.createInboundShipmentPlan)

    // sheet
    , sheet : getSheetById(CONFIG.SS, 10575334)
  })

  // setting up API
  setupAPI()

  this.API.updateOption = {
    method : "post",
    url : `${this.API.baseURL}/sp-api/createInboundShipmentPlanSandbox`
  }     
}

const setupCreateShippingTest = () => {
  if(this.SCHEMAS === undefined) setSchemas()

  // setting up API
  setupAPIShipping()

  this.API.updateOption = {
    method : "post",
    url : `${this.API.baseURL}/sp-api/createInboundShipmentSandbox`
  } 

  setupISWT1Test()
  setupStateManagerTest()
  setupSettings()

  this.PropertiesStore = new ScriptProperties(PropertiesService.getDocumentProperties())

    // Inbound Shipment Workflow Transition 1
  this.ISWT2 = new WritableTable({
    // table params
    table : {
      name : 'Transition 2',
      groupRow : true,
      isLastRowTemplate : true
    }

    // model schema
    , model : new BypassStrictSchemaCheck({      
        shipping_id : "shipping id",
        sku :	"sku",
        qty__total_ :	"qty (total)",
        qty__total___shipment :	"qty (total) / shipment",
        state : "state",
        shipping_id_amazon : "shipping id amazon",
        error :	"error"
      })

    // sheet
    , sheet : ISWT1.sheet
  })

  this.ISWT1.next = ISWT2

  this.CreateInboundShipment = new WritableTable({
    // table params
    table : {
      name : 'createInboundShipment',
      groupRow : false
    }

    // model schema
    , model : new Model(SCHEMAS.createInboundShipment)

    // sheet
    , sheet : getSheetById(CONFIG.SS, 10575334)
  })
}
