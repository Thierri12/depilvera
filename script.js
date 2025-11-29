
const horariosFixos = [];
for (let hora = 9; hora <= 21; hora++) {
    for (let min = 0; min < 60; min += 30) {
        const time = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        horariosFixos.push(time);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadDefaultServices();
    atualizarSelectServicos();
    carregarCaixa();
    
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').value = hoje;
    document.getElementById('data-add').value = hoje;
    const mes = new Date().toISOString().slice(0,7);
    document.getElementById('data-caixa').value = mes;
    carregarAgendamentosPorData();
    atualizarTotalMensalPorMes();
});




function loadDefaultServices() {
    let servicos = JSON.parse(localStorage.getItem('servicos')) || {};
    if (Object.keys(servicos).length === 0) {
        servicos = {
            geral: [
                ["Unhas (Manicure e Pedicure)", 50.00],
                ["Manicure", 25.00],
                ["Pedicure", 28.00],
                ["SPA dos Pés e Mãos (sem cutilar)", 30.00],
                ["Desbastador de Calosidade", 25.00],
                ["Banho de Lua", 70.00],
                ["Esfoliação Corporal", 50.00],
                ["Limpeza de Pele Facial (com aplicação de ácidos)", 170.00],
                ["Limpeza de Pele Completa (s/ aplicação de ácidos)", 150.00],
                ["Clareamento de Virilha (sessão)", 35.00],
                ["Clareamento entre Coxas (sessão)", 30.00],
                ["Clareamento de Axilas (sessão)", 20.00],
                ["Escalda Pés com Flores e Sais (ofurô)", 35.00],
                ["Escleroterapia", 0.00],
                ["Podologia", 0.00],
                ["Massoterapia", 0.00],
                ["Depilação a Laser", 0.00]
            ],
            pacotes: [
                ["Pacote 01", 100.00],
                ["Pacote 02", 170.00],
                ["Pacote 03", 200.00]
            ],
            feminina: [
                ["Sobrancelha de Pinça", 30.00],
                ["Sobrancelha de Cera", 28.00],
                ["Sobrancelha de Henna", 50.00],
                ["Buço", 15.00],
                ["Nariz", 15.00],
                ["Queixo", 15.00],
                ["Faixa do Rosto (Costelas)", 15.00],
                ["Rosto Completo", 30.00],
                ["Pescoço", 15.00],
                ["Nuca", 18.00],
                ["Axilas", 20.00],
                ["Braços Completos", 38.00],
                ["Antebraço", 25.00],
                ["Seios/Auréolas", 14.00],
                ["Barriga", 25.00],
                ["Faixa da Barriga", 15.00],
                ["Costas", 25.00],
                ["Virilha Contorno", 35.00],
                ["Virilha Cavada", 43.00],
                ["Virilha Total", 48.00],
                ["Ânus", 20.00],
                ["Perna Interna", 60.00],
                ["Meia Perna", 40.00],
                ["Faixa das Pernas (Lateral e/ou atrás das coxas)", 20.00],
                ["Coxa", 48.00],
                ["Mãos", 12.00],
                ["Pés", 12.00],
                ["Nádegas", 48.00],
                ["DEPIL ARTER", 60.00]
            ],
            masculina: [
                ["Sobrancelha", 30.00],
                ["Bigode", 15.00],
                ["Nariz", 15.00],
                ["Orelhas", 15.00],
                ["Barba Completa", 38.00],
                ["Meia Barba", 28.00],
                ["Pescoço/Nuca", 15.00],
                ["Axilas", 20.00],
                ["Braços completos", 45.00],
                ["Antebraços", 28.00],
                ["Peito", 48.00],
                ["Peito e Barriga", 85.00],
                ["Peito e Costas", 85.00],
                ["Barriga", 45.00],
                ["Faixa da Barriga", 20.00],
                ["Costas Completa", 55.00],
                ["Meia Costa", 40.00],
                ["Nádegas", 40.00],
                ["Ânus", 28.00],
                ["Virilha", 55.00],
                ["Pernas Inteiras", 70.00],
                ["Meia Perna", 45.00],
                ["Coxas", 55.00],
                ["Mãos", 14.00],
                ["Pés", 14.00]
            ]
        };
        localStorage.setItem('servicos', JSON.stringify(servicos));
    }
}



