import dispatcher from '../dispatcher';
import { EventEmitter } from 'events';
var merge = require('merge');

var emitter = EventEmitter.prototype.setMaxListeners(100);

// Internal object of notifications
var _notifications = [];

// Method to add notification from action data
function addNotification(data) {
    _notifications.push(data);
}

// Method to remove notification from action data
function removeNotification() {
    // TODO
    _notifications.splice(0, 1);
}

// Merge our store with Node's Event Emitter
var NotificationsStore = merge(emitter, {

    // Returns all shoes
    getNotifications: function() {
        return _notifications;
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
        case 'addNotification':
            // Call internal method based upon dispatched action
            addNotification(data);
            break;
        case 'removeNotification':
            // Call internal method based upon dispatched action
            removeNotification();
            break;

        default:
            return true;
    }

    // If action was acted upon, emit change event
    NotificationsStore.emitChange();

    return true;

});

module.exports = NotificationsStore;