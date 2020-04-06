// Storage Controller


// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }

    // Data Structure / State
    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0
    }
    // Public Methods
    return {
        getItems: function () {
            return data.items
        },
        addItem: function (name, calories) {
            let ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }

            calories = parseInt(calories)

            newItem = new Item(ID, name, calories)

            data.items.push(newItem)

            return newItem
        },

        getItemById: function (id) {
            let found = null;
            // Loop through items
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function (name, calories) {
            calories = parseInt(calories)
            let found = null
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name
                    item.calories = calories
                    found = item
                }
            })
            return found
        },
        deleteItem: function (id) {
            const ids = data.items.map(function (item) {
                return item.id
            })

            const index = ids.indexOf(id)
            data.items.splice(index, 1)
        },
        clearAllItems: function(){
            data.items = []
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0
            data.items.forEach(function (item) {
                total += item.calories
            });

            data.totalCalories = total

            return data.totalCalories
        },
        logData: function () {
            return data
        },
    }
})()

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
    }

    // Public Methods
    return {
        populateItemList: function (items) {
            let html = ''
            items.forEach(item => {
                html += `          
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt blue-text"></i></a>
                </li>
                `
            });
            const list = document.querySelector(UISelectors.itemList)
            list.innerHTML = html
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            document.querySelector(UISelectors.itemList).style.display = 'block'
            const li = document.createElement('li')
            li.className = 'collection-item'
            li.id = `item-${item.id}`
            li.innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt blue-text"></i></a>
            `

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            // Turn Node List into array
            listItems = Array.from(listItems)
            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id')
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt blue-text"></i></a>
                    `
                }
            })
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID)
            item.remove()
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems)
            listItems = Array.from(listItems)
            listItems.forEach(function (item) {
                item.remove()                
            })
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },

        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors
        }
    }
})()

// App Controller
const App = (function (ItemCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })
        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', backBtnClick);
        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    const backBtnClick = function (e) {
        UICtrl.clearEditState()
        e.preventDefault()
    }

    const itemAddSubmit = function (e) {
        const input = UICtrl.getItemInput()

        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem)
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            UICtrl.clearInput()
        }

        e.preventDefault()
    }

    // Update item submit
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split('-');
            // Get the actual id
            const id = parseInt(listIdArr[1]);
            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    const itemUpdateSubmit = function (e) {
        const input = UICtrl.getItemInput()

        // Update the item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

        // Update the UI
        UICtrl.updateListItem(updatedItem)

        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.clearEditState()

        e.preventDefault()
    }

    const itemDeleteSubmit = function (e) {
        const currentItem = ItemCtrl.getCurrentItem()
        ItemCtrl.deleteItem(currentItem.id)

        UICtrl.deleteListItem(currentItem.id)

        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.clearEditState()

        e.preventDefault()
    }

    const clearAllItemsClick = function (e) {
        ItemCtrl.clearAllItems()

        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)

        UICtrl.removeItems()
        UICtrl.hideList()

    }

    // Public Methods
    return {
        init: function () {
            // Clear edit state / set initial set
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            // Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl)

// Initialize App
App.init()