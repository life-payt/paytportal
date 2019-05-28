import dispatcher from '../dispatcher';

export function updateRole(data) {
    dispatcher.dispatch({
        type: 'update-role',
        data: data
    })
}

export function updateParties(data) {
    dispatcher.dispatch({
        type: 'update-parties',
        data: data
    })
}

export function updateInfo(name, email) {
    dispatcher.dispatch({
        type: 'update-info',
        data: { name: name, email: email }
    })
}

export function updateName(name) {
    dispatcher.dispatch({
        type: 'update-name',
        data: name
    })
}

export function updateEmail(email) {
    dispatcher.dispatch({
        type: 'update-email',
        data: email
    })
}

export function updatePartyActiveByCounty(data) {
    dispatcher.dispatch({
        type: 'update-party-active-county',
        data: data
    })
}

export function updatePartyActiveByParty(data) {
    dispatcher.dispatch({
        type: 'update-party-active-party',
        data: data
    })
}

export function updateAlias(county, producerIdx, alias) {
    dispatcher.dispatch({
        type: 'update-alias',
        data: { county: county, producerIdx: producerIdx, alias: alias }
    })
}

export function updateAuthenticated(data) {
    dispatcher.dispatch({
        type: 'update-authenticated',
        data: data
    })
}