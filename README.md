# NEXTHEALER prototype

## Run
Open `index.html` in a browser. For the most reliable local testing, serve this folder through a local static web server.

## Structure
- `index.html`: Home, About Us, Contact
- `products.html`: Product catalogue and search
- `print.html`: Cart buying list and print view
- `css/`: Shared, product, and print styles
- `js/`: Product data, shared cart storage, navigation, catalogue, and print logic

## Cart persistence
The cart is stored in the `nexthealer_cart` cookie for one day, using `Path=/` and `SameSite=Lax`. `Secure` is added automatically on HTTPS. If cookies are unavailable, the app tries localStorage, then in-memory storage. The prototype's three demo cart entries are retained as the first-run default.


## Mobile layout
Responsive styles are included for the home navigation and stacked sections, the product search/header and product grid, and the buying-list table/actions. The buying-list table remains a table and can be swiped horizontally on narrow screens.
