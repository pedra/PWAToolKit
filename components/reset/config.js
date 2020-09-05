

// Pages
const Config = {
    app: {
        id: 'salva',
        version: '1.0.1',
        name: 'Salva',
        domain: 'http://localhost',
        assets: 'http://localhost:3000',
        server: 'http://localhost:3000'
    },

    pages: [
        {
            id: 'home',
            title: 'Teste : Home',
            efect: 'backward',
            bottombar: 'home',
            action: () => console.log('Action: ' + Page.current())
        }, {
            id: 'project',
            title: 'Teste : Project',
            efect: 'next',
            bottombar: 'project',
            action: () => console.log('Action: ' + Page.current())
        }, {
            id: 'class',
            title: 'Teste : Tutoriais',
            efect: 'up',
            bottombar: 'class',
            action: () => console.log('Action: ' + Page.current())
        }, {
            id: 'contact',
            title: 'Teste : Contatos',
            efect: 'down',
            bottombar: 'contact',
            action: () => console.log('Action: ' + Page.current())
        }, {
            id: 'blog',
            title: 'Teste : Blog',
            efect: 'next',
            bottombar: 'blog',
            action: () => console.log('Action: ' + Page.current())
        }
    ],

    bottombar: {
        element: '.bottom-bar',
        current: 'home',
        config: [
            {
                id: 'home',
                text: 'Home',
                title: 'Página inicial',
                icon: 'home'
            }, {
                id: 'project',
                text: 'Projetos',
                title: 'Meus projetos novos e antigos',
                icon: 'lightbulb_outline'
            }, {
                id: 'class',
                text: 'Tutoriais',
                title: 'Video-aulas e tutoriais diversos',
                icon: 'play_circle_outline'
            }, {
                id: 'blog',
                text: 'Blog',
                title: 'Anúncios e Notícias sobre nós',
                icon: 'blur_on'
            }, {
                id: 'contact',
                text: 'Contatos',
                title: 'Todos os contatos para nos falarmos',
                icon: 'send'
            }
        ]
    }
}