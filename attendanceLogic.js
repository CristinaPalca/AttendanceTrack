
const min_attendance = Math.floor(12 * 0.75);
const selected_days_key = 'selected_days_key';

const el_string = '<li class="subject_wrapper d-flex flex-column align-items-center">'+
  '<div class="subject">'+
    '<span class="subject_name"></span>' +
    '<span class="attendance_nr"></span>' +
    '<div class="buttons">'+
    '<i class="open_calendar mx-2 fas fa-plus fa-sm text-primary"></i>' +
    '<i class="remove_lecture mx-2 far fa-times-circle fa-md text-secondary"></i>' +
    '</div>' +
  '</div>' +
  '<div class="card-wrapper d-none">' +
  '<div class="card">' +
    '<div class="card-header d-flex align-items-center justify-content-around">' +
    '<button class="btn btn-outline-primary previous-btn" onclick=previous()> Previous </button>'+
      '<span class="monthAndYear">Month and Year</span>'+
    '<button class="btn btn-outline-primary next-btn" onclick=next()> Next </button>'+
    '</div>' +
    '<table class="table table-bordered table-responsive-sm" class="calendar">'+
      '<thead>'+
        '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th>'+
          '<th>Sat</th></tr></thead>'+
      '<tbody class="calendar-body"></tbody>'+
    '</table>'+
    '<div class="container submit-container d-flex align-items-center justify-content-end">'+
      '<button class="btn cancel-btn btn-outline-secondary my-2 mx-1"> Cancel </button>'+
      '<button class="btn done-btn btn-outline-primary my-2 mx-1"> Done </button>'+
    '</div></div></div></li>';


function add_listeners(){

  window.addEventListener("load", add_attendance);
  window.addEventListener("load", add_lectures);
  let add_btn = document.querySelector(".add_subject_btn");
  add_btn.addEventListener("click", add_lecture);

  let list = document.querySelector(".lectures-list");
  list.addEventListener("click", add_click_listeners);
}

function add_lecture(e){
  console.log("add lecture pressed");
  let items_list = document.querySelector(".lectures-list");
  items_list.innerHTML += el_string;

  let text = document.querySelector(".add_subject input").value;

  let items_names = document.querySelectorAll(".subject_name");
  const last_item_index = items_names.length - 1;
  items_names[last_item_index].innerText = text;
  text.value = "";
  let tmp_item = items_names[last_item_index];
  while(!tmp_item.classList.contains("subject_wrapper")){
    tmp_item = tmp_item.parentNode;
  }
  refresh_total_of_lectures(tmp_item);
  var local = JSON.parse(localStorage.getItem(selected_days_key));

  local.push({name: text});
  localStorage.setItem(selected_days_key, JSON.stringify(local));
}




function add_click_listeners(e){
  if(e.target.classList.contains("open_calendar")){
    add_btn_listener(e);
  }else if(e.target.tagName.toLowerCase() === "td" && e.target.innerText != ""){
    e.target.classList.toggle("item-selected");
    e.target.classList.toggle("bg-secondary");
  }else if(e.target.classList.contains("remove_lecture")){
    let tmp_lecture = e.target.parentNode;
    while(!tmp_lecture.classList.contains("subject_wrapper")){
      tmp_lecture = tmp_lecture.parentNode;
    }
    remove_lecture(tmp_lecture);
  }
  //check for done button
  else if(e.target.classList.contains("done-btn")){
    let tmp_parent = e.target.parentNode;
    while(tmp_parent.tagName.toLowerCase() != "li"){
      tmp_parent = tmp_parent.parentNode;
    }
    done(tmp_parent);
  }
  //check for close button
  else if(e.target.classList.contains("cancel-btn")){
    let tmp_calendar = e.target;
    while(tmp_calendar.classList.contains("card-wrapper") === false){
      tmp_calendar = tmp_calendar.parentNode;

    }
    cancel(tmp_calendar);
  }else{
    console.log("outside card listeners" + e.target.classList);
  }
}

function remove_lecture(item){
  const item_name = item.querySelector(".subject_name").innerText;
  var tmp_arr = JSON.parse(localStorage.getItem(selected_days_key));
  for(let i = 0; i < tmp_arr.length; i++){
    if(tmp_arr[i].name === item_name){
      tmp_arr.splice(i, 1);
      break;
    }
  }
  localStorage.setItem(selected_days_key, JSON.stringify(tmp_arr));
  item.parentNode.removeChild(item);
}

