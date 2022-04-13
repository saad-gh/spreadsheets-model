function usage() {
// minmum parameters required for instantiating model
const Records = new WritableTable({

// table name
table: "Records"

// table schema
, model: {
    rid: { header: "rid", uniqueId: true, autoIncrease: true },
    type: "type",
    qty_ctn: "qty / ctn",
    cid: "cid",
    location: "location",
    sku: "sku",
    item: "item"
}

, sheet: SpreadsheetApp.getActive().getSheets().filter(sheet => sheet.getSheetId() === 1368755867)[0]
})

const model = Records.model

// GETTING ALL OBJECTS
console.log("Get All Values: ", model.all().value);

// GETTING SINGLE OBJECTS
console.log("Get row with unique ID: ", model.get(1).value);
console.log("Get row with unique ID combination: ", model.get({ rid: 1, cid: 'C19' }).value);

// FILTERING AND SORTING
console.log("Get mutliple rows: ", model.filter({ cid: 'C17' }).value);
console.log("Get mutliple rows base on value combination: ", model.filter({ cid: 'C19', qty_ctn: 6 }).value);
console.log("Get mutliple rows, sorted by value: ", model.filter({ cid: 'C17' }).sortBy('sku').value);
console.log("Get all rows, sorted by value: ", model.all().sortBy('cid').value);
console.log("Sort by multiple keys: ", model.all().sortBy('cid').sortBy('qty_ctn').value)

// UPDATING
console.log('Update single row: ', model.get(1).set({ cid: 'C50' }).table.write())
console.log('Update single row multiple value(s): ', model.get(1).set({ type: 'b2b', location: 'p2p' }).table.write())
console.log('Update multiple rows: ', model.filter({ cid: 'C17' }).set({ type: 'fba', location: 'p2p' }).table.write())
console.log('Get all rows, sort, and write: ', model.all().sortBy('cid').table.write())
console.log('Get filered rows, sort, and write: ', model.filter({ cid: 'C17' }).sortBy('location').table.write())

// ADDING
console.log('Preparing data for adding')
const row1 = {
type: 'fba shipment',
cid: 'C12',
location: 'unicon',
sku: 'PV-G72N-WCJL',
qty_ctn: 12
}

const row2 = {
type: 'b2b',
cid: 'C13',
location: 'p2p',
sku: 'IS-OTS6-LVXE',
qty_ctn: -36,
}
console.log('Add below specific row, using unique Id auto increase: ', model.get(1).addBelow([row1, row2]).table.write())
console.log('Add above specific row: ', model.get(5).addAbove([row1, row2]).table.write())
console.log('Add at table start: ', model.addFirst(row1).table.write())
console.log('Add at table end: ', model.addLast([row1, row2]).table.write())
console.log('Added stuff can be sorted too: ', model.get(1).addAbove([row1, row2]).sortBy('cid').table.write())

// DELETING
console.log('Delete single object: ', model.get(5).table.del())
console.log('Delete single object: ', model.filter({ cid: 'C17' }).table.del())

// UTILS
console.log("Check if included in entire table: ", model.has({ rid: 1 }));
console.log("Check Size of filtered rows: ", model.filter({ cid: 'C16' }).size);

// BATCH REQUESTS
// Requires Sheets Api enabled from advanced services
console.log('Preparing batch requests')
console.log(model.all().value)
requests = []
requests.push(model.get(1).addBelow([row1, row2]).table.batchRequests())
requests.push(model.get(1).set({ cid: 'C50' }).table.batchRequests())
requests.push(model.all().sortBy('cid').table.batchRequests())
console.log("Batch request: ", model.table.batchRequestsExecute(requests))

  // End of usage show
  const data = [{
    type: 'initial',
    cid: 'C19',
    location: 'unicon',
    sku: 'PV-G72N-WCJL',
    item: 'KZ Eimer 3L Silber',
    qty_ctn: 9,
  },
  {
    type: 'fba',
    cid: 'C17',
    location: 'p2p',
    sku: 'T4-BDHN-OQSC',
    item: 'VH X7L Black',
    qty_ctn: 6,
  },
  {
    type: 'initial',
    cid: 'C17',
    location: 'p2p',
    sku: '4A-YZCU-J00Q',
    item: 'Hanging Pot Matt Grey',
    qty_ctn: 6,
  },
  {
    type: 'initial',
    cid: 'C17',
    location: 'unicon',
    sku: 'IS-OTS6-LVXE',
    item: 'Hanging Pot Basic Glossy White',
    qty_ctn: 6,
  },
  {
    type: 'initial',
    cid: 'C17',
    location: 'unicon',
    sku: 'IS-OTS6-LVXE',
    item: 'Hanging Pot Basic Glossy White',
    qty_ctn: 4,
  },
  {
    type: 'initial',
    cid: 'C17',
    location: 'p2p',
    sku: 'IS-OTS6-LVXE',
    item: 'Hanging Pot Basic Glossy White',
    qty_ctn: 4,
  },
  {
    type: 'initial',
    cid: 'C21',
    location: 'p2p',
    sku: 'IS-OTS6-LVXE',
    item: 'Hanging Pot Basic Glossy White',
    qty_ctn: 4,
  },
  {
    type: 'initial',
    cid: 'C16',
    location: 'unicon',
    sku: 'PV-G72N-WCJL',
    item: 'KZ Eimer 3L Silber',
    qty_ctn: 9
  },
  {
    type: 'initial',
    cid: 'C22',
    location: 'unicon',
    sku: '4A-YZCU-J00Q',
    item: 'Hanging Pot Matt Grey',
    qty_ctn: 9,
  },
  {
    type: 'initial',
    cid: 'C16',
    location: 'unicon',
    sku: '4A-YZCU-J00Q',
    item: 'Hanging Pot Matt Grey',
    qty_ctn: 6,
  },
  {
    type: 'initial',
    cid: 'C22',
    location: 'unicon',
    sku: '3H-O7DG-BSV6',
    item: 'Hanging Pot Big Matt White',
    qty_ctn: 6,
  },
  {
    type: 'initial',
    cid: 'C21',
    location: 'p2p',
    sku: 'T4-BDHN-OQSC',
    item: 'VH X7L Black',
    qty_ctn: 56,
  },
  {
    type: 'initial',
    cid: 5,
    location: 'unicon',
    sku: '3H-O7DG-BSV6',
    item: 'Hanging Pot Big Matt White',
    qty_ctn: 6,
  }]

  model.table.clearTable()
  model.addFirst(data).table.write()
}