'use strict';

function select(selector, scope = document) {
    return scope.querySelector(selector);
}


const clock = select('.real-clock');
const alarmTimeDisplay = select('.alarm-time');
const form = select('.inputs');
const hoursInput = select('.hours');
const minutesInput = select('.minutes');
const btn = select('.btn');
const message = select('.feedback');

const alarmSound = new Audio('./assets/Audio/six.mp3');
alarmSound.type = 'audio/mp3';
let alarmTime = null;

/*
    formatTime() is a method to only display time. I use use this to organise
    my code instaed of writing .getHour().toString().padStart() and t returs a string
    format 'HH'
*/
function formatTime(date) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false   // I use this to enforce 24-hour format because by default localeString is 12h format
    };

    let result = date.toLocaleTimeString('en-CA', options);
    return result;
}

function displayCurrentTime() {
    const now = new Date();
    clock.innerText = formatTime(now);
    checkAlarm(now); 
}

function checkAlarm(currentTime) {
    if (alarmTime && formatTime(currentTime) === alarmTime) {
        alarmSound.play();
        message.innerText = 'Alarm is ringing!!';
        clock.classList.add('ringing');
        
        setTimeout(() => {
            clock.classList.remove('ringing');
            alarmTime = null; 
            alarmTimeDisplay.innerText = ''; 
        }, 5000);
    }
}


function validateInput(hours, minutes) {
    const hourNum = Number(hours);
    const minuteNum = Number(minutes);
    
    if (!Number.isInteger(hourNum) || !Number.isInteger(minuteNum)) {
        message.innerText = "Please enter whole numbers";
        return false;
    }
    if (!(hourNum > 0 && hourNum < 24)) {
        message.innerText = "Invalid hour!! Must between 0 and 23";
        return false;
    }
    if (!(minuteNum > 0 && minuteNum < 60)) {
        message.innerText = "Invalid minute!! Must between  0 and 59";
        return false;
    }

    return { hourNum, minuteNum }; 
}

function getValidInput() {
    const hour = hoursInput.value.trim();
    const minute = minutesInput.value.trim();
    const validInput = validateInput(hour, minute);
    if (!validInput) return null;
    return validInput;
}


function setAlarm() {
    const validInput = getValidInput();
    if(!validInput) return;

    const alarmDate = new Date();
    alarmDate.setHours(validInput.hourNum, validInput.minuteNum, 0, 0);

    const now = new Date();
    if(alarmDate.getTime() <= now.getTime()) {
        alarmDate.setDate(alarmDate.getDate() + 1);
    }

    alarmTime = formatTime(alarmDate); 
    alarmTimeDisplay.innerText = `\u{1F514} ${alarmTime}`; // Unicode for the bell symbol 
    message.innerText = ''; 
    hoursInput.value = ''; 
    minutesInput.value = '';
}

hoursInput.addEventListener('input', (event) => {
    if (/^\d{0,2}$/.test(event.target.value)) {
        // Allow only up to 2 digits
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    } else {
        event.target.value = event.target.value.slice(0, 2);
    }
});

minutesInput.addEventListener('input', (event) => {
    if (/^\d{0,2}$/.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    } else {
        event.target.value = event.target.value.slice(0, 2);
    }
});

setInterval(displayCurrentTime, 1000);
btn.addEventListener('click', setAlarm); 
