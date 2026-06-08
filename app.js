/* ============================
   REPORTA AQUI — app.js
   Capão Redondo, São Paulo – SP
   ============================ */

// ---- Dados iniciais ----
const ocorrencias = [
  {
    id: 'OC001',
    tipo: 'semaforo',
    titulo: 'Semáforo inoperante',
    local: 'Cruzamento Estr. Capão Redondo',
    status: 'urgente',
    data: '21/04/2026',
    etapaAtual: 1,
    desc: 'Semáforo piscando em amarelo há 2 dias, causando confusão no trânsito.',
  },
  {
    id: 'OC002',
    tipo: 'buraco',
    titulo: 'Buraco na calçada',
    local: 'Av. Battistoni Filho, 320',
    status: 'urgente',
    data: '20/04/2026',
    etapaAtual: 2,
    desc: 'Buraco de ~1m na calçada, risco de queda para pedestres.',
  },
  {
    id: 'OC003',
    tipo: 'iluminacao',
    titulo: 'Poste apagado',
    local: 'R. Mato Grosso do Sul, 80',
    status: 'analise',
    data: '19/04/2026',
    etapaAtual: 2,
    desc: 'Trecho sem luz há 3 dias. Sensação de insegurança à noite.',
  },
  {
    id: 'OC004',
    tipo: 'buraco',
    titulo: 'Buraco na pista',
    local: 'Estr. do Capão Redondo, 580',
    status: 'novo',
    data: '21/04/2026',
    etapaAtual: 1,
    desc: 'Buraco no meio da pista causando desvios perigosos.',
  },
  {
    id: 'OC005',
    tipo: 'iluminacao',
    titulo: 'Iluminação pública danificada',
    local: 'R. Piauí c/ Estr. Capão Redondo',
    status: 'analise',
    data: '14/04/2026',
    etapaAtual: 3,
    desc: 'Dois postes apagados no mesmo trecho.',
  },
  {
    id: 'OC006',
    tipo: 'lixo',
    titulo: 'Lixo acumulado',
    local: 'R. Mato Grosso do Sul, 210',
    status: 'resolvido',
    data: '15/04/2026',
    etapaAtual: 5,
    desc: 'Resolvido pela Subprefeitura após registro na plataforma.',
  },
];

// ---- Etapas do fluxo ----
const ETAPAS = [
  { id: 'registro',    label: 'Registro' },
  { id: 'analise',     label: 'Análise' },
  { id: 'encaminhado', label: 'Encaminhado' },
  { id: 'execucao',    label: 'Execução' },
  { id: 'resolvido',   label: 'Resolvido' },
];

// ---- Mapeamentos ----
const tipoIcone = {
  buraco:    '🕳️',
  iluminacao:'💡',
  semaforo:  '🚦',
  lixo:      '🗑️',
  outro:     '📋',
};

const tipoNome = {
  buraco:    'Buraco na via',
  iluminacao:'Falha na iluminação',
  semaforo:  'Semáforo com problema',
  lixo:      'Lixo acumulado',
  outro:     'Outro problema',
};

const icCls = {
  buraco:    'buraco',
  iluminacao:'iluminacao',
  semaforo:  'semaforo',
  lixo:      'lixo',
  outro:     'outro',
};

const statusLabel = {
  novo:      'Novo',
  analise:   'Em análise',
  resolvido: 'Resolvido',
  urgente:   'Urgente',
};

const badgeCls = {
  novo:      'novo',
  analise:   'analise',
  resolvido: 'resolvido',
  urgente:   'urgente',
};

let protocoloCounter  = 1001;
let filtroLista       = 'todas';
let filtroAcomp       = 'todas';
let tipoRapido        = 'buraco';

// ---- Render: lista de ocorrências (página início) ----
function renderLista() {
  const el = document.getElementById('lista-ocorrencias');
  if (!el) return;

  const lista = filtroLista === 'todas'
    ? ocorrencias
    : ocorrencias.filter(o => o.tipo === filtroLista);

  if (!lista.length) {
    el.innerHTML = '<div class="empty">Nenhuma ocorrência nessa categoria ainda.</div>';
    return;
  }

  el.innerHTML = lista.map(o => `
    <div class="ocorrencia">
      <div class="oc-icon ${icCls[o.tipo] || 'outro'}">${tipoIcone[o.tipo] || '📋'}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px">
          <span class="oc-title">${o.titulo}</span>
          <span class="badge ${badgeCls[o.status]}">${statusLabel[o.status] || o.status}</span>
        </div>
        <div class="oc-meta">${o.local} · ${o.data}</div>
        <div class="oc-desc">${o.desc}</div>
      </div>
    </div>
  `).join('');
}

