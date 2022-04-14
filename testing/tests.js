function test_StateDataManager(){
  const transitions = [
    { name: 'melt',     from: 'solid',  to: 'liquid' },
    { name: 'freeze',   from: 'liquid', to: 'solid'  },
    { name: 'vaporize', from: 'liquid', to: 'gas'    },
    { name: 'condense', from: 'gas',    to: 'liquid' },
    { name: 'goto', from: '*', to: function(s){ return s } }
  ];

  console.log(PropertiesService.getScriptProperties().getProperties()); 
  
  const SDM = new FbaStateDataManager({
    storageManager : new StorageManager(PropertiesService.getScriptProperties()),
    transitions : transitions
  })

  const onMelt = () => {
    const data = "melting"
    SDM.transition({      

        name : "melt",
        data : data

     })
  }

  const onFreeze = () => {
    const data = "freezing"
    SDM.transition({  

        name : "freeze",
        data : data

     })
  }

  const onVaporize = () => {
    const data = "vapourizing"
    SDM.transition({      

        name : "vaporize",
        data : data

     })
  }

  const onCondense = () => {
    const data = "condensing"
    SDM.transition({      

        name : "condense",
        data : data

     })
  }

  var fsm = new StateMachine({
    init: 'solid',
    transitions: transitions,
    methods: {
      onMelt:     onMelt,
      onFreeze:   onFreeze,
      onVaporize: onVaporize,
      onCondense: onCondense
    }
  });

  const current = SDM.current()
  if(current !== undefined) fsm.goto(transitions.filter(t => t.name === current)[0].to)
  fsm.condense()

}

function test_loader(){
  const [TestTablesSheet] = loader([944181883])
  const ph = TestTablesSheet.table('Placeholder')
  ph.model.addFirst({ qty_per_ctn : 6, qty_ctns : 6 })
  ph.commit()
}

function test_readme(){
  const st = new SheetTables(1804062973)

  // st.insert({
  //     // table name
  //     name : "Records",
  //     headers : ["id", "item", "description", "qty"]
  // })

  // st.insert({
  //     // table name
  //     name : "Team",
  //     headers : ["id", "name", "role" ]
  // })

  const models = st.models
  // // add data to table top
  // models['Team'].addFirst({ id : 1,  name : "Saad", role : "developer" })
  // models['Team'].addLast({ id : 2,  name : "Saad", role : "developer" })

  // models['Team'].get({ id : 2 }).addBelow({ id : 3,  name : "Saad", role : "developer" })
  // models['Team'].get({ id : 2 }).addAbove({ id : 4,  name : "Saad", role : "developer" })

  // // add methods also accept multiple row objects for example
  // models['Team'].addLast([
  //   { id : 5,  name : "Saad", role : "developer"} ,
  //   { id : 6,  name : "Saad", role : "developer"} ,
  //   { id : 7,  name : "Saad", role : "developer"} 
  // ])

  // // write to table
  // models['Team'].table.commit()
  
  // set model to point at all values
  models['Team'].all()
  // get values
  let values = models['Team'].value

  // - filter functions return false if data is not found otherwise returns model object
  // - values are then accessed with model's 'value' property
  models['Team'].filter({ name : "Saad", id : 3 })
  values = models['Team'].value

  // other filter functions
  models['Team'].or({ name : "Saad", id : 3 })
  models['Team'].and({ name : "Saad", id : 3 })
  models['Team'].not({ name : "Saad", id : 3 })
  models['Team'].nand({ name : "Saad", id : 3 }) // NAND logic
  models['Team'].nor({ name : "Saad", id : 3 }) // NOR logic
  models['Team'].greater({ id : 3 })
  models['Team'].less({ id : 3 })

  // 'and', 'or', 'not', 'nand' and 'nor' filter functions can also take arrays for example
  // the expression below translates to: name = 'Saad' or (id = 3 or id = 4)
  models['Team'].or({ name : "Saad", id : [3, 4] })
  // similary the expression below translates to: name = 'Saad' and (id = 3 or id = 4)
  models['Team'].and({ name : "Saad", id : [3, 4] })

  // 'greater' and 'less' functions take a second argument 'equal' of type 'bool'
  // to differentiate between operators '>' and '>=' and '<' and '<=' for example
  // the below expression translates to: id >= 3
  models['Team'].greater({ id : 3 }, true)
  
}

function test_delete_table(){
  const st = new SheetTables(1804062973)
  st.del("Team")
  st.del("Records")
}

function test_json_to_json(){
  // allowed json structure
  const json = {
    "key1" : "tableKey_1",
    "key3" : "tableKey_3",
    "key2" : [
      { "key1" : "tableKey_1","key2" : [{ "key1" : "tableKey_1"}] },
      { "key1" : "tableKey_2","key2" : [{ "key1" : "tableKey_2"}] },
      { "key1" : "tableKey_3","key2" : [{ "key1" : "tableKey_3"}, { "key1" : "tableKey_4"}] }
    ],
    "key5" : { "key1" : "taleKey_1", "key2" : { "key1" : "tableKey_5" } },
    "key6" : { "key1" : "tableKey_1", "key2":"tableKey_2" },
    "key7" : { "key1" : "tableKey_1", "key2" : { "key1" : "tableKey_1" } },
  }

  const directive = {
    "key2" : { "key1" : (value) => value === "tableKey_2" }
  }

  const expected = {

    root : [{ "key1" : "tableKey_1", "key3" : "tableKey_3" }],

    $key2 : [
      { "key1" : "tableKey_1" },
      { "key1" : "tableKey_2" },
      { "key1" : "tableKey_3" }
    ],

    $key2_$key2 : [
      { "key1" : "tableKey_1"},
      { "key1" : "tableKey_2"},
      { "key1" : "tableKey_3"},
      { "key1" : "tableKey_4"}
    ],

    $key5_$key2 : [{"key1" : "tableKey_5"}],
    
  }

  const model = jsonToModel(json)

  const results = {

    root : model.all().value,

    $key2 : model.$key2.all().value,

    $key2_$key2 : model.$key2.$key2.all().value,

    $key5_$key2 : model.$key5.$key2.all().value,

  }

  for(let key in results){
    log("result")
    log(results[key])
    log("expected")
    log(expected[key])
    log(JSON.stringify(results[key]) === JSON.stringify(expected[key]))
  }

}

function test_join(){
  let d1 = [
    { a : "b", b : 2 },
    { a : "a", b : 1 }
  ]

  let d2 = [
    { c : "b", d : 2 },
    { c : "a", d : 1 },
    { c : "b", d : 2 },
    { c : "a", d : 1 },
    { c : "b", d : 2 },
    { c : "a", d : 1 }
  ]

  // one to many
  log(join(d1, d2, { d1 : "a", d2 : "c" }))
  log(join(d1, d2, { d1 : "b", d2 : "d" }))

  // many to one
  log(join(d2, d1, { d2 : "c", d1 : "a" }))

  let d3 = [
    { c : "b", d : 2 },
    { c : "a", d : 1 },
    { c : "b", d : 2 },
    { c : "a", d : 1 }
  ]

  // many to many
  log(join(d2, d3, { d2 : "c", d3 : "c" }))
  log(join(d3, d2, { d3 : "c", d2 : "c" }))  

}

function test_directive3(){

  const sheetTables = new SheetTables(944181883)
  const models = sheetTables.asModels

  const directives = {
    "key1" : { key : "tableKey_1", model : 'directive test 1' },
    "key3" : "tableKey_3",
    "key2" : { 
      "key1" : { key : "tableKey_1", model : 'directive test 2', many : true, operation : (data) => { data["key2"].forEach(item => item["key2"] = data["key1"]) } }, 
      "key2" : { "key1" : { key : "tableKey_1", model : 'directive test 3', many : true }, "key2" : "tableKey_2" } 
    },
    "key4" : { key : "tableKey_4", model : 'directive test 1', array : true },
    "key5" : { "key1" : { key : "tableKey_1", model : 'directive test 1' }, "key2" : { "key1" : "tableKey_1" } } ,
    "key6" : { "key1" : { key : "tableKey_1", model : 'directive test 1', "key2":"tableKey_2" } },
    "key7" : { "key1" : "tableKey_1", "key2" : { "key1" : "tableKey_1" } },
  }

  const data = {
    "key1" : "tableKey_1",
    "key3" : "tableKey_3",
    "key2" : [
      { "key1" : "tableKey_1","key2" : [{ "key1" : "tableKey_1"}] },
      { "key1" : "tableKey_1","key2" : [{ "key1" : "tableKey_1"}] },
      { "key1" : "tableKey_1","key2" : [{ "key1" : "tableKey_1"}, { "key1" : "tableKey_1"}] }
    ],
    "key4" : [1,2,3,4],
    "key5" : { "key1" : "taleKey_1", "key2" : { "key1" : "tableKey_1" } },
    "key6" : { "key1" : "tableKey_1", "key2":"tableKey_2" },
    "key7" : { "key1" : "tableKey_1", "key2" : { "key1" : "tableKey_1" } },
  }

  const directiveInterpreter = new DirectiveInterpreter(directives, models)
  directiveInterpreter.json = data

  sheetTables.commit()  
}

