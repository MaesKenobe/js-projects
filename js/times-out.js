'use strict';

/**
*
* Common definitions.
*
*/

// Common elements.
const body = document.querySelector('body');
let memoryTimers = new Array();

// Definition of components.
const timerContainer = document.querySelector('.timer__container');
const timerAdd = document.querySelector('.button--add-timer');
const timerEdit = document.querySelector('.button__edit--timer');
const timerRemove = document.querySelector('.button__remove--timer');
const removeAll = document.querySelector('.button--remove-all-timers');

/**
*
* Functions.
*
*/

// HELPERS.

// Transform time in string.
function timeCalculator(seconds) {
  // Just in case the value is not a number (probably another string).
  seconds = Number(seconds);
  let y = Math.floor(seconds / 31536000);
  let mo = Math.floor((seconds % 31536000) / 2628000);
  let d = Math.floor(((seconds % 31536000) % 2628000) / 86400);
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = Math.floor(seconds % 60);

  let yDisplay = y > 0 ? y + 'y ' : "";
  let moDisplay = mo > 0 ? mo + 'm ' : "";
  let dDisplay = d > 0 ? d + 'd ' : "";
  let hDisplay = h > 0 ? ('0' + h.toString()).slice(-2) + ':' : "00:";
  let mDisplay = m > 0 ? ('0' + m.toString()).slice(-2) + ':' : "00:";
  let sDisplay = s > 0 ? ('0' + s.toString()).slice(-2) : "00";
  return yDisplay + moDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
}


// LOCAL STORAGE CONTROL.

// Sync with localstorage. We need to parse array and objects like JSON.
const syncStorage = function() {
  localStorage.setItem("memoryTimers", JSON.stringify(memoryTimers));
};

// Load from localstorage. We need to unparse the stored JSON value.
const loadStorage = function () {
  let load = JSON.parse(localStorage.getItem("memoryTimers") || "[]");
  memoryTimers = load;
  return load;
};

// Clear from logalstorage.
const clearStorage = function() {
  // Clean local storage.
  localStorage.clear();
  // Set variables to default.
  memoryTimers = [];
};


// TIMER CONSTRUCTOR, TIMER RENDERING, TIMER ADD AND TIMER REMOVE.

// Timer constructor with markup.
const constructTimer = function(timer) {
  let markup = document.createElement('div');
  markup.setAttribute('class', 'timer');
  markup.setAttribute('id', timer.id );
  markup.setAttribute('data-status', timer.status);
  let statusLabel = "";

  if ( timer.status === 'ready' ) {
    statusLabel = "Start";
  }
  else if (timer.status === 'running') {
    statusLabel = "Pause";
  }
  else if (timer.status === 'paused') {
    statusLabel = "Restart";
  }

  markup.innerHTML = '<div class="timer__main--content"><h3 class="timer__title">' + timer.title + '</h3><p class="timer__description">' + timer.description + '</p><p class="timer__time" data-value="' + Number(timer.timeAccumulated) + '">' + timeCalculator(timer.timeAccumulated) + '</p><div class="timer__controls--editing"><button class="button button__edit--timer" id="edit--' + timer.id + '"></button><button class="button button__remove--timer" id="remove--' + timer.id + '"></button></div></div><div class="timer__controls--status"><button class="button button__trigger--timer" id="trigger--' + timer.id + '" data-status="'+ timer.status +'">'+ statusLabel +'</button></div></div>';
  return markup;
};

// Look for especific timer.
const searchTimer = function(id) {
  // Load stored timers.
  loadStorage();

  // Get position of this timer.
  return memoryTimers.map(function(e) { return e.id; }).indexOf(id);
};

// Retrieve espeficic timer.
const retrieveTimer = function(index) {
  if (index > -1) {
    return memoryTimers[index];
  }
};

// Update especific Timer.
const updateTimer = function(object) {
  memoryTimers = memoryTimers.map(e => e.id !== object.id ? e : object);
};

