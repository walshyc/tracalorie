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
        items: [{
                id: 0,
                name: 'Steak Dinner',
                calories: 1200
            },
            {
                id: 1,
                name: 'Cookie',
                calories: 250
            },
            {
                id: 2,
                name: 'Eggs',
                calories: 300
            },

        ],
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
        itemCaloriesInput: '#item-calories'
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
        getSelectors: function () {
            return UISelectors
        }
    }
})()

// App Controller
const App = (function (ItemCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        const UISelectiors = UICtrl.getSelectors()
        document.querySelector(UISelectiors.addBtn).addEventListener('click', itemAddSubmit)
    }

    const itemAddSubmit = function (e) {
        const input = UICtrl.getItemInput()

        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)
        }

        e.preventDefault()
    }
    // Public Methods
    return {
        init: function () {
            const items = ItemCtrl.getItems()
            UICtrl.populateItemList(items)
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl)

// Initialize App
App.init()