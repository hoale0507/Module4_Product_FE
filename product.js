function showAllProduct(){
    $.ajax({
        type: 'GET',
        url: "http://localhost:8080/products",
        success: function (data){
            let content = "";
            for (let i = 0; i < data.length; i++) {
                content += ` <tr>
        <th scope="row">${i + 1}</th>
        <td>${data[i].name}</td>
        <td>${data[i].price}</td>
        <td>${data[i].description}</td>
        <td>${data[i].category == null ? "" : data[i].category.name}</td>
        <td><img src="http://localhost:8080/image/${data[i].image}" alt="img"></td>
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#edit-product" onclick="showEditForm(${data[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete-product" onclick="showDeleteForm(${data[i].id})">
                                    <i class="fa fa-trash"></i>
                                </button>
<!--        <button class="btn btn-danger" onclick="deleteProduct(${data[i].id})">Delete</button></td>-->
    </tr>`;
            }
            $('#product-list-content').html(content);
        }
    })
}


function createNewProduct(){
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image').val();
    let category = $('#category').val();
    let product = {
        name: name,
        price: price,
        description: description,
        image: image,
        category: {
            id: category
        }
    }
    $.ajax({
        type: 'POST',
        url: "http://localhost:8080/products",
        data: JSON.stringify(product),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (){
            showAllProduct();
            showSuccessMessage('Create completed');
        },
        error: function (){
            showErrorMessage('Created failed');
        }
    })
}

function showSuccessMessage(message){
    $(function(){
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'success',
            title: message
        })

    })
}

function showErrorMessage(message){
    $(function(){
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'error',
            title: message
        })

    })
}


$(document).ready(function () {
    showAllProduct();
})


function deleteProduct(id){
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        success: function (){
            showAllProduct();
            showSuccessMessage('Deleted completed');
        },
        error: function (){
            showErrorMessage('Deleted failed');
        }
    })
}

function showDeleteForm(id){
    let content = `
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" onclick="deleteProduct(${id})" data-dismiss="modal">Delete</button>`;
    $('#delete-form-footer').html(content);
}

function showEditForm(id){
    $.ajax({
        type:'GET',
        url:`http://localhost:8080/products/${id}`,
        success: function (product){
            $('#nameEdit').val(product.name);
            $('#priceEdit').val(product.price);
            $('#descriptionEdit').val(product.description);
            $('#imageEdit').val(product.image);
            $.ajax({
                type:'GET',
                url: 'http://localhost:8080/categories',
                success: function (data){
                    let content =  `
                        <option>Select category</option>`;
                    for (let category of data) {
                        if(product.category.id == category.id){
                            content += `
                        <option value="${category.id}" selected>${category.name}</option>`;
                        } else{
                            content += `
                        <option value="${category.id}">${category.name}</option>`;}
                    }
                    $('#categoryEdit').html(content);
                }
            })
            let content1 = `
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="editProduct(${id})">Edit</button>`;
            $('#edit-modal-footer').html(content1);
        }
    })
}


function editProduct(id){
    let name = $('#nameEdit').val();
    let price = $('#priceEdit').val();
    let description = $('#descriptionEdit').val();
    let image = $('#imageEdit').val();
    let category = $('#categoryEdit').val();
    let product = {
        name: name,
        price: price,
        description: description,
        image: image,
        category: {
            id: category
        }
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/products/${id}`,
        data: JSON.stringify(product),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (){
            showSuccessMessage('Edit successfully!');
            showAllProduct();
            reDrawCreateForm();
        },
        error: function (){
            showErrorMessage('Edit failed!');
        }
    })
}
function reDrawCreateForm(){
    $('#create-product-content').html(`<div class="modal-header">
                <h4 class="modal-title" id="create-head">Create Product</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="create-modal_body">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" placeholder="Enter name">
                </div>
                <div class="form-group">
                    <label for="price">Price</label>
                    <input type="number" class="form-control" id="price" placeholder="Enter price">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" class="form-control" id="description" placeholder="Enter description">
                </div>
                <div class="form-group">
                    <label for="image">Image</label>
                    <input type="text" class="form-control" id="image" placeholder="Enter Image">
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category">
                    </select>
                </div>
            </div>
            <div class="modal-footer justify-content-between" id="create-modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="createNewProduct()">Create</button>
            </div>`)
}

function showCategoryList(){
    $.ajax({
        type:'GET',
        url: 'http://localhost:8080/categories',
        success: function (data){
            let content =  `
                        <option>Select category</option>`;
            for (let category of data) {
                content += `
                        <option value="${category.id}">${category.name}</option>`;
            }
            $('#category').html(content);
        }
    })
}