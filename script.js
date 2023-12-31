let items = [];

function fetchItems() {
  fetch('http://127.0.0.1:3000/get') // Adjust the endpoint based on your server setup
    .then(response => response.json())
    .then(data => {
      items = data;
      console.log(items);
      renderItems(items);
    })
    .catch(error => console.error('Error fetching items:', error));
}

function renderItems(displayItems) {
  const itemList = document.getElementById('items');
  itemList.innerHTML = '';

  displayItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>${item.name}</strong> -
      Артикул: ${item.vendor_code} -
      Место на складе: ${item.location} -
      Количество: ${item.quantity} -
      Вес: ${item.weight} кг -
      Срок хранения: ${item.shelf_life} дней -
      Поставщик: ${item.shipper}
    `;

    const buttonsContainer = document.createElement('div');

    const writeOffButton = createButton('Списать товар', () =>
      writeOffItem(item.id)
    );
    const changeLocationButton = createButton('Изменить место на складе', () =>
      changeLocation(item.id)
    );
    const changeQuantityButton = createButton('Изменить количество', () =>
      changeQuantity(item.id)
    );
    const changeWeightButton = createButton('Изменить вес', () =>
      changeWeight(item.id)
    );
    const changeShelfLifeButton = createButton('Изменить срок хранения', () =>
      changeShelfLife(item.id)
    );
    const changeShipperButton = createButton('Изменить поставщика', () =>
      changeShipper(item.id)
    );
    const changeVendorCodeButton = createButton('Изменить артикул', () =>
      changeVendorCode(item.id)
    );

    buttonsContainer.appendChild(writeOffButton);
    buttonsContainer.appendChild(changeLocationButton);
    buttonsContainer.appendChild(changeQuantityButton);
    buttonsContainer.appendChild(changeWeightButton);
    buttonsContainer.appendChild(changeShelfLifeButton);
    buttonsContainer.appendChild(changeShipperButton);
    buttonsContainer.appendChild(changeVendorCodeButton);

    listItem.appendChild(buttonsContainer);
    itemList.appendChild(listItem);
  });
}

function createButton(text, clickHandler) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', clickHandler);
  return button;
}

function writeOffItem(itemId) {
  const reason = prompt('Введите причину списания товара');
  if (reason !== null) {
    const confirmWriteOff = confirm(
      `Вы уверены, что хотите списать товар?\nПричина: ${reason}`
    );
    if (!confirmWriteOff) {
      return;
    }
  }

  fetch(`http://127.0.0.1:3000/deleteItem/${itemId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(deletedItem => {
      items = items.filter(item => item.id !== itemId);
      renderItems(items);
      alert('Success');
    })
    .catch(error => alert('Error!'));

  deleteItem(itemId);
}

function deleteItem(itemId) {
  items = items.filter(item => item.id !== itemId);
  renderItems(items);
}

function changeLocation(itemId) {
  const newLocation = prompt('Введите место на складе');

  fetch(`http://127.0.0.1:3000/updateLocation`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: itemId, location: newLocation }),
  })
    .then(res => res.json())
    .then(() => alert('Success!'))
    .catch(err => alert('Fail'));
}

function changeQuantity(itemId) {
  const newQuantity = prompt('Введите количество');

  fetch(`http://127.0.0.1:3000/updateQuantity`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: itemId, quantity: newQuantity }),
  })
    .then(res => res.json())
    .then(() => alert('Success!'))
    .catch(err => alert('Fail'));
}

function changeWeight(itemId) {
  const newWeight = prompt('Введите вес');

  fetch(`http://127.0.0.1:3000/updateWeight`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: itemId, weight: newWeight }),
  })
    .then(res => res.json())
    .then(() => alert('Success!'))
    .catch(err => alert('Fail'));
}

function changeShelfLife(itemId) {
  const newShelfLife = prompt('Введите срок хранения');

  fetch(`http://127.0.0.1:3000/updateShelfLife`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: itemId, shelf_life: newShelfLife }),
  })
    .then(res => res.json())
    .then(() => alert('Success!'))
    .catch(err => alert('Fail'));
}

function changeShipper(itemId) {
  const newShipper = prompt('Введите поставщика');

  fetch(`http://127.0.0.1:3000/updateShipper`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: itemId, shipper: newShipper }),
  })
    .then(res => res.json())
    .then(() => alert('Success!'))
    .catch(err => alert('Fail'));
}

function changeVendorCode(itemId) {
  const newVendorCode = prompt('Введите артикул');

  fetch(`http://127.0.0.1:3000/updateVendorCode`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: itemId, vendor_code: newVendorCode }),
  })
    .then(res => res.json())
    .then(() => alert('Success!'))
    .catch(err => alert('Fail'));
}

function addItem() {
  const itemName = document.getElementById('itemName').value;
  const vendorCode = document.getElementById('vendorCode').value;
  const quantity = parseInt(document.getElementById('quantity').value) || 0;
  const weight = parseFloat(document.getElementById('weight').value) || 0;
  const shelfLife = parseInt(document.getElementById('shelfLife').value) || 0;
  const shipper = document.getElementById('shipper').value;
  const location =
    document.getElementById('location').value || 'Место по умолчанию';

  const newItem = {
    id: Date.now(),
    name: itemName,
    vendorCode: vendorCode,
    location: location,
    quantity: quantity,
    weight: weight,
    shelfLife: shelfLife,
    shipper: shipper,
  };

  fetch('http://127.0.0.1:3000/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
    // credentials: 'include',
  }).then(response => {
    if (response.ok) {
      alert('Success');
    } else {
      alert('Failed');
    }
  });

  items.push(newItem);
  renderItems(items);
}

function searchItems() {
  const searchTerm = document.getElementById('searchTerm').value;
  const searchCriteria = document.getElementById('searchCriteria').value;

  fetch(
    `http://127.0.0.1:3000/search?searchTerm=${searchTerm}&searchCriteria=${searchCriteria}`
  )
    .then(response => response.json())
    .then(searchResults => {
      renderItems(searchResults);
    })
    .catch(error => console.error('Error searching items:', error));
}

// renderItems(items);
// fetchItems();
