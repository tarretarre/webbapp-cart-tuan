document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();

    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => {
            const contentSection = document.querySelector('.content-section');

            products.forEach(product => {
                let truncatedTitle = product.title.length > 23 ? product.title.slice(0, 23) + '...' : product.title;

                const productTitle = document.createElement('span');
                productTitle.classList.add('shop-item-title');
                productTitle.textContent = truncatedTitle;

                const productImage = document.createElement('img');
                productImage.classList.add('shop-item-image');
                productImage.src = product.image;

                const productPrice = document.createElement('span');
                productPrice.classList.add('shop-item-price');
                productPrice.textContent = `$${product.price}`;

                const addToCartButton = document.createElement('button');
                addToCartButton.classList.add('btn', 'btn-primary', 'shop-item-button');
                addToCartButton.type = 'button';
                addToCartButton.textContent = 'ADD TO CART';
                addToCartButton.addEventListener('click', addToCartClicked);

                const productDetails = document.createElement('div');
                productDetails.classList.add('shop-item-details');
                productDetails.appendChild(productPrice);
                productDetails.appendChild(addToCartButton);

                const shopItem = document.createElement('div');
                shopItem.classList.add('shop-item');
                shopItem.appendChild(productImage);
                shopItem.appendChild(productTitle);
                shopItem.appendChild(productDetails);

                contentSection.appendChild(shopItem);
            });

            updateCartTotal();
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

    var cartRemoveItemButtons = document.querySelectorAll('.btn-danger');
    cartRemoveItemButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
    });

    var quantityInputs = document.querySelectorAll('.cart-quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', quantityChanged);
    });

    document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);
});

function loadCartFromLocalStorage() {
    var cartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (cartItems) {
        var cartItemsContainer = document.querySelector('.sidebar');
        var totalPrice = document.querySelector('.cart-total');
        cartItems.forEach(item => {
            addItemToCart(item.title, item.price, item.imageSrc);
        });
        updateCartTotal;
    }
}

function saveCartToLocalStorage() {
    var cartItems = document.querySelectorAll('.cart-item');
    var cartData = [];
    cartItems.forEach(item => {
        var title = item.querySelector('.cart-item-title').innerText;
        var price = item.querySelector('.cart-item-price').innerText;
        var imageSrc = item.querySelector('.cart-item-image').src;
        cartData.push({title, price, imageSrc});
    });
    localStorage.setItem('cartItems', JSON.stringify(cartData));
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    saveCartToLocalStorage();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
    saveCartToLocalStorage();
}

function updateCartTotal() {
    var cartRows = document.querySelectorAll('.cart-item');
    var total = 0;
    cartRows.forEach(row => {
        var priceElement = row.querySelector('.cart-item-price');
        var quantityElement = row.querySelector('.cart-quantity-input');
        var price = parseFloat(priceElement.textContent.replace('$', ''));
        var quantity = quantityElement.value;
        total += price * quantity;
    });
    total = Math.round(total * 100) / 100;
    document.querySelector('.cart-total-price').innerText = '$' + total;
}

function purchaseClicked() {
    var cartItems = document.querySelectorAll('.sidebar .cart-item');
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add some items before purchasing.');
        return;
    }
    
    alert('Thank you for your purchase');
    var cartItemsContainer = document.querySelector('.sidebar');
    cartItemsContainer.innerHTML = `
        <h4>Cart</h4>
        <div class="cart-total">
            <strong class="cart-total-title">Total</strong>
            <span class="cart-total-price">$0.00</span>
        </div>
        <button class="btn btn-primary btn-purchase" type="button">PURCHASE</button>
    `;
    updateCartTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.querySelector('.shop-item-title').textContent;
    var price = shopItem.querySelector('.shop-item-price').textContent;
    var imageSrc = shopItem.querySelector('.shop-item-image').src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
    localStorage.removeItem('cartItems');
}

function addItemToCart(title, price, imageSrc) {
    var cartItemTitles = document.querySelectorAll('.cart-item-title');
    for (var i = 0; i < cartItemTitles.length; i++) {
        if (cartItemTitles[i].innerText == title) {
            alert('This item is already added to the cart');
            return;
        }
    }

    var cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    var cartItemContents = `
        <img class="cart-item-image" src="${imageSrc}">
        <span class="cart-item-title">${title}</span>
        <span class="cart-item-price">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
        </div>
        <div class="cart-item-details">
            <button class="btn btn-danger cart-item-button"type="button">REMOVE</button>
        </div>
    `;
    cartItem.innerHTML = cartItemContents;

    var cartItemsContainer = document.querySelector('.sidebar');
    var totalPrice = document.querySelector('.cart-total');
    cartItemsContainer.insertBefore(cartItem, totalPrice);

    cartItem.querySelector('.btn-danger').addEventListener('click', removeCartItem);
    cartItem.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
    saveCartToLocalStorage();
}