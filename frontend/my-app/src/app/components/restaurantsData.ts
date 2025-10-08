const restaurants = [
    {
        name: "M** Bun",
        slug: "m-bun",
        address: "Corso Giuseppe Siccardi 8/A, 10122 Torino Italia",
        description: "Fast food piemontese che propone hamburger preparati al momento ...",
        image: "/img/mbun.jpg",
        category: "Offerte",
        averagePrice: 12,
        highlights: [
            "Hamburger piemontesi preparati al momento",
            "Prodotti locali e ingredienti di qualità",
            "Ambiente moderno e accogliente"
        ],
        menu: {
            Burgers: [
                { id: "b1", title: "CHEL", description: "Hamburger di manzo, insalata, pomodoro, maionese", price: 8.70, imageUrl: "/img/burger1.jpg" },
                { id: "b2", title: "BUN CLASSICO", description: "Con formaggio, cipolla e salsa BBQ", price: 9.90, imageUrl: "/img/burger2.jpg" },
                { id: "b3", title: "VEG BURGER", description: "Burger vegetariano con verdure grigliate", price: 9.20, imageUrl: "/img/burger3.jpg" },
            ],
            Patatine: [
                { id: "p1", title: "PATATE CLASSICHE", description: "Fritte croccanti con sale marino", price: 4.50, imageUrl: "/img/fries1.jpg" },
                { id: "p2", title: "PATATE SPECIAL", description: "Con cheddar fuso e pancetta", price: 6.00, imageUrl: "/img/fries2.jpg" },
            ],
            'Cold Drinks': [
                { id: "d1", title: "Coca-Cola", description: "33cl", price: 2.50, imageUrl: "/img/drink1.jpg" },
                { id: "d2", title: "Birra Artigianale", description: "Bionda 50cl", price: 5.00, imageUrl: "/img/drink2.jpg" },
            ],
        }
    },
    {
        name: "prova",
        slug: "prova",
        address: "Italia",
        description: "dewfjeento ...",
        image: "/img/dwed.jpg",
        category: "Pizza",
        averagePrice: 10,
        highlights: [
            "prova",
            "prova 1",
            "prova 2"
        ],
        menu: {
            Burgers: [
                { id: "b1", title: "CHfrefrEL", description: "Hamburger di manzo, insalata, pomodoro, maionese", price: 8.70, imageUrl: "/img/burger1.jpg" },
                { id: "b2", title: "freff eff", description: "Con forfrfrefrefeaa BBQ", price: 9.90, imageUrl: "/img/burger2.jpg" },
                { id: "b3", title: "frffr frsf", description: "Burger vegetariano con verdure grigliate", price: 9.20, imageUrl: "/img/burger3.jpg" },
            ],
            Patatine: [
                { id: "p1", title: "PAefefrf", description: "jfjdfrfe", price: 4.50, imageUrl: "/img/fries1.jpg" },
                { id: "p2", title: "PATATE SPECIAL", description: "Con cheddar fuso e pancetta", price: 6.00, imageUrl: "/img/fries2.jpg" },
            ],
            'Cold Drinks': [
                { id: "d1", title: "Coca-ina", description: "330gr", price: 2.50, imageUrl: "/img/drink1.jpg" },
                { id: "d2", title: "Birra ", description: "Bionda 50cl", price: 5.00, imageUrl: "/img/drink2.jpg" },
            ],
            'gggg': [
                { id: "c1", title: "Coca-ina", description: "330gr", price: 2.50, imageUrl: "/img/drink1.jpg" },
                { id: "c2", title: "sda ", description: "Bionda 50cl", price: 5.00, imageUrl: "/img/drink2.jpg" },
            ],
        }
    }
];

export default restaurants;
