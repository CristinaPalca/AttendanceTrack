let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var active_cont = null;

function showCalendar(container){
  active_cont = container;
  let firstDay = new Date(currentYear, currentMonth).getDay();
  let daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate();
  let tbl = active_cont.querySelector(".calendar-body");
  let monthAndYear = active_cont.querySelector(".monthAndYear");
  tbl.innerHTML = "";

  monthAndYear.innerText = months[currentMonth] + " " + currentYear;
//  monthAndYear.innerText= months[currentMonth];
  let date = 1;

  for(let i = 0; i < 6; i++){
    let row = document.createElement('tr');

    for(let j = 0; j < 7; j++){
      if( i === 0 && j < firstDay){
        let cell = document.createElement('td');
        let cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      }else if(date > daysInMonth){
        if(j != 0){
          let cell = document.createElement('td');
          let cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        }else{
          break;
        }
      }else{
        let cell = document.createElement('td');
        let cellText = document.createTextNode(date);
        date++;
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

    }
    tbl.appendChild(row);
  }
}

function previous(){
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showCalendar(active_cont);
  extract_month_from_storage(active_cont);
}

function next(){
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
  showCalendar(active_cont);
  extract_month_from_storage(active_cont);
}
