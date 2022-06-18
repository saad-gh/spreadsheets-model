function demo(){
  console.log("Adding")
  adding()

  console.log("Filtering")
  filtering()

  console.log("Updating")
  updating()

  console.log("Sorting")
  sorting()

  console.log("Joining")
  joining()

  console.log("Requesting")
  requesting()

  console.log("Handling")
  handling()
}

function adding() {

  // load patient history table
  // loader function accepts array of sheets ids and return SheetTable objects which have table models.
  const [sheet] = loader([1550146239])
  const history = sheet.models['Patient History']

  // add data to table top
  history.addFirst(
    { "name": "Patty O'Furniture.", "age": 25, "sex": "M", "date": "22-6-17", "complain": "Lorem ipsum dolor sit amet, co..." }
  )
  history.addLast(
    { "name": "Paddy O'Furniture.", "age": 30, "sex": "F", "date": "22-6-18", "diagnosis": "Donec ut risus consectetur, pu..." }
  )

  // add data below or above selected row(s)
  history.filter({ name: "Patty O'Furniture." }).addBelow(
    { "name": "Aida Bugg.", "age": 33, "sex": "F", "date": "22-6-20", "complain": "Pellentesque aliquet libero ut..." }
  )
  history.filter({ name: "Patty O'Furniture." }).addAbove(
    { "name": "Maureen Biologist.", "age": 40, "sex": "F", "date": "22-6-21", "complain": "Nullam vel odio nunc. Donec ve..." }
  )

  // add methods also accept multiple row objects for example
  history.addLast([
    { "name": "Teri Dactyl.", "age": 50, "sex": "M", "date": "22-6-22", "complain": "Cras a porttitor nisi. Donec v..." },
    { "name": "Peg Legge.", "age": 55, "sex": "F", "date": "22-6-23", "complain": "Nunc ornare orci sed massa fin..." },
    { "name": "Allie Grater.", "age": 60, "sex": "M", "date": "22-6-24", "complain": "Vestibulum eget elit sed turpi..." }
  ])

  // commit changes to sheet
  sheet.commit()

}

function filtering() {
  // load patient history table
  const [sheet] = loader([1550146239])
  const history = sheet.models['Patient History']

  // set table model with all values
  history.all()
  print("values", history.value)

  // filter functions return false if data is not found otherwise returns model object
  // values are then accessed with model's 'value' property
  history.filter({ name: "Patty O'Furniture." })
  print("Basic syntax", history.value)

  // other filter functions
  history.or({ name: "Patty O'Furniture.", age: 50 }); print("or", history.value)
  history.and({ name: "Patty O'Furniture.", age: 50 }); print("and", history.value)
  history.not({ name: "Patty O'Furniture.", age: 50 }); print("not", history.value)
  history.nand({ name: "Patty O'Furniture.", age: 50 }); print("nand", history.value) // NAND logic
  history.nor({ name: "Patty O'Furniture.", age: 50 }); print("nor", history.value) // NOR logic
  history.greater({ age: 50 }); print("greater", history.value)
  history.less({ age: 50 }); print("less", history.value)

  // 'and', 'or', 'not', 'nand' and 'nor' filter functions can also take arrays for example
  // the expression below translates to: name = 'Patty O'Furniture.' or (id = 50 or id = 55)
  history.or({ name: "Patty O'Furniture.", age: [50, 55] })
  print("array", history.value)
  // similary the expression below translates to: name = 'Patty O'Furniture.' and (id = 50 or id = 55)
  history.and({ name: "Patty O'Furniture.", id: [50, 55] })
  print("array", history.value)

  // 'greater' and 'less' functions take a second argument 'equal' of type 'bool'
  // to differentiate between operators '>' and '>=' and '<' and '<=' for example
  // the below expression translates to: id >= 50
  history.greater({ age: 50 }, true)
  print("greater than equal to", history.value)
}

function updating() {
  const [sheet] = loader([1550146239])
  const history = sheet.models['Patient History']
  // set name to "Khan" for all rows with id greater than 50
  history.greater({ age: 50 }, true).set({ name: "Khan" })
  print("updating", history.value)
}

