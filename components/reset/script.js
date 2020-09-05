var Page, BottomBar

window.onload = () => {
    Page = new PageClass(Config.pages)
    BottomBar = new BottomBarClass(Config.bottombar)
}


const _ = e => document.querySelector(e) || false
const _a = e => document.querySelectorAll(e) || []

