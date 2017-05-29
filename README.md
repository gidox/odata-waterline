# odata-waterline
Service to emulate OData (Open Data Protocol) with waterline orm (.net style)

## Installation

Paste the file into the folder api/services/

## Extra dependencies
 - lodash
 
## Examples

Call Examples:
  - Conditioal Operators
  
    $and, $or
    
  - Filters:  
  
    - Simple Match
    
      api/example?filter=field eq value    

      Response:

        {
          "count": 0,
          "modelAlias": []
        }
        
    - Dates
    
      api/example?filter=field eq datetime   // 2017-05-01T00:00:00-05:00    
    
    - Greater or equal
      
      api/example?filter=field ge datetime $and field le datetime    // 2017-05-01T00:00:00-05:00 
      
  - Orders
    
    - api/example?orderby=field desc     // or asc
    
  - Or filter
    
    - api/example?opFilter=field eq value1 $or field eq valueN
    
  - Expands(populate) only one down
    
    - api/example?expand=modelToExpand1,modelToExpand2,modelToExpandN
  
Controller:

    var values = req.allParams()
    
    var query = Model.find(odataService.filtersObj(values))

    odataService.populateObj(query, values).exec(function(err, modelAlias) {
      Model.count(odataService.filtersObj(values, true)).exec(function(err, count) {
        var response = {};
        response.count = count;
        response.modelAlias = modelAlias;

        return res.json(200, response);

      })
    });
    




