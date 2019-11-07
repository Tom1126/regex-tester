//declare data object
var data = {
  regexArray: [],
  descArray: [],
  textArray: [],
  dateArray: []

}

if (typeof(Storage) !== "undefined") {
  // Code for localStorage/sessionStorage.

  //set data object with value or empty object in storage
  const getFav = browser.storage.local.get("favData")
  getFav.then(results => {
    if (!Object.is(results, undefined)) {

      data = JSON.parse(results['favData']) || data
      showFav();
      favorites();

    } else {
      console.log(`favData not found in local storage`)
    }

    
  })
  .catch(err => {
    console.error(err)
  })

  //show data in favorite tab
  //showFav(data);


  //if addFav button is clicked
  document.getElementById('addFav').addEventListener('click', (e) => {

      var txt = '';
      var regex = document.getElementById("enter-regex").value;//get regex value from user
      var text = document.getElementById("enter-text").value;//get text to text value from user
      var desc = ''

      var x;
      var bool = false;

      for(x in data.regexArray){//for each item in regex array
        if(regex === data.regexArray[x]){//check if there are duplicated totally similar regex
            bool = true;//there is duplicated regex in localStorage
           break;
        }
      }
      if(!bool){//if no duplicated regex, continue

        //show modal when addFav button clicked
        $("#inputDescDetails").modal('show');
        document.getElementById("enter-text").innerHTML=`Regex entered: ${regex}`//get regex value
        //detect click to submit description

        const addFavElement = document.getElementById("descSubmit");

        //if(addFavElement.getAttribute('listener')!=='true'){
          document.getElementById("descSubmit").addEventListener('click', (e) => {
            desc=document.getElementById('enter-desc').value;
            console.log('desc',desc,'regex',regex,'text',text)
            $("#inputDescDetails").modal('hide');
          
            //validate if description is empty
            if (desc === null || desc === "") {
              document.getElementById("favMessage").innerHTML = "Favorites adding insuccessful.";//show text and prompt user addign favorites insuccessful
            }
            else {

              //add value into data object
              data.regexArray.push(regex);
              data.descArray.push(desc);
              data.textArray.push(text)

              //get current data and store into dateArray in data object
              var d = new Date();
              var datefullform = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
              data.dateArray.push(datefullform);

              //store data in storage
              browser.storage.local.set({
                'favData': JSON.stringify(data)
              })

              //set and show regex is added with a message
              document.getElementById("favMessage").innerHTML = `${regex} is successfully added to favorites.`;//set text for display message to user

              showFav()
              favorites();


            }


          }, {once: true});//make sure the addEventListener only added once

        
      }
      else{
        document.getElementById("favMessage").innerHTML = `${regex} exists in favorites.`;//set text for display message to user
      }
      
    })

    //if test button is clicked, hide favorite message
    document.getElementById('test').addEventListener('click', (e) => {
      document.getElementById("favMessage").innerHTML = ''
    })

    favorites();

      

} else {
  // Sorry! No Web Storage support..
  console.log("no web storage support");
}



//function to display modal and set value for elements in modal
/** 
   * @method  showFavModal
   *
   * @param  {int}  i
   * 
   */
function showFavModal(i){

  let favInfo = document.getElementById('favInfoContainer');


  //Clear display area
  favInfo.innerHTML = '';
  let info = '';    
  
  info+= `<form class="form-horizontal" id="viewDetailsForm" action="#">`

  info+= `<div class="form-group">`
  info+= `<label class="control-label col-sm-3" for="regexDate">Date Added:</label>`
  info+= `<div class="col-sm-8">`
  info+= `<input type="text" class="form-control" id="regexDate" placeholder="Regex Title" name="regexDate" value="${data.dateArray[i]}" readonly>`
  info+= `</div>`
  info+= `</div>`

  info+= `<div class="form-group">`
  info+= `<label class="control-label col-sm-3" for="regexDesc">Description: </label>`
  info+= `<div class="col-sm-8">`
  info+= `<input type="text" class="form-control" id="regexDesc" placeholder="Regex Text" name="regexDesc" value="${data.descArray[i]}" readonly>`
  info+= `</div>`
  info+= `</div>`

  info+= `<div class="form-group">`
  info+= `<label class="control-label col-sm-3" for="regexText">Text: </label>`
  info+= `<div class="col-sm-8">`
  info+= `<textarea id="regexText" placeholder="Regex Matches" name="regexText" readonly>`
  info+= `${data.textArray[i]}`
  info+= `</textarea>`
  info+= `</div>`
  info+= `</div>`

  info+= `</form>`

  favInfo.innerHTML = info;

  //after setting values, show modal to user
  $("#showFavDetails").modal('show');

}

//function to set on click listener for each element
/** 
   * @method  favorites
   *
   * 
   */
function favorites(){
  for (let i = data.regexArray.length-1; i >= 0; i -= 1) {
    console.log('in favorites',i)

    document.getElementById(`clickTrash${i}`).addEventListener('click', (e) => {
      //alert(e.target.parentNode.id)
      $("#deleteFav").modal('show');

      console.log('delete clicked')

      //button in modal to trigger deletion
      document.querySelector(".btn-success").addEventListener('click', (e) => {
        data.regexArray.splice(i, 1)
        data.descArray.splice(i, 1)
        data.textArray.splice(i, 1)
        data.dateArray.splice(i, 1)

        //update storage
        browser.storage.local.set({
          'favData': JSON.stringify(data)
        })

        showFav();
        favorites()
        $("#deleteFav").modal('hide');
        //console.log(`fav${i}, ${i}`)

        return true;
      }, {once: true})

      //to avoid clicked on li and pop up modal
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();


    })

    
    document.getElementById(`fav${i}`).addEventListener('click', (e) => {
      //alert(`fav${i}, ${i}`)
      showFavModal(i)
    })
  }
}

//create and show li elements for each favorite regex
/** 
   * @method  showFav
   *
   * 
   */
function showFav(){
  //console.log('showFav function',data)
      
  let list = document.getElementById('fav-ul-list');

  //Clear display area
  list.innerHTML = '';

  console.log(list.innerHTML)
  let info = '';    

  for (let i = data.regexArray.length-1; i >= 0; i -= 1) {
    info+= `<li class="list-group-item favList" id="fav${i}">`
    info+= `<span class="glyphicon glyphicon-trash pull-right" aria-hidden="true" id="clickTrash${i}"></span>`
    info+= `<h5 class="list-title ">${data.regexArray[i]}</h5>`
    info+= `<h6 class="list-date">${data.dateArray[i]}</h6>`
    info+= `</li>`
  }

  list.innerHTML = info;
}
