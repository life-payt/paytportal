import dispatcher from '../dispatcher';

export function addNotification(data) {
    dispatcher.dispatch({
        type: 'addNotification',
        data: data
    })
}

export function removeNotification(data) {
    dispatcher.dispatch({
        type: 'removeNotification',
        data: data
    })
}