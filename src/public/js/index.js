const socket = io();

socket.on('products', (products) => {
  const productsList = document.getElementById('realtime');
  productsList.innerHTML = '';
  if (products.length === 0) productsList.innerHTML = '<h1>Nenhum produto cadastrado</h1>';
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product box';
    productElement.innerHTML = `
            <h2>${product.title}</h2>
            <p>Descrição: ${product.description}</p>
            <p>Preço: ${product.price}</p>
            <p>Categoria: ${product.category}</p>
            <p>Código: ${product.code}</p>
        `;
    productsList.appendChild(productElement);
  });
})
