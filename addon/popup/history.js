//declare histdata object
let histData = {
  histRegexArray: [],
  histDescArray: [],
  histTextArray: [],
  histDateArray: []
}

if (typeof (Storage) !== "undefined") {
  // Code for localStorage/sessionStorage.

  // Get the histories from local storage and load them to the addon
  const getHistoryListOperation = browser.storage.local.get("histData")
  getHistoryListOperation.then(results => {
      if (!Object.is(results, undefined)) {

        histData = JSON.parse(results['histData']) || histData
        showHist(histData) // Show histories in the web page
        histories(); // Add event listeners to each history object in the list

      } else {
        console.log(`histData not found in local storage`)
      }


    })
    .catch(err => {
      console.error(err)
    })

  //if test button is clicked, add the regex details to history
  document.getElementById('test').addEventListener('click', (e) => {
    addToHistList()
  })

} else {
  // Sorry! No Web Storage support..
  console.log("no web storage support");
}

/**
 * Function to add history to history list 
 * 
 */
function addToHistList() {
  let regex = document.getElementById("enter-regex").value; //get regex value from user
  let text = document.getElementById("enter-text").value;
  let desc = regex;
  console.log(desc)
  $("#inputHistDetails").modal('hide');

  desc = regex
  //add values into histdata object
  histData.histRegexArray.push(regex);
  histData.histDescArray.push(desc);
  histData.histTextArray.push(text);

  //get current data and store into histdateArray in histdata object
  const d = new Date();
  const datefullform = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  histData.histDateArray.push(datefullform);

  // Saved updated list to local storage
  browser.storage.local.set({
    'histData': JSON.stringify(histData)
  })
  
  //Show updated list in web page
  showHist()
  histories();

  document.getElementById('enter-hist').value = ''
  
}


//function to display modal
/** 
 * @method  showHistModal
 *
 * @param  {Object}  data history object
 * 
 */
function showHistModal(i, data) {

  let histInfo = document.getElementById('histInfoContainer');


  //Clear display area
  histInfo.innerHTML = '';
  let info = '';

  info += `<form class="form-horizontal" id="viewHistDetailsForm" action="#">`

  info += `<div class="form-group">`
  info += `<label class="control-label col-sm-3" for="regexDate">Date Added:</label>`
  info += `<div class="col-sm-8">`
  info += `<input type="text" class="form-control" id="regexDate" placeholder="Regex Title" name="regexDate" value="${data.histDateArray[i]}" readonly>`
  info += `</div>`
  info += `</div>`

  info += `<div class="form-group">`
  info += `<label class="control-label col-sm-3" for="regexDesc">Regex: </label>`
  info += `<div class="col-sm-8">`
  info += `<input type="text" class="form-control" id="regexDesc" placeholder="Regex Text" name="regexDesc" value="${data.histDescArray[i]}" readonly>`
  info += `</div>`
  info += `</div>`

  info += `<div class="form-group">`
  info += `<label class="control-label col-sm-3" for="regexText">Text: </label>`
  info += `<div class="col-sm-8">`
  info += `<textarea id="regexText" placeholder="Regex Matches" name="regexText" readonly>`
  info += `${data.histTextArray[i]}`
  info += `</textarea>`
  info += `</div>`
  info += `</div>`

  info += `</form>`

  histInfo.innerHTML = info;

  //after setting values of the history, show modal to user
  $("#showHistDetails").modal('show');

}

/**
 * Function to delete specific history items from history list
 * @param {HTMLEvent} e event to retrieve index
 */
function deleteHistory(e) {

  $("#deleteHist").modal('show');

  const index = e.currentTarget.index
  console.log(`Current index: ${index}`)

  //button in modal to trigger deletion
  document.getElementById('histDeleteBtn').addEventListener('click', e => {

    histData.histRegexArray.splice(index, 1)
    histData.histDescArray.splice(index, 1)
    histData.histTextArray.splice(index, 1)
    histData.histDateArray.splice(index, 1)

    browser.storage.local.set({
      'histData': JSON.stringify(histData)
    })
    //update storage
    //localStorage.setItem('histData', JSON.stringify(histData));

    showHist();
    histories();
    $("#deleteHist").modal('hide');
    //console.log(`fav${i}, ${i}`)

    return true;

  }, {
    once: true
  })

  //to avoid clicked on li and pop up modal
  e.stopImmediatePropagation();
  e.stopPropagation();
  e.preventDefault();
}

//function to set on click listener for each element
/** 
 * @method  histories
 *
 * @param  {Object}  data
 * 
 */
function histories() {

  for (let i = histData.histRegexArray.length - 1; i >= 0; i--) {
    console.log('in histories', i)


    document.getElementById(`clickHistTrash${i}`).index = i
    document.getElementById(`clickHistTrash${i}`).addEventListener('click', deleteHistory, {
      once: true
    })

    document.getElementById(`hist${i}`).addEventListener('click', (e) => {
      showHistModal(i, histData)
    })
  }

}

//create and show li elements for each favorite regex
/** 
 * @method  showFav
 *
 * @param  {Object}  data
 * 
 */
function showHist() {

  let list = document.getElementById('hist-ul-list');

  //Clear display area
  list.innerHTML = '';
  let info = '';

  for (let i = histData.histRegexArray.length - 1; i >= 0; i -= 1) {
    info += `<li class="list-group-item favList" id="hist${i}">`
    info += `<span class="glyphicon glyphicon-trash pull-right" aria-hidden="true" id="clickHistTrash${i}"></span>`
    info += `<h5 class="list-title ">${histData.histRegexArray[i]}</h5>`
    info += `<h6 class="list-date">${histData.histDateArray[i]}</h6>`
    info += `</li>`
  }

  list.innerHTML = info;
}