function getPrecoServico(nome) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || {};
    for (const cat in servicos) {
        const found = servicos[cat].find(([n]) => n === nome);
        if (found) return found[1];
    }
    return 0;
}

function atualizarSelectServicos() {
    const select = document.getElementById('servico-agendamento');
    select.innerHTML = '<option value="">Selecione Serviço</option>';
    const servicos = JSON.parse(localStorage.getItem('servicos')) || {};
    const categories = {geral: 'Geral', pacotes: 'Pacotes', feminina: 'Feminina', masculina: 'Masculina'};
    for (const cat in categories) {
        if (servicos[cat]) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = categories[cat];
            servicos[cat].forEach(([nome, preco]) => {
                const option = document.createElement('option');
                option.value = nome;
                option.textContent = nome;
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        }
    }
}



function adicionarAgendamento() {
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const cliente = document.getElementById('cliente').value.trim();
    const servico = document.getElementById('servico-agendamento').value;
    const valor = getPrecoServico(servico);
    const meioPagamento = document.getElementById('meio-pagamento').value;
    if (!data || !hora || !cliente || !servico || !meioPagamento) {
        showModal('Preencha todos os campos e selecione meio de pagamento!');
        return;
    }
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};
    if (!agendamentos[data]) agendamentos[data] = {};
    if (!agendamentos[data][hora]) agendamentos[data][hora] = [];


    let clienteIndex = agendamentos[data][hora].findIndex(c => c.cliente === cliente);
    if (clienteIndex === -1) {

        if (agendamentos[data][hora].length >= 2) {
            showModal('Horário já tem 2 clientes!');
            return;
        }
        agendamentos[data][hora].push({ cliente, servicos: [{ servico, valor }], meioPagamento });
    } else {

        if (agendamentos[data][hora][clienteIndex].servicos.length >= 3) {
            showModal('Cliente já tem 3 serviços neste horário!');
            return;
        }
        agendamentos[data][hora][clienteIndex].servicos.push({ servico, valor });
    }

    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    carregarAgendamentosPorData();
    // Limpar campos
    document.getElementById('hora').value = '';
    document.getElementById('cliente').value = '';
    document.getElementById('servico-agendamento').value = '';
    document.getElementById('meio-pagamento').value = 'Dinheiro';
}

function renderizarAgendamentos(data) {
    const tbody = document.querySelector('#tabela-agendamentos tbody');
    tbody.innerHTML = '';
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};
    const agsDia = agendamentos[data] || {};
    horariosFixos.forEach(hora => {
        const row = document.createElement('tr');
        const ags = agsDia[hora] || [];
        const cliente1 = ags[0] ? ags[0].cliente : 'Livre';
        const servicos1 = ags[0] ? ags[0].servicos.map(s => `${s.servico} (R$${s.valor.toFixed(2)})`).join(', ') : '-';
        const total1 = ags[0] ? `R$ ${ags[0].servicos.reduce((sum, s) => sum + s.valor, 0).toFixed(2)}` : '-';
        const meio1 = ags[0] ? (ags[0].meioPagamento || '-') : '-';
        const cliente2 = ags[1] ? ags[1].cliente : 'Livre';
        const servicos2 = ags[1] ? ags[1].servicos.map(s => `${s.servico} (R$${s.valor.toFixed(2)})`).join(', ') : '-';
        const total2 = ags[1] ? `R$ ${ags[1].servicos.reduce((sum, s) => sum + s.valor, 0).toFixed(2)}` : '-';
        const meio2 = ags[1] ? (ags[1].meioPagamento || '-') : '-';
        const acoes = ags.length > 0 ? `<button onclick="removerAgendamento('${data}', '${hora}')">Remover Todos</button>` : '-';
        row.innerHTML = `
            <td>${hora}</td>
            <td>${cliente1}</td>
            <td>${servicos1}</td>
            <td>${total1}</td>
            <td>${meio1}</td>
            <td>${cliente2}</td>
            <td>${servicos2}</td>
            <td>${total2}</td>
            <td>${meio2}</td>
            <td>${acoes}</td>
        `;
        tbody.appendChild(row);
    });
}