// ---- Render: painel de acompanhamento ----
function renderAcompanhamento() {
  const el = document.getElementById('acomp-cards');
  if (!el) return;

  const lista = filtroAcomp === 'todas'
    ? ocorrencias
    : ocorrencias.filter(o => o.status === filtroAcomp);

  if (!lista.length) {
    el.innerHTML = '<div class="empty">Nenhuma ocorrência encontrada para esse filtro.</div>';
    return;
  }

  el.innerHTML = lista.map(o => {
    const pct = Math.round((o.etapaAtual / ETAPAS.length) * 100);

    const etapasHTML = ETAPAS.map((e, i) => {
      let dotClass = 'pending';
      let dotContent = String(i + 1);

      if (i < o.etapaAtual - 1) {
        dotClass = 'done';
        dotContent = '✓';
      } else if (i === o.etapaAtual - 1) {
        dotClass = o.status === 'urgente' ? 'urgent' : 'current';
      }

      return `
        <div class="etapa-item ${i < o.etapaAtual ? 'done' : ''}">
          <div class="etapa-dot ${dotClass}">${dotContent}</div>
          <div class="etapa-name">${e.label}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="acomp-card">
        <div class="acomp-card-top">
          <div class="acomp-card-left">
            <div class="oc-icon ${icCls[o.tipo] || 'outro'}" style="width:38px;height:38px;font-size:18px">${tipoIcone[o.tipo] || '📋'}</div>
            <div>
              <div class="acomp-card-titulo">${o.titulo}</div>
              <div class="acomp-card-meta">📍 ${o.local} · ${o.data}</div>
            </div>
          </div>
          <span class="badge ${badgeCls[o.status]}">${statusLabel[o.status] || o.status}</span>
        </div>

        <div class="etapas-row">${etapasHTML}</div>

        <div class="prog-wrap">
          <div class="prog-fill prog-${o.status}" style="width:${pct}%"></div>
        </div>
        <div class="prog-info">
          <span>Etapa atual: ${ETAPAS[o.etapaAtual - 1]?.label || 'Registro'}</span>
          <span>${pct}% concluído</span>
        </div>
      </div>
    `;
  }).join('');
}

// ---- Atualizar estatísticas ----
function atualizarStats() {
  const total      = ocorrencias.length;
  const resolvidas = ocorrencias.filter(o => o.status === 'resolvido').length;
  const andamento  = total - resolvidas;

  const elTotal     = document.getElementById('cnt-total');
  const elResolv    = document.getElementById('cnt-resolvidas');
  const elAndamento = document.getElementById('cnt-andamento');

  if (elTotal)     elTotal.textContent     = total;
  if (elResolv)    elResolv.textContent    = resolvidas;
  if (elAndamento) elAndamento.textContent = andamento;

  // Bloco de impacto — números simulados crescendo com os registros
  const usuarios   = 128 + (total - 6) * 3;
  const resolvidos = 43  + resolvidas;

  const impUsu  = document.getElementById('imp-usuarios');
  const impRes  = document.getElementById('imp-resolvidos');
  const impFrase = document.getElementById('imp-frase-num');

  if (impUsu)   impUsu.textContent   = usuarios;
  if (impRes)   impRes.textContent   = resolvidos;
  if (impFrase) impFrase.textContent = usuarios;
}

// ---- Navegação entre páginas ----
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'acompanhamento') renderAcompanhamento();
}

// ---- Envio rápido ----
function enviarRapido() {
  const rua  = document.getElementById('q-rua').value.trim();
  const desc = document.getElementById('q-desc').value.trim();

  if (!rua) {
    alert('Por favor, informe a rua ou ponto de referência.');
    return;
  }

  const hoje = new Date();
  ocorrencias.unshift({
    id:         'OC' + (protocoloCounter++),
    tipo:       tipoRapido,
    titulo:     tipoNome[tipoRapido],
    local:      rua,
    status:     'novo',
    data:       hoje.toLocaleDateString('pt-BR'),
    etapaAtual: 1,
    desc:       desc || 'Registrado pela comunidade.',
  });

  atualizarStats();
  renderLista();

  document.getElementById('q-rua').value  = '';
  document.getElementById('q-desc').value = '';

  const msg = document.getElementById('msg-rapido');
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 3500);
}

// ---- Envio completo ----
function enviarCompleto() {
  const nome     = document.getElementById('r-nome').value.trim();
  const end      = document.getElementById('r-end').value.trim();
  const tipo     = document.getElementById('r-tipo').value;
  const urgencia = document.getElementById('r-urgencia').value;
  const desc     = document.getElementById('r-desc').value.trim();

  if (!nome || !end) {
    alert('Preencha os campos obrigatórios: nome e endereço.');
    return;
  }

  const protocolo   = 'OC' + (protocoloCounter++);
  const hoje        = new Date();
  const statusInicial = urgencia === 'urgente' ? 'urgente' : 'novo';

  ocorrencias.unshift({
    id:         protocolo,
    tipo:       tipo,
    titulo:     tipoNome[tipo] || 'Ocorrência',
    local:      end,
    status:     statusInicial,
    data:       hoje.toLocaleDateString('pt-BR'),
    etapaAtual: 1,
    desc:       desc || 'Registrado pela comunidade.',
  });

  atualizarStats();

  const elProt = document.getElementById('protocolo-num');
  if (elProt) elProt.textContent = protocolo;

  const msg = document.getElementById('msg-completo');
  if (msg) msg.style.display = 'block';

  ['r-nome', 'r-email', 'r-end', 'r-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ---- Inicialização ----
document.addEventListener('DOMContentLoaded', () => {

  // Navegação
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showPage(el.dataset.page);
    });
  });

  // Filtros da lista (início)
  document.querySelectorAll('.chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filtroLista = chip.dataset.filter;
      renderLista();
    });
  });

  // Filtros do acompanhamento
  document.querySelectorAll('.chip[data-acomp-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-acomp-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filtroAcomp = chip.dataset.acomplFilter || chip.dataset.acompFilter;
      renderAcompanhamento();
    });
  });

  // Tipo rápido
  document.querySelectorAll('#tipo-rapido .tipo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tipo-rapido .tipo-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tipoRapido = btn.dataset.tipo;
    });
  });

  // Botões de envio
  const btnRapido = document.getElementById('btn-enviar-rapido');
  if (btnRapido) btnRapido.addEventListener('click', enviarRapido);

  const btnCompleto = document.getElementById('btn-enviar-completo');
  if (btnCompleto) btnCompleto.addEventListener('click', enviarCompleto);

  // Render inicial
  renderLista();
  atualizarStats();
});