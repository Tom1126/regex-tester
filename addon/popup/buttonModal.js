// View Details Modal
function displayModal() {
    $('#viewDetails').modal('show');
}

// Delete Confirmation Dialog
function displayConfirm() {
    $("#deleteFav").modal('show');
}

window.onload = function() {
    var test = document.getElementById("test").addEventListener('click', (e) => {
        var element =  document.getElementsByClassName('result__count__text');

        if (element.length!=0){
            document.getElementById('addFav').style.display = 'inline-block'; //show favorites button after results produced
        }
        else{
            document.getElementById('addFav').style.display = 'none'; //hide favorites button if no results produced
        }
    });
    var list = document.getElementById("clickList");
    var trash = document.getElementById("clickTrash");
    list.onclick = displayModal;
    trash.onclick = displayConfirm;
}