function test_directive2(){

  const sheetTables = new SheetTables(944181883)
  const models = sheetTables.asModels

  const directives = {
    // "key1" : { key : "tableKey_1", filter : (models) => models['directive test 1'].all() },
    "key3" : "tableKey_3",
    "key2" : { "key1" : { key : "tableKey_1", filter : (models) => models['directive test 2'].all(), many : true }, 
      "key2" : { "key1" : { key : "tableKey_1", filter : (models) => models['directive test 3'].all(), many : true }
      } 
    },
    // "key4" : { key : "tableKey_4", filter : (models) => models['directive test 1'].all(), operation : (values) => values.map(row => row['tableKey_4']) },
    "key5" : { "key1" : { key : "tableKey_1", filter : (models) => models['directive test 1'].all() }, "key2" : { "key1" : "tableKey_1" } },
    "key6" : { "key1" : { key : "tableKey_1", filter : (models) => models['directive test 1'].all() }, "key2":"tableKey_2" },
    "key7" : { "key1" : "tableKey_1", "key2" : { "key1" : "tableKey_1" } },
  }

  // const directives = {
  //   "key1" : { key : "tableKey_1", filter : (models) => models['directive test 1'].all() },
  //   "key3" : "tableKey_3",
  //   "key2" : { "key1" : { key : "tableKey_1", filter : (models) => models['directive test 2'].all(), many : true }, 
  //     "key2" : { "key1" : { key : "tableKey_1", filter : (models) => models['directive test 3'].all(), many : true }
  //     } 
  //   },
  //   "key4" : { key : "tableKey_4", filter : (models) => models['directive test 1'].all(), operation : (values) => values.map(row => row['tableKey_4']) },
  //   "key5" : { "key1" : { key : "tableKey_1", filter : (models) => models['directive test 1'].all() }, "key2" : { "key1" : "tableKey_1" } },
  //   "key6" : { "key1" : { key : "tableKey_1", filter : (models) => models['directive test 1'].all() }, "key2":"tableKey_2" },
  //   "key7" : { "key1" : "tableKey_1", "key2" : { "key1" : "tableKey_1" } },
  // }

  const directiveInterpreter = new DirectiveInterpreter(directives, models)
  const json = directiveInterpreter.json

  log(JSON.stringify(json))  
}

function test_directive1(){
  const map = {
    "key1" : "table1.key1",
    "key3" : "table1.key3",
    "key2" : [{ "key1" : "table2.key1", "key2" : [{ "key1" : "table3.key1" }] }],
    "key4" : "table1.key2"
  }

  const data1 = {
    "key1" : "x1",
    "key2" : [
      { "key1" : "xx1", "key2" : [{ "key1" : "xxx1" }] },
      { "key1" : "xx2", "key2" : [{ "key1" : "xxx1", "key2" : "yyy1", "key3" : { "key1" : "xxxx1" } }, { "key1" : "xxx2" }] },
    ],
    "key3" : "x2",
    "key4" : [1,2,3,4]
  }

  const result = mapper(map, data1)

  log(result)

  log(rows(result, 0))

  const expected = [
    { "data" : "", "directive" : "" }
  ]
}

function test_sheetTables_commit(){
    // dummy data
  const rows = [{ a : 1, b : 'abc' }, { a : 2, b : 'def' }, { a : 3, b : 'ghi' }]

  // initialize test tables
  const sheetTables = new SheetTables(944181883)
  const table = sheetTables.tables['batchrequests']

  // execute addFirst
  table.model.addFirst(rows)

  // checking integrity of table below
  const table_2 = sheetTables.tables['batchrequests_2']
  table_2.model.addFirst(rows)

  sheetTables.commit()
  // test
  SpreadsheetApp.flush()
  committed = table_2.getWrittenData(true)

  const test = new GasTap()
  test('checking integrity of table below', function(t){
    t.partialDeepEqual(rows, committed, 'checking data')
  })

}

function test_batchrequests_formula_1(){
  const cases = [
    "=$A$1", 
    "=A1", 
    "=$A1", 
    "=A$1", 
    "=$A1:B$1", 
    "=1:1", 
    "=Sheet1!1:1", 
    "=Sheet1!$A1:B$1", 
    "=Sheet1!A$1",
    '=IF(AND($C6 <> ""; NOT(ISBLANK(B$6))); IF(SUM(FILTER($F$6:$F$7;$C$6:$C$7 = $C6)) < $G6; 1; IF($E6 = 0; 1; 0)); 0)',
    // "=$A$111", "=A111", "=$A111", "=A$111", "=$A111:B$111", 
    // "=111:111", 
    "=Sheet1!111:111", 
    "=Sheet1!$A111:B$111", 
    "=Sheet1!A$111",
    // '=IF(AND($C111 <> ""; NOT(ISBLANK(B$111))); IF(SUM(FILTER($F$111:$F$112;$C$111:$C$112 = $C111)) < $G111; 1; IF($E111 = 0; 1; 0)); 0)',

    // // if string literals have addresses they shouldn't be affected
    // '=IF(AND($C111 <> "A1 $A1 $A1:B$1";$C111 <> "Sheet1!1:1";$C111 <> "Sheet1!$A1:B$1"); 1 , 0)'
  ]

  const expectedAdd = [
    '=$A$16',
    '=A16',
    '=$A16',
    '=A$16',
    '=$A16:B$16',
    '=16:16',
    '=Sheet1!1:1',
    '=Sheet1!$A1:B$1',
    '=Sheet1!A$1',
    '=IF(AND($C26 <> ""; NOT(ISBLANK(B$26))); IF(SUM(FILTER($F$26:$F$27;$C$26:$C$27 = $C26)) < $G26; 1; IF($E26 = 0; 1; 0)); 0)',
    // '=$A$126',
    // '=A126',
    // '=$A126',
    // '=A$126',
    // '=$A126:B$126',
    // '=126:126',
    '=Sheet1!111:111',
    '=Sheet1!$A111:B$111',
    '=Sheet1!A$111',
    // '=IF(AND($C126 <> ""; NOT(ISBLANK(B$126))); IF(SUM(FILTER($F$126:$F$127;$C$126:$C$127 = $C126)) < $G126; 1; IF($E126 = 0; 1; 0)); 0)',
    // '=IF(AND($C126 <> "A1 $A1 $A1:B$1";$C126 <> "Sheet1!1:1";$C126 <> "Sheet1!$A1:B$1"); 1 , 0)' 
    ]

  let results = cases.map(_case => updateRowReference(_case, 15, 1, 5, 5))

  console.log('Test Add')
  console.log(results.every((result, i) => result === expectedAdd[i]))
}

function test_batchrequests_formula(){
  const cases = [
    "=$A$1", 
    "=A1", 
    "=$A1", 
    "=A$1", 
    "=$A1:B$1", 
    "=1:1", 
    "=Sheet1!1:1", 
    "=Sheet1!$A1:B$1", 
    "=Sheet1!A$1",
    '=IF(AND($C6 <> ""; NOT(ISBLANK(B$6))); IF(SUM(FILTER($F$6:$F$7;$C$6:$C$7 = $C6)) < $G6; 1; IF($E6 = 0; 1; 0)); 0)',
    "=$A$111", "=A111", "=$A111", "=A$111", "=$A111:B$111", 
    "=111:111", 
    "=Sheet1!111:111", 
    "=Sheet1!$A111:B$111", 
    "=Sheet1!A$111",
    '=IF(AND($C111 <> ""; NOT(ISBLANK(B$111))); IF(SUM(FILTER($F$111:$F$112;$C$111:$C$112 = $C111)) < $G111; 1; IF($E111 = 0; 1; 0)); 0)',

    // if string literals have addresses they shouldn't be affected
    '=IF(AND($C111 <> "A1 $A1 $A1:B$1";$C111 <> "Sheet1!1:1";$C111 <> "Sheet1!$A1:B$1"); 1 , 0)'
  ]

  const expectedAdd = [
    '=$A$16',
    '=A16',
    '=$A16',
    '=A$16',
    '=$A16:B$16',
    '=16:16',
    '=Sheet1!16:16',
    '=Sheet1!$A16:B$16',
    '=Sheet1!A$16',
    '=IF(AND($C21 <> ""; NOT(ISBLANK(B$21))); IF(SUM(FILTER($F$21:$F$22;$C$21:$C$22 = $C21)) < $G21; 1; IF($E21 = 0; 1; 0)); 0)',
    '=$A$126',
    '=A126',
    '=$A126',
    '=A$126',
    '=$A126:B$126',
    '=126:126',
    '=Sheet1!126:126',
    '=Sheet1!$A126:B$126',
    '=Sheet1!A$126',
    '=IF(AND($C126 <> ""; NOT(ISBLANK(B$126))); IF(SUM(FILTER($F$126:$F$127;$C$126:$C$127 = $C126)) < $G126; 1; IF($E126 = 0; 1; 0)); 0)',
    '=IF(AND($C126 <> "A1 $A1 $A1:B$1";$C126 <> "Sheet1!1:1";$C126 <> "Sheet1!$A1:B$1"); 1 , 0)' 
    ]

  let results = cases.map(_case => updateRowReference(_case, 15))

  console.log('Test Add')
  console.log(results.every((result, i) => result === expectedAdd[i]))

  console.log('Test Subtract')
  results = results.map(_case => updateRowReference(_case, -15))
  console.log(results.every((result, i) => result === cases[i]))
}

