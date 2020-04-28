export function makeUpset(sets, names) { // names: [[],[]]

    var numSets = sets.length
  
    // computes intersections
    var data2 = []
      
    for (var i = 0; i < numSets; i++) {
      var intSet = {
        "set": i.toString(),
        "names": names[i]
      }
      data2.push(intSet)
  
      for (var j = i + 1; j < numSets; j++) {
        var intSet2 = {
          "set": i.toString() + j.toString(),
          "names": findIntersection(names[i], names[j])
        }
        data2.push(intSet2)
        helperUpset(i, j+1, numSets, names, data2)
      }
    }
  
    //removing all solo datasets and replacing with data just in those datasets (cannot intersect with others)
    var tempData = []
    for (var i = 0; i < data2.length; i++) {
      if (data2[i].set.length != 1) { // solo dataset
        tempData.push(data2[i])
      }
    }
    data2 = tempData
    
  
    for (var i = 0; i < numSets; i++) {
      var inds = Array.apply(null, {length: numSets}).map(Function.call, Number)
      var index = inds.indexOf(i)
      if (index > -1) {
        inds.splice(index, 1);
      }
      //console.log(inds)
      data2.push({
        "set": i.toString(),
        "names": names[i]
      })
    }
  
  
    // makes sure data is unique
    var unique = []
    var newData = []
    for (var i = 0; i < data2.length; i++) {
      if (unique.indexOf(data2[i].set) == -1) {
        unique.push(data2[i].set)
        newData.push(data2[i])
      }
    }
  
    var data = newData
  
    // sort data decreasing
    data.sort(function(a, b) {
      return parseFloat(b.names.length) - parseFloat(a.names.length);
    });

    return data

}

// takes two arrays of values and returns an array of intersecting values
function findIntersection(set1, set2) {
    //see which set is shorter
    var temp;
    if (set2.length > set1.length) {
        temp = set2; set2 = set1; set1 = temp;
    }

    return set1
        .filter(function(e) { //puts in the intersecting names
            return set2.indexOf(e) > -1;
        })
        .filter(function(e,i,c) { // gets rid of duplicates
            return c.indexOf(e) === i;
        })
}

//for the difference of arrays - particularly in the intersections and middles
//does not mutate any of the arrays
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

//for calculating solo datasets
function subtractUpset(i, inds, names) {
    var result = names[i].slice(0)
    for (var ind = 0; ind < inds.length; ind++) {
        // set1 vs set2 -> names[i] vs names[ind]
        for (var j = 0; j < names[inds[ind]].length; j++) { // for each element in set2
            if (result.includes(names[inds[ind]][j])) { 
                // if result has the element, remove the element
                // else, ignore
                var index = result.indexOf(names[inds[ind]][j])
                if (index > -1) {
                    result.splice(index, 1)
                }
            }
        }
    }
    return result
}

//recursively gets the intersection for each dataset
function helperUpset(start, end, numSets, names, data) {
    if (end == numSets) {
      return data
    }
    else {
      var intSet = {
        "set": data[data.length-1].set + end.toString(),
        "names": findIntersection(data[data.length-1].names, names[end])
      }
      data.push(intSet)
      return helperUpset(start, end+1, numSets, names, data)
    }
}

