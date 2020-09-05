/**
 * Page Class
 */

const PageClass = function (config) {

    var currentPage = 'home'
    var currentIn = 'back'
    var currentOut = 'next'
    var efects = {
        next: { in: () => 'right', out: () => 'left' },
        back: { in: () => 'left', out: () => 'right' },
        up: { in: () => 'up', out: () => 'down' },
        down: { in: () => 'down', out: () => 'up' },
        forward: { in: () => currentIn, out: () => currentOut },
        backward: { in: () => currentOut, out: () => currentIn }
    }

    var pages = {}

    const show = (page, efect) => {
        if (!pages[page] || page == currentPage) return false
        eft = efects[efect] || efects[pages[page].efect]

        Event.trigger('PageBefore') // Dispara evento

        // Colocando a devida class na página anterior e na nova...
        _a('.page').forEach(a => {
            a.classList.remove('iup', 'idown', 'ileft', 'iright', 'oup', 'odown', 'oleft', 'oright')
            if (a.classList.contains(currentPage)) a.classList.add('o' + eft.out())
            if (a.classList.contains(page)) a.classList.add('i' + eft.in())
        })
        // Atualizando a página selecionada, efeitos & disparando o evento final
        currentPage = page
        currentIn = eft.in()
        currentOut = eft.out()

        Event.trigger('PageBeforeAction', { page: currentPage, action: pages[page].action })

        // Running action
        pages[page].action()

        Event.trigger('PageAfter', currentPage)

        /* Retorna false para ser usado em retorno 
           de link <a onclick="return Page('home')" ...
        */
        return false
    }

    // Retorna a página corrente 
    const current = () => currentPage
    const getPages = (p) => p ? pages[p] : pages

    // Construindo ...
    const constructor = (config) => {
        if (!config) return false
        CONFIG.pages.map(a => pages[a.id] = { title: a.title, efect: a.efect, action: a.action })
    }
    constructor(config)

    // Returns ...
    return {
        show: show,
        current: current,
        pages: getPages
    }
}