function test_batchrequests_edits(){
  // dummy data
  const rows = [{ a : 1, b : 'abc' }, { a : 2, b : 'def' }, { a : 3, b : 'ghi' }]

  // initialize test tables
  const sheetTables = new SheetTables(944181883)
  const table = sheetTables.tables['batchrequests']

  // execute addFirst
  table.model.addFirst(rows)
  table.commit()

  // test
  SpreadsheetApp.flush()
  let committed = table.getWrittenData(true)
  const test = new GasTap()
  test('addFirst', function(t){
    t.partialDeepEqual(rows, committed, 'checking data')
  })

  // execute del
  table.model.all().del()
  table.commit()

  // test
  SpreadsheetApp.flush()
  committed = table.getWrittenData(true)
  test('delete', function(t){
    t.equal(0, committed.length, 'checking data')
  })

  // execute adding
  table.model.addFirst(rows)
  table.model.get({a : 3}).addAbove(rows[0])
  table.model.get({a : 3}).addBelow(rows[0])
  table.model.addLast(rows.reverse())
  table.commit()

  // clean up
  rows.reverse()

  // test
  SpreadsheetApp.flush()
  committed = table.getWrittenData(true)
  test('adding', function(t){
    t.partialDeepEqual([
      rows[0],
      rows[1],
      rows[0],
      rows[2],
      rows[0],
      ...rows.reverse()
    ], committed, 'checking data')
  })

  // clean up
  rows.reverse()

  // checking integrity of table below
  const table_2 = sheetTables.tables['batchrequests_2']
  table_2.model.addFirst(rows)
  table_2.commit()

  // test
  SpreadsheetApp.flush()
  committed = table_2.getWrittenData(true)
  test('checking integrity of table below', function(t){
    t.partialDeepEqual(rows, committed, 'checking data')
  })

  // clean up
  // table_2.model.all().del()
  // table_2.commit()

  // execute edit
  let updateDirective = { a : 2 }
  table.model.all().set(updateDirective)
  table.commit()

  // test
  SpreadsheetApp.flush()
  committed = table.getWrittenData(true)
  test('update', function(t){
    t.partialDeepEqual(new Array(committed.lenght).fill(updateDirective), committed, 'checking data')
  })

  // clean up
  table.model.all().del()
  table.commit()

  // execute filter edit
  table.model.addFirst(rows)
  updateDirective = { a : 21 }
  table.model.filter({ a : 2 }).set(updateDirective)
  table.commit()

  // test
  SpreadsheetApp.flush()
  committed = table.getWrittenData(true)
  test('update', function(t){
    t.partialDeepEqual([
      { a : 1 }, 
      updateDirective,
      { a : 3 }
    ], committed, 'checking data')
  })

  // clean up
  table.model.all().del()
  table.commit()

  // execute sort
  table.model.addFirst(rows).sortBy('a', 'desc')
  table.commit()
  
  // test
  SpreadsheetApp.flush()
  const rowsReversed = JSON.parse(JSON.stringify(rows)).reverse()
  committed = table.getWrittenData(true)
  test('sort', function(t){
    t.partialDeepEqual(rowsReversed, committed, 'checking data')
  })

}

function test_batchRequests_delete_1(){
  const sheetTables = new SheetTables(463144639)

  const row1 = { sid : 1 }
  const row2 = { sid : 2 }
  const row3 = { sid : 3 }
  const row4 = { sid : 4 }
  const row5 = { sid : 5 }

  sheetTables.apply('clearTable')

  sheetTables.apply('addFirst',[[
    row1,
    row2,
    row3,
    row4,
    row5
  ]])

  sheetTables.apply('write')

  SpreadsheetApp.flush()
  
  sheetTables.apply('and', [{ sid : [3, 4] }])

  sheetTables.apply('del')

  sheetTables.apply('commit')

  const expected = [
    row1,
    row2,
    row5
  ]

  const test = new GasTap()

  test('Delete',function(t){

    const tables = sheetTables.tables

    Object.values(tables).forEach( table => {

      table.getWrittenData(true)
    
      t.partialDeepEqual(expected, table.model.all().value, "checking data")

    })

  })
}

function test_APIModel(){
  const input = { A : 1, B : 2 }
  const expected = { a : 1, b : 2 }
  const tables = new SheetTables(944181883).tables
  const payload_1_1 = tables['Payload 1 1']
  const result = payload_1_1.model.updateKeys(input)

  const test = new GasTap()

  test('API Model',function(t){
    t.deepEqual(result, expected, "checking data")
  })
}

function test_multipleGroupRows(){
  const tables = new SheetTables(944181883).tables
  const multiGroupRows = tables['Multiple Group Rows']
  const expectedHeader = ['placeholder', 'header 1', 'header 2', 'header 3']

  const test = new GasTap()

  test('Multiple Group Rows', function(t){

    const header = multiGroupRows.header

    t.deepEqual(expectedHeader, header, 'checking data')

  })
}

function test_comparison(){
  const test = new GasTap()

  test("and", function(t){

    const result = ComparisonMask.and(query1, data5)
    t.deepEqual(expected1, result, "checking data")

  })

  test("or", function(t){

    const result = ComparisonMask.or(query1, data5)
    t.deepEqual(expected2, result, "checking data")

  })

  test("nor", function(t){

    const result = ComparisonMask.nor(query1, data5)
    t.deepEqual(expected3, result, "checking data")

  })

  test("nand", function(t){

    const result = ComparisonMask.nand(query1, data5)
    t.deepEqual(expected4, result, "checking data")

  })

  test("greater", function(t){

    let result = ComparisonMask.greater(query2, data6)
    t.deepEqual(expected5, result, "checking data")

    result = ComparisonMask.greater(query2, data6, equal = true)
    t.deepEqual(expected6, result, "checking data")

  })

  test("less", function(t){

    let result = ComparisonMask.less(query2, data6)
    t.deepEqual(expected7, result, "checking data")

    result = ComparisonMask.less(query2, data6, equal)
    t.deepEqual(expected8, result, "checking data")

  })

}

function test_SheetTables(){

  const test = new GasTap()

  test("SheetTables", function(t){

    const sheetId = 944181883

    const ST = new SheetTables(sheetId)

    // testing first three occurrences only
    const tables = Object.entries(ST.tables).slice(0, 3)

    const names = tables.map(table => table[0])

    const expectedNames = ['Table 1', 'Table 2', 'Table 3']

    t.deepEqual(names, expectedNames, "testing table names")

    const nextTableNames = tables.map(table => {
      if(table[1].next !== undefined) return table[1].next.name
      else return undefined
    })

    const expectedNextTableNames = ['Table 2', 'Table 3', 'Table 4']

    t.deepEqual(nextTableNames, expectedNextTableNames, "testing next table names")

  })

}

/**
 * TESTING
 */

