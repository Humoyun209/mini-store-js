// Сортировка таблиц
table1.onclick = function(event) {
    if (event.target.tagName != 'TH') return;
    let th = event.target
    sortTable(th.cellIndex, th.dataset.type, 'table1')
}

table2.onclick = function(event) {
    if (event.target.tagName != 'TH') return
    let th = event.target
    sortTable(th.cellIndex, th.dataset.type, 'table2')
}

function sortTable(colNum, type, id){
    let elem = document.getElementById(id)
    let tbody = elem.querySelector('tbody')
    let rowsArray = Array.from(tbody.rows)
    let compare
    switch (type) {
        case 'number':
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML
            }
            break;

            case 'string':
                compare = function(rowA, rowB) {
                    return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1
                }
            break;
    }
    rowsArray.sort(compare)
    tbody.append(...rowsArray)
}


if (!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}

let saveButton = document.querySelector('button.add_new')
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'))

// Опции для list.js он ищет элемента по указанном параметрам
let options = {
    valueNames: ['name', 'price']
}
let userList


// goods[i][4] = Количество товаров в корзине; goods[i][5] = Скидка; goods[i][6] = Цена со скидкой 

saveButton.addEventListener('click', function(event){
    let name = document.getElementById('good_name').value
    let price = document.getElementById('good_price').value
    let count = document.getElementById('good_count').value

    if (name && Number(price) && Number(count)) {
        document.getElementById('good_name').value= ''
        document.getElementById('good_price').value = ''
        document.getElementById('good_count').value = '1'

        let goods = JSON.parse(localStorage.getItem('goods'))
        goods.push([`good_${goods.length}`, name, price, count, 0, 0, 0])
        localStorage.setItem('goods', JSON.stringify(goods))
        update_goods()
        myModal.hide()
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Ошибка при вводе',
            text: 'У вас есть незаполненные поля \
            либо данные неправильно введени.',
          })
    }

    console.log();
})

update_goods()

function update_goods() {
    let result_price = 0;
    let tbody = document.querySelector(".list")
    let tbodycart = document.querySelector(".cart")
    tbody.innerHTML = ""
    document.querySelector('.cart').innerHTML = ""
    let goods = JSON.parse(localStorage.getItem("goods"))
    // let table1 = document.getElementById("table1")
    // let table2 = document.getElementById("table2")
    if (goods.length) {
        table1.hidden = false
        table2.hidden = false

        for (let i=0; i < goods.length; i++){
            tbody.insertAdjacentHTML('afterbegin', 
                `
                <tr class="align-middle">
                    <td>${i+1}</td>
                    <td  class="name">${goods[i][1]}</td>
                    <td class="price">${goods[i][2]}</td>
                    <td>${goods[i][3]}</td>
                    <td><button class="good_delete btn btn-danger" data-delete="${goods[i][0]}">&#10006</button></td>
                    <td><button class="good_to_cart btn btn-primary" data-goods="${goods[i][0]}">&#10149</button></td>
                </tr>
                `
            )
            if (goods[i][4] > 0) {
                let sum = goods[i][4] * goods[i][2]
                goods[i][6] = sum * (1 - goods[i][5] * 0.01)

                tbodycart.insertAdjacentHTML('beforeend', 
                `
                <tr class="align-middle">
                    <td>${i+1}</td>
                    <td class="price_name">${goods[i][1]}</td>
                    <td class="price_one">${goods[i][2]}</td>
                    <td class="price_count">${goods[i][4]}</td>
                    <td class="price_discount"><input class="myinput" data-goodid="${goods[i][0]}" type="text" value="${goods[i][5]}" min="20" max="100"></td>
                    <td class="price_sum">${goods[i][6]}</td>
                    <td><button class="good_delete btn btn-danger" data-delete-price="${goods[i][0]}">&#10006</button></td>
                </tr>
                `

                
            )
            result_price += goods[i][6]
            }
            
        }
        userList = new List('goods', options);  

        

    } else {
        table1.hidden = true
        table2.hidden = true
    }

    
    let all_sum = document.querySelector('.price_result');
    all_sum.innerHTML = result_price + '&#8381'
} 

// Удалить товара из магазина
document.addEventListener('click', function(event) {
    if (!event.target.dataset.delete){
        return;
    }
        let goods = JSON.parse(localStorage.getItem("goods"))
        for (let i=0; i < goods.length; i++){
            if (event.target.dataset.delete == goods[i][0] ){
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: 'btn btn-success mx-4',
                      cancelButton: 'btn btn-danger mx-4'
                    },
                    buttonsStyling: false
                  })
                  
                  swalWithBootstrapButtons.fire({
                    title: 'Внимание!',
                    text: "Вы действительно хотите удалить?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Да',
                    cancelButtonText: 'Нет',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        goods.splice(i, 1)
                        localStorage.setItem("goods", JSON.stringify(goods));
                        update_goods()
                      swalWithBootstrapButtons.fire(
                        'Удалено',
                        'Вы удалили товара.',
                        'success'
                      )
                    }
                  })
                
        }
    }
})


document.addEventListener('click', function(event) {
    if (!event.target.dataset.goods){
        return;
    }
    let goods = JSON.parse(localStorage.getItem("goods"))
        for (let i=0; i < goods.length; i++){
            if (event.target.dataset.goods == goods[i][0] && goods[i][3] > 0) {
                goods[i][4] += 1
                goods[i][3] -= 1
                localStorage.setItem("goods", JSON.stringify(goods))
                update_goods()

            }

            if (event.target.dataset.goods == goods[i][0] && goods[i][3] == 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ошибка',
                    text: 'В магазине не остался от этого товара.',
                  })
            }
        }
})


document.addEventListener('click', function(event) {
    if (!event.target.dataset.deletePrice){
        return;
    }
    let goods = JSON.parse(localStorage.getItem("goods"))
        for (let i=0; i < goods.length; i++){
            if (event.target.dataset.deletePrice == goods[i][0] && goods[i][4] > 0) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: 'btn btn-success mx-4',
                      cancelButton: 'btn btn-danger mx-4'
                    },
                    buttonsStyling: false
                  })
                  
                  swalWithBootstrapButtons.fire({
                    title: 'Внимание!',
                    text: "Вы действительно хотите удалить(уменьшить) товара из корзины?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Да',
                    cancelButtonText: 'Нет',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        goods[i][4] -= 1
                        goods[i][3] += 1
                        localStorage.setItem("goods", JSON.stringify(goods))
                        update_goods()
                    }
                  })

            }
        }
})


document.addEventListener('input', function(event) {
    if (!event.target.dataset.goodid){
        return;
    }
    
    let goods = JSON.parse(localStorage.getItem("goods"))
    for (let i=0; i < goods.length; i++) {
        if (goods[i][0] == event.target.dataset.goodid) {
            goods[i][5] = event.target.value
            if ((Number(goods[i][5] || goods[i][5] == '') && goods[i][5] < 100)){
                let sum = goods[i][4] * goods[i][2]
                goods[i][6] = sum * (1 - goods[i][5] * 0.01)
                localStorage.setItem("goods", JSON.stringify(goods))
                update_goods()
                let input = document.querySelector(`[data-goodid="${goods[i][0]}"`)
                input.focus()
                input.selectionStart = input.value.length
            }

            else if (!Number(goods[i][5])){
                goods[i][5] = 0
                Swal.fire({
                    icon: 'error',
                    title: 'Ошибка при вводе акции',
                    text: 'акция должен быть целочисленним',
                  })

            }
        }
    }
})