// Start timers.
const startTimers = function() {
  let timers = timerContainer.querySelectorAll('.timer');
  if (timers) {
    // Look for all rendered timers, start to move the counters.
    for (let i = 0; i < timers.length; i++) {
      let thisTimer = timers[i];
      let thisTimerStatus = thisTimer.getAttribute('data-status');
      let thisTimerCounter = thisTimer.querySelector('.timer__time');
      let thisTimerCounterValue = Number(thisTimerCounter.getAttribute('data-value'));

      if (thisTimerStatus === "running") {
        setInterval(function() {
          thisTimerCounterValue = Number(thisTimerCounterValue + 1);
          thisTimerCounter.textContent = timeCalculator(thisTimerCounterValue);
          thisTimerCounter.setAttribute('data-value', thisTimerCounterValue);
          saveCounters();
        }, 1000);
      }
    }
  }
};

// Save all timers counters.
const saveCounters = function() {
  let timers = timerContainer.querySelectorAll('.timer');
  if (timers) {
    // Look for all rendered timers, start to move the counters.
    for (let i=0; i<timers.length; i++) {
      let status = timers[i].getAttribute('data-status');
      let id = timers[i].getAttribute('id');
      let thisAccumulated = timers[i].querySelector('.timer__time').getAttribute('data-value');
      let targetTimer = retrieveTimer(searchTimer(id));
      targetTimer.status = status;
      targetTimer.timeAccumulated = Number(thisAccumulated);
      updateTimer(targetTimer);
      syncStorage();
    }
  }
}

// Render the timers.
const renderTimers = function() {
  let load = loadStorage();

  // Remove previous Timers.
  while (timerContainer.firstChild) {
    timerContainer.firstChild.remove();
  }

  // If it exists, it is not empty and it is not null.
  if (typeof load !== "undefined" && load !== "" && load !== null) {
    let timer = new Object();
    
    // Look for all saved timers, parse them to the markup with construct function and then append them to the container.
    for (let i=0; i<load.length; i++) {
      timer = constructTimer(load[i]);
      timerContainer.append(timer);
    }

    startTimers();
  }
};

// Add Timer.
timerAdd.addEventListener("click", function() {
  openModal("new");
});

// Edit Timer.
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id.includes("edit--timer-")) {
    let thisTimer = document.querySelector('#' + event.target.id);
    let thisTimerId = thisTimer.closest('.timer').getAttribute('id');
    let index = "";

    // Get position of this timer.
    index = searchTimer(thisTimerId);
    
    // If position exists.
    if (index > -1) {
      openModal("edit", retrieveTimer(index));
    }
  };
});

// Remove especific timer.
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id.includes("remove--timer-")) {

    let message ="Are you sure? There is no way to recover the timer."
    if (confirm(message) == true) {
      let thisTimer = document.querySelector('#' + event.target.id);
      let thisTimerID = thisTimer.closest('.timer').getAttribute('id');
      let index = "";
  
      // Get position of this timer.
      index = searchTimer(thisTimerID);
      
      // If position exists.
      if (index > -1) {
        // Remove item from array.
        memoryTimers.splice(index, 1);
      }
  
      // Save changes.
      syncStorage();
  
      // Render the new timers.
      renderTimers();
    }
  };
});

// Trigger timer status.
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id.includes("trigger--timer-")) {
    let thisButton =  document.querySelector('#' + event.target.id);
    let thisTimer = thisButton.closest('.timer');
    let thisTimerStatus = thisTimer.getAttribute('data-status');

    // Change status logic: Ready => Running => Paused => Running => Paused => ... 
    // It nevers come back to ready status, this is only for new and non initialised timers.
    if (thisTimerStatus === "ready") {
      thisTimer.setAttribute('data-status', 'running');
      thisButton.setAttribute('data-status', 'running');
    }
    else if (thisTimerStatus === "running") {
      thisTimer.setAttribute('data-status', 'paused');
      thisButton.setAttribute('data-status', 'paused');
    }
    else if (thisTimerStatus === "paused") {
      thisTimer.setAttribute('data-status', 'running');
      thisButton.setAttribute('data-status', 'running');
    }

    saveCounters();
    renderTimers();
  };
});

// Remove all timers.
removeAll.addEventListener("click", function() {
  let message ="Are you sure? There is no way to recover the timers."
  if (confirm(message) == true) {
    // Remove stored data.
    clearStorage();
    // Refresh timer rendering.
    renderTimers();
    // Send a message.
    setTimeout(function() {
      alert('All timers removed');
    }, 100);
  }
});