function test_v5(TABLE){
  let test = new GasTap()
  const tests = ['dataDuplication','addingempty','getting','adding','filtering','sorting','tablesize','uids','update','delete_','customcolumns','tproperties','getColumnValues','placeholder']
  const skipper = tests.reduce((a,c) => a = {...a,[c] : true },{})

  skipper.dataDuplication = false
  skipper.addingempty = false
  skipper.getting = false
  skipper.adding = false
  skipper.uids = false
  skipper.filtering = false
  skipper.sorting = false
  skipper.update = false
  skipper.delete_ = false
  skipper.customcolumns = false
  skipper.tablesize = false
  skipper.tproperties = false
  skipper.getColumnValues = false
  skipper.placeholder = TABLE.name === 'Placeholder' ? false : true

  // TODO: MODEL.getWrittenData(true); MODEL.model.all(); TABLE.write(); doesn't check duplicate uid values
  test('MODEL: UID columns', function(t){
    if(skipper.uids) t.skip()

    TABLE_UIDs.clearTable()  
    
    TABLE_UIDs.model.addFirst(singleRow1)
    const row1 = JSON.parse(JSON.stringify(singleRow1))
    
    row1.sid = getNextInteger('sid',TABLE_UIDs.model.all().value)
    row1.cid = getNextInteger('cid',TABLE_UIDs.model.all().value)
    row1.rid = getNextInteger('rid',TABLE_UIDs.model.all().value)

    t.throws(() => TABLE_UIDs.model.addFirst(row1),'Trying to add primary key manually')
    t.throws(() => TABLE_UIDs.model.get(1).set({ rid : 1 }), 'Trying to update primary key')

    t.equal(row1.sid, singleRow1.sid + 1,'get next max id')
    t.equal(row1.cid, singleRow1.cid + 1,'get next max id')
    t.throws(() => TABLE_UIDs.model.addFirst(singleRow1),'Trying to add duplicate ids')
    TABLE_UIDs.model.addFirst(singleRow2)
    t.throws(() => TABLE_UIDs.model.get({ cid : singleRow2.cid }).set({ cid : singleRow1.cid }), 'Trying to update unique id column with duplicate value')

    TABLE_UIDs.model.all()
    TABLE_UIDs.write()

    TABLE_UIDs.model.all()
    t.throws(TABLE_UIDs.write, 'Trying duplicating PKs by re-writing')
  })

  test('TABLE: Data Duplication', function(t){
    if(skipper.dataDuplication) t.skip()

    TABLE.model.filter(filterCriteria1)
    TABLE.model.addLast(row15)
    TABLE.model.all()

    TABLE.model.filter(filterCriteria2)
    TABLE.model.set(row16)

    TABLE.write()

    // TABLE.model.filter(filterCriteria2)
    // TABLE.model.set(row16)

    // TABLE.model.filter(filterCriteria1)
    // TABLE.model.addLast(row15)

    // TABLE.write()
  })

  test('TABLE: Property',function(t){
    if(skipper.tproperties) t.skip()
    const error = [
      'Table header and schemas are not matching!',
      'Non string type header value found. Check group row property',
      'Table.values empty. Try checking group row property',
      'Headers not found. Try checking group row property'
    ]

    const invalidProp = {
      model : SCHEMAS.TABLE_3,
      sheet: testingTablesSheet,
      table: {
        name: 'Table 3',
        groupRow: false
      }
    }
    // test with clear table
    TABLE_3.clearTable()
    t.throws2(() => {t_ = new WritableTable(invalidProp); t_.getWrittenData(true)}, error ,'Group row false in group row table')

    // test with data in table
    TABLE_3.model.addFirst(singleRow1); TABLE_3.write()
    t.throws2(() => {t_ = new WritableTable(invalidProp); t_.getWrittenData(true)}, error ,'Group row false in group row table')

    // invalid group row prop
    invalidProp.model = SCHEMAS.TABLE_4
    invalidProp.table.name = 'Table 4'
    invalidProp.table.groupRow = true
    // test with clear table
    TABLE_4.clearTable()
    t.throws2(() => {t_ = new WritableTable(invalidProp); t_.getWrittenData(true)}, error ,'Trying to specify group row in non group row table')
    // test with data in table
    TABLE_4.model.addFirst(singleRow1); TABLE_4.write()
    t.throws2(() => {t_ = new WritableTable(invalidProp); t_.getWrittenData(true)}, error ,'Trying to specify group row in non group row table')
  })

  test('MODEL: Placeholder',function(t){
    if(skipper.placeholder) t.skip()
    const testingTablesSheet = getSheetById(CONFIG.SS, 944181883)
    TABLE = new WritableTable(
      {
        table : {
          name : 'Placeholder',
          groupRow : false
        }
        , model : SCHEMAS.Placeholder

        , sheet : testingTablesSheet
      }
    )
    TABLE_UIDs.next = TABLE
    TABLE.next = TABLE_5

    TABLE.clearTable()
    // trying to initialize a non placeholder table
    t.throws2(() => {
      new WritableTable(
        {
          table : {
            name : 'Placeholder',
            groupRow : false,
            isLastRowTemplate : true
          }
          , model : SCHEMAS.Placeholder
          
          , sheet : testingTablesSheet
        }
      )
    },'No placeholder found','Trying to initialize a non placeholder table')
    TABLE.model.addFirst({ rid : "_" })
    TABLE.write()

    // attaching placeholder table class to model for the rest of the tests
    TABLE = new WritableTable(
      {
        table : {
          name : 'Placeholder',
          groupRow : false,
          isLastRowTemplate : true
        }
        , model : SCHEMAS.Placeholder

        , sheet : testingTablesSheet
      }
    )

    TABLE_UIDs.next = TABLE
    TABLE.next = TABLE_5
  })

  test('MODEL: Adding into empty table',function(t){
    if(skipper.addingempty) t.skip()
    
    TABLE.clearTable();

    TABLE.model.addFirst(singleRow1)
    t.ok(TABLE.write(), "adding single row")
    t.partialDeepEqual(singleRow1, TABLE.model.get(singleRow1).value[0], "checking added row")
    
    TABLE.clearTable();

    TABLE.model.addFirst(multipleRows)
    let writtenData = TABLE.write();
    t.equal(writtenData.length, multipleRows.length, "adding multiple rows")

    TABLE.model.all()
    multipleRows.map((r,i) => {
      t.partialDeepEqual(r, TABLE.model.value[i], "checking data")
    })
  })

  test('MODEL: Getting', function(t){
    if(skipper.getting) t.skip()

    TABLE.clearTable()

    TABLE.model.addFirst(multipleRows)
    TABLE.write()
    t.ok(isObject(TABLE.model.get(multipleRows[0]).value[0]),"getting by PK")
    t.ok(isObject(TABLE.model.get({ sid : 1, cid : 13 }).value[0]), "getting by object")
    
    t.throws(() => TABLE.model.get({ type : 'b2b' }), "Trying to get more then one record")

    const invalidQuery = { abc : '2' }
    t.throws(() =>  TABLE.model.get(invalidQuery), "invalid query error")
  })

  test('MODEL: Adding', function(t){
    if(skipper.adding) t.skip()

    TABLE.clearTable()

    // adding case
    let i = 0;
    let rows = [
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4
    ]
    
    // adding in sequence of rows array
    TABLE.model.addFirst(rows[0])
    TABLE.model.get(rows[0]).addBelow(rows[1])
    TABLE.model.addLast(rows[3])
    TABLE.model.get(rows[3]).addAbove(rows[2])

    t.throws(TABLE.write,"checking writing outside table size")

    TABLE.model.all()
    t.equal(TABLE.model.value.length,rows.length,'checking count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,TABLE.model.value[i],'checking data')
    })

    TABLE.write()
    let written = TABLE.getWrittenData(true)
    t.equal(written.length,rows.length,'checking written count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,written[i],'checking written data')
    })
    
    TABLE.clearTable()

    // adding case multiple rows
    const [multipleRows1, multipleRows2, multipleRows3, multipleRows4] = [
      [singleRow1, singleRow2],
      [singleRow2, singleRow3],
      [singleRow3, singleRow4],
      [singleRow4, singleRow5]
    ]

    rows = [
      ...multipleRows1,
      ...multipleRows2,
      ...multipleRows3,
      ...multipleRows4
    ]

    // adding in sequence of mulitple rows
    TABLE.model.addFirst(multipleRows1)
    TABLE.model.get(multipleRows1[1]).addBelow(multipleRows2)
    TABLE.model.addLast(multipleRows4)
    TABLE.model.get(multipleRows4[0]).addAbove(multipleRows3)

    TABLE.model.all()
    t.equal(TABLE.model.value.length,rows.length,'checking count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,TABLE.model.value[i],'checking data')
    })

    TABLE.write()
    written = TABLE.getWrittenData(true)
    t.equal(written.length,rows.length,'checking written count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,written[i],'checking written data')
    })

    // checking addLast on empty table
    TABLE.clearTable()
    rows = [
      ...multipleRows1
    ]

    // adding in sequence of mulitple rows
    TABLE.model.addLast(multipleRows1)

    TABLE.model.all()
    t.equal(TABLE.model.value.length,rows.length,'checking count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,TABLE.model.value[i],'checking data')
    })

    TABLE.write()
    written = TABLE.getWrittenData(true)
    t.equal(written.length,rows.length,'checking written count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,written[i],'checking written data')
    })

    // invalid input
    // neither array or object
    t.throws(() =>  TABLE.model.addFirst(1) , 'invalid input error')

    // invalid schema
    t.throws(() =>  TABLE.model.addFirst({ abc : 3 }) , 'invalid input error')
    
  })

  test('MODEL: Filtering', function(t) {
    // skipper.filtering = false
    if(skipper.filtering) t.skip()
    TABLE.clearTable()

    // adding five more rows to differentiate from filter case
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.write()

    // filter case
    const type = "b2c"
    const rows = [
      {...singleRow1 , ['type'] : type },
      {...singleRow2 , ['type'] : type }
    ]

    TABLE.model.addFirst(rows)
    TABLE.write()
    TABLE.model.filter({ type : type })
    rows.map((r,i) => {
      t.partialDeepEqual(r, TABLE.model.value[i], "checking data with filter case")
    })

    // case trying to write filtered data
    t.throws(TABLE.write,"trying to write filtered data")

    TABLE.clearTable()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.write()
    TABLE.model.addFirst(rows)
    TABLE.model.filter({ type : type })
    t.throws(TABLE.write,"trying to write filtered data")

    TABLE.clearTable()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.write()
    TABLE.model.addLast(rows)
    TABLE.model.filter({ type : type })
    t.throws(TABLE.write,"trying to write filtered data")

    TABLE.clearTable()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.write()
    TABLE.model.get(singleRow3).addAbove(rows)
    TABLE.model.filter({ type : type })
    t.throws(TABLE.write,"trying to write filtered data")

    TABLE.clearTable()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.write()
    TABLE.model.get(singleRow3).addBelow(rows)
    TABLE.model.filter({ type : type })
    t.throws(TABLE.write,"trying to write filtered data")

  })

  test('MODEL: Sorting', function(t){
    // skipper.sorting = false
    if(skipper.sorting) t.skip()

    TABLE.clearTable()
    
    let rows = [{ sid: 'c', cid : 1 }, { sid: 'b', cid : 2 }, { sid: 'a', cid : 3 }]
    TABLE.model.addFirst(rows)

    TABLE.model.all()
    // sort by numbers
    TABLE.model.sortBy('cid')
    rows.forEach((r, i) => t.partialDeepEqual(r,TABLE.model.value[i],'checking sorted numbers '))
    TABLE.write()
    let written = TABLE.getWrittenData(true)
    rows.forEach((r, i) => t.partialDeepEqual(r,written[i],'checking written sorted numbers '))

    // sort by characters
    TABLE.model.sortBy('sid')
    rows.reverse().forEach((r, i) => t.partialDeepEqual(r, TABLE.model.value[i],'checking sorted chars'))
    TABLE.write()
    written = TABLE.getWrittenData(true)
    rows.forEach((r, i) => t.partialDeepEqual(r,written[i],'checking written sorted numbers '))
    
    TABLE.clearTable()

    rows = [
      { sid: 'a', cid : 3 }, { sid: 'b', cid : 5 }, { sid: 'a', cid : 1 },
      { sid: 'b', cid : 6 }, { sid: 'a', cid : 2 }, { sid: 'b', cid : 4 },
      { sid: 'c', cid : 9 }, { sid: 'c', cid : 8 }, { sid: 'c', cid : 7 }
    ]

    TABLE.model.addFirst(rows)

    TABLE.write()
    let filter = { sid : 'b' }
    TABLE.model.filter(filter).sortBy('cid')
    let sorted = rows.filter((r => r.sid === filter.sid )).sort((a,b) => a.cid - b.cid)
    sorted.forEach((r, i) => t.partialDeepEqual(r,TABLE.model.value[i],'checking data'))

    TABLE.write()

    // sorting by multiple fields
    sorted = rows.sort(compareValues('sid','asc')).sort(compareValues('cid','asc','sid'))
    TABLE.model.all()
    TABLE.model.sortBy('sid').sortBy('cid')
    sorted.forEach((r, i) => t.partialDeepEqual(r,TABLE.model.value[i],'checking data'))

    TABLE.write()
  })

  test('MODEL: Update',function(t){
    if(skipper.update) return
    TABLE.clearTable()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.write()
    const singleRow1Changed = {
      ...singleRow1,
      ['type'] : 'b2c'
    };
    const singleRow2Changed = {
      ...singleRow2,
      ['type'] : 'b2c',
      ['warehouse'] : 'spirit'
    };

    TABLE.model.get(singleRow1).set({ type : 'b2c' })
    TABLE.write()
    t.equal(TABLE.model.get(singleRow1Changed).value[0].type, 'b2c','checking data')

    TABLE.model.get(singleRow2).set({ type : 'b2c', warehouse : 'spirit' })
    TABLE.write()
    t.equal(TABLE.model.get(singleRow2Changed).value[0].type, 'b2c','checking data')
    t.equal(TABLE.model.get(singleRow2Changed).value[0].warehouse, 'spirit','checking data')

    TABLE.model.filter({ type : 'b2b' }).set({ type : 'b2c' })
    TABLE.write()
    t.equal(TABLE.model.filter({ type : 'b2c' }).value.length, 5, 'checking data')
  })

  test('MODEL: Delete',function(t){
    if(skipper.delete_) return

    TABLE.clearTable()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.write()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2
    ])
    TABLE.write()

    TABLE.model.get(singleRow3)
    //   // TODO: if del function is updated to execute on write 
    TABLE.del()
    t.notOk(TABLE.model.get(singleRow3),'checking deleted data')
    TABLE.getWrittenData(true)
    t.notOk(TABLE.model.get(singleRow3),'checking deleted data on written')

    TABLE.model.filter({ sid : 2 })
    //   // TODO: if del function is updated to execute on write 
    TABLE.del()
    t.notOk(TABLE.model.filter({ sid : 2 }),'checking deleted data')
    TABLE.getWrittenData(true)
    t.notOk(TABLE.model.filter({ sid : 2 }),'checking deleted data on written')

    TABLE.model.addLast([
      { ...singleRow1, ['type'] : 'b2c', ['warehouse'] : 'spirit' },
      { ...singleRow2, ['type'] : 'b2c' }
    ])
    TABLE.write()
    TABLE.model.filter( { type : 'b2c' } ).sortBy('cid').get( { warehouse : 'spirit' } )
    //   // TODO: if del function is updated to execute on write 
    TABLE.del()
    t.notOk(TABLE.model.get( { warehouse : 'spirit' } ), 'checking deleted data')
    TABLE.getWrittenData(true)
    t.notOk(TABLE.model.get( { warehouse : 'spirit' } ), 'checking deleted data on written')
  })

  test('MODEL: Custom Columns', function(t){
    if(skipper.customcolumns) return

    // developing case
    TABLE_1.clearTable()
    TABLE_1.tablFormulaR1C1 = undefined
    TABLE_1.tablFormulaA1 = undefined
    TABLE_1.model.addFirst(singleRow1); TABLE_1.write()
    const map = [
      // columns after custom columns
      ["del"],
      // respective custom columns
      ["total"],
      // respective custom column formula template
      ["I#*J#"]
    ]
    insertCustomColumns(map, TABLE_1, true)
    SpreadsheetApp.flush()

    TABLE_1.getWrittenData(true)

    TABLE_1.model.addFirst(singleRow2); TABLE_1.write()
    TABLE_1.model.get(singleRow1).addBelow(singleRow3); TABLE_1.write()
    TABLE_1.model.addLast(singleRow4); TABLE_1.write()
    TABLE_1.model.get(singleRow4).addAbove(singleRow5); TABLE_1.write()

    let testData = [
      singleRow2,
      singleRow1,
      singleRow3,
      singleRow5,
      singleRow4
    ]

    // get data updated by formulas
    TABLE_1.getWrittenData(true)
    let tableData = TABLE_1.model.all().value
    t.ok(tableData.every((r,i) => {
      return r.custom_col_10 === testData[i].qty_ctns * testData[i].qty_per_ctn
    }), 'checking data')

    // Test preserving formula on clear table
    TABLE_1.clearTable()
    TABLE_1.model.addFirst(singleRow1); TABLE_1.write()

    // get data updated by formulas
    TABLE_1.getWrittenData(true)
    t.equal(singleRow1.qty_ctns * singleRow1.qty_per_ctn,TABLE_1.model.get(singleRow1).value[0].custom_col_10,'checking preserved formula after table clear')

    // Test formula after Ops
    TABLE_1.clearTable()
    TABLE_1.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5,
      { ...singleRow2, ['type'] : 'b2c' },
      { ...singleRow1, ['type'] : 'b2c' }
    ]); TABLE_1.write()

    TABLE_1.model.filter( { type : 'b2c' } ).sortBy('cid'); TABLE_1.write()
    // get data updated by formulas
    TABLE_1.getWrittenData(true)
    tableData = TABLE_1.model.all().value
    testData = [
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5,
      { ...singleRow1, ['type'] : 'b2c' },
      { ...singleRow2, ['type'] : 'b2c' }
    ]

    t.ok(tableData.every((r,i) => {
      return r.custom_col_10 === testData[i].qty_ctns * testData[i].qty_per_ctn
    }), 'checking data')
  })

  test('MODEL: Table Size',function(t){
    if(skipper.tablesize) t.skip()

    TABLE.clearTable()
    t.equal(TABLE.size, 0, 'checking count')

    TABLE.model.addFirst([singleRow1]); TABLE.write()

    t.equal(TABLE.size, 1,'checking count')

    TABLE.model.addFirst([singleRow1]); TABLE.write()
    t.equal(TABLE.size, 2,'checking count')   
  })

  test('MODEL: getColumnValue', function(t){
    if(skipper.getColumnValues) t.skip()

    const rows = [
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4
    ]
    TABLE.model.addFirst(rows)
    const valuesModel = TABLE.model.getColumnValues('sid')
    const values =  rows.map(r => r['sid'])
    values.map((v, i) => t.equal(v, valuesModel[i],'checking data'))

    t.throws(() => TABLE.model.getColumnValues('abc'), 'trying field not in schema')

    TABLE.clearTable()
    t.notOk(TABLE.model.getColumnValues('sid').length, 'trying to get field from empty table')
  })

  test('MODEL: Placeholder',function(t){
    if(skipper.placeholder) t.skip()
    const testingTablesSheet = getSheetById(CONFIG.SS, 944181883)
    TABLE.clearTable()

    // attaching table class to check if placeholder is still preserved
    TABLE = new WritableTable(
      {
        table : {
          name : 'Placeholder',
          groupRow : false
        }
        , model : SCHEMAS.Placeholder
        , sheet : testingTablesSheet
      }
    )

    TABLE_UIDs.next = TABLE
    TABLE.next = TABLE_5
    TABLE.getWrittenData(true)
    t.ok(TABLE.model.get({ rid : '_' }).value.length,'checking data')
  })

  test.finish()
}



