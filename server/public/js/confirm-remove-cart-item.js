const trashBtn = document.querySelectorAll(".trash-btn");

trashBtn.forEach(item=>{
    item.addEventListener('click', () => showConfirmationMessage(item))
});

function showConfirmationMessage(btn){
    const cartItem = btn.parentNode.parentNode;
    
    const containerBox = document.createElement('div');
    containerBox.classList.add('confirmationMessage');
    containerBox.innerHTML = `
        <p>Deseja realmente remover este item do carrinho?</p>
        <button class="confirmDelete">Sim</button>
        <button class="cancelDelete">Não</button>
    `;
    cartItem.appendChild(containerBox);

    const confirmDeleteBtn = document.querySelectorAll('.confirmDelete');
    const cancelDeleteBtn = document.querySelectorAll('.cancelDelete');

    cancelDeleteBtn.forEach(item=>{
        item.addEventListener('click', () => cancelDelete(item))    
    });

    confirmDeleteBtn.forEach(item=>{
        item.addEventListener('click', () => confirmDelete(item))
    })

}

function cancelDelete(btn){
    const cartItem = btn.parentNode.parentNode;
    const containerBox = btn.parentNode;

    cartItem.removeChild(containerBox);
}

async function confirmDelete(btn){
    const cartItem = btn.parentNode.parentNode;
    const containerBox = btn.parentNode;
    const id = cartItem.getAttribute('data-id');

    cartItem.removeChild(containerBox);

    try {
        const response = await fetch(`/carrinho/${id}/remover`);

        if (!response.ok) {
            throw new Error('Não foi possível remover o item do carrinho.');
        }else {
            // Forçando a página a ser recarragada, para atualizar as infos do carrinho e não ficar em cache
            window.location.reload(true);
        }
    } catch (error) {
        console.error(error);
    }

}