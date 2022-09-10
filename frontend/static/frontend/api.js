
/*
KEY COMPONENTS:
"activeItem" = null until an edit button is clicked. Will contain object of item we are editing
"list_snapshot" = Will contain previous state of list. Used for removing extra rows on list update

PROCESS:
1 - Fetch Data and build rows "buildList()"
2 - Create Item on form submit
3 - Edit Item click - Prefill form and change submit URL
4 - Delete Item - Send item id to delete URL
5 - Cross out completed task - Event handle updated item
NOTES:
-- Add event handlers to "edit", "delete", "title"
-- Render with strike through items completed
-- Remove extra data on re-render
-- CSRF Token
*/


function getCookie(name) {
var cookieValue = null;
if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
}
return cookieValue;
}
var csrftoken = getCookie('csrftoken');
var activeItem = null;
activeItemid = null;
var list_snapshot = []

buildList()
function buildList(){
var wrapper = document.getElementById('list-wrapper')
// wrapper.innerHTML = ""
var url = 'http://127.0.0.1:8000/api/task-list/'
fetch(url)
.then((response) =>response.json())
.then(function(data){
    console.log("data:",data)
    var list = data
    for(var i in list){

        try{
            document.getElementById(`data-row-${i}`).remove()
        }catch(err){

        }
        var title = `<span class="title">${list[i].title}</span>`
        if (list[i].completed == true){
            title = `<strike class="title">${list[i].title}</strike>`
        }
        var item = `
        
        <div id="data-row-${i}" class="task-wrapper flex-wrapper">

            <div style="flex:7" onclick="strikeUnstrike(${list[i].id},'${list[i].title}', ${list[i].completed})">
                ${title}
            </div>

            <div style="flex:1">
                <button class="btn btn-sm btn-outline-info edit" onclick="editItem(${list[i].id},'${list[i].title}',${list[i].completed} )">Edit </button>
            </div>

            <div style="flex:1">
                <button class="btn btn-sm btn-outline-dark delete" onclick="deleteItem(${list[i].id})">X</button>
            </div>
        </div>
        `

        wrapper.insertAdjacentHTML('beforeend', item)
    }

    if (list_snapshot.length > list.length){
        for (var i = list.length; i < list_snapshot.length; i++){
            document.getElementById(`data-row-${i}`).remove()
        }
    }

    list_snapshot = list
})
}


var form = document.getElementById('form-wrapper')
form.addEventListener('submit', function(e){
e.preventDefault()
console.log('form submitted')
var url = 'http://127.0.0.1:8000/api/task-create/'
method = 'POST'
if(activeItem != null ){
    var url = `http://127.0.0.1:8000/api/task-update/${activeItemid}/`
    method = 'PUT'
}
var title = document.getElementById('title').value
fetch(url, {
    method:method,
    headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
    },
    body:JSON.stringify({'title':title}),
}
).then(function(response){
    buildList()
    document.getElementById('form').reset()
})

})


function editItem(id, title, completed){
 console.log(id)
 activeItem = title
 activeItemid = id
 document.getElementById('title').value = activeItem
}

function deleteItem(id){
console.log(id)
fetch(`http://127.0.0.1:8000/api/task-delete/${id}/`,
{
    method:'DELETE',
    headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
    }
}).then((response)=>
{
    buildList()
})
}


function strikeUnstrike(id,title, completed){
console.log('Strike clicked')
completed = !completed;
fetch(`http://127.0.0.1:8000/api/task-update/${id}/`,{

    method:'PUT',
    headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
    },
    body:JSON.stringify({'title':title, 'completed':completed})
}).then((response) => {
    buildList()
})
}