// MODAL AND MODAL CONTROLS.

// Modal constructor.
const constructModal = function(operation, object) {
  let thisModal = document.createElement('div');
  thisModal.setAttribute('class', 'modal content-modal');

  // New timer modal.
  if (operation === "new") {
    thisModal.setAttribute("data-action", "new");
    thisModal.innerHTML = '<div class="modal__modal-window-container" id="modal"><div class="modal-window"><div class="modal-window__close" id="closeModal" ></div><div class="row row__title"><label class="label modal__label" for="timer__title">Title:</label><input class="timer__title" name="timer__title" type="text"></input></div><div class="row row__description"><label class="label modal__label for="timer__description">Description:</label><input type="text" class="timer__description" name="timer__description"></input></div><div class="modal__controls"><button class="button controls--save" id="controls--save">Save</button><button class="button controls--cancel" id="controls--cancel">Cancel</button></div></div></div>';
    
  }

  // Edit timer modal.
  if (operation === "edit" && object) {
    thisModal.setAttribute("data-action", "edit");
    thisModal.setAttribute("data-target", object.id);
    thisModal.innerHTML = '<div class="modal__modal-window-container " id="modal"><div class="modal-window"><div class="modal-window__close" id="closeModal" ></div><div class="row row__title"><label class="label modal__label" for="timer__title">Title:</label><input class="timer__title" name="timer__title" type="text" value="' + object.title +'"></input></div><div class="row row__description"><label class="label modal__label for="timer__description">Description:</label><input type="text" class="timer__description" name="timer__description" value="' + object.description + '"></input></div><div class="modal__controls"><button class="button controls--save" id="controls--save">Update</button><button class="button controls--cancel" id="controls--cancel">Cancel</button></div></div></div>';
  }

  return thisModal;
};

// Append and open the modal.
const openModal = function (operation, object) {
  let newModal = "";
  
  // Check if there is a previous modal wandering there...
  if ( document.querySelector('.modal__modal-window-container') === true ) {
    closeModal();
  }

  // Save the constructor results in the variable.
  newModal = constructModal(operation, object);

  // Append the new modal.
  body.append(newModal);

  // Add class show to make visible the modal.
  document.querySelector('.modal__modal-window-container').classList.add("show");
};

// Close and remove the modal.
const closeModal = function () {
  document.querySelector('.modal__modal-window-container').classList.remove("show");
  body.removeChild(document.querySelector('.modal'));
};

// Parse modal input values to object.
const parseModal = function(operation, object) {
  let modal = document.querySelector('.modal__modal-window-container');
  let index = memoryTimers.length;
  let thisTimer = {};

  if ( operation === "new" ) { 
  
    // Create timer structure.
    thisTimer.id = "timer-" + index;
    thisTimer.title = modal.querySelector('.timer__title').value;
    thisTimer.description = modal.querySelector('.timer__description').value;
    thisTimer.status = 'ready'; // Posible status: ready, running, paused.
    thisTimer.timeAccumulated = 0;

    memoryTimers.push(thisTimer);
    thisTimer = {};
  }
  else if (operation === "edit" && object) {
    // It only can be modified title and description.
    object.title = modal.querySelector('.timer__title').value;
    object.description = modal.querySelector('.timer__description').value;
    updateTimer(object);
  }

  // Sync localstorage.
  syncStorage();
};

// Click close button on modal.
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id == 'closeModal' || event.target.id == 'controls--cancel' || event.target.id == 'modal')  {
    closeModal();
  };
});

// Click save button on modal.
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id == 'controls--save' ) {
    let thisModal = document.querySelector('#' + event.target.id).closest('.modal');
    let thisTimer = thisModal.getAttribute('data-target');
    let status = thisModal.getAttribute('data-action');
    let index = "";

    if (status === "new") {
      // Parse modal new variables to object.
      parseModal("new");
    }

    if (status === "edit" && thisTimer.length > 0) {
      // Get position of this timer.
      index = searchTimer(thisTimer);
      // Parse modal with previous object values to edit.
      parseModal("edit", retrieveTimer(index));
    }

    // Render new timers.
    renderTimers();
    // Close modal.
    closeModal();
  };
});


// ON LOAD OR RESIZE OR RELOAD.
renderTimers();