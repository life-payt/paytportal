import dispatcher from "../dispatcher";

export function loadStrings(data) {
    dispatcher.dispatch({
        type: 'load-strings',
        data: data
    })
}