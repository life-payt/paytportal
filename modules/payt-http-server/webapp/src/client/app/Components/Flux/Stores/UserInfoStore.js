import dispatcher from '../dispatcher';
import { EventEmitter } from 'events';
var merge = require('merge');

var emitter = EventEmitter.prototype.setMaxListeners(100);

// Internal object of user
// parties = [{'county': county, 'party': {party}}, ...]
var _user = {
    isAuthenticated: false,
    parties: [],
    role: '',
    name: '',
    email: '',
    partyAct: {} //alterar quando adicionar mais counties
};

function setAuthenticated(val) {
    _user.isAuthenticated = val;
}

// Method to update user info from action data
function setRole(role) {
    //api call to retrieve user info
    _user.role = role;
}

function setName(name) {
    //api call to retrieve user info
    _user.name = name;
}

function setEmail(email) {
    //api call to retrieve user info
    _user.email = email;
}

function addParty(data) {
    //data = [county,party]
    _user.parties.push({ 'county': data[0], 'party': data[1] });
}

function setPartyActiveByCounty(county) {
    _user.parties.forEach(party => {
        if (party.county === county)
            _user.partyAct = party.party;
    });
}

function setPartyActiveByParty(party) {
    _user.partyAct = party;
}

function setAlias(county, producerIdx, alias) {
    //api call to retrieve user info
    _user.parties.forEach((party, idx) => {
        if (party.county === county)
            _user.parties[idx].party.producers[producerIdx].alias = alias;
    });

    setPartyActiveByCounty(county);
}

// Merge our store with Node's Event Emitter
var UserInfoStore = merge(emitter, {

    // Returns all
    getUserInfo: function() {
        return _user;
    },

    emitChange: function() {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    removeAllListeners: function(callback) {
        this.removeListener('change', callback);
    }

});

// Register dispatcher callback
dispatcher.register(function(payload) {
    var action = payload.type;
    var data = payload.data;

    // Define what to do for certain actions
    switch (action) {
        case 'update-role':
            // Call internal method based upon dispatched action
            setRole(data);
            break;
        case 'update-parties':
            addParty(data);
            break;
        case 'update-info':
            setName(data.name);
            setEmail(data.email);
            break;
        case 'update-name':
            setName(data);
            break;
        case 'update-email':
            setEmail(data);
            break;
        case 'update-party-active-county':
            setPartyActiveByCounty(data);
            break;
        case 'update-party-active-party':
            setPartyActiveByParty(data);
            break;
        case 'update-alias':
            setAlias(data.county, data.producerIdx, data.alias);
            break;
        case 'update-authenticated':
            setAuthenticated(data);
            break;
        default:
            return true;
    }

    // If action was acted upon, emit change event
    UserInfoStore.emitChange();

    return true;

});

module.exports = UserInfoStore;