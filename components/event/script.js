/**
 * Event register
 * 
 */

const Event = {

    events: {},

    /**
     * insere uma ação para um determinado evento
     * 
     * @param {string} event  Nome do evento
     * @param {string} id Nome da ação
     * @param {function} action Ação a ser executada quando o Evento for disparado
     * 
     * @return {boolean}
     */
    subscribe: (event, id, action) => {
        if (!Event.events[event]) Event.events[event] = {}
        if (!Event.events[event][id]) {
            Event.events[event][id] = action
            return true
        }
        return false
    },

    /**
     * Apaga um determinado evento indicado pelo seu id
     * 
     * @param {string} event 
     * @param {string} id 
     * 
     * @return {boolean}
     */
    unsubscribe: (event, id) => {
        if (!Event.events[event]) return false
        return delete (Event.events[event][id])
    },

    /**
     * Executa TODAS as ações registradas para um "event" e "id" 
     * 
     * @param {string} event Nome do evento
     * @param {object|string|number|boolean} data dados passados como argumento (opcional) 
     * 
     * @return {boolean} 
     */
    trigger: (event, data) => {
        if (!Event.events[event]) return false
        for (var i in Event.events[event]) {
            Event.events[event][i](data)
        }
        return true
    },
}