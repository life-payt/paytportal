import dispatcher from '../dispatcher';
import { EventEmitter } from 'events';
var merge = require('merge');
import en from '../../i18n/en';
import pt from '../../i18n/pt';
import gr from '../../i18n/gr';

var emitter = EventEmitter.prototype.setMaxListeners(100);

const languages = {
    en,
    pt,
    gr
};

// Internal object of strings
var _strings = languages[getCookie('lang') || 'pt'];

// Method to load strings from action data
function loadStrings(data) {
    _strings = data;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}


// Merge our store with Node's Event Emitter
var TranslationsStore = merge(emitter, {

    // Returns all shoes
    getStrings: function() {
        return _strings;
    },

    emitChange: function() {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }

});

// Register dispatcher callback
dispatcher.register(function(payload) {
    var action = payload.type;
    var data = payload.data;

    // Define what to do for certain actions
    switch (action) {
        case 'load-strings':
            // Call internal method based upon dispatched action
            loadStrings(data);
            break;

        default:
            return true;
    }

    // If action was acted upon, emit change event
    TranslationsStore.emitChange();

    return true;

});

module.exports = TranslationsStore;