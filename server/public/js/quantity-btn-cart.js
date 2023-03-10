const incrementBtn = document.querySelectorAll('.increment');
const decrementBtn = document.querySelectorAll('.decrement');

// Chamando a função stepper passando o próprio botão como parâmetro
incrementBtn.forEach(item=>{
    item.addEventListener('click', () => stepper(item))
});
decrementBtn.forEach(item=>{
    item.addEventListener('click', () => stepper(item))
});

async function stepper(btn){
        
    const inputQuantity = btn.parentNode.querySelector('input');
    
    const { min, max, step, value } = inputQuantity;
    const dataId = inputQuantity.getAttribute('data-id');

    const result = (btn.classList.contains('increment')) ? (step * 1) : (step * -1);  

    const newValue = parseInt(value) + result;

    if(newValue >= min && newValue <= max){
        inputQuantity.value = newValue;
    
        // Adicionando fetch dentro da função stepper para enviar o novo valor do input para o servidor:
        try {
            const response = await fetch(`/carrinho/atualizar/${dataId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: newValue })
            });

            if (!response.ok) {
                throw new Error('Não foi possível atualizar o carrinho.');
            }else {
                // Forçando a página a ser recarragada, para atualizar as infos do carrinho e não ficar em cache
                window.location.reload(true);
            }
        } catch (error) {
            console.error(error);
        }
    
    }    
}