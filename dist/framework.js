const sheetId = 1083321884

var CONFIG = {
    SS: SpreadsheetApp.getActiveSpreadsheet(),
    TESTING: true,
    HEADER_ROW: 1,
    COLORS: ['#d9d9d9', '#f3f3f3'],
    BANDINGS : {
      DEFAULT : {
        rheader : null,
        rfirst : '#d9d9d9',
        rsecond : '#f3f3f3',
        rfooter : null
      }
    },
    SCHEMA_SHEET :{
      sheetId : sheetId,
      tables : [{
        tableName : "Schemas",
        schema : {
          sheetId : "sheetId",
          tableName : "tableName",
          key : "key",
          header : "header",
          autoIncrease : "autoIncrease",
          uniqueId : "uniqueId",
          type: "type"
        }
      },{
        tableName : "Table Properties",
        schema : {
          sheetId : "sheetId",
          tableName : "tableName",
          groupRow : "groupRow",
          isLastRowTemplate : "isLastRowTemplate",
          model : "model",
          strictCheck : "strictCheck",
          delete : "delete",
          warehouse : "warehouse"
        }
      },{
        tableName : "Destinations",
        schema : {
          name : "name",
          app : "app",
          spreadsheetId : "spreadsheetId",
          sheetId : "sheetId",
          tableName : "tableName",
          email : "email"
        }
      }],
      getTableConfigByName : function(name){
        return this.tables.find(table => table.tableName === name)
      }
    },
    getModels : function(){ return {
      Model : Model,
      BypassStrictSchemaCheck : BypassStrictSchemaCheck,
      APIModel : APIModel
    }},
    DB: SpreadsheetApp.getActiveSpreadsheet() // could also be a JDBC connection
  };

  CONFIG.SSID = CONFIG.SS.getId()
  
  CONFIG.SHEETS = {};
  CONFIG.SHEETS.OBJs = CONFIG.SS.getSheets();
  CONFIG.SHEETS.MAP = CONFIG.SHEETS.OBJs.map(sheet => { return { id : sheet.getSheetId(), name : sheet.getName() } });
  
  function authorize(){
    
    
  }

  class ssManagerError extends Error {
    constructor(e) {
      super(e);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
 * mapping array with steps
 * @param steps - number of items to skip
 * @param func - function applied on each item of the array
 * */ 
Array.prototype.steps = function(steps, func){

    let jump = 1;
  
    for(let i = steps[0], j = 1; i < this.length; i+=jump) {   
      if(i === steps[j]) {
        jump = steps[++j] - i; ++j;
      } else jump = 1
      this[i] = func(this[i])
    }
  
    return this
  }
  
  /**
   * remove empty cells beyond data range from sheet
   * @param sht - sht object
   * TODO: Sheets API
   */
  function removeTrailingEmptyCells(sht){
    const [x1, y1] = [sht.getLastRow() + 1, sht.getLastColumn() + 1]
    const [x2, y2] = [sht.getMaxRows() - x1, sht.getMaxColumns() - y1]
    if(x2 > 0) sht.deleteRows(x1, x2)
    if(y2 > 0) sht.deleteColumns(y1, y2)
  }
  
  /**
   * remove empty cells beyond data range for all sheets
   * TODO: Sheets API
   */
  function removeTrailingEmptyCellsFromAllSheets(){
    CONFIG.SS.getSheets().forEach(removeTrailingEmptyCells)
  }
  
  /**
   * loads data into SheetTables object
   * @param ids {Array} - array of sheet ids with required tables
   * @param spreadsheetId {String} - spreadsheet id with the required sheets
   */
  function loader(ids, spreadsheetId = CONFIG.SS.getId()){
  
    // building requests for required data
    const builder = new BatchRequestsBuilder()
    let params = [
  
      // params for getting data range values
      { ids : ids, spreadsheetId : spreadsheetId },
  
      // data range formulas
      { ids : ids, spreadsheetId : spreadsheetId, formula : true },
  
      // schema sheet data range values
      { ids : [CONFIG.SCHEMA_SHEET.sheetId], spreadsheetId : spreadsheetId }
    ]
    const requests = params.map(p => builder.get(p))
  
    // trying requests
    let responses = undefined
    try {
      responses = UrlFetchApp.fetchAll(requests).map(response => JSON.parse(response.getContentText()))  
    } catch (e) {
      throw new ssManagerError(e)
    }
  
    /**
     * pop valueRanges from responses
     * @param r - response ref: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGetByDataFilter
     */
    const pop = r => r.pop().valueRanges
  
    /**
     * initializing schema manager
     * @param params.dataRange - data range of schema manager sheet as 2D array
     */
    params = { dataRange : pop(responses)[0].valueRange.values }
    const SM = new SchemaManager(params)
  
    /**
     * get sheet id from response
     * @param o - matchedValueRange ref: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGetByDataFilter#MatchedValueRange
     */
    const sheetId = o => o.dataFilters[0].gridRange.sheetId
  
    /**
     * sort response by sheet id
     * @param a - matchedValueRange ref: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGetByDataFilter#MatchedValueRange
     */
    const sorter = (a,b) => sheetId(a) - sheetId(b)
  
    params = pop(responses) // pop valueRanges for requested sheet ids as 2D array
      .sort(sorter) // sorting by sheetId to set formula respectively
      .map(range => {
        /**
         * getting params for SheetTables constructor
         * @param id - sheet id
         * @param params.dataRange - data range of the sheet as 2D array
         */
        const [id, params] = [sheetId(range), { schemaTable : SM.schemaTable, propertiesTable : SM.propertiesTable, dataRange : range.valueRange.values }]
        return [id, params]
      });
  
    // modifying SheetTable's constructor params with formula data ranges
    const STs = pop(responses)
      .sort(sorter)
      .map((range, i) => {
        const [id, params_] = params[i]
        params_.formulaRange = range.valueRange.values
        return new SheetTables(id, params_)
      })
  
    // returning in order of input @param ids and attaching schema manager at the end.
    return [...ids.map(id => STs.find(ST => ST._sheetId === id)), SM]  
    
  }
  
  function jsonOut(directive, models){
    return new DirectiveInterpreter(directive, models).json
  }
  
  function jsonIn(directive, models, json){
    new DirectiveInterpreter(directive, models).json = json
  }
  
  /**
   * Allowed json structure a key's value can only be a primitive type, an object with key value pair, an array of objects with key value pairs
   * for example a key's value cannot be an array of primitive types
   */
  function jsonToModel(json, directive = {}){
  
    const model = new Model()
    const schema = {}
    const data = []
  
    let array = json
    if(array.constructor.name === "Object") array = [array]
    array.forEach(json => {
  
      const row = {}
      for(let key in json){
        if(isPrimitive(json[key])){
  
          schema[key] = key
          row[key] = json[key]
  
        } else {
  
          if(json[key].constructor.name === "Array" && json[key].some(value => isPrimitive(value))) throw new ssManagerError("a key's value cannot be an array of primitive types")
  
          model.nestedModel = { 
            name : '$' + key,
            model : jsonToModel(json[key])
          }
  
        }
      }
      data.push(row)
  
    })
  
    model.initialize(schema)
    model.addFirst(data)
  
    return model
  
  }
  
  // join array of objects
  // d1 picks a subset from d2 where d1[x][query.a] === d2[x][query.b]
  // TODO: enable joined table to be joined with another by referencing keys without table name
  let join = (d1, d2, query) => {
  
    const [a, b] = Object.keys(query)
  
    d1 = d1.sort(compareValues(query[a]))
    d2 = d2.sort(compareValues(query[b]))
  
    let d12 = []
    let i2 = 0
    let v1 = undefined
    let i2Copy = i2
  
    d1.forEach(row1 => {
  
      if(v1 === row1[query[a]]) i2 = i2Copy
      else i2Copy = i2
  
      v1 = row1[query[a]]
  
      while(d2[i2] !== undefined && row1[query[a]] === d2[i2][query[b]]){
  
        // avoiding duplicate keys
        const row = {}
        let newkey = undefined
        for(let key in row1) { 
          newkey = key.split(".").length > 1 ? key : `${a}.${key}`; 
          row[newkey] = row1[key]
        }
        const row2 = d2[i2]
        for(let key in row2) {
          newkey = key.split(".").length > 1 ? key : `${b}.${key}`; 
          row[newkey] = row2[key]
        }
        d12.push(row)
  
        ++i2;
      }
  
    })
  
    return d12
  }
  
  let isPrimitive = (val) => {
      
    if(val === null){
        return true
    }
      
    if(typeof val == "object" || typeof val == "function"){
      return false
    }else{
      return true
    }
  }
  
  class DirectiveInterpreter {
    constructor(directives,models){
  
      this._directives = directives
      this._models = models
      this._separatedjson = []
  
    }
  
    get json(){
  
      return this._output()
  
    }
  
    _assignRefs(refs, item, input = false){
      let object = {}
  
      for(let key in refs){
  
        const modelKey = refs[key]
  
        if(input === false && item[modelKey] !== undefined) {
            object[key] = item[modelKey]
        } else if(input === true && item[key] !== undefined) {
            object[modelKey] = item[key]
        }
      }
  
      return object
    }
  
    _output(directives = this._directives){
  
      let nested = {}
  
      let currentLevel = {}
  
      let currentLevelRefs = {}
  
      for(let key in directives){
        let container = directives[key]
        if(typeof container !== "object") currentLevelRefs[key] = container
      }
  
      // separating level from nested objects
      for(let key in directives){
  
        // container is a directive container with all operation properties e.g { key : "tableKey", filter : () => { ... }, operation : () => { ... } }
        let container = directives[key]
  
        if(container.constructor.name === "Array") throw new ssManagerError("directive cannot be an array")
  
        if(container !== undefined && container.constructor.name === "Object" && Object.keys(container).every(key => typeof container[key] !== 'function')){
          
          nested[key] = this._output(directives[key])        
          if(Object.keys(nested[key]).length === 0) delete nested[key]
  
        } else if (container.constructor.name === "Object" && Object.keys(container).some(key => typeof container[key] === 'function')) {
          
          const model = container.filter(this._models)
          let values = model.value
          if(container.operation !== undefined) values = container.operation(values)
          let many = container.many === true
  
          if(many){
  
            currentLevel = values.map(item => {
              if(item[container.key] === undefined) throw new ssManagerError(`tableKey "${container.key}" not found in model for contructing Array`)
              return {
                [key] : item[container.key],
                ...this._assignRefs(currentLevelRefs, item)
              }
            })
  
          } else if(values[0] !== undefined && values[0].constructor.name === "Object") {
  
            values = values[0]
            if(values[container.key] === undefined) throw new ssManagerError(`tableKey "${container.key}" not found in model for constructing Object`)
            currentLevel[key] = values[container.key]
            Object.assign(currentLevel, this._assignRefs(currentLevelRefs, values))
  
          } else {
  
            currentLevel[key] = values
  
          }       
  
        } 
  
      }
  
      if(currentLevel.constructor.name === "Array") return currentLevel.map(object => { return { ...object, ...nested } })  
      else return { ...currentLevel, ...nested }
  
    }
  
    _identifyDirectives(directives = this._directives){
  
      for(let key in directives){
        let directive = directives[key]
        if(directive.constructor.name === "Object" 
          && directive.model !== undefined
          && directive.key !== undefined
          && this._models[directive.model] !== undefined
          && this._models[directive.model].schema[directive.key.underscore()] !== undefined){
  
          directive.isDirective = true
  
        } else if (directive.constructor.name === "Object"){
  
          this._identifyDirectives(directive)
  
        }
      }
      
    }
  
    _input(data, directives = this._directives){
  
      this._identifyDirectives()
  
      let currentLevel = {}
  
      let currentLevelRefs = {}
  
      let name = ""
  
      for(let key in directives){
        let container = directives[key]
        if(typeof container !== "object") {
          currentLevelRefs[key] = container
        }
      }
  
      let many = Object.keys(directives).some(key => directives[key].isDirective === true && directives[key].many === true)
  
      // separating level from nested objects
      for(let key in directives){
  
        // container is a directive container with all operation properties e.g { key : "tableKey", filter : () => { ... }, operation : () => { ... } }
        let container = directives[key]
  
        if(container.constructor.name === "Array") throw new ssManagerError("directive cannot be an array")
  
        if(container !== undefined && container.constructor.name === "Object" && container.isDirective === undefined){
  
          if(many){
            data.forEach(item => {
  
              if(item[key] !== undefined)
                this._input(item[key], directives[key])
  
            })
          } else {
  
            if(data[key] !== undefined)
              this._input(data[key], directives[key])
  
          }
  
        } else if (container.constructor.name === "Object" && container.isDirective === true) {
          
          name = container.model
  
          let tableKey = container.key
  
          let operation = container.operation
  
          if(typeof operation === "function") {
  
            if(many) {
  
              data.forEach(item => {
  
                operation(item)
  
              })
  
            } else {
  
              operation(data)
  
            }
            
          }
  
          let array = container.array === true
  
          if(many){
  
            currentLevel = data.map(item => {
  
              if(item[key] === undefined) item[key] = ""
  
              return { 
                [tableKey] : item[key],
                ...this._assignRefs(currentLevelRefs, item, true)
              }
  
            })
  
          } else if (array){
  
            if(data[key] === undefined) data[key] = []
  
            currentLevel = data[key].map(item => {
  
              return { [container.key] : item }
  
            })
  
          } else if(!(array || many)) {
  
            if(data[key] === undefined) data[key] = ""
  
            currentLevel[tableKey] = data[key]
  
            Object.assign(currentLevel, this._assignRefs(currentLevelRefs, data, true))
  
          }
  
          this._models[name].addLast(currentLevel)   
  
        } 
  
      }
  
    }
  
    set json(data){
      this._input(data)
    }
  }
  
  function rows(all_data_map, level){
  
    return all_data_map
    .filter(row => row[0].level === level)
    .reduce((a, c) => {
  
      return [
        ...a,
  
        c.reduce((a, c) => { return { ...a, [c.map] : c.data }}, {})
      ]
  
    }, [])
  
  }
  
  function mapper(map, object, all_data_map = [], level = 0){
  
    if(object.constructor.name === "Object") {
  
      const data_map = []
  
      for(let key in object){
  
        // a string value for map[key] or object[key] in both tests will skip this condition and finalize data map
        if([object, map].every(o => o[key] !== undefined && o[key].constructor.name === "Object") 
        || [object, map].every(o => o[key] !== undefined && o[key].constructor.name === "Array")){
  
          mapper(map[key], object[key], all_data_map, level + 1)
  
        } else {
  
          if(object[key].constructor.name === "Array") {
            const array = object[key]
            if(array.length > 0){
              data_map.push({ data : array[0], map : map[key], level : level })
              if(array.length > 1) mapper(map[key], array.slice(1), all_data_map, level)
            }
          } else data_map.push({ data : object[key], map : map[key], level : level })
  
        }
      }
  
      if(data_map.length > 0) all_data_map.push(data_map)
  
    } else if([object, map].every(o => o.constructor.name === "Array")) {
  
      map = map[0]
  
      if(!(map.constructor.name === "Object")) throw new ssManagerError(`1. map is not object`)
  
      object.forEach(item => {
        
        if(!(item.constructor.name === "Object")) throw new ssManagerError(`2. item is not object`)
        mapper(map, item, all_data_map, level)
  
      })
  
    } else if(map !== undefined && object !== undefined && map.constructor.name === "String" && object.constructor.name === "Array"){
  
      object.forEach(item => all_data_map.push([{ data : item, map : map, level : level }]))
  
    }
  
    return all_data_map
  
  }
  
  String.prototype.replaceAt = function(index, replacement, diff = 0) {
      let end = this.substr(index + replacement.length + diff)
      if((this.length - 1) === index) end = ""
      return this.substr(0, index) + replacement + end;
  }
  // Ref: https://stackoverflow.com/a/1431113/2319414
  
  function timeIt(name, func, args, this_ = this){
    const start = new Date().getTime()
    const value = func.apply(this_, args)
    const end = new Date().getTime()
  
    log(`${name} : ${end - start}`)
  
    return value
  }
  
  function queryfy(obj){
    let query = []
  
    for(let key in obj) query.push(`${key}=${obj[key]}`)
  
    return query.join("&")
  }
  
  function updateObject(object, data){
  
    for(let key in data) {
      if(object.hasOwnProperty(key)) object[key] = data[key]
    }
  
  }
  
  class BatchRequestsBuilder {
  
    constructor(){
      this._batchRequests = []
    }
  
    get batchRequests(){
      return this._batchRequests
    }
  
    set batchRequests(batchRequests){
      this._batchRequests = batchRequests
    }  
  
    updateRequest(row, startRowIndex){
  
      const template = JSON.parse(JSON.stringify(BatchRequests.update.template))
      this._setRows(template, row)
      this._setRange(template, { startRowIndex : startRowIndex, endRowIndex : startRowIndex + 1 }) 
  
      this._batchRequests.push(template)
  
    }
  
    insertRequest(startIndex, endIndex){
      const template = JSON.parse(JSON.stringify(BatchRequests.insert.template))
      this._setRange(template, { startIndex : startIndex, endIndex : endIndex }) 
      this._batchRequests.push(template)
    }
  
    _setRepeatCell(template, value){
      template[this._requestName(template)].cell.userEnteredValue.formulaValue = value
    }
  
    _setRows(template, row){
      const values = Object.values(row).map((value) => {
        let userEnteredValue = undefined
  
        if(typeof value === "string") userEnteredValue = { "stringValue" : value }
        else if(typeof value === "boolean") {
  
          if(value) value = 'TRUE'
          else value = 'FALSE'
  
          userEnteredValue = { "boolValue" : value }
        }
        else userEnteredValue = { "numberValue" : value instanceof Date ? googleDate(value) : value }
  
        const cell = {
          "userEnteredValue" : userEnteredValue         
        }
  
        return cell
      })
  
      template[this._requestName(template)].rows = { "values" : values }
    }
  
    _requestName(template){
      return Object.keys(template)[0]
    }
  
    _setRange(template, range, key = "range"){
  
      const name = this._requestName(template)
  
      template[name][key] = {
        ...template[name][key],
        ...range
      }
  
      return this
  
    }
  
    _getRange(template, key = "range"){
      const name = this._requestName(template)
  
      return template[name][key]
    }
  
    repeatRequest(formula, startColumnIndex, startRowIndex, endRowIndex){
      const template = JSON.parse(JSON.stringify(BatchRequests.repeat.template))
      this._setRepeatCell(template, formula)
      this._setRange(template, {
        "startColumnIndex": startColumnIndex,
        "endColumnIndex":startColumnIndex + 1,
        "startRowIndex": startRowIndex,
        "endRowIndex": endRowIndex
      })
      this._batchRequests.push(template)
    }
  
    copyPasteRequest(source, destination){
      const template = JSON.parse(JSON.stringify(BatchRequests.copyPaste.template))
      const name = this._requestName(template)
      template[name].source = source
      template[name].destination = destination
      this._batchRequests.push(template)
    }
  
    deleteRequest(startRowIndex){
      const template = JSON.parse(JSON.stringify(BatchRequests.delete.template))
      this._setRange(template, { startIndex : startRowIndex, endIndex : startRowIndex + 1 })    
      this._batchRequests.push(template)
    }
  
    deleteAllRequest(startRowIndex, endRowIndex){
      const template = JSON.parse(JSON.stringify(BatchRequests.delete.template))
      this._setRange(template, { startIndex : startRowIndex, endIndex : endRowIndex })    
      this._batchRequests.push(template)
    }
  
    updateLocation(sheetId, rowFirstData){
      const update = range => {
        for(let row in range){
          // condition to confirm if object key is representing row
          if((row.indexOf('start') !== -1 || row.indexOf('end') !== -1) && row.indexOf('Column') === -1){
            range[row] = range[row] + rowFirstData - 1
          }
        }
      }
  
      this._batchRequests.forEach(request => {
  
        const name = this._requestName(request)
  
        if(name === "copyPaste") throw new ssManagerError("copyPaste requests update location not supported")
  
        this._setRange(request, { sheetId : sheetId })
        let range = this._getRange(request)
        update(range)
        
  
      })
    }
  
    get(params){
      let ids = undefined, template = undefined;
      if(params.constructor.name === "Object" && params.spreadsheetId !== undefined){
        ids = params.ids;
        template = BatchRequests.templates.get(params.spreadsheetId)
      } else ids = params
  
      const payload = ids.reduce((a,id) => {
        return BatchRequests.get(id, a)
      }, undefined)  
  
      if(params.formula === true) payload.valueRenderOption = "FORMULA"
  
      if(template === undefined) return payload
      else return { ...template, "payload" : JSON.stringify(payload) }
    }
  
    reset(){
      this._batchRequests = []
    }
  
  }
  
  const BatchRequests = {
    repeat : {
      template : {
        "repeatCell": {
          "cell": {
            "userEnteredValue": {
              "formulaValue": ""
            }
          },
          "range":{
            "sheetId": -1,
            "startColumnIndex": -1,
            "endColumnIndex":-1,
            "startRowIndex": -1,
            "endRowIndex": -1
          },
          "fields":"userEnteredValue,formattedValue"
        }
      }
    },
    delete : {
      template : {
        "deleteDimension": {        
            "range": {
              "sheetId": -1,
              "dimension": "ROWS",
              "startIndex": -1,
              "endIndex": -1
            }        
        }
      },
    },
  
    update : {
      template : {
        "updateCells" : {
          "rows" : {},
          "fields" : "userEnteredValue,formattedValue",
          "range" : {
            "sheetId": -1,
            "startColumnIndex": 0,
            "startRowIndex": -1,
            "endRowIndex": -1
          }
        }
      },
    },
  
    insert : {
      template : {
        "insertDimension": {
          "inheritFromBefore": false,
          "range": {
            "dimension": "ROWS",
            "startIndex": -1,
            "endIndex": -1,
            "sheetId": -1
          }
        }
      },
    },
  
    repeat : {
      template : {
        "repeatCell": {
          "cell": {
            "userEnteredValue": {
              "formulaValue": ""
            }
          },
          "range":{
            "sheetId": -1,
            "startColumnIndex": -1,
            "endColumnIndex": -1,
            "startRowIndex": -1,
            "endRowIndex": -1
          },
          "fields":"userEnteredValue,formattedValue"
        }
      }
    },
  
    copyPaste : {
      template : {
        "copyPaste": {
          "source": { },
          "destination": { },
          "pasteOrientation": "NORMAL",
          "pasteType": "PASTE_FORMULA"
        }
      }
    },
  
    get : (sheetId, request) => {
  
      if(request === undefined || request.constructor.name === "Array"){
        request = {
          "dateTimeRenderOption": "SERIAL_NUMBER",
          "majorDimension": "ROWS",
          "valueRenderOption": "UNFORMATTED_VALUE",
          "dataFilters" : []
        }
      }
  
      request["dataFilters"]
      .push({
        "gridRange": {
          "sheetId": sheetId,
          "startRowIndex": 0
        }
      })
  
      return request
    },
  
    templates : {
      get : (spreadsheetId) => {
        // request template
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGetByDataFilter`
        const headers = {
          "Authorization" : `Bearer ${ScriptApp.getOAuthToken()}`,
          "Accept" : "application/json",
          "Content-Type" : "application/json"
        }
        return {
          url : url,
          headers : headers,
          method : "post"
        }
      }
    }
  }
  
  const ComparisonMask = {
  
    and : function(query, data){
      return data.map( (row, i) => matches(query, row) ? i : null )
    },
  
    or  : function(query, data){
      return data.map( (row, i) => matches(query, row, false, 'some') ? i : null )
    },
  
    nand :  function(query, data){ 
      return data.map( (row, i) => !matches(query, row) ? i : null )
    },
  
    nor :  function(query, data){ 
      return data.map( (row, i) => !matches(query, row, false, 'some') ? i : null )
    },
  
    less  : function(query, data, equal = false){ 
  
      const criteria = equal ? this.criteria['<='] : this.criteria['<']
  
      return data.map( (row, i) => matches(query, row, false, 'every', criteria) ? i : null )
  
    },
  
    greater  : function(query, data, equal = false){
  
      const criteria = equal ? this.criteria['>='] : this.criteria['>']
  
      return data.map( (row, i) => matches(query, row, false, 'every', criteria) ? i : null )
  
    },
  
    criteria : {
      '=' : function(a, b){ return a === b },
      '>' : function(a, b){ return a > b },
      '>=' : function(a, b){ return a >= b },
      '<' : function(a, b){ return a < b },
      '<=' : function(a, b){ return a <= b }
    }
  
  }
  
  class SchemaManager {
    /**
     * @param params - an object referencing schemaTable and propertiesTable
     */
    constructor(params = undefined){
  
      // params are not defined instantiate schema table and properties table
      if(this.constructor.name === "SchemaManager" && params.dataRange !== undefined) {
  
        this._schemaTable = this.getSchemaTable("Schemas", params.dataRange)
        this._propertiesTable = this.getSchemaTable("Table Properties", params.dataRange)
  
      } else {
  
        this._schemaTable = params.schemaTable || this.getSchemaTable()
        const dataRangeValues = this._schemaTable.dataRangeValues
        this._propertiesTable = params.propertiesTable || this.getSchemaTable("Table Properties", dataRangeValues)
        this._propertiesTable.next = this._schemaTable
  
      }
  
      /**
       * REGISTER ALL SCHEMA TABLES
       */
      this._schemaTables = {
        schemaTable : this._schemaTable,
        propertiesTable : this._propertiesTable
      }
  
    }
  
    get schemaTables(){
      return this._schemaTables
    }
  
    get schemaTable(){
      return this._schemaTable
    }
  
    get propertiesTable(){
      return this._propertiesTable
    }
  
    // inserts a new column in schemaTable
    insertColumn(column, sheetId, tableName){
  
      const schemaTable = this._schemaTable
  
      schemaTable.model.filter({ sheetId : sheetId, tableName : tableName }).addAbove({ sheetId : sheetId, tableName : tableName, header : column })
  
      // schemaTable.write()
  
      schemaTable.commit()
  
    }
  
    // deletes a column from schema table
    deleteColumn(column, deleteMultiple = false){
  
      const schemaTable = this._schemaTable
  
      // const sheetId = this._table.sheet.getSheetId()
      const sheetId = this._sheetId
  
      const tableName = this._table.name
  
      schemaTable.model.filter({ sheetId : sheetId, tableName : tableName, header : column })
  
      if(deleteMultiple === false && schemaTable.model.value.length > 1) throw new ssManagerError(`Multiple headers by the name ${column} found. To proceed set deleteMultiple flag to true`)
  
      // schemaTable.del()
      schemaTable.model.del().table.commit()
  
    }
  
    updateColumn(column, replace, sheetId, tableName, deleteMultiple = false){
  
      const schemaTable = this._schemaTable
  
      schemaTable.model.filter({ sheetId : sheetId, tableName : tableName, header : column })
  
      if(deleteMultiple === false && schemaTable.model.value.length > 1) throw new ssManagerError(`Multiple headers by the name ${column} found. To proceed set deleteMultiple flag to true`)
  
      schemaTable.model.set({ header : replace })
  
      // schemaTable.write()
  
      schemaTable.commit()
    }
  
    // gets a table from schema sheet. Schema for all tables in schema sheet are hardcoded in Config.gs
    getSchemaTable(tableName = "Schemas", dataRangeValues = undefined){
  
      const schemaTableConfig = CONFIG.SCHEMA_SHEET.getTableConfigByName(tableName)
  
      const table = new WritableTable(
        {
          table : {
            name : schemaTableConfig.tableName,
            isLastRowTemplate : true
          },
  
          model : schemaTableConfig.schema,
  
          // sheet : getSheetById(CONFIG.SS, CONFIG.SCHEMA_SHEET.sheetId),
  
          sheetId : CONFIG.SCHEMA_SHEET.sheetId,
  
          dataRangeValues : dataRangeValues
        }
      )
  
      return table
    }
  
    // get any schema defined in schema sheet
    getSchema(sheetId, tableName, modelOnly = false){
  
      const schemaTable = this._schemaTable
  
      let filter = { tableName : tableName }
  
      if(modelOnly === false ) filter.sheetId = sheetId
  
      const schemaData = schemaTable.model.filter(filter).value
  
      // schema builder
      const reducer = (a, c) => {
  
        // if key is not specified generate it buy replacing spaces, parenthesis and slashes by underscore
        const key = c.key === "" ? c.header.underscore() : c.key
  
        return {
          ...a,
          [key] : c
        }
  
      }
  
      this._currentSchema = schemaData.reduce(reducer,{})
  
      return this._currentSchema
    }
  
    insertNewTable(params = { isLastRowTemplate : true, model : "BypassStrictSchemaCheck" }){
  
      const rng = SpreadsheetApp.getActiveRange()
  
       // TESTING
      // const rng = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("components").getRange("A1:C2")
  
      const values = rng.getValues()
      const sheet = rng.getSheet()
      const sheetName = sheet.getName()
      const sheetId = sheet.getSheetId()
      let groupRow = 0
      let destination = undefined
  
      if(values.length === 1) throw new ssManagerError('Table cannot have one row') 
  
      const headerRow = values.length - 1
  
      // if(values.length > 3) throw new ssManagerError('Active range has more than 3 rows. Only table name and header row should be included')
  
      if(values.length >= 3) {
        const groups = values[headerRow - 1].filter(v => v !== "").length
        const headers = values[headerRow].filter(v => v !== "").length
  
        if(headers <= groups)
          throw new ssManagerError('Invalid group row')
        
        // first non empty cell is named destination
        destination = values[headerRow - 1].find(value => value !== "")
  
        // -1 for header row and -1 for table name
        groupRow = values.length - 1 - 1
      }
      
  
      // first row of active range is expected to be table name
      const tableName = values[0].reduce((a, c) => a + c)
      // last row is expected to have headers
      const headers = values[headerRow]
  
      // rows to be added to schema table
      const rows = []
      headers.forEach(header => rows.push({
        sheetId : sheetId,
        tableName : tableName,
        header : header
      }))
  
      const schemaTable = this._schemaTable
  
      if(schemaTable.model.filter({ sheetId : sheetId, tableName : tableName }) !== false) throw new ssManagerError(`Table ${tableName} already added on sheet ${sheetName}`)
  
      schemaTable.model.addLast(rows).table.commit()
  
      if(params.model === "BypassStrictSchemaCheck") params.strictCheck = false
      else params.strictCheck = true
  
      this._propertiesTable.model.addLast({...params, sheetId : sheetId, tableName : tableName, groupRow : groupRow }).table.commit()
  
      // if(destination !== undefined) this._destinationsTable.model.addLast({ name : destination, app : 'spreadsheet', sheetId : sheetId, tableName : tableName }).table.commit()
  
    }
  
    deleteTable(){
      let tablesToDelete = this._propertiesTable.model.filter({ delete : true })
  
      if(tablesToDelete !== false){
        tablesToDelete.value.forEach(table => {
          const filter = { sheetId : table.sheetId, tableName : table.tableName }
          this._schemaTable.model.filter(filter).del().table.commit()
        })
      }
  
      tablesToDelete.del().table.commit()
    }
  }
  
  class WorkflowManager extends SchemaManager {
    constructor(sheetId, params = undefined){
      super(params)
      this._sheetTables = new SheetTables(sheetId, { schemaTable : this._schemaTable, propertiesTable : this._propertiesTable })
      this._workflowTables = this._sheetTables.tables
    }
  
    insertTableKey(){
  
      const keys = CONFIG.SS.getActiveRange().getValues()[0]
      // TESTING
      // const keys = ['a', 'b', 'c']
  
      if(!keys.every(key => typeof key === "string")) throw new ssManagerError("Non string value found")
  
      this._workflowTables['table key'].model.addLast(
  
        keys.filter(key => key !== "")
        .map(key => { return { key : key } })
  
      ).table.commit()
  
    }
  
    insertStates(){
      const ranges = CONFIG.SS.getActiveRangeList().getRanges();
  
      ranges.forEach(range => {
  
        const tableName = range.getValue()
  
        if(typeof tableName !== "string") throw new ssManagerError("Non string value found")
  
        this._workflowTables['states'].model.addLast({ table_name : tableName })
  
      })
  
      this._workflowTables['states'].commit()
    }
  }
  
  function committer(tables){
    let requests = []
  
    tables.forEach(table => {
      const batchRequests = table.getBatchRequests()
  
      if(batchRequests.length > 0){
        table.commitValues()
        requests = [
          ...requests,
          ...batchRequests
        ]        
      }
  
    })
  
    if(requests.length > 0) Sheets.Spreadsheets.batchUpdate({ requests : requests }, CONFIG.SS.getId())
  }
  
  class SheetTables extends SchemaManager {
  
    constructor(sheetId, params = undefined){
  
      super(params)
      this._tables = {};
      this._sheetId = sheetId
  
      if(params !== undefined) {
        this._dataRangeValues = params.dataRange
        this._formulaRangeValues = params.formulaRange
      }
      if(sheetId !== undefined) this.getTables(sheetId)
    }
  
    table(key){
      const table = this._tables[key]
      if(table === undefined) throw new ssManagerError(`Table "${key}" not found. SheetId "${this._sheetId}".`)
      return table
    }
  
    set formula(dataRange){
      this.asArray.forEach(table => table.formula = dataRange)
    }
  
    get models(){
      return this._models    
    }
  
    // insert table
    insert(params){
  
      let sheet = undefined
      for(let t in this._tables){
        sheet = this._tables[t].sheet; break;
      }
      if(sheet === undefined) sheet = getSheetById(CONFIG.SS, this._sheetId)
      const lastRow = sheet.getLastRow()
      sheet.appendRow([params.name])
      const groupRow = sheet.getLastRow()
  
      // getting table header from schema
      const headers = []
      const schemas = []
  
      params.headers.forEach(header => {
        const schema = {}
  
        if(header.constructor.name === "Object") {
  
          const header = header.header
          headers.push(header)
          schema.header = header
          schema.autoIncrease = header.autoIncrease === true,
          schema.uniqueId = header.uniqueId === true
  
        } else {
  
          headers.push(header)
          schema.header = header
  
        }
  
        schemas.push({
          ...schema,
          sheetId : this._sheetId,
          tableName : params.name,
        })
      }) 
  
      const isLastRowTemplate = params.isLastRowTemplate === false ? false: true
  
      if(isLastRowTemplate) {
        sheet.appendRow(headers)
        sheet.appendRow(["_"])
      } else sheet.appendRow(headers)
  
      if(params.groupRow > 0) sheet.insertRowsAfter(groupRow, params.groupRow)
  
      // insert row between last table and new one
      if(lastRow > 0) sheet.insertRowAfter(lastRow)
  
      const schemaTable = this._schemaTable
  
      if(schemaTable.model.filter({ sheetId : this._sheetId, tableName : params.name }) !== false) throw new ssManagerError(`Table ${tableName} already added on sheet ${sheetName}`)
  
      schemaTable.model.addLast(schemas).table.commit()
  
      params.groupRow = params.groupRow > 0 ? params.groupRow : 0
  
      this._propertiesTable.model.addLast({ 
        isLastRowTemplate : isLastRowTemplate, 
        sheetId : this._sheetId, 
        tableName : params.name, 
        groupRow : params.groupRow,
        model : "Model",
        strictCheck : params.strictCheck === false ? false : true
      }).table.commit()
  
      this.getTables(this._sheetId)
    }
  
    del(name){
      const table = this._tables[name]
      if(table === undefined) throw new ssManagerError(`table ${name} not found`)
      const sheet = table.sheet
  
      // - 1 for table name
      const rowIndex = table.tableStart - table.groupRow - 1
      const count = table.tableEnd - rowIndex
      sheet.deleteRows(rowIndex + 1, count + 1) // count + 1 to remove empty row at the end of the table also
  
      // remove from schema
      this._schemaTable.model.filter({ sheetId : this._sheetId, tableName : name }).del().table.commit()
      this._propertiesTable.model.filter({ sheetId : this._sheetId, tableName : name }).del().table.commit()
    }
  
    get asModels(){
  
      const models = {}
  
      for(let key in this._tables){
        models[key] = this._tables[key].model
      }
  
      return models
    }
  
    add(sheetId){
  
      const tables = this._tables
  
      this._tables = {
        ...tables,
        ...this.getTables(sheetId)
      }
  
      return this._tables
    }
  
    get asArray(){
      return Object.entries(this._tables).map(([key, table]) => table)
    }
  
    commit(){
      committer(this.asArray)
    }
  
    apply(func, arg){
  
      Object.values(this._tables).reverse().forEach(table => {
  
        try {
  
          table.model[func].apply(table.model, arg)
  
        } catch(e) {
  
          if(e.message === "Cannot read property 'apply' of undefined") table[func].apply(table, arg) 
          else {
            log(e)
            return
          }
          
        }
        
      })
  
    }
  
    get tables(){
      return this._tables
    }
  
    getTables(sheetId, params = { filter : [], strict : true }){
  
      let sheetTableIds = this._propertiesTable.model.filter({ sheetId : sheetId }).value
      // this._schemaTable.model.filter({ sheetId : sheetId })
  
      if(sheetTableIds === undefined) return false
  
      // @param filter {Array} - array of table names
      if(params.filter.length > 0) sheetTableIds = sheetTableIds.filter(id => params.filter.indexOf(id.tableName) !== -1); 
  
      // @param tables {Array} - each item is an array of two items
      // item at index 0 is the table object and item and index 1
      // is tableStart row number which will be used to sort this array
      // and set next property of the tables
      let tables = []
  
      for(let i = 0; i < this._dataRangeValues.length; ) {  
  
        const currentRow = this._dataRangeValues[i];
        if(currentRow.length === 0) { i++; continue }
        const tableName = currentRow.reduce((a, c) => a + c)
        const sheetTableId = sheetTableIds.find(sheetTableId => sheetTableId.tableName === tableName)
  
        if(sheetTableId !== undefined){
  
          // getting table boundary and values
          i += (sheetTableId.groupRow ? sheetTableId.groupRow + 1 : 1)
          const tableStartRow = i
          const values = [];
          
          while(this._dataRangeValues[i] && this._dataRangeValues[i].length){
            values.push(this._dataRangeValues[i])
            i++;
          } 
          const tableEndRow = i;
  
          // API response when valueRenderOption is set to UNFORMATTED does not return values appended by array formulas.
          // for example a pivot table's data is appended like an array formula so it API response is empty and in order 
          // to get these values valueRenderOption is set to FORMULA 
          const formulaHeaderIndex = this._formulaRangeValues[tableStartRow].reduce((a, item, i) => { if(item !== "") { a.push(i); return a } }, [])
          if(formulaHeaderIndex.length > 0){
            values.forEach((value, i) => {
              formulaHeaderIndex.forEach(index => value[index] = this._formulaRangeValues[tableStartRow + i][index])
            })
          }
  
          // setting table
          const schema = this.getSchema(sheetTableId.sheetId, sheetTableId.tableName)
          const table = new WritableTable({
            table : { ...sheetTableId, name : sheetTableId.tableName },
            model : new Model(schema, sheetTableId.strictCheck),
            sheetId : sheetTableId.sheetId,
            tableStartRow : tableStartRow,
            tableEndRow : tableEndRow,
            values : values
          })
          table.formula = this._formulaRangeValues
          tables.push(table)
          sheetTableId.found = true
          
        } else i++
  
      }
  
      if(params.strict) {
        const notFound = sheetTableIds.filter(id => id.found !== true).map(id => `sheetId: ${id.sheetId}, tableName: ${id.tableName}`)
        if(notFound.length > 0) throw new ssManagerError("Tables not found \n" + notFound.join('\n'))      
      }
  
      // sorting tables how they appear from top to bottom in google sheet
      // and reducing array to tables only for simplicity later
      tables = tables.sort((a, b) => a.tableStart - b.tableStart)
  
      // resetting tables for new sheet tables
      this._tables = {}
      this._models = {}
  
      for(let i = 0; i < tables.length; i++){
  
        const table = tables[i]
  
        this._tables[table.name] = table
        this._models[table.name] = table.model
  
        // setting next property
        if(i > 0){
  
          const previousTableName = tables[i - 1].name
  
          this._tables[previousTableName].next = this._tables[table.name]
  
        }      
  
      }
  
      return this._tables
    }
    
  }
  
  function macroInsertNewTable(){
    new SchemaManager().insertNewTable()
  }
  
  function macroInsertNewTableParameters(){
    var ui = SpreadsheetApp.getUi(); // Same variations.
  
    var result = ui.prompt(
        'Table properties, to set default click Cancel',
        'Please enter comma separated values for parameters isLastRowTemplate and model e.g true,BypassStrictSchemaCheck',
        ui.ButtonSet.OK_CANCEL);
  
    // Process the user's response.
    var button = result.getSelectedButton();
  
    const SM = new SchemaManager()
    if(button == ui.Button.CLOSE || button == ui.Button.CANCEL) {
      SM.insertNewTable()
    } else {
      var text = result.getResponseText();
      
      const _ = text.split(",")
      const isLastRowTemplate = 'true' === _[0]
      const model = Object.keys(CONFIG.getModels()).indexOf(_[1]) !== -1 ? _[1] : undefined
  
      if(model === undefined) throw new ssManagerError(`invalid table parameter ${model}`)
  
      SM.insertNewTable({ isLastRowTemplate : isLastRowTemplate, model : model })
    }
  }
  
  function macroInsertWorkflowStates(){
    new WorkflowManager(1149096157).insertStates()
  }
  
  function macroInsertWorkflowTableKey(){
    new WorkflowManager(1149096157).insertTableKey()
  }
  
  function macroDeleteTable(){
    new SchemaManager().deleteTable()
  }
  
  const log = console.log;
  
  const sanitizeHeader = header => header.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s\s+/g, " ")
  
  function getObjectByName(name){ return this[name] }
  
  function getTableByName(name){ 
    const key = Object.keys(this).find(key => 
      this[key] instanceof WritableTable && this[key].name === name
    )
  
    if(key === undefined) throw new ssManagerError("table not found")
    
    return this[key]
  }
  
  const makeUnique = array => {
    let id = 1;
  
    array.forEach((item, index, self) => {
      if(self.indexOf(item) !== index) self[index] = `${self[index]}_${id++}`
    })
  
    return array
  }
  
  const createRowObjects = (data, header) => {
  
    header = makeUnique(header)
  
    return data.map(row => header.reduce(
      (a, h, i) => {
  
        return {
          ...a,
          [h] : row[i] === undefined ? "" : row[i]
        }
  
      } ,{})
    )
  }
  
  
  
  /**
   * check if keys exist in an array of key value pair objects
   * @param data - array of key value pair objects
   * @param keys - array of keys
   */
  function HasKeys(strict = true){
    if(!(this instanceof HasKeys)) throw new ssManagerError('function HasKeys can only be used as a contructor')
  
    this._strict = strict
    const func = this._strict ? 'every' : 'some'
  
    return (data, keys) => data.every(row => {
  
      return Object.keys(row)[func](k => keys.indexOf(k) !== -1)
  
    })
  }
  
  // block - a range of data with same values for a particular key.
  function getBlocks(data, key){
  
    // returns @param ptrEnd and @param blockRange
    // @param ptrEnd - index after the last item of a block
    // @param blockRange - 2 item array. first item has index of first item of the block. second item is @param ptrEnd
    const _getBlock = function(data, ptrStart, key){
      // assuming only one item in this shipment
      let ptrEnd = ptrStart + 1
  
      // reference value
      let value = data[ptrStart][key]
  
      for(let i = ptrStart + 1; i < data.length; i++){
        let current = data[i]
  
        if(current[key] !== value) {
          break;
        } else {
          ++ptrEnd
        }
      }
  
      // block range
      const blockRange = [ptrStart, ptrEnd]
  
      return [ptrEnd, blockRange]
    }
    
    // initializing pointer for suggestions array see getShippingRequests function for usage
    let ptrStart = 0
    let blocks = []
  
    while(ptrStart < data.length){
      let blockRange;
      [ptrStart, blockRange] = _getBlock(data, ptrStart, key)
      blocks.push(blockRange)
    }
  
    return blocks
  }
  
  /**
   * find duplicate values for keys in an array of key value pair objects
   * @param keys - array of keys 
   * @param data - array of key value pair objects
   */
  const findDuplicates = (keys, data) => {
    const transpose = []
    keys.forEach(key => transpose.push([key, ...data.map(row => row[key])]))
  
    const found = []
    transpose.forEach(
      /**
       * @param {string} key - column key
       * @param {Array} values - column values
       */
      ([key, ...values]) => {
        if(values.hasDuplicates() || values.find(uIV => isNaN(uIV)) !== undefined)
          found.push(key) 
      }
    )
    return found
  }
  
  function partialSort(arr, start, end, func) {
    let preSorted = arr.slice(0, start), postSorted = arr.slice(end);
    let sorted = arr.slice(start, end).sort(func);
    arr.length = 0;
    arr.push.apply(arr, preSorted.concat(sorted).concat(postSorted));
    return arr;
  }
  
  function * nextMaxInteger(keyPK, values){
    let maxPK = getNextInteger(keyPK, values)
    while(true)
      yield maxPK++
  }
  
  const getNextInteger = (key, values) => {
    let nextInteger = undefined
    // TODO: Investigate purpose of isNaN condition
    if(values.length === 0 || values.find(r => isNaN(r[key])) !== undefined) nextInteger = 0
    else {
      const PKs = values.map(r => r[key])
      nextInteger = Math.max(...PKs)
    }
    return ++nextInteger
  }
  
  function ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
  
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
  
    var total_seconds = Math.floor(86400 * fractional_day);
  
    var seconds = total_seconds % 60;
  
    total_seconds -= seconds;
  
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
  
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }
  
  // https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript/57184486#57184486
  function jsDate(serial){
    return new Date(-2209075200000 + (serial - (serial < 61 ? 0 : 1)) * 86400000 + (new Date().getTimezoneOffset() * 60000));
  }
  
  // https://stackoverflow.com/questions/14363073/converting-google-spreadsheet-date-into-a-js-date-object
  function googleDate(d) { 
     const start = new Date(Date.UTC(1899,11,30,0,0,0,0)) ; // the starting value for Google
     return ((d.getTime()  - start.getTime())/60000 - d.getTimezoneOffset()) / 1440 ;
  }
  
  const partialEqualKeys = (part, obj) => {
    const pkeys = Object.keys(part)
    const okeys = Object.keys(obj)
    return pkeys.every(pkey => okeys.indexOf(pkey) !== -1)
  }
  
  String.prototype.underscore = function(exp = /\(|\)|\s|\//g) { 
    let s = this.slice()
    return s.replace(exp, "_")
   }
  
  const isEmptyObj = (obj) => 
    // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    // because Object.keys(new Date()).length === 0;
    // we have to do some additional check
    this // 👈 null and undefined check
    && Object.keys(this).length === 0 && this.constructor === Object
  
  Array.prototype.insert = function (index, items) {
    let _obj = clone(items)
    if (!Array.isArray(_obj)) _obj = [_obj];
    _obj.reverse().forEach((item) => this.splice(index, 0, item));
  };
  
  // https://stackoverflow.com/questions/46849286/merge-two-array-of-objects-based-on-a-key
  Array.prototype.reorder = function(onKey1, array, onKey2){
    
    const value1 = this.map(row => row[onKey1])
    const value2 = array.map(row => row[onKey2])
    if(value1.length !== value2.length || value1.some(v => value2.indexOf(v) === -1 )) throw new ssManagerError("different column values found during reorder")
  
    const map = new Map();
  
    // since Map() stores keys in order of insertion
    // merged array will follow order of input @param array
    array.forEach(item => map.set(item[onKey2], undefined));
    
    this.forEach(item => map.set(item[onKey1], item ));
  
    return Array.from(map.values());
  }
  
  // https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
  Array.prototype.hasDuplicates = function () {
    return (new Set(this)).size !== this.length
  }
  
  // TODO: change name to update column
  // adds a column to object items
  Array.prototype.addColumn = function (name, values) {
  
    // constant column value
    if(!Array.isArray(values)) this.forEach(row => row[name] = values)
  
    // check column values passed as array
    else if(this.length !== values.length) throw new ssManagerError('values array not equal to host array')
  
    // column values passed as array
    else this.forEach((row, i) => row[key] = values[i])
  
    return this
  }
  
  Array.prototype.filterIndexes = function(func) {
    let ptr = [];
  
    this.forEach((object, i) => { if(func(object)) ptr.push(i) })
  
    return ptr
  }
  
  function getSheetById(ss, id) {
    return ss.getSheets().filter(function (s) {
      return s.getSheetId() === id;
    })[0];
  }
  
  const clone = (obj) => {
    if (Array.isArray(obj)) return Object.assign([], obj);
    return Object.assign({}, obj);
  };
  
  const isObject = (obj) => {
    return typeof obj === 'object' && obj !== null
  };
  
  /**
   * @param nonMatchingKeys - If set to true ignore keys in part not found in object
   */
  const matches = (query, obj, nonMatchingKeys = false, arrayFunc = 'every', criteria = ComparisonMask.criteria['=']) => {
    return Object.keys(query)[arrayFunc](
      (key) => {
  
        // will be set to either true of false
        let b = undefined
  
        if(obj.hasOwnProperty(key)){
  
          // if query is of type date
          if(query[key] instanceof Date){
  
            // b = obj[key] instanceof Date && query[key].getTime() === obj[key].getTime()
            b = obj[key] instanceof Date && criteria(obj[key].getTime(), query[key].getTime())
  
          // if query is of type array
          } else if(query[key] instanceof Array){
  
            const isDate = obj[key] instanceof Date
  
            if(isDate) 
              b = query[key].map(dt => dt.getTime()).indexOf(obj[key].getTime()) !== -1
            else
              b = query[key].indexOf(obj[key]) !== -1
  
          } else {
            b = criteria(obj[key], query[key])
          } 
  
        } else {
          b = nonMatchingKeys ? true : false
        }
        return b      
      }
    );
  };
  
  const deepMatches = (part, obj, nonMatchingKeys = false) => {
    return part.every((p, i) => matches(p, obj[i]))
  }
  
  const formatDict2Array = (item) => {
    const array = [];
    Object.keys(item).map(function (key) {
      array.push(item[key]);
    });
    return array;
  };
  
  const compareValues = (key, order, chain = "") => {
    
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      let comparison = 0;
  
      // recall function for sorting by multiple fields
      if(chain !== key)
        comparison = compareValues(chain, order, chain)(a, b)
  
      if(comparison === 0){
        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
  
        
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
      }
  
      return order === "desc" ? comparison * -1 : comparison;
    };
  };
  
  function tsvToRows(data){
    const body = []
    data.split('\n').forEach(line => {
      const row = line.split('\t').map(v => v.trim())
      const isEmpty = row.every(v => v === "")
      if(!isEmpty) body.push(row)
    })
    return body
  }
  
  // transforms serialized text box value array to table
  function textBoxTable(data){
    const header = []
    const body = []
    data.forEach(o => { header.push(o.name); body.push(o.value) })
    return [header, body]
  }
  
  function textAreaTSVTable(data){
    if(data.length > 1) throw new ssManagerError(`one text area entry expected found ${data.length}`)
    let [header, body] = textBoxTable(data)
    header = header[0].split('&')
    body = tsvToRows(body[0])
    return [header, ...body]
  }
  
  function rowToTsv(row, keys = []){
    const reducer = (a, k) => { return { ...a, [k] : row[k] } }
    if(keys.length > 0) return keys.reduce(reducer, {}).join('\t')
    else Object.values.join('\t')
  }
  
  function fieldToNumber(data, field){
    return data.map(o => {
      if(isNaN(o[field]) && o[field] !== "") throw new ssManagerError('Invalid Input - Not a number: ' + o[field])
      return { ...o, [field] : o[field] !== "" ? Number(o[field]) : o[field] }
    })
  }
  
  /**
   * @param m.0 - column name before which custom column will be inserted
   * @param m.1 - custom column name
   * @param m.2 - custom column formula template
   */
  const insertCustomColumns = (m, table, insertFormula = false) => {
    const h = table.rowFirstData - 1
    // @param tSht - Sheet to which table belongs
    const tSht = table.sheet
    m[0].map((nc, i) => { // @param nc - column name before which custom column will be inserted
      // @param ic - index of column before which custom column will be inserted
      const ic = tSht.getRange(`${h}:${h}`).getValues()[0].indexOf(nc)
      // @param r - range of column header before which custom column will be inserted
      const r = tSht.getRange(h,ic + 1,1,1)
      // @param nr - peek, if new range not already inserted
      let nr
      if(r.offset(0,-1,1,1).getValue() != m[1][i]){
        nr = r.insertCells(SpreadsheetApp.Dimension.COLUMNS)
        SpreadsheetApp.flush()
        nr.setValue(m[1][i])
      }
  
      if(insertFormula){
        nr = nr || r.offset(0,-1,1,1)
        const f = `=${m[2][i].replace(/#/g,h + 1)}`
        SpreadsheetApp.flush()
        nr.offset(1,0,1,1).setValue(f)
      }
    })
  }
  
  /**
   * Gets last column numhber of a sheet.
   *
   * @param {name} optional sheet name.
   * @return last column number of the sheet.
   * @customfunction
   */
  function LASTCOLUMN(name = CONFIG.SS.getActiveSheet().getName()){
    return CONFIG.SS.getSheetByName(name).getLastColumn()
  }

  class Model {
    constructor(schema, strictCheck = true ,table = undefined) {
  
      if(schema !== undefined) this.initialize(schema)
  
      this._strictCheck = strictCheck
  
      if(table !== undefined) {
        this.table = new TableManager(table.sheetId, table.tableName)
        this.table.model = this
      }
    }

    *groupGenerator(key){
      const unique = [...new Set(this.getColumnValues(key))]
      
      for(let i = 0; i < unique.length; i++ ){
        this.all().filter({ [key] : unique[i] })
        yield this
      }
    }
  
    set nestedModel(property){
      if(this[property.name] !== undefined) this[property.name].addLast(property.model.all().value)
      else this[property.name] = property.model
    }
  
    join(model){    
      this._join = model
      return this
    }
  
    on(query){
  
      const [a, b] = Object.keys(query)
  
      if(this._join === undefined) throw new ssManagerError("No model to join")
  
      let d1 = this.value
  
      if(d1[0][query[a]] === undefined) throw new ssManagerError(`Not found in model query.a: ${query[a]}`)
  
      let filter = d1.map(row => row[query[a]])
  
      this._join.and({ [query[b]] : filter })
      let d2 = this._join.value
  
      // preparing for this._joined
      // filtering this to confirm joined rows
      filter = d2.map(row => row[query[b]])
      this.and({ [query[a]] : filter })
      d1 = this.value
  
      // sorting
      let d12 = join(d1, d2, query)
  
      // initializing variable for joined schema
      const schema = {}
      let newkey = undefined
      for(let key in this.schema){
        newkey = key.split(".").length > 1 ? key : `${a}.${key}`
        schema[newkey] = this.schema[key]
      }
      for(let key in this._join.schema){
        newkey = key.split(".").length > 1 ? key : `${b}.${key}`
        schema[newkey] = this._join.schema[key]
      }
  
      this._joined = new Model(schema)
  
      // sanitizing data by schema
      d12 = d12.map(row => {
  
        // sanitizer
        const sanitize = {}
        for(let key in schema) if(row[key] !== undefined) sanitize[key] = row[key]
  
        return sanitize
        
      })
  
      this._joined.addFirst(d12)
  
      return this._joined
    }
  
    apply(func, cols = undefined){
      this.pointer
      .map(i => this.values[i])
      .forEach(row => {
        if(cols === undefined) for(let col in row) row[col] = func(row[col])
        else cols.forEach(col => row[col] = func(row[col]))
      })
    }
  
    // apply(func, argsArray){
    //   this.table[func].apply(this.table,argsArray)
    // }
  
    _validateSchema(schema){
  
      let fieldUniqueId = {}
      let keyPK = undefined
  
      for(let key in schema){
  
        if(typeof schema[key] !== 'string'){
          const attributes = schema[key]
  
          if(attributes.header === undefined) throw new ssManagerError(`Fields must have a 'header' property - Ref field ${key}`)
  
          if(attributes.uniqueId === true){
  
            if(attributes.autoIncrease === true){
  
              if(keyPK === undefined) keyPK = key
              else ssManagerError(`More than one auto increase value set to true`)
  
            } else fieldUniqueId[key] = attributes
  
          }
        }
  
      }
  
      return [schema, keyPK, fieldUniqueId]
    }
  
    initialize(schema){
  
      [this.schema, this.keyPK, this.fieldUniqueId] = this._validateSchema(schema)
      
      this.emptyRowTemplate = this.schemaKeys.reduce((a, c) => { return { ...a, [c] : '' }}, {})  
  
      this._initDataVariables();
  
    }
  
    get lastHeld(){
      return this._lastHeld.map(i => Object.assign({}, this.values[i]))
    }
  
    and(query){
  
      if(!isObject(query) || !this._hasSchemaKeys([query])) throw new ssManagerError(`ambigous query: ${JSON.stringify(query)}`)
  
      this._lastHeld = []
      this.pointer = ComparisonMask.and(query, this.values).filter((pointer, i) => {
        if(pointer === null) this._lastHeld.push(i)
        return pointer !== null
      })
  
      if(this._notFound()) return false
  
      return this
  
    }
  
    or(query){
  
      if(!isObject(query) || !this._hasSchemaKeys([query])) throw new ssManagerError(`ambigous query: ${JSON.stringify(query)}`)
  
      this._lastHeld = []
      this.pointer = ComparisonMask.or(query, this.values).filter((pointer, i) => {
        if(pointer === null) this._lastHeld.push(i)
        return pointer !== null
      })
  
      if(this._notFound()) return false
  
      return this
      
    }
  
    // just for convention since nor is not used often
    not(query){
  
      return this.nor(query)
      
    }
  
    nor(query){
  
      if(!isObject(query) || !this._hasSchemaKeys([query])) throw new ssManagerError(`ambigous query: ${JSON.stringify(query)}`)
  
      this._lastHeld = []
      this.pointer = ComparisonMask.nor(query, this.values).filter((pointer, i) => {
        if(pointer === null) this._lastHeld.push(i)
        return pointer !== null
      })
  
      if(this._notFound()) return false
  
      return this
      
    }
  
    nand(query){
  
      if(!isObject(query) || !this._hasSchemaKeys([query])) throw new ssManagerError(`ambigous query: ${JSON.stringify(query)}`)
  
      this._lastHeld = []
      this.pointer = ComparisonMask.nand(query, this.values).filter((pointer, i) => {
        if(pointer === null) this._lastHeld.push(i)
        return pointer !== null
      })
  
      if(this._notFound()) return false
  
      return this
      
    }
  
    greater(query, equal = false){
  
      if(!isObject(query) || !this._hasSchemaKeys([query])) throw new ssManagerError(`ambigous query: ${JSON.stringify(query)}`)
  
      this._lastHeld = []
      this.pointer = ComparisonMask.greater(query, this.values, equal).filter((pointer, i) => {
        if(pointer === null) this._lastHeld.push(i)
        return pointer !== null
      })
  
      if(this._notFound()) return false
  
      return this
      
    }
  
    less(query, equal = false){
  
      if(!isObject(query) || !this._hasSchemaKeys([query])) throw new ssManagerError(`ambigous query: ${JSON.stringify(query)}`)
  
      this._lastHeld = []
      this.pointer = ComparisonMask.less(query, this.values, equal).filter((pointer, i) => {
        if(pointer === null) this._lastHeld.push(i)
        return pointer !== null
      })
  
      if(this._notFound()) return false
  
      return this
      
    }
  
    del(){
  
      if(this.values.length === 0 || this.pointer.length === 0) return this
  
      if(this._deletePointer.length > 0) throw new ssManagerError('only one delete operation allowed per commit')
  
      this._deletePointer = clone(this.pointer)
  
      if(this.pointer.length === this.values.length) {
  
        this._batchRequestsBuilder.deleteAllRequest(0, this.values.length)
  
        this.values = new Array(this.values.length).fill(undefined)
  
      } else this.pointer.reverse().forEach(i => {
  
        delete this.values[i]
  
        this._batchRequestsBuilder.deleteRequest(i)
  
      })
  
      this.pointer = []
  
      return this
  
    }
  
    _hasSchemaKeys(data){
  
      if(this.schema === undefined) return true
  
      const schemaKeys = this.schemaKeys
  
      const func = this._strictCheck ? 'every' : 'some'
  
      return data.every(row => {
        return Object.keys(row)[func](k => schemaKeys.indexOf(k) !== -1)
      })
    }
  
    _validateData(data) {
      if(!Array.isArray(data) && !isObject(data)) throw new ssManagerError('Invalid input - Expecting array or object, got: ' + JSON.stringify(data)) 
  
      if (!Array.isArray(data)) data = [data];
  
      if(this.keyPK !== undefined && data.find(row => row[this.keyPK] !== undefined) !== undefined){
        throw new ssManagerError('User provided primary keys found: \n' + JSON.stringify(data.filter(row => row[this.keyPK] !== undefined).map(row => row[this.keyPK])))
      }  
  
      if(!this._hasSchemaKeys(data)) throw new ssManagerError("Data doesn't have the required fields: \n" + Object.keys(data[0]) + '\n' + this.schemaKeys);
  
      this._avoidDuplicateOrNaNUniqueIds([...data, ...this.values])    
  
      return data;
    }
  
    _avoidDuplicatePKs(data = this.values){
  
      if(this.keyPK === undefined) return
  
      let found = findDuplicates([this.keyPK],data)
      found = found.map(key => this.schema[key].header !== undefined ? this.schema[key].header : this.schema[key])
      if(found.length > 0) throw new ssManagerError('Duplicate or NaN UIds found: ' + found)
  
    }
  
    _avoidDuplicateOrNaNUniqueIds(data = this.values){
  
      if(isEmptyObj(this.fieldUniqueId)) return
  
      let found = findDuplicates(Object.keys(this.fieldUniqueId),data)
      found = found.map(key => this.schema[key].header !== undefined ? this.schema[key].header : this.schema[key])
      if(found.length > 0) throw new ssManagerError('Duplicate or NaN UIds found: ' + found)
  
    }
  
    getSchema(){
      return this.schema
    }
  
    get schemaKeys(){
      return Object.keys(this.schema)
    }
  
    // finds key to a given header
    findKeyHeader(header){
      let found = undefined
  
      // iterating all keys in schema
      for(let key in this.schema){
  
        // checking if header property is equal to argument header
        if(this.schema[key].header === header || this.schema[key] === header) {
          found = key
          break
        }
      }
  
      return found
    }
  
    _initDataVariables(){
      this.values = []
      this.valuesBackup = clone(this.values);
      this.pointer = [];
      this.sortByChain = "";
      this._deletePointer = [];
      this._batchRequestsBuilder = new BatchRequestsBuilder()
      this._join = undefined;
      this._joined = undefined
      this._lastHeld = []
    }
  
    get batchRequestsBuilder(){
      return this._batchRequestsBuilder
    }
  
    getColumnValues(col){
      if(this.schemaKeys.indexOf(col) === -1) throw new ssManagerError('Field not found: ' + col)
      if(this.pointer.length > 0) return this.pointer.map(i => this.values[i][col])
      else return []
    }
  
    // https://stackoverflow.com/questions/37105135/get-single-yield-value-from-iterator-generator
    * _nextMaxPK(){
      let maxPK = getNextInteger(this.keyPK, this.values)
      while(true)
        yield maxPK++
    }
  
    //returns a copy of values for corrseponding array pointers
    get value() {
      let _temp = this._value.map(a => Object.assign({}, a));
      return _temp;
    }
  
    get _value() {
  
      return this.pointer.map((i) => this.values[i]);
  
    }
  
    // point to corresponding array row; needs unique id as input; will return first found value
    get(id) {
  
      if(!isObject(id) && !isNaN(id) && this.keyPK !== undefined) id = { [this.keyPK] : id }
      else if(!isObject(id) || !this._hasSchemaKeys([id])) throw new ssManagerError(`ambigous query: ${JSON.stringify(id)}`)
  
      this.filter(id)
  
      if (this._notFound()) return false
      if (this.size > 1) throw new ssManagerError(`method get returned multiple records with query ${JSON.stringify(id)}`)
  
      return this
    }
  
    all() {
  
      this.pointer = this.values.map((row, i) => i);
  
      const this_ = this
  
      return this;
    }
  
    //this.get for multiple array values; returns []
    filter(id) {
      if(!isObject(id) || !this._hasSchemaKeys([id])) throw new ssManagerError(`ambigous query: ${JSON.stringify(id)}`)
  
      this.pointer = this._filter(id, this.values);
      if (this._notFound()) return false;
  
      return this;
    }
  
    _filter(id, array) {
      return array
        .map((row, i) => {
          if(row === undefined) return null
          else return matches(id, row) ? i : null
        })
        .filter((i) => i != null);
    }
  
    // return true if id in whole table
    has(id) {
  
      return this._filter(id, this.values).length != 0;
    }
  
    // brings the pointer array into a new order, based on key; asc / desc
    sortBy(key, order = "asc") {
  
      let _temp = this._value.sort(compareValues(key, order, this.sortByChain));
      // adjust pointer order
      this.pointer = this.pointer.map((p, i) => {
        
        // preparing batch request
        this._batchRequestsBuilder.updateRequest(_temp[i], p)
  
        // adjusting pointer order
        return this.values.indexOf(_temp[i])
      })
      // store key for chaining
      this.sortByChain = key
  
      return this;
    }
  
    // get size of the data, belonging to the pointers
    get size() {
      return this.value.length || 1;
    }
  
    _updateRow(row, data, nextMaxPK){
  
      if(nextMaxPK !== undefined) row[this.keyPK] = nextMaxPK.next().value
  
      updateObject(row, data)
  
    }  
  
    // set data at corresponding pointers
    set(data, nextMaxPK) {
  
      this._validateData(data);
  
      this.pointer.map(i => {
  
        let row = this.values[i]
  
        this._updateRow(row, data, nextMaxPK)
  
        // preparing batch request
        this._batchRequestsBuilder.updateRequest(row, i)
  
      });
  
      return this;
    }
  
    addAbove(data) {
      data = this._validateData(data);
      this._add(data, 0);
  
      return this;
    }
  
    /**
     * @param offset = 0 - addAbove
     * @param offset = 1 - addBelow
     */
    _add(data, offset) {
      const backupOffset = offset
      let _pointer = this.pointer[0];
      const nextMaxPK = this.keyPK !== undefined ? this._nextMaxPK() : undefined
  
      // preparing batch request
      this._batchRequestsBuilder.insertRequest(_pointer + offset, _pointer + offset + data.length)
  
      data = data.map((row, i) => {
        
        this.values.insert(_pointer + offset + i, this.emptyRowTemplate);
        this._setPointer(_pointer + offset + i);
        this.set(row, nextMaxPK);
  
      })
  
      // incase addAbove sets offset to 1
      offset = backupOffset
      this.pointer = data.map((row, i) => i + _pointer + offset);
    }
  
    addBelow(data) {
  
      data = this._validateData(data);
      this._add(data, 1)
  
      return this;
    }
  
    addFirst(data) {    
      this._setPointer(0);
      this.addAbove(data);
  
      return this;
    }
  
    addLast(data) {
  
      if(this.values.length === 0) return this.addFirst(data)
      
      this._setPointer(this.values.length - 1);
      this.addBelow(data);
  
      return this;
    }
  
    // custom callbacks on data
    each(cb) {
  
      this.pointer.forEach((i) => (this.values[i] = cb(this.values[i])));
      return this;
    }
  
    _notFound() {
      if (this.pointer[0] == -1 || this.pointer.length == 0) {
        return true;
      }
    }
  
    _setPointer(pointer) {
      Array.isArray(pointer)
        ? (this.pointer = pointer)
        : (this.pointer = [pointer]);
    }
  
    resetValues(){
      this.values = this.values.filter(Boolean)
    }
  
    _reset() {
  
      // reset indices
      this.resetValues()
      this.valuesBackup = clone(this.values);
      this.pointer = [];
      this.sortByChain = "";
      this._deletePointer = []
      this._batchRequestsBuilder.reset()
      this._join = undefined
      this._joined = undefined
      this._lastHeld = []
  
    }
  
    _updatePointerOrder(){
      let _values = clone(this.values);
      let _pointer = clone(this.pointer).sort((a, b) => a - b);
      this.pointer.map((i, index) => {
        this.values[_pointer[index]] = _values[i];
      });
    }
  
    getTable(){
      return this.table
    }
  
    clearModel(){
      this._initDataVariables()
    }
  }
  
  class APIModel extends Model {
    constructor(schema){
      super(schema)
    }
  
    updateKeys(tableObject){
      const object = {}
  
      for(let tableKey in tableObject){
        const value = this.get({ tableKey : tableKey }).value[0]
        object[value.apiKey] = tableObject[tableKey]
      }
  
      return object
    }
  
  }

  class Table {
    constructor(params) { 
      this.name = params.table
      this.groupRow = false
  
      if(typeof this.name !== "string"){
        this.name = params.table.name
        this.groupRow = params.table.groupRow === undefined ? false : params.table.groupRow
      } 
  
      // this.batchFormulaRequests = []
      this._isLastRowTemplate = params.table.isLastRowTemplate === true
      this.model = params.model.constructor.name === "Object" ? new Model(params.model) : params.model
      this.sheet = params.sheet; 
  
      this._sheetId = params.sheetId;
      if(params.dataRangeValues !== undefined) this._dataRangeValues = params.dataRangeValues
  
      if(["tableStartRow","tableEndRow","values"].every(prop => params[prop] !== undefined)) this._loadTable(params)
      else this.getWrittenData()
  
      this._backupRowFirstData = this.rowFirstData
  
      return this    
    }
  
    get boundary(){
      return [this.tableStart - (this.groupRow ? this.groupRow + 1 : 1), this.tableEnd]
    }
  
    get header(){
      return this._header
    }
  
    get dataRangeValues(){
      return this._dataRangeValues
    }
  
    set dataRangeValues(dataRange){
      this._dataRangeValues = dataRange
    }
  
    insertColumn(column, before = 1){
  
      let position = before;
  
      if(typeof position === 'string') {
        position = this.getColumnPosition(position)
        if(position === -1) throw new ssManagerError(`column ${before} not found`)
      }
  
      this.sheet
        .getRange(this.tableStart + 1, position, this.tableEnd - this.tableStart + 1)
        .insertCells(SpreadsheetApp.Dimension.COLUMNS);
  
      this.sheet
        .getRange(this.tableStart + 1, position).setValue(column)
  
    }
  
    updateColumn(column, replace){
  
      let position = this.getColumnPosition(column)
  
      this.sheet
        .getRange(this.tableStart + 1, position).setValue(replace)
  
    }
  
    getColumnPosition(column){
  
      let position = undefined
  
      if(typeof column === 'string') {
  
        position = this._header.findIndex(h => h === column)
  
        if(position !== -1) {
          position++
        } 
  
      }
      else if(typeof column === 'number') position = column
      else throw new ssManagerError('ambigous type @param column') 
  
      return position
    }
  
    deleteColumn(column){
  
      if(column === undefined) throw new ssManagerError("column cannot be undefined")   
  
      const position = this.getColumnPosition(column)
  
      this.sheet
        .getRange(this.tableStart + 1, position, this.tableEnd - this.tableStart + 1)
        .deleteCells(SpreadsheetApp.Dimension.COLUMNS);
  
    }
  
    _sanitize(headerValue) {
      return this.model.findKeyHeader(headerValue)
    }
  
    _validateHeader(params){
      const schemaKeys = Object.keys(this.model.schema)
      const emptyRowTemplateKeys = Object.keys(params.emptyRowTemplate).filter(k => k.includes('custom_col'))
  
      if (schemaKeys.length + emptyRowTemplateKeys.length != params.header.length) {
        throw new ssManagerError('Table header and schemas are not matching!')
      }
    }
  
    getEmptyRowTemplate(header) {
      if(!header.every(h => typeof h === 'string')) throw new ssManagerError('Non string type header value found. Check group row property')
  
      const emptyRowTemplate = {};
      header.forEach((h, index) => {
        const value = h.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s\s+/g, " ");
        const key = this._sanitize(value);
  
        const duplicateIndex = header.slice(0, index).findIndex(h_ => h_ === h)
  
        if (key && duplicateIndex === -1) emptyRowTemplate[this._sanitize(value)] = '';
        else emptyRowTemplate['custom_col_' + index] = '';
      });
  
      this._validateHeader({
        emptyRowTemplate : emptyRowTemplate,
        header : header
      })
      return emptyRowTemplate;
    }
  
    _calculateSize(){
      const rowFirstData = this.getRowFirstData()
      // tableEnd is index rather than row number therefore + 1
      return this.tableEnd + 1 - rowFirstData
    }
  
    set size(v){
      this._size = v
    }
  
    get size(){
      return this._calculateSize()
    }
  
    get rowFirstData(){
      return this.getOffsetTableStart()
    }
  
    get values(){
      return clone(this._values).map(row => clone(row))
    }
  
    getSize(){
      // *
      this.getContainer()
      
      // get row first data is called to reset table end also
      const rowFirstData = this.getRowFirstData()
      return this.tableEnd - rowFirstData + 1
    }
  
    getOffsetTableStart(offset = 2){
      return this.tableStart + offset;
    }
  
    getContainer(){
      [this.tableStart, this.tableEnd, this._values ] = this._initContainer();
    }
  
    getRowFirstData(){
      return this.getOffsetTableStart();
    }
  
    set formula(dataRange){
  
      if(this._isLastRowTemplate !== true) return
  
      let rowFirstData = this.getRowFirstData()
      if(this._values.length === 0) throw new ssManagerError('Table.values empty. Try checking group row property')
  
      if(this.tableEnd - rowFirstData + 1 !== 0){
        this.tableFormulaA1 = dataRange[this.tableEnd - 1].map(value => {
          if(value.constructor.name === "String" && value.indexOf("=") === 0) return value
          else return ""
        })
      } else null
    }
  
    _sliceByLastHeader(data){
      let headers = data[0]
  
      if(headers === undefined) throw new ssManagerError('Headers not found. Try checking group row property')
  
      let index = headers.length - 1;
      let newLast = -1;
  
      while(headers[index] === "" && index >= 0) {
        newLast = index
        index--
      }
  
      if(newLast !== -1) data = data.map(row => row.slice(0, newLast))
  
      return data
    }
  
    _getDataRangeValues(){
      // this._dataRangeValues = this.sheet.getDataRange().getValues();
      const responses = UrlFetchApp.fetchAll([new BatchRequestsBuilder().get({ ids : [this._sheetId], spreadsheetId : CONFIG.SSID })])
      const json = JSON.parse(responses[0].getContentText())
      this._dataRangeValues = json.valueRanges[0].valueRange.values
    }
  
    _loadTable(params){
      this.tableStart = params.tableStartRow;
      this.tableEnd = params.tableEndRow
      this._values = params.values;
      if(this._isLastRowTemplate && this._values.length === 1) throw new ssManagerError("No placeholder found")
      this.loadModel()
      this.model.all()
      return this
    }
  
    _initContainer() {
  
      // if([this.tableStart, this.tableEnd, this._values].every(prop => prop !== undefined)) return [this.tableStart, this.tableEnd, this._values]
  
      if(this._dataRangeValues === undefined) this._getDataRangeValues();
      
      let tableNameRow = this._dataRangeValues.map(row => row.length > 0 ? row.reduce((a, c) => a + c) : "").indexOf(this.name)
  
      if(tableNameRow === -1) throw new ssManagerError(`Table ${this.name} sheet id ${this.sheet.getSheetId()} not found`)
  
      let _tableStart = tableNameRow + (this.groupRow ? this.groupRow + 1 : 1);
  
      // let _tableEnd = this._dataRangeValues.slice(_tableStart).map(row => row.length > 0 ? row.reduce((a, c) => a + c) : "").indexOf("")
      let _tableEnd = this._dataRangeValues.slice(_tableStart).findIndex(row => row.length === 0)
  
      if(_tableEnd === -1) _tableEnd = this._dataRangeValues.length
  
      // It may seem that this statement sets tableEnd to the row next to the last but
      // because tableEnd is set initially from indexOf function which counts from 0, therefore,
      // this statement will make it point to last row as required
      else _tableEnd += _tableStart 
      
      let _dataTable = this._dataRangeValues.slice(_tableStart, _tableEnd);
  
      // let _dataTable = this._dataRangeValues.splice(_tableStart, _tableEnd - _tableStart);
  
      // _dataTable = this._sliceByLastHeader(_dataTable)
  
      if(this._isLastRowTemplate && _dataTable.length === 1) throw new ssManagerError("No placeholder found")
      return [_tableStart, _tableEnd, _dataTable]
    }
  
    loadModel(){
      // clone table
      let table = this.values
  
      let ref = this
      
      // transforming table for model
      this._header = table.shift()
      if(this._isLastRowTemplate) this._lastRowTemplate = table.pop()
  
      // model parameters
      this.model.table = this
  
      // empty row template
      this.model.emptyRowTemplate = this.getEmptyRowTemplate(this._header)
  
      // model data
      if(table.length > 0){
        // loading model with table data
        this.model.values = createRowObjects(table, Object.keys(this.model.emptyRowTemplate));
  
        // converting serial date to js date
        const dateColumns = []
        for(let key in this.model.schema) if(this.model.schema[key].type === "date") dateColumns.push(key)
        this.model.all()
        this.model.apply((value) => {
          if(!isNaN(value)) return jsDate(value)
          return value
        },dateColumns)
  
      } else this.model.values = []   
  
      this.model._reset()
    }
  
    // loads data from this._dataRangeValues
    // if reload is set to true then this._dataRangeValues is reinitialized
    getWrittenData(reload = false){
  
      if(reload) this._getDataRangeValues()
  
      this.getContainer()
  
      this.loadModel()
  
      return this.model.all().value
      
    }
  
  }
  
  class WritableTable extends Table {
    constructor(params){
      super(params)
    }
  
    offsetTable(rows){
      if(this.next !== undefined)
        this.next.offsetTable(rows)
  
      this.tableStart += rows
      this.tableEnd += rows
    }
  
    set resize(rows){
      this.tableEnd += rows
  
      this._size = this._calculateSize()
  
      if(this.next !== undefined)
        this.next.offsetTable(rows)
    }
  
    // calculate rows to be added or subtracted
    _calculateRows(modeldata_ = this.model.values){
      // rows deleted/added - +1 for modeldata because it doesn't include a headerrow
      let tableLength = this._values.length
      // header offset
      tableLength--
      // lastRowTemplate offset
      if(this._isLastRowTemplate) tableLength--
      // calculating rows to be added/subtracted
      return modeldata_.length - tableLength
    }
  
    set updateValues(modeldata_){
      const rows = this._calculateRows(modeldata_)
  
      // updating according to model
      this._values = [this._header, ...modeldata_.map(row => this._header.map(h => row[h] !== undefined ? row[h] : ""))]
      if(this._lastRowTemplate !== undefined) this._values[this._values.length] = this._lastRowTemplate
  
      // resize this and next tables
      this.resize = rows
    }
  
    getBatchRequests() {
  
      const rowFirstData = this.rowFirstData
      const sheetId = this._sheetId
      const batchRequestsBuilder = this.model.batchRequestsBuilder
      const ref = this
  
      batchRequestsBuilder.updateLocation(sheetId, rowFirstData)
  
      // update formula request
      if(this._isLastRowTemplate){
  
        this.tableFormulaA1.forEach((formula, columnIndex) => {
          if(formula !== "" && this.tableEnd > this.rowFirstData){
            const source = {
                "sheetId": sheetId,
                "startRowIndex": this.tableEnd - 1,
                "endRowIndex": this.tableEnd,
                "startColumnIndex" : columnIndex,
                "endColumnIndex" : columnIndex + 1
            }
  
            batchRequestsBuilder.copyPasteRequest(source, {
              "sheetId": sheetId,
              "startRowIndex": this.rowFirstData - 1,
              "endRowIndex": this.tableEnd - 1,
              "startColumnIndex" : columnIndex,
              "endColumnIndex" : columnIndex + 1
            })
  
          }
        })
  
      }
  
      return batchRequestsBuilder.batchRequests
  
    }
  
    // resizes next tables
    commitValues(){
      this.model.resetValues()
      this.updateValues = this.model.values
      return this
    }
  
    commit() {
  
      this.model.resetValues();
      this.updateValues = this.model.values
      const requests = this.getBatchRequests()
  
      if(requests.length > 0) {
        Sheets.Spreadsheets.batchUpdate({ "requests" : requests }, CONFIG.SS.getId())
      }
  
      this.model._reset()
      return true;
  
    }
  
  }  

  // manages state data in a key value pair object. Each value is a two dimensional array. 
  // Each second dimension has three values 
  // [0] = time state entered
  // [1] = state data
  // [2] = time state left
  // params.transitions first transition must be the initial transition
  class StateDataManager {

    constructor(params){
      this._statesData = params.storageManager.get(params.transitions)
      this._transitions = params.transitions
      this._storageManager = params.storageManager
      this._first = params.transitions[0].name
      this._current = undefined
      this._active = undefined
    }

    // get data
    get(params){
      if(params.name === undefined) throw new ssManagerError("name cannot be undefined.")
      let data = undefined;
      if(params.buffer) data = this._statesData[params.name + "buffer"]
      else data = this._statesData[params.name]
      this._active = params.name
      return data[0][1]
    }

    get transition(){
      return this._active
    }

    current(){
      let max = -1
      let current = undefined

      for(let key in this._statesData){
        if(this._statesData[key].length === 0) continue
        
        const time = this._statesData[key][0][0]
        if(time > max) {
          max = time
          current = key
        }
      }

      this._current = current
      return current
    }

    /**
     * 
     * @param {String} params.t2.name - next transition name
     * @param {Object} params.t2.data - next transition data
     */
    transition(params){
      const time = new Date().getTime()
      
      const bufferKey = this._first === params.name ? "fbainitbuffer" : this._active + "buffer"

      // failed transiton data
      if(params.buffer === false) this._statesData[bufferKey] = []
      else if(params.buffer !== undefined) this._statesData[bufferKey][0] = [time, params.buffer]

      // next transition
      if(params.data === false) this._statesData[params.name] = []
      else if(params.data !== undefined) this._statesData[params.name][0] = [time, params.data] 

      this._storageManager.save({
        [bufferKey] : this._statesData[bufferKey],
        [params.name] : this._statesData[params.name]
      })
    }

  }

  /**
   * Storage Manager Implementation for Google Apps Script
   */
  class StorageManager {
    constructor(service = PropertiesService.getDocumentProperties()){
      this._service = service
    }

    init(transitions){
      const placeholders = {}
      transitions.forEach(t => {
        placeholders[t.name] = [];
        placeholders[t.name + "buffer"] = []
      })
      this.save(placeholders)
    }

    get(transitions){
      const names = transitions.map(t => t.name)
      const props = this._service.getProperties()
      const parsed = {}
      for(let key in props) if(names.indexOf(key) !== -1) parsed[key] = JSON.parse(props[key])
      return parsed
    }

    save(data){
      const keyvalue = {}
      for(let key in data) keyvalue[key] = JSON.stringify(data[key])
      this._service.setProperties(keyvalue)
    }
  }