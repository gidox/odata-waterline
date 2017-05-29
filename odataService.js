module.exports.populateObj = function (query, urlParams) {

  if (urlParams.expand) {
    var expands = urlParams.expand.split(",");
    _.forEach(expands, function (val) {
      var aux = val.split("(");
      if (aux[1]) {
        var aux2 = aux[1].split(")")[0];
        aux2 = aux2.split("&")

        var obj = {};
        _.forEach(aux2, function (value) {

          var query = value.split("=");

          if (query) {

            obj[query[0]] = query[1];
          }
        })

        query.populate(aux[0], utilService.filtersObj(obj))

      } else {
        query.populate(aux)

      }

    })
  }
  return query
}

module.exports.filtersObj = function (filters, options) {
  var filter = filters.filter;
  var opFilter = filters.opFilter;
  var order = filters.orderby;
  var skip = filters.skip;
  var top = filters.top;
  if (filter) {
    var aux = filter;
    filter = filter.split("$and");

  }
  if (opFilter) {
    var auxOp = opFilter;
    opFilter = opFilter.split("$or");
  }
  var obj = {};
  obj.where = {};

  _.forEach(filter, function (value) {
    value = value.trim();
    var aux = value.split(" ");
    if (obj.where[aux[0]]) {
      obj.where[aux[0]] = _.merge(obj.where[aux[0]], getFilterObj(aux))
    } else {
      obj.where[aux[0]] = getFilterObj(aux);
    }

  })
  if (opFilter && opFilter.length > 0) {
    var objaux = [];
    _.forEach(opFilter, function (value, index) {
      value = value.trim();
      var auxOp = value.split(" ");
      objaux.push(getOpFilterObj(auxOp));
    })
    obj.where["or"] = objaux;
  }
  if (order) {
    obj.sort = {};
    order = order.split(",");
    _.forEach(order, function (value) {
      value = value.trim();
      var aux = value.split(" ");

      if (aux[1] == "asc" || aux[1] == "ASC") {
        obj.sort[aux[0]] = 1;

      } else {
        obj.sort[aux[0]] = -1;

      }

    })

  }
  if (!options) {
    if (skip) {
      obj.skip = parseInt(skip);

    }
    if (top) {
      obj.limit = parseInt(top);

    }

  }

  return obj;
};
function getFilterObj(obj) {
  if (obj[2] == "null") {
    obj[2] = null;
  }
  if (obj[1] == "ge") {
    return { ">": obj[2] }
  } else if (obj[1] == "le") {
    return { "<": obj[2] }
  } else if (obj[1] == "eq") {
    return obj[2];
  } else if (obj[1] == "like") {
    return { "contains": obj[2] };
  } else if (obj[1] == "ne") {
    return { "!": obj[2] }

  }
}
function getOpFilterObj(obj) {
  var help = {};
  if (obj[2] == "null") {
    obj[2] = null;
  } else if (obj[1] == "eq") {
    help[obj[0]] = obj[2];
  } else if (obj[1] == "ne") {


  }
  return help;
}