function sorting() {
  const [sheet] = loader([1550146239])
  const history = sheet.models['Patient History']

  // by default sort order is ascending
  history.sortBy('id')

  // to sort by order descending
  history.sortBy('id', 'desc')

  // to chain sortBy methods
  history.sortBy('id').sortBy('name')

  // commit to google sheet
  print("sorting", history.value)
}

function joining() {
  const [sheet] = loader([1550146239])
  const history = sheet.models['Patient History']
  const vitals = sheet.models['Vitals']

  // adding data to vitals model
  vitals.addFirst([
    { "pid": 1, "bp": "121 - 82", "pulse": 72, "temp": 98, "weight": 65 },
    { "pid": 2, "bp": "118 - 85", "pulse": 73, "temp": 99, "weight": 68 },
    { "pid": 3, "bp": "125 - 90", "pulse": 70, "temp": 98, "weight": 75 },
    { "pid": 4, "bp": "120 - 80", "pulse": 65, "temp": 100, "weight": 80 },
    { "pid": 5, "bp": "120 - 75", "pulse": 75, "temp": 101, "weight": 85 },
    { "pid": 6, "bp": "110 - 65", "pulse": 80, "temp": 103, "weight": 90 },
    { "pid": 7, "bp": "140 - 90", "pulse": 90, "temp": 97, "weight": 95 },
    { "pid": 8, "bp": "120 - 90", "pulse": 65, "temp": 100, "weight": 100 }
  ])
  let joined = history.join(vitals)
    // first key 'h' corresponds to history table field
    // second field 'v' corresponds to vitals table field
    // the resulting array of objects will have updated keys for example 'age' from history will be 'h.age'
    // similary 'bp' from vitals will be 'v.bp'
    .on({ h: 'id', v: 'pid' });
  print("join", history.value)

  // to join subset of data filter functions can be used for example the following will only join records
  // where age is greater than 50
  history.greater({ age: 50 })
  joined = history.join(vitals).on({ h: 'id', v: 'pid' });
  print("join subset", history.value)
}

/**
 * API Support
 * - mapping keys between API and model data
 * - building json request body from models
 * - handling json response body and putting into models
 */

function requesting() {
  const [sheet] = loader([1550146239])

  // updated directive to point to the required model row
  let directive = {
    ID: { key: "id", filter: (models) => models["Patient History"].filter({ id: 1 }) },
    NameOfPatient: "name",
    Age: "age"
  }

  // any key could have been used to point to the required row
  directive = {
    ID: "id",
    NameOfPatient: { key: "name", filter: (models) => models["Patient History"].filter({ id: 1 }) },
    Age: "age"
  }

  // use jsonOut function to get the required request body
  print("Basic syntax:", jsonOut(directive, sheet.models))

  // normally request bodies are nested objects
  // {
  //    ID : 1,
  //    NameOfPatient : "Patty O'Furniture.",
  //    Age : 25,
  //    Vitals : { BP : "abc", Pulse : "abc", Temp : "", Weight : "" } 
  // }

  // updated directive
  directive = {
    ID: { key: "h.id", filter: (joined) => joined.filter({ "h.id": 1 }) },
    NameOfPatient: "h.name",
    Age: "h.age",
    Vitals: {
      BP: "v.bp",
      Pulse: "v.pulse",
      Temp: "t.temp",
      Weight: { key: "v.weight", filter: (joined) => joined.filter({ "v.pid": 1 }) }
    }
  }

  sheet.models['Vitals'].addFirst({ "pid": 1, "bp": "121 - 82", "pulse": 72, "temp": 98, "weight": 65 })
  let joined = sheet.models['Patient History'].join(sheet.models['Vitals']).on({ h: "id", v: "pid" })
  print("Nested", jsonOut(directive, joined))

  // request bodies nested object can also be arrays
  // {
  //    ID : 1,
  //    NameOfPatient : "Patty O'Furniture.",
  //    Age : 25,
  //    Tests : [
  //        { Name : "Complete Blood Count" },
  //        { Name : "Basic Metabolic Panel" },
  //        { Name : "Comprehensive Metabolic Panel" }
  //    ]
  // }

  // udpated directive. note the many attribute in nested directive.
  directive = {
    ID: { key: "h.id", filter: (joined) => joined.filter({ "h.id": 1 }) },
    NameOfPatient: "h.name",
    Age: "h.age",
    Tests: {
      Name: { key: "t.name", many: true, filter: (joined) => joined.filter({ "h.id": 1 }) },
      Id: "t.pid"
    }
  }

  sheet.models['Tests'].addFirst([
    { "pid": 1, "name": "Complete Blood Count" },
    { "pid": 1, "name": "Basic Metabolic Panel" },
    { "pid": 1, "name": "Comprehensive Metabolic Panel" }
  ])
  joined = sheet.models['Patient History'].join(sheet.models['Tests']).on({ h: "id", t: "pid" })
  print("Array", jsonOut(directive, joined))

  // directives also accept an operation attribute to transform filtered data
  directive = {
    ID: { key: "id", filter: (models) => models["Patient History"].filter({ id: 1 }), operation: (values) => values.map(row => row.name += " Oh Oh") },
    NameOfPatient: "name",
    Age: "age"
  }
  print("Operation", jsonOut(directive, sheet.models))

  // the directive above would produce the output. Note the transformed value of "NameOfPatient"
  // {
  //     ID : 1,
  //     NameOfPatient : "Patty O'Furniture. Khan",
  //     Age: "age"
  // }

}

