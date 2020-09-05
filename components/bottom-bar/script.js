/**
 * Bottom Bar Class
 */
/**
 * @param {{ element: string; // Escutando evento de troca de página
current: string; config: { id: string; text: string; title: string; icon: string; }[]; }} config
 */
const BottomBarClass = function (config) {

    // Defaults
    var node = '.bottom-bar'
    var itens = []
    var current = 'home'

    /**
     * Page call this function after set a new page
     * @param {string} b New Page id 
     */
    const set = b => {
        current = b
        Event.trigger('BottomBarSet', b)
        return mount()
    }

    // Returns current selected
    const getCurrent = () => current

    // Draw BottomBar
    const mount = (config) => {
        if (config) {
            if (config.element) node = config.element
            if (config.config) itens = config.config
            if (config.active) current = config.active
        }

        Event.trigger('BottomBarBefore', config)

        var html = '<div class="container"><ul>'

        itens.map(a => {
            html += `<li onclick="Page.show('${a.id}')" ${a.id == current ? ' class="on"' : ''} data-id="${a.id}" title="${a.title}"><i class="material-icons">${a.icon}</i>${a.text}</li>`
        })

        html += '</ul></div>'

        Event.trigger('BottomBarBeforeChangeDom', html)

        _(node).innerHTML = html

        Event.trigger('BottomBarAfter', html)
    }

    // Build object ...
    /**
     * @param {{ element: string; 
    current: string; config: { id: string; text: string; title: string; icon: string; }[]; }} config
     */
    const constructor = (config) => {
        if (!config) return false
        mount(config)

        // Escutando evento de troca de página
        Event.subscribe('PageAfter', 'bottombar', set)
    }
    constructor(config)

    // Returns ...
    return {
        set: set,
        mount: mount,
        current: getCurrent
    }
}