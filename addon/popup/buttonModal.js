// View Details Modal
function displayModal() {
    $('#viewDetails').modal('show');
}

function displayHistoryModal() {
    $('#viewHistDetails').modal('show');
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
}