function handling() {
  const [sheet] = loader([1550146239])

  // updated directive to point to the required model
  let directive = {
    NameOfPatient: { key: "name", model: "Patient History" },
    Age: "age"
  }

  // any key could have been used to point to the required model
  directive = {
    NameOfPatient: "name",
    Age: { key: "age", model: "Patient History" },
  }

  // normally response bodies are nested objects
  let response = {
    NameOfPatient: "Patty O'Furniture.",
    Age: 25,
    Vitals: { "BP": "121 - 82", "Pulse": 72, "Temp": 98, "Weight": 65 }
  }

  // updated directive
  directive = {
    NameOfPatient: { key: "id", model: "Patient History" },
    Age: "age",
    Vitals: {
      BP: { key: "bp", model: "Vitals" },
      Pulse: "pulse",
      Temp : "temp",
      Weight : "weight"
    }
  }

  // directives also accept an operation attribute to transform response bodies. 
  // see upated directive below for how an id will be assigned to 'Vitals' object.
  // nextMaxInteger is a generator function which comes with the framework
  // 'all' method on a table model sets the pointer to point at all values
  const idGen = nextMaxInteger("id", sheet.models['Patient History'].all().value)
  directive = {
    NameOfPatient: { key: "name", model: "Patient History", 
      operation: (obj) => obj.Vitals.id = idGen.next().value },
    Age: "age",
    Vitals: {
      id : "pid",
      BP: { key: "bp", model: "Vitals" },
      Pulse: "pulse",
      Temp : "temp",
      Weight : "weight"
    }
  }

  // use jsonIn function to populate table models
  jsonIn(directive, sheet.models, response)
  // update sheet with new data from response
  // sheet.commit()

  // response bodies nested object can also be arrays
  response = {
    NameOfPatient: "Patty O'Furniture.",
    Age: 25,
    Tests: [
      { "Name": "Complete Blood Count" },
      { "Name": "Basic Metabolic Panel" },
      { "Name": "Comprehensive Metabolic Panel" }
    ]
  }

  // updated directive below. note the many attribute in nested directive.
  // assignId function to to assign ids to Test objects.
  const assignId = obj => {
    const pid = idGen.next().value
    obj.Tests.forEach(t => t.id = pid)
  }
  directive = {
    NameOfPatient: { key: "name", model: "Patient History", operation : assignId },
    Age: "age",
    Tests: {
      id : "pid",
      Name: { key: "name", model: "Tests", many: true } 
    }
  }

  jsonIn(directive, sheet.models, response)
  // update sheet with new data from response
  sheet.commit()

}

function deleteTable() {
  loader().deleteTable()
}

function print(feature, data) {
  console.log(feature)
  console.log(data)
}