/**
 * TESTING Decoupling
 */
function test_v8(){
  setSchemas()
  MODEL = new Model(SCHEMAS.TABLE_2)
  let test = new GasTap()
  const tests = ['getColumnValues','addingempty','getting','adding','filtering','sorting','tablesize','uids','update','delete_']
  const skipper = tests.reduce((a,c) => a = {...a,[c] : false },{})
  // skipper.getColumnValues = false
  // skipper.addingempty = false
  // skipper.getting = false
  // skipper.adding = false
  // skipper.uids = false
  // skipper.filtering = false
  // skipper.sorting = false
  // skipper.update = false
  // skipper.delete_ = false

  test('MODEL: getColumnValue', function(t){
    if(skipper.getColumnValues) t.skip()

    const rows = [
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4
    ]

    MODEL.addFirst(rows)
    const valuesModel = MODEL.getColumnValues('sid')
    const values =  rows.map(r => r['sid'])
    values.map((v, i) => t.equal(v, valuesModel[i],'checking data'))

    t.throws(() => MODEL.getColumnValues('abc'), 'trying field not in schema')

    MODEL.clearModel()
    t.notOk(MODEL.getColumnValues('sid').length, 'trying to get field from empty table')
  })

  test('MODEL: Adding into empty table',function(t){
    if(skipper.addingempty) t.skip()
    
    MODEL.clearModel();

    t.ok(MODEL.addFirst(singleRow1).value.length, "adding single row")
    t.partialDeepEqual(singleRow1, MODEL.get(singleRow1).value[0], "checking added row")

    MODEL.clearModel();

    let writtenData = MODEL.addFirst(multipleRows);
    MODEL.all()
    multipleRows.map((r,i) => {
      t.partialDeepEqual(r, MODEL.value[i], "checking data")
    })
  })

  test('MODEL: Getting', function(t){
    if(skipper.getting) t.skip()

    MODEL.clearModel()

    MODEL.addFirst(multipleRows)
    t.ok(isObject(MODEL.get(multipleRows[0]).value[0]),"getting by PK")
    t.ok(isObject(MODEL.get({ sid : 1, cid : 13 }).value[0]), "getting by object")
    // t.ok(isObject(MODEL.get({ type : 'b2b' }).value), "checking if only one record is returned")
    t.throws(() => MODEL.get({ type : 'b2b' }), "Trying to get more then one record")

    const invalidQuery = { abc : '2' }
    t.throws(() =>  MODEL.get(invalidQuery), "invalid query error")
  })

  test('MODEL: Adding', function(t){
    if(skipper.adding) t.skip()

    MODEL.clearModel()

    // adding case
    let i = 0;
    let rows = [
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4
    ]
    
    // adding in sequence of rows array
    MODEL.addFirst(rows[0])
    MODEL.get(rows[0]).addBelow(rows[1])
    MODEL.addLast(rows[3])
    MODEL.get(rows[3]).addAbove(rows[2])

    MODEL.all()
    t.equal(MODEL.value.length,rows.length,'checking count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,MODEL.value[i],'checking data')
    })

    MODEL.clearModel()

    // adding case multiple rows
    const [multipleRows1, multipleRows2, multipleRows3, multipleRows4] = [
      [singleRow1, singleRow2],
      [singleRow2, singleRow3],
      [singleRow3, singleRow4],
      [singleRow4, singleRow5]
    ]

    rows = [
      ...multipleRows1,
      ...multipleRows2,
      ...multipleRows3,
      ...multipleRows4
    ]

    // adding in sequence of mulitple rows
    MODEL.addFirst(multipleRows1)
    MODEL.get(multipleRows1[1]).addBelow(multipleRows2)
    MODEL.addLast(multipleRows4)
    MODEL.get(multipleRows4[0]).addAbove(multipleRows3)

    MODEL.all()
    t.equal(MODEL.value.length,rows.length,'checking count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,MODEL.value[i],'checking data')
    })

    // invalid input
    // neither array or object
    t.throws(() =>  MODEL.addFirst(1) , 'invalid input error')

    // invalid schema
    t.throws(() =>  MODEL.addFirst({ abc : 3 }) , 'invalid input error')
    
  })

  test('MODEL: Filtering', function(t) {
    // skipper.filtering = false
    if(skipper.filtering) t.skip()
    MODEL.clearModel()

    // adding five more rows to differentiate from filter case
    MODEL.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])

    // filter case
    const type = "b2c"
    const rows = [
      {...singleRow1 , ['type'] : type },
      {...singleRow2 , ['type'] : type }
    ]

    MODEL.addFirst(rows)
    MODEL.filter({ type : type })
    rows.map((r,i) => {
      t.partialDeepEqual(r, MODEL.value[i], "checking data with filter case")
    })
  })

  test('MODEL: Sorting', function(t){
    if(skipper.sorting) t.skip()

    MODEL.clearModel()
    
    let rows = [{ sid: 'c', cid : 1 }, { sid: 'b', cid : 2 }, { sid: 'a', cid : 3 }]
    MODEL.addFirst(rows)

    MODEL.all()
    // sort by numbers
    MODEL.sortBy('cid')
    rows.forEach((r, i) => t.partialDeepEqual(r,MODEL.value[i],'checking sorted numbers '))

    // resetting to avoid chaining
    MODEL.sortByChain = ""
    // sort by characters
    MODEL.sortBy('sid')
    rows.reverse().forEach((r, i) => t.partialDeepEqual(r, MODEL.value[i],'checking sorted chars'))
    
    MODEL.clearModel()

    rows = [
      { sid: 'a', cid : 3 }, { sid: 'b', cid : 5 }, { sid: 'a', cid : 1 },
      { sid: 'b', cid : 6 }, { sid: 'a', cid : 2 }, { sid: 'b', cid : 4 },
      { sid: 'c', cid : 9 }, { sid: 'c', cid : 8 }, { sid: 'c', cid : 7 }
    ]

    MODEL.addFirst(rows)
    let filter = { sid : 'b' }
    MODEL.filter(filter).sortBy('cid')
    let sorted = rows.filter((r => r.sid === filter.sid )).sort((a,b) => a.cid - b.cid)
    sorted.forEach((r, i) => t.partialDeepEqual(r,MODEL.value[i],'checking data'))

    MODEL._reset()
    // sorting by multiple fields
    sorted = rows.sort(compareValues('sid','asc')).sort(compareValues('cid','asc','sid'))
    MODEL.all()
    MODEL.sortBy('sid').sortBy('cid')
    sorted.forEach((r, i) => t.partialDeepEqual(r,MODEL.value[i],'checking data'))
  })

  // TODO: Decoupled Model UID
  // test('MODEL: UID columns', function(t){
  //   if(skipper.uids) t.skip()

  //   TABLE_UIDs.clearTable()    
  //   TABLE_UIDs.addFirst(singleRow1)
  //   const row1 = clone(singleRow1)
    
      // row1.sid = getNextInteger('sid',TABLE_UIDs.all().value)
      // row1.cid = getNextInteger('cid',TABLE_UIDs.all().value)
      // row1.rid = getNextInteger('rid',TABLE_UIDs.all().value)

  //   t.throws(() => TABLE_UIDs.addFirst(row1),'Trying to add primary key manually')
  //   t.throws(() => TABLE_UIDs.get(1).set({ rid : 1 }), 'Trying to update primary key')

  //   t.equal(row1.sid, singleRow1.sid + 1,'get next max id')
  //   t.equal(row1.cid, singleRow1.cid + 1,'get next max id')
  //   t.throws(() => TABLE_UIDs.addFirst(singleRow1),'Trying to add duplicate ids')
  //   TABLE_UIDs.addFirst(singleRow2)
  //   t.throws(() => TABLE_UIDs.get({ cid : singleRow2.cid }).set({ cid : singleRow1.cid }), 'Trying to update unique id column with duplicate value')

  //   TABLE_UIDs.write()
  //   t.throws(TABLE_UIDs.all().write, 'Trying duplicating PKs by re-writing')
  // })

  test('MODEL: Update',function(t){
    if(skipper.update) return
    MODEL.clearModel()
    MODEL.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    const singleRow1Changed = {
      ...singleRow1,
      ['type'] : 'b2c'
    };
    const singleRow2Changed = {
      ...singleRow2,
      ['type'] : 'b2c',
      ['warehouse'] : 'spirit'
    };

    MODEL.get(singleRow1).set({ type : 'b2c' })
    t.equal(MODEL.get(singleRow1Changed).value[0].type, 'b2c','checking data')

    MODEL.get(singleRow2).set({ type : 'b2c', warehouse : 'spirit' })
    t.equal(MODEL.get(singleRow2Changed).value[0].type, 'b2c','checking data')
    t.equal(MODEL.get(singleRow2Changed).value[0].warehouse, 'spirit','checking data')

    MODEL.filter({ type : 'b2b' }).set({ type : 'b2c' })
    t.equal(MODEL.filter({ type : 'b2c' }).value.length, 5, 'checking data')
  })

  test.finish()
}

