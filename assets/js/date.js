
// DOM
const timeDiv = document.getElementById('time');
const dateDiv = document.getElementById('date');


// DECLARAÇÃO DO OBJETO COM A CLASSE "Date"
let objDate = new Date();


// FUNÇÃO QUE OBTEM A DATA
function getData() {
    // FORMATADORES
    let monthsFormat = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    let daysWeekFormat = ['Domingo','Segunda-Feira','Terça-Feira','Quarta-Feira','Quinta-Feira','Sexta-Feira','Sábado'];


    // OBJETO DATA
    let data = {
        day: objDate.getDate(),
        month: objDate.getMonth(),
        year: objDate.getFullYear(),
        daysWeek: objDate.getDay(),

        dayWeekFormat: daysWeekFormat[objDate.getDay()],
        monthFormat: monthsFormat[objDate.getMonth()]
    }


    //RETORNA O OBJETO DATA
    return data;
}

// FUNÇÃO QUE OBTEM A HORA
function getTime() {
    // OBJETO HORA
    let time = {
        hour: objDate.getHours(),
        minutes: objDate.getMinutes()
    }

    //RETORNA O OBJETO HORA
    return time;
}


function setDataTime() {

    // ATRIBUINDO A CHAMADA DAS FUNÇÕES DE DATA E HORA NAS VÁRIAVEIS
    let data = getData();
    let time = getTime();

    // 
    dateDiv.innerHTML = `${data.dayWeekFormat}, ${data.day <= 9 ? '0'+data.day : data.day} de ${data.monthFormat} de ${data.year}`;
    timeDiv.innerHTML = `${time.hour <= 9 ? '0'+time.hour : time.hour}:${time.minutes <= 9 ? '0'+time.minutes : time.minutes}`
}

// CHAMADA DA FUNÇÃO DATA E HORA
setInterval(setDataTime, 0)