function add_lectures(e){
  const lectures_local_arr = JSON.parse(localStorage.getItem(selected_days_key));
  var list_parent = document.querySelector(".lectures-list");
  for(let i = 0; i < lectures_local_arr.length; i++){
    list_parent.innerHTML += el_string;
  }
  let list_items = list_parent.querySelectorAll('.subject_wrapper');
  for(let i = 0; i < lectures_local_arr.length; i++){
    let list_item_name = list_items[i].querySelector('.subject_name');
    let list_item_attendance = list_items[i].querySelector(".attendance_nr");
    list_item_name.innerText = lectures_local_arr[i].name;
  }
  add_attendance();
}


function add_btn_listener(e){
  // list item
    let tmp_cont = e.target;
    while(!tmp_cont.classList.contains("subject_wrapper")){
      tmp_cont = tmp_cont.parentNode;
    }
  //  let tmp_cont = e.target.parentNode.parentNode; // li container
    let calendar_container = tmp_cont.querySelector(".card-wrapper");
    showCalendar(tmp_cont);
    if(calendar_container.classList.contains("d-none")){
      calendar_container.classList.remove("d-none");
      extract_month_from_storage(tmp_cont);
    }else{
      calendar_container.classList.add("d-none");
    }

  e.preventDefault();
}

function extract_month_from_storage(item){
  var tmp_obj = JSON.parse(localStorage.getItem(selected_days_key));
  var tmp_name = item.querySelector(".subject_name").innerText;
  var calendar_days = item.querySelectorAll("td");

  if(tmp_obj != null){
    tmp_obj.forEach(function(item){
      if(item.name === tmp_name){
        if(item.months){
          item.months.forEach(function(month){
            if(month.month === currentMonth){
              month.days.forEach(function(day){
                for(let i = 0; i < calendar_days.length; i++){
                  if(calendar_days[i].innerText === day){
                    calendar_days[i].classList.toggle("item-selected");
                    calendar_days[i].classList.toggle("bg-secondary");
                    break;
                  }
                }
              });
            }
          });
        }

      }
    });
  }

}


function cancel(container){
  container.classList.add("d-none");
}


function done(parent_item){

  let obj_arr;
  const obj_name = parent_item.querySelector(".subject_name").innerText;
  const days_selected = parent_item.querySelectorAll(".item-selected");
  var days_arr = [];
  var check_for_object = false;
  var check_for_month = false;
  const tmp_calendar = parent_item.querySelector(".card-wrapper");
  days_selected.forEach(function(item){
    days_arr.push(item.innerText);
  });

  if(JSON.parse(localStorage.getItem(selected_days_key)) === null){
    //init new object
    obj_arr = [];
  }else{
    // add to existing object
    obj_arr = JSON.parse(localStorage.getItem(selected_days_key));
    for(let i = 0; i < obj_arr.length; i++){
      if(obj_arr[i].name === obj_name){
        check_for_object = true;
        if(obj_arr[i].months){
          for(let j = 0; j < obj_arr[i].months.length; j++){
            let month = obj_arr[i].months[j].month;
            if(month === currentMonth){
              check_for_month = true;
              obj_arr[i].months[j].days = days_arr;
              break;
            }
          }
        }
        if(!check_for_month){
          let tmp_month = {
            month: currentMonth,
            days: days_arr
          }
          if(obj_arr[i].months){
            obj_arr[i].months.push(tmp_month);
          }else{
            obj_arr[i].months = [tmp_month];
          }

        }
        break;
      }
    }
  }
  if(!check_for_object){
    let tmp_obj = {
      name: obj_name,
      months: [{month: currentMonth, days: days_arr}]
    };
    obj_arr.push(tmp_obj);
  }

  localStorage.setItem(selected_days_key, JSON.stringify(obj_arr));
  cancel(tmp_calendar);
  add_attendance();
}

function add_attendance(){
  let tmp_list_items = document.querySelectorAll(".subject_wrapper");
  tmp_list_items.forEach(function(list_item){
    refresh_total_of_lectures(list_item);
  });
}

function refresh_total_of_lectures(list_item){
  var tmp_nr = 0;
  var tmp_add_nr = list_item.querySelector(".attendance_nr");
  const tmp_name = list_item.querySelector(".subject_name").innerText;
  let tmp_obj_arr = JSON.parse(localStorage.getItem(selected_days_key));
  if( tmp_obj_arr != null){
      for( let i = 0; i < tmp_obj_arr.length; i++){
        if(tmp_obj_arr[i].name === tmp_name){
          if(tmp_obj_arr[i].months){
            tmp_obj_arr[i].months.forEach(function(month){
              tmp_nr += month.days.length;
            });
            break;
          }else{
            console.log("no month");
          }

        }
      }
  }

  tmp_add_nr.innerText = tmp_nr + '/' + min_attendance;
}


add_listeners();