function test_v9(){
  const test = new GasTap()
  test('SCHEMAS', function(t){
    let { schemas, params, schemaCollection } = setupSchemasTest()
    getSchemas(schemas, params, schemaCollection)
  })

  test.finish()
}

const logTimeDiff = (function (){
  return function(message) {
    log('timeit: ' + message + "; " + new Date().getTime())
  }
})()

function driver(){
  // setTestTables();
  const [TestTables] = loader([944181883]);
  const tables = TestTables.tables;

  [
    tables['Table 3'],
    tables['Placeholder']
    // TABLE_1,
    // TABLE_2,
    // TABLE_3,
    // TABLE_4,
    // PlaceholderTable_,
    // TABLE_5
  ].forEach(M => test_v5_1(M))

  // log(PlaceholderTable_.size)
  // log(TABLE_1.size)
}


// batch requests delete
function helper9(){

  const requests = [{
    "deleteRange": {
      "range": {
        "sheetId": 463144639,
        "startRowIndex": 2,
        "endRowIndex": 3
      },
      "shiftDimension": "ROWS"
    }
  },{
    "deleteRange": {
      "range": {
        "sheetId": 463144639,
        "startRowIndex": 7,
        "endRowIndex": 8
      },
      "shiftDimension": "ROWS"
    }
  }]

  Sheets.Spreadsheets.batchUpdate({ "requests" : requests }, CONFIG.SS.getId())
}

function auth(){

}

// BatchRequestBuilder
function test_BRB(){
  const brb = new BatchRequestsBuilder()
  brb.insertRequest(1, 2)
  brb.updateRequest({ a : '1' }, 1)
  brb.deleteRequest(1)
  brb.updateLocation(111, 5)
  log(JSON.stringify(brb.batchRequests))
}

