
const horariosFixos = [];
for (let hora = 9; hora <= 21; hora++) {
    for (let min = 0; min < 60; min += 30) {
        const time = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        horariosFixos.push(time);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    carregarServicos();
    carregarAgendamentos();
    carregarCaixa();
});


function adicionarServico() {
    const novoServico = document.getElementById('novo-servico').value.trim();
    if (!novoServico) {
        alert('Digite um nome para o serviço!');
        return;
    }
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    if (servicos.includes(novoServico)) {
        alert('Serviço já existe!');
        return;
    }
    servicos.push(novoServico);
    localStorage.setItem('servicos', JSON.stringify(servicos));
    renderizarServicos();
    atualizarSelectServicos();
    document.getElementById('novo-servico').value = '';
}

function renderizarServicos() {
    const ul = document.getElementById('lista-servicos');
    ul.innerHTML = '';
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    servicos.forEach((servico, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${servico}</span>
            <div>
                <button onclick="editarServico(${index})">Editar</button>
                <button onclick="removerServico(${index})">Remover</button>
            </div>
        `;
        ul.appendChild(li);
    });
}

function editarServico(index) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const novoNome = prompt('Novo nome para o serviço:', servicos[index]);
    if (novoNome && novoNome.trim()) {
        servicos[index] = novoNome.trim();
        localStorage.setItem('servicos', JSON.stringify(servicos));
        renderizarServicos();
        atualizarSelectServicos();
    }
}

function removerServico(index) {
    if (confirm('Remover este serviço?')) {
        let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
        servicos.splice(index, 1);
        localStorage.setItem('servicos', JSON.stringify(servicos));
        renderizarServicos();
        atualizarSelectServicos();
    }
}

function carregarServicos() {
    renderizarServicos();
    atualizarSelectServicos();
}

function atualizarSelectServicos() {
    const select = document.getElementById('servico-agendamento');
    select.innerHTML = '<option value="">Selecione Serviço</option>';
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    servicos.forEach(servico => {
        const option = document.createElement('option');
        option.value = servico;
        option.textContent = servico;
        select.appendChild(option);
    });
}


function adicionarAgendamento() {
    const hora = document.getElementById('hora').value;
    const cliente = document.getElementById('cliente').value.trim();
    const servico = document.getElementById('servico-agendamento').value;
    const valor = parseFloat(document.getElementById('valor').value);
    if (!hora || !cliente || !servico || isNaN(valor) || valor <= 0) {
        alert('Preencha todos os campos, incluindo um valor válido!');
        return;
    }
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};
    if (!agendamentos[hora]) agendamentos[hora] = [];
    
 
    let clienteIndex = agendamentos[hora].findIndex(c => c.cliente === cliente);
    if (clienteIndex === -1) {

        if (agendamentos[hora].length >= 2) {
            alert('Horário já tem 2 clientes!');
            return;
        }
        agendamentos[hora].push({ cliente, servicos: [{ servico, valor }] });
    } else {
      
        if (agendamentos[hora][clienteIndex].servicos.length >= 3) {
            alert('Cliente já tem 3 serviços neste horário!');
            return;
        }
        agendamentos[hora][clienteIndex].servicos.push({ servico, valor });
    }
    
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    renderizarAgendamentos();
    atualizarSelectHorarios();
    // Limpar campos
    document.getElementById('hora').value = '';
    document.getElementById('cliente').value = '';
    document.getElementById('servico-agendamento').value = '';
    document.getElementById('valor').value = '';
}

function renderizarAgendamentos() {
    const tbody = document.querySelector('#tabela-agendamentos tbody');
    tbody.innerHTML = '';
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};
    horariosFixos.forEach(hora => {
        const row = document.createElement('tr');
        const ags = agendamentos[hora] || [];
        const cliente1 = ags[0] ? `${ags[0].cliente}: ${ags[0].servicos.map(s => `${s.servico} (R$${s.valor.toFixed(2)})`).join(', ')}` : 'Livre';
        const total1 = ags[0] ? `R$ ${ags[0].servicos.reduce((sum, s) => sum + s.valor, 0).toFixed(2)}` : '-';
        const cliente2 = ags[1] ? `${ags[1].cliente}: ${ags[1].servicos.map(s => `${s.servico} (R$${s.valor.toFixed(2)})`).join(', ')}` : 'Livre';
        const total2 = ags[1] ? `R$ ${ags[1].servicos.reduce((sum, s) => sum + s.valor, 0).toFixed(2)}` : '-';
        const acoes = ags.length > 0 ? `<button onclick="removerAgendamento('${hora}')">Remover Todos</button>` : '-';
        row.innerHTML = `
            <td>${hora}</td>
            <td>${cliente1}</td>
            <td>${total1}</td>
            <td>${cliente2}</td>
            <td>${total2}</td>
            <td>${acoes}</td>
        `;
        tbody.appendChild(row);
    });
}

function removerAgendamento(hora) {
    if (confirm('Remover todos os agendamentos deste horário?')) {
        let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};
        delete agendamentos[hora];
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        renderizarAgendamentos();
        atualizarSelectHorarios();
    }
}

function carregarAgendamentos() {
    renderizarAgendamentos();
    atualizarSelectHorarios();
}

function atualizarSelectHorarios() {
    const select = document.getElementById('hora');
    select.innerHTML = '<option value="">Selecione Horário</option>';
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};
    horariosFixos.forEach(hora => {
        const ags = agendamentos[hora] || [];
        if (ags.length < 2) {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora;
            select.appendChild(option);
        }
    });
}

function adicionarGanho() {
    const ganho = parseFloat(document.getElementById('ganho').value);
    if (isNaN(ganho) || ganho <= 0) {
        alert('Insira um valor válido!');
        return;
    }
    const hoje = new Date().toISOString().split('T')[0];
    let caixa = JSON.parse(localStorage.getItem('caixa')) || {};
    if (!caixa[hoje]) caixa[hoje] = 0;
    caixa[hoje] += ganho;
    localStorage.setItem('caixa', JSON.stringify(caixa));
    atualizarTotalDia(caixa[hoje]);
    renderizarHistorico(caixa);
    document.getElementById('ganho').value = '';
}

function carregarCaixa() {
    const caixa = JSON.parse(localStorage.getItem('caixa')) || {};
    const hoje = new Date().toISOString().split('T')[0];
    atualizarTotalDia(caixa[hoje] || 0);
    renderizarHistorico(caixa);
}

function atualizarTotalDia(total) {
    document.getElementById('total-dia').textContent = `R$ ${total.toFixed(2)}`;
}

function renderizarHistorico(caixa) {
    const ul = document.getElementById('historico-mensal');
    ul.innerHTML = '';
    Object.keys(caixa).sort().forEach(data => {
        const li = document.createElement('li');
        li.textContent = `${data}: R$ ${caixa[data].toFixed(2)}`;
        ul.appendChild(li);
    });
}

function limparTudo() {
    if (confirm('Tem certeza? Isso vai apagar todos os dados!')) {
        localStorage.clear();
        location.reload();
    }
}