function removerAgendamento(data, hora) {
    if (confirm('Remover todos os agendamentos deste horário nesta data?')) {
        let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};
        if (agendamentos[data] && agendamentos[data][hora]) {
            delete agendamentos[data][hora];
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
            carregarAgendamentosPorData();
        }
    }
}

function carregarAgendamentosPorData() {
    const data = document.getElementById('data').value;
    renderizarAgendamentos(data);
    atualizarSelectHorarios(data);
}

function atualizarSelectHorarios(data) {
    const select = document.getElementById('hora');
    select.innerHTML = '<option value="">Selecione Horário</option>';
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};
    const agsDia = agendamentos[data] || {};
    horariosFixos.forEach(hora => {
        const ags = agsDia[hora] || [];
        if (ags.length < 2) {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora;
            select.appendChild(option);
        }
    });
}


function adicionarGanho() {
    const data = document.getElementById('data-add').value;
    const ganho = parseFloat(document.getElementById('ganho').value);
    if (!data || isNaN(ganho) || ganho <= 0) {
        showModal('Selecione uma data e insira um valor válido!');
        return;
    }
    let caixa = JSON.parse(localStorage.getItem('caixa')) || {};
    if (!caixa[data]) caixa[data] = 0;
    caixa[data] += ganho;
    localStorage.setItem('caixa', JSON.stringify(caixa));
    atualizarTotalMensalPorMes();
    document.getElementById('ganho').value = '';
}

function carregarCaixa() {
    const caixa = JSON.parse(localStorage.getItem('caixa')) || {};
    renderizarHistorico(caixa);
    atualizarTotalMensalPorMes();
}

function atualizarTotalMensalPorMes() {
    const mesAno = document.getElementById('data-caixa').value;
    const caixa = JSON.parse(localStorage.getItem('caixa')) || {};
    let total = 0;
    for (const data in caixa) {
        if (data.startsWith(mesAno)) {
            total += caixa[data];
        }
    }
    document.getElementById('total-mes').textContent = `R$ ${total.toFixed(2)}`;
    renderizarHistorico(caixa, mesAno);
}

function renderizarHistorico(caixa, mesAno) {
    const ul = document.getElementById('historico-mensal');
    ul.innerHTML = '';
    let total = 0;
    const keys = mesAno ? Object.keys(caixa).sort().filter(data => data.startsWith(mesAno)) : Object.keys(caixa).sort();
    keys.forEach(data => {
        const li = document.createElement('li');
        li.innerHTML = `${data}: R$ ${caixa[data].toFixed(2)} <button onclick="editarGanho('${data}')">Editar</button> <button onclick="removerGanho('${data}')">Remover</button>`;
        ul.appendChild(li);
        total += caixa[data];
    });

    const liTotal = document.createElement('li');
    liTotal.className = 'total-geral';
    liTotal.textContent = mesAno ? `Total do Mês: R$ ${total.toFixed(2)}` : `Total Geral: R$ ${total.toFixed(2)}`;
    ul.appendChild(liTotal);
}

function editarGanho(data) {
    const caixa = JSON.parse(localStorage.getItem('caixa')) || {};
    if (!caixa[data]) return;
    const novoValor = prompt(`Novo valor para ${data}:`, caixa[data]);
    if (novoValor !== null && !isNaN(parseFloat(novoValor)) && parseFloat(novoValor) >= 0) {
        caixa[data] = parseFloat(novoValor);
        localStorage.setItem('caixa', JSON.stringify(caixa));
        atualizarTotalMensalPorMes();
    }
}