function test_v5_1(TABLE){

  let test = new GasTap()
  const tests = ['dataDuplication','addingempty','getting','adding','filtering','sorting','tablesize','uids','update','delete_','customcolumns','tproperties','getColumnValues','placeholder']
  const skipper = tests.reduce((a,c) => a = {...a,[c] : true },{})

  // skipper.dataDuplication = false
  // skipper.addingempty = false
  // skipper.getting = false
  skipper.adding = false
  // skipper.uids = false
  // skipper.filtering = false
  skipper.sorting = false
  // skipper.update = false
  // skipper.delete_ = false
  // skipper.customcolumns = false
  // skipper.tablesize = false
  // skipper.tproperties = false
  // skipper.getColumnValues = false
  // skipper.placeholder = TABLE.name === 'Placeholder' ? false : true

  test('MODEL: Adding', function(t){
    if(skipper.adding) t.skip()

    TABLE.model.all().del().table.commit(); SpreadsheetApp.flush();

    // adding case
    let i = 0;
    let rows = [
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4
    ]
    
    // adding in sequence of rows array
    TABLE.model.addFirst(rows[0])
    TABLE.model.get(rows[0]).addBelow(rows[1])
    TABLE.model.addLast(rows[3])
    TABLE.model.get(rows[3]).addAbove(rows[2])

    // t.throws(TABLE.write,"checking writing outside table size")

    TABLE.model.all()
    t.equal(TABLE.model.value.length,rows.length,'checking count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,TABLE.model.value[i],'checking data')
    })

    TABLE.commit()
    SpreadsheetApp.flush(); 
    let written = TABLE.getWrittenData(true)
    t.equal(written.length,rows.length,'checking written count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,written[i],'checking written data')
    })
    
    TABLE.model.all().del().table.commit()

    // adding case multiple rows
    const [multipleRows1, multipleRows2, multipleRows3, multipleRows4] = [
      [singleRow1, singleRow2],
      [singleRow2, singleRow3],
      [singleRow3, singleRow4],
      [singleRow4, singleRow5]
    ]

    rows = [
      ...multipleRows1,
      ...multipleRows2,
      ...multipleRows3,
      ...multipleRows4
    ]

    // adding in sequence of mulitple rows
    TABLE.model.addFirst(multipleRows1)
    TABLE.model.get(multipleRows1[1]).addBelow(multipleRows2)
    TABLE.model.addLast(multipleRows4)
    TABLE.model.get(multipleRows4[0]).addAbove(multipleRows3)

    TABLE.model.all()
    t.equal(TABLE.model.value.length,rows.length,'checking count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,TABLE.model.value[i],'checking data')
    })

    TABLE.commit()
    SpreadsheetApp.flush();
    written = TABLE.getWrittenData(true)
    t.equal(written.length,rows.length,'checking written count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,written[i],'checking written data')
    })

    // checking addLast on empty table
    TABLE.model.all().del().table.commit()
    rows = [
      ...multipleRows1
    ]

    // adding in sequence of mulitple rows
    TABLE.model.addLast(multipleRows1)

    TABLE.model.all()
    t.equal(TABLE.model.value.length,rows.length,'checking count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,TABLE.model.value[i],'checking data')
    })

    TABLE.commit()
    SpreadsheetApp.flush();
    written = TABLE.getWrittenData(true)
    t.equal(written.length,rows.length,'checking written count')
    rows.map((r,i) => {
      t.partialDeepEqual(r,written[i],'checking written data')
    })

    // invalid input
    // neither array or object
    t.throws(() =>  TABLE.model.addFirst(1) , 'invalid input error')

    // invalid schema
    t.throws(() =>  TABLE.model.addFirst({ abc : 3 }) , 'invalid input error')
    
  })

  test('MODEL: Sorting', function(t){
    // skipper.sorting = false
    if(skipper.sorting) t.skip()

    TABLE.model.all().del().table.commit()
    
    let rows = [{ sid: 'c', cid : 1 }, { sid: 'b', cid : 2 }, { sid: 'a', cid : 3 }]
    TABLE.model.addFirst(rows)

    TABLE.model.all()
    // sort by numbers
    TABLE.model.sortBy('cid')
    rows.forEach((r, i) => t.partialDeepEqual(r,TABLE.model.value[i],'checking sorted numbers '))
    TABLE.commit()
    SpreadsheetApp.flush();
    let written = TABLE.getWrittenData(true)
    rows.forEach((r, i) => t.partialDeepEqual(r,written[i],'checking written sorted numbers '))

    // sort by characters
    TABLE.model.sortBy('sid')
    rows.reverse().forEach((r, i) => t.partialDeepEqual(r, TABLE.model.value[i],'checking sorted chars'))
    TABLE.commit()
    SpreadsheetApp.flush();
    written = TABLE.getWrittenData(true)
    rows.forEach((r, i) => t.partialDeepEqual(r,written[i],'checking written sorted numbers '))
    
    TABLE.model.all().del().table.commit()

    rows = [
      { sid: 'a', cid : 3 }, { sid: 'b', cid : 5 }, { sid: 'a', cid : 1 },
      { sid: 'b', cid : 6 }, { sid: 'a', cid : 2 }, { sid: 'b', cid : 4 },
      { sid: 'c', cid : 9 }, { sid: 'c', cid : 8 }, { sid: 'c', cid : 7 }
    ]

    TABLE.model.addFirst(rows)

    TABLE.commit()
    let filter = { sid : 'b' }
    TABLE.model.filter(filter).sortBy('cid')
    let sorted = rows.filter((r => r.sid === filter.sid )).sort((a,b) => a.cid - b.cid)
    sorted.forEach((r, i) => t.partialDeepEqual(r,TABLE.model.value[i],'checking data'))

    TABLE.commit()

    // sorting by multiple fields
    sorted = rows.sort(compareValues('sid','asc')).sort(compareValues('cid','asc','sid'))
    TABLE.model.all()
    TABLE.model.sortBy('sid').sortBy('cid')
    sorted.forEach((r, i) => t.partialDeepEqual(r,TABLE.model.value[i],'checking data'))

    TABLE.commit()
  })

  // TODO: MODEL.getWrittenData(true); MODEL.model.all(); TABLE.commit(); doesn't check duplicate uid values
  test('MODEL: Custom Columns', function(t){
    if(skipper.customcolumns) return

    // developing case
    TABLE_1.model.all().del().table.commit(); SpreadsheetApp.flush()
    TABLE_1.tablFormulaR1C1 = undefined
    TABLE_1.tablFormulaA1 = undefined
    TABLE_1.model.addFirst(singleRow1); 
    
    TABLE_1.commit(); SpreadsheetApp.flush();
    const map = [
      // columns after custom columns
      ["del"],
      // respective custom columns
      ["total"],
      // respective custom column formula template
      ["I#*J#"]
    ]
    insertCustomColumns(map, TABLE_1, true)
    SpreadsheetApp.flush()
    TABLE_1.getWrittenData(true)

    TABLE_1.model.addFirst(singleRow2); TABLE_1.commit(); SpreadsheetApp.flush();

    
    TABLE_1.model.get(singleRow1).addBelow(singleRow3); TABLE_1.commit(); SpreadsheetApp.flush();
    TABLE_1.model.addLast(singleRow4); TABLE_1.commit(); SpreadsheetApp.flush();
    TABLE_1.model.get(singleRow4).addAbove(singleRow5); TABLE_1.commit(); SpreadsheetApp.flush();

    let testData = [
      singleRow2,
      singleRow1,
      singleRow3,
      singleRow5,
      singleRow4
    ]

    // get data updated by formulas
    SpreadsheetApp.flush();
    TABLE_1.getWrittenData(true)
    let tableData = TABLE_1.model.all().value
    t.ok(tableData.every((r,i) => {
      return r.custom_col_10 === testData[i].qty_ctns * testData[i].qty_per_ctn
    }), 'checking data')

    // Test preserving formula on clear table
    TABLE_1.model.all().del().table.commit()
    TABLE_1.model.addFirst(singleRow1); TABLE_1.commit()

    // get data updated by formulas
    SpreadsheetApp.flush();
    TABLE_1.getWrittenData(true)
    t.equal(singleRow1.qty_ctns * singleRow1.qty_per_ctn,TABLE_1.model.get(singleRow1).value[0].custom_col_10,'checking preserved formula after table clear')

    // Test formula after Ops
    TABLE_1.model.all().del().table.commit()
    TABLE_1.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5,
      { ...singleRow2, ['type'] : 'b2c' },
      { ...singleRow1, ['type'] : 'b2c' }
    ]); TABLE_1.commit()

    TABLE_1.model.filter( { type : 'b2c' } ).sortBy('cid'); TABLE_1.commit()
    // get data updated by formulas
    SpreadsheetApp.flush();
    TABLE_1.getWrittenData(true)
    tableData = TABLE_1.model.all().value
    testData = [
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5,
      { ...singleRow1, ['type'] : 'b2c' },
      { ...singleRow2, ['type'] : 'b2c' }
    ]

    t.ok(tableData.every((r,i) => {
      return r.custom_col_10 === testData[i].qty_ctns * testData[i].qty_per_ctn
    }), 'checking data')
  })

  test('TABLE: Data Duplication', function(t){
    if(skipper.dataDuplication) t.skip()

    TABLE.model.filter(filterCriteria1)
    TABLE.model.addLast(row15)
    TABLE.model.all()

    TABLE.model.filter(filterCriteria2)
    TABLE.model.set(row16)

    TABLE.commit()

    // TABLE.model.filter(filterCriteria2)
    // TABLE.model.set(row16)

    // TABLE.model.filter(filterCriteria1)
    // TABLE.model.addLast(row15)

    // TABLE.commit()
  })

  test('MODEL: Delete',function(t){
    if(skipper.delete_) return

    TABLE.model.all().del().table.commit()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.commit()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2
    ])
    TABLE.commit()

    TABLE.model.get(singleRow3)
    //   // TODO: if del function is updated to execute on write 
    TABLE.model.del(); TABLE.commit()
    t.notOk(TABLE.model.get(singleRow3),'checking deleted data')
    SpreadsheetApp.flush();
    TABLE.getWrittenData(true)
    t.notOk(TABLE.model.get(singleRow3),'checking deleted data on written')

    TABLE.model.filter({ sid : 2 })
    //   // TODO: if del function is updated to execute on write 
    TABLE.model.del(); TABLE.commit()
    t.notOk(TABLE.model.filter({ sid : 2 }),'checking deleted data')
    SpreadsheetApp.flush();
    TABLE.getWrittenData(true)
    t.notOk(TABLE.model.filter({ sid : 2 }),'checking deleted data on written')

    TABLE.model.addLast([
      { ...singleRow1, ['type'] : 'b2c', ['warehouse'] : 'spirit' },
      { ...singleRow2, ['type'] : 'b2c' }
    ])
    TABLE.commit()
    TABLE.model.filter( { type : 'b2c' } ).sortBy('cid').get( { warehouse : 'spirit' } )
    //   // TODO: if del function is updated to execute on write 
    TABLE.model.del(); TABLE.commit()
    t.notOk(TABLE.model.get( { warehouse : 'spirit' } ), 'checking deleted data')
    SpreadsheetApp.flush();
    TABLE.getWrittenData(true)
    t.notOk(TABLE.model.get( { warehouse : 'spirit' } ), 'checking deleted data on written')

    TABLE.model.get({ 'sid' : 4 }).del()
    t.throws(() => { TABLE.model.get({ 'sid' : 5 }).del() }, 'trying more than one delete request')
    TABLE.model._reset()
  })

  test('MODEL: Placeholder',function(t){
    if(skipper.placeholder) t.skip()
    const testingTablesSheet = getSheetById(CONFIG.SS, 944181883)
    SpreadsheetApp.flush();
    TABLE = new WritableTable(
      {
        table : {
          name : 'Placeholder',
          groupRow : false
        }
        , model : SCHEMAS.Placeholder

        , sheet : testingTablesSheet
      }
    )
    TABLE_UIDs.next = TABLE
    TABLE.next = TABLE_5

    TABLE.model.all().del().table.commit(); SpreadsheetApp.flush()

    // trying to initialize a non placeholder table
    t.throws2(() => {
      new WritableTable(
        {
          table : {
            name : 'Placeholder',
            groupRow : false,
            isLastRowTemplate : true
          }
          , model : SCHEMAS.Placeholder
          
          , sheet : testingTablesSheet
        }
      )
    },'No placeholder found','Trying to initialize a non placeholder table')
    TABLE.model.addFirst({ rid : "_" })
    TABLE.commit(); SpreadsheetApp.flush();

    // attaching placeholder table class to model for the rest of the tests
    TABLE = new WritableTable(
      {
        table : {
          name : 'Placeholder',
          groupRow : false,
          isLastRowTemplate : true
        }
        , model : SCHEMAS.Placeholder

        , sheet : testingTablesSheet
      }
    )

    TABLE_UIDs.next = TABLE
    TABLE.next = TABLE_5
  })

  test('MODEL: UID columns', function(t){
    if(skipper.uids) t.skip()

    TABLE_UIDs.model.all().del().table.commit()  
    
    TABLE_UIDs.model.addFirst(singleRow1)
    const row1 = JSON.parse(JSON.stringify(singleRow1))
    
    row1.sid = getNextInteger('sid',TABLE_UIDs.model.all().value)
    row1.cid = getNextInteger('cid',TABLE_UIDs.model.all().value)
    row1.rid = getNextInteger('rid',TABLE_UIDs.model.all().value)

    t.throws(() => TABLE_UIDs.model.addFirst(row1),'Trying to add primary key manually')
    t.throws(() => TABLE_UIDs.model.get(1).set({ rid : 1 }), 'Trying to update primary key')

    t.equal(row1.sid, singleRow1.sid + 1,'get next max id')
    t.equal(row1.cid, singleRow1.cid + 1,'get next max id')
    t.throws(() => TABLE_UIDs.model.addFirst(singleRow1),'Trying to add duplicate ids')
    TABLE_UIDs.model.addFirst(singleRow2)
    t.throws(() => TABLE_UIDs.model.get({ cid : singleRow2.cid }).set({ cid : singleRow1.cid }), 'Trying to update unique id column with duplicate value')

    TABLE_UIDs.model.all()
    TABLE_UIDs.commit()

    TABLE_UIDs.model.all()
    t.throws(TABLE_UIDs.write, 'Trying duplicating PKs by re-writing')
  })

  test('TABLE: Property',function(t){
    if(skipper.tproperties) t.skip()

    TABLE_3.model._reset()

    const error = [
      'Table header and schemas are not matching!',
      'Non string type header value found. Check group row property',
      'Table.values empty. Try checking group row property',
      'Headers not found. Try checking group row property'
    ]

    const invalidProp = {
      model : SCHEMAS.TABLE_3,
      sheet: testingTablesSheet,
      table: {
        name: 'Table 3',
        groupRow: false
      }
    }
    // test with clear table
    TABLE_3.model.all().del().table.commit()
    SpreadsheetApp.flush();
    t.throws2(() => {t_ = new WritableTable(invalidProp); t_.getWrittenData(true)}, error ,'Group row false in group row table')

    // test with data in table
    TABLE_3.model.addFirst(singleRow1); TABLE_3.commit()
    SpreadsheetApp.flush();
    t.throws2(() => {t_ = new WritableTable(invalidProp); t_.getWrittenData(true)}, error ,'Group row false in group row table')

    // invalid group row prop
    invalidProp.model = SCHEMAS.TABLE_4
    invalidProp.table.name = 'Table 4'
    invalidProp.table.groupRow = true
    // test with clear table
    TABLE_4.model.all().del().table.commit()
    SpreadsheetApp.flush();
    t.throws2(() => {t_ = new WritableTable(invalidProp); t_.getWrittenData(true)}, error ,'Trying to specify group row in non group row table')
    // test with data in table
    TABLE_4.model.addFirst(singleRow1); TABLE_4.commit()
    SpreadsheetApp.flush();
    t.throws2(() => {t_ = new WritableTable(invalidProp); t_.getWrittenData(true)}, error ,'Trying to specify group row in non group row table')
  })

  test('MODEL: Getting', function(t){
    if(skipper.getting) t.skip()

    TABLE.model.all().del().table.commit()

    TABLE.model.addFirst(multipleRows)
    TABLE.commit()
    t.ok(isObject(TABLE.model.get(multipleRows[0]).value[0]),"getting by PK")
    t.ok(isObject(TABLE.model.get({ sid : 1, cid : 13 }).value[0]), "getting by object")
    
    t.throws(() => TABLE.model.get({ type : 'b2b' }), "Trying to get more then one record")

    const invalidQuery = { abc : '2' }
    t.throws(() =>  TABLE.model.get(invalidQuery), "invalid query error")
  })

  test('MODEL: Filtering', function(t) {
    // skipper.filtering = false
    if(skipper.filtering) t.skip()
    TABLE.model.all().del().table.commit()

    // adding five more rows to differentiate from filter case
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.commit()

    // filter case
    const type = "b2c"
    const rows = [
      {...singleRow1 , ['type'] : type },
      {...singleRow2 , ['type'] : type }
    ]

    TABLE.model.addFirst(rows)
    TABLE.commit()
    TABLE.model.filter({ type : type })
    rows.map((r,i) => {
      t.partialDeepEqual(r, TABLE.model.value[i], "checking data with filter case")
    })

    // case trying to write filtered data
    t.throws(TABLE.write,"trying to write filtered data")

    TABLE.model.all().del().table.commit()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.commit()
    TABLE.model.addFirst(rows)
    TABLE.model.filter({ type : type })
    t.throws(TABLE.write,"trying to write filtered data")

    TABLE.model.all().del().table.commit()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.commit()
    TABLE.model.addLast(rows)
    TABLE.model.filter({ type : type })
    t.throws(TABLE.write,"trying to write filtered data")

    TABLE.model.all().del().table.commit()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.commit()
    TABLE.model.get(singleRow3).addAbove(rows)
    TABLE.model.filter({ type : type })
    t.throws(TABLE.write,"trying to write filtered data")

    TABLE.model.all().del().table.commit()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.commit()
    TABLE.model.get(singleRow3).addBelow(rows)
    TABLE.model.filter({ type : type })
    t.throws(TABLE.write,"trying to write filtered data")

  })

  test('MODEL: Update',function(t){
    if(skipper.update) return
    TABLE.model.all().del().table.commit()
    TABLE.model.addFirst([
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4,
      singleRow5
    ])
    TABLE.commit()
    const singleRow1Changed = {
      ...singleRow1,
      ['type'] : 'b2c'
    };
    const singleRow2Changed = {
      ...singleRow2,
      ['type'] : 'b2c',
      ['warehouse'] : 'spirit'
    };

    TABLE.model.get(singleRow1).set({ type : 'b2c' })
    TABLE.commit()
    t.equal(TABLE.model.get(singleRow1Changed).value[0].type, 'b2c','checking data')

    TABLE.model.get(singleRow2).set({ type : 'b2c', warehouse : 'spirit' })
    TABLE.commit()
    t.equal(TABLE.model.get(singleRow2Changed).value[0].type, 'b2c','checking data')
    t.equal(TABLE.model.get(singleRow2Changed).value[0].warehouse, 'spirit','checking data')

    TABLE.model.filter({ type : 'b2b' }).set({ type : 'b2c' })
    TABLE.commit()
    t.equal(TABLE.model.filter({ type : 'b2c' }).value.length, 5, 'checking data')
  })

  test('MODEL: Table Size',function(t){
    if(skipper.tablesize) t.skip()

    TABLE.model.all().del().table.commit()
    t.equal(TABLE.size, 0, 'checking count')

    TABLE.model.addFirst([singleRow1]); TABLE.commit()

    t.equal(TABLE.size, 1,'checking count')

    TABLE.model.addFirst([singleRow1]); TABLE.commit()
    t.equal(TABLE.size, 2,'checking count')   
  })

  test('MODEL: getColumnValue', function(t){
    if(skipper.getColumnValues) t.skip()

    const rows = [
      singleRow1,
      singleRow2,
      singleRow3,
      singleRow4
    ]
    TABLE.model.addFirst(rows)
    const valuesModel = TABLE.model.all().getColumnValues('sid')
    const values =  rows.map(r => r['sid'])
    values.map((v, i) => t.equal(v, valuesModel[i],'checking data'))

    t.throws(() => TABLE.model.all().getColumnValues('abc'), 'trying field not in schema')

    TABLE.model.all().del().table.commit()
    t.notOk(TABLE.model.all().getColumnValues('sid').length, 'trying to get field from empty table')
  })

  test('MODEL: Placeholder',function(t){
    if(skipper.placeholder) t.skip()
    const testingTablesSheet = getSheetById(CONFIG.SS, 944181883)
    TABLE.model.all().del().table.commit()

    // attaching table class to check if placeholder is still preserved
    TABLE = new WritableTable(
      {
        table : {
          name : 'Placeholder',
          groupRow : false
        }
        , model : SCHEMAS.Placeholder
        , sheet : testingTablesSheet
      }
    )

    TABLE_UIDs.next = TABLE
    TABLE.next = TABLE_5
    SpreadsheetApp.flush();
    TABLE.getWrittenData(true)
    t.ok(TABLE.model.get({ rid : '_' }).value.length,'checking data')
  })

  test.finish()
}