function removerGanho(data) {
    if (confirm(`Remover ganho do dia ${data}?`)) {
        const caixa = JSON.parse(localStorage.getItem('caixa')) || {};
        delete caixa[data];
        localStorage.setItem('caixa', JSON.stringify(caixa));
        atualizarTotalMensalPorMes();
    }
}



function adicionarServico() {
    const cat = document.getElementById('categoria-servico').value;
    const nome = document.getElementById('novo-servico').value.trim();
    const precoStr = document.getElementById('preco-servico').value.trim();
    if (!nome || !precoStr || isNaN(parseFloat(precoStr))) {
        showModal('Preencha nome e preço válido!');
        return;
    }
    let servicos = JSON.parse(localStorage.getItem('servicos')) || {};
    if (!servicos[cat]) servicos[cat] = [];
    if (servicos[cat].some(([n]) => n === nome)) {
        showModal('Serviço já existe na categoria!');
        return;
    }
    servicos[cat].push([nome, parseFloat(precoStr)]);
    localStorage.setItem('servicos', JSON.stringify(servicos));
    atualizarSelectServicos();
    renderizarServicosGerenciar();
    document.getElementById('categoria-servico').value = 'geral';
    document.getElementById('novo-servico').value = '';
    document.getElementById('preco-servico').value = '';
    showModal('Serviço adicionado!');
}

function editarServico(cat, index) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || {};
    if (!servicos[cat] || !servicos[cat][index]) return;
    const [nome, preco] = servicos[cat][index];
    const novoNome = prompt('Novo nome para o serviço:', nome);
    if (!novoNome) return;
    const novoPrecoStr = prompt('Novo preço:', preco);
    if (!novoPrecoStr || isNaN(parseFloat(novoPrecoStr))) return;
    servicos[cat][index] = [novoNome.trim(), parseFloat(novoPrecoStr)];
    localStorage.setItem('servicos', JSON.stringify(servicos));
    renderizarServicosGerenciar();
    atualizarSelectServicos();
}

function removerServico(cat, index) {
    if (confirm('Remover este serviço?')) {
        let servicos = JSON.parse(localStorage.getItem('servicos')) || {};
        servicos[cat].splice(index, 1);
        localStorage.setItem('servicos', JSON.stringify(servicos));
        renderizarServicosGerenciar();
        atualizarSelectServicos();
    }
}

function renderizarServicosGerenciar() {
    const ul = document.getElementById('lista-servicos-gerenciar');
    if (!ul) return;
    ul.innerHTML = '';
    const servicos = JSON.parse(localStorage.getItem('servicos')) || {};
    const categories = {
        geral: 'Serviços Gerais',
        pacotes: 'Pacotes',
        feminina: 'Depilação Feminina',
        masculina: 'Depilação Masculina'
    };
    for (const cat in categories) {
        if (servicos[cat]) {
            const h4 = document.createElement('h4');
            h4.textContent = categories[cat];
            ul.appendChild(h4);
            servicos[cat].forEach(([nome, preco], index) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${nome}: R$ ${preco.toFixed(2)}</span><div><button onclick="editarServico('${cat}', ${index})">Editar</button><button onclick="removerServico('${cat}', ${index})">Remover</button></div>`;
                ul.appendChild(li);
            });
        }
    }
}

function toggleServicos() {
    const div = document.getElementById('gerenciar-servicos');
    div.style.display = div.style.display === 'none' ? 'block' : 'none';
}

function toggleListaServicos() {
    const ul = document.getElementById('lista-servicos-gerenciar');
    ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
    if (ul.style.display === 'block') {
        renderizarServicosGerenciar();
    }
}

function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
}

function limparTudo() {
    if (confirm('Tem certeza? Isso vai apagar todos os dados!')) {
        localStorage.clear();
        location.reload();
    }
}
