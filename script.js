'use strict';

// Datos de demostración. Los títulos corresponden a las ocho tarjetas de la propuesta.
// No son resultados de una consulta a sistemas reales de Fonasa.
const servicios = [
  {id:'sap', nombre:'Sistema de Acceso Priorizado (SAP)', detalle:'Información introductoria sobre el Sistema de Acceso Priorizado y las listas de espera no GES.', palabras:['lista de espera','espera','priorizado','cirugias','cirugía','pacientes','sap','ges']},
  {id:'afiliacion', nombre:'Afíliate a Fonasa', detalle:'Orientación sobre el proceso de afiliación, sus requisitos y la búsqueda de información para inscribirse.', palabras:['afiliacion','afiliación','afiliar','afiliarse','inscripcion','registro','afiliado','salud']},
  {id:'bono', nombre:'Cotiza tu bono', detalle:'Acceso demostrativo al servicio de consulta de valores de bonos y prestaciones médicas.', palabras:['bono','bonos','cotiza','cotizar','precio','valor','consulta','medicina general']},
  {id:'prestadores', nombre:'Red de prestadores en convenio', detalle:'Consulta demostrativa sobre profesionales y centros de atención que mantienen convenio.', palabras:['red','prestadores','convenio','medico','medico en convenio','clínica','clinica','centro','profesionales']},
  {id:'coberturas', nombre:'Coberturas de salud PAD, GES y Ricarte Soto', detalle:'Información introductoria sobre programas de cobertura, GES, PAD y Ley Ricarte Soto.', palabras:['cobertura','coberturas','ges','pad','ricarte soto','ricardo soto','tratamiento','prestaciones','garantia','garantías','diabetes']},
  {id:'pad', nombre:'¿Qué son los Bonos PAD?', detalle:'Orientación general sobre el significado de los bonos PAD y sus ámbitos de uso.', palabras:['pad','bono pad','bonos pad','pago asociado','diagnostico','paquete']},
  {id:'certificado', nombre:'Certificados de afiliación', detalle:'Acceso demostrativo al certificado que acredita la afiliación a Fonasa.', palabras:['certificado','certificados','afiliacion','afiliación','acreditacion','comprobante','descargar']},
  {id:'cotizaciones', nombre:'Certificado de cotizaciones', detalle:'Acceso demostrativo al certificado sobre las cotizaciones registradas.', palabras:['cotizaciones','cotizacion','certificado','certificado cotizaciones','aportes','cotizante','pagos']}
];

const $ = selector => document.querySelector(selector);
const input = $('#search-input');
const searchForm = $('#search-form');
const popover = $('#suggestion-popover');
const optionList = $('#search-suggestions');
const hint = $('#suggestion-help');
const status = $('#live-search-status');
const clearButton = $('#clear-search');
const detailDialog = $('#detail-dialog');
const catalogDialog = $('#catalog-dialog');
const infoDialog = $('#info-dialog');
const accessibilityDialog = $('#accessibility-dialog');
let suggestions = [];
let activeIndex = -1;
let matchesExact = false;

function normalizar(str){
  return String(str).toLocaleLowerCase('es-CL').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
}
function getMatches(raw){
  const q = normalizar(raw);
  if(!q) return [];
  const matches = servicios.map(item => {
    const name = normalizar(item.nombre);
    const keywords = item.palabras.map(normalizar);
    let score = 0;
    if(name === q) score = 120;
    else if(name.startsWith(q)) score = 90;
    else if(keywords.some(k=>k === q)) score = 75;
    else if(keywords.some(k=>k.startsWith(q))) score = 65;
    else if(name.includes(q)) score = 55;
    else if(keywords.some(k=>k.includes(q))) score = 45;
    else if(q.includes(' ') && q.split(/\s+/).filter(t=>t.length>1).some(t=>name.includes(t)||keywords.some(k=>k.includes(t)))) score = 25;
    return {item,score};
  }).filter(entry=>entry.score>0).sort((a,b)=>b.score-a.score);
  return matches.map(e=>e.item).slice(0,6);
}
function getFallback(){return [servicios[1],servicios[2],servicios[4],servicios[6]];}
function closeSuggestions(){
  popover.hidden = true;
  optionList.replaceChildren();
  input.setAttribute('aria-expanded','false');
  input.removeAttribute('aria-activedescendant');
  suggestions=[];activeIndex=-1;
}
function setActive(idx){
  activeIndex=idx;
  [...optionList.children].forEach((li,i)=>{
    li.setAttribute('aria-selected',i===idx?'true':'false');
  });
  if(idx>=0){
    const li=optionList.children[idx];
    input.setAttribute('aria-activedescendant',li.id);
    li.scrollIntoView({block:'nearest',inline:'nearest'});
  }else input.removeAttribute('aria-activedescendant');
}
function showSuggestions(query){
  const q=query.trim();
  clearButton.hidden=!q;
  if(!q){closeSuggestions();status.textContent='Escribe el nombre de un trámite para recibir sugerencias inmediatas.';return;}
  const result=getMatches(q);
  matchesExact=result.length>0;
  suggestions=matchesExact?result:getFallback();
  optionList.replaceChildren();
  suggestions.forEach((item,i)=>{
    const li=document.createElement('li');
    li.id=`opcion-tramite-${i}`;
    li.setAttribute('role','option');
    li.setAttribute('aria-selected','false');
    li.textContent=item.nombre;
    // Un puntero no desplaza el foco del combobox; Enter y flechas siguen disponibles.
    li.addEventListener('pointerdown',event=>event.preventDefault());
    li.addEventListener('click',()=>selectSuggestion(i));
    optionList.append(li);
  });
  hint.textContent=matchesExact?'Usa las flechas para elegir una opción y pulsa Enter.':'Sin coincidencias exactas. Prueba con “afiliación”, “bono” o “certificado”, o selecciona un trámite frecuente.';
  popover.hidden=false;
  input.setAttribute('aria-expanded','true');
  setActive(-1);
  status.textContent=matchesExact?`${suggestions.length} sugerencias disponibles para ${q}. Usa flecha abajo para recorrerlas.`:`No encontramos coincidencias exactas para ${q}. Se muestran cuatro trámites frecuentes como alternativas.`;
}
function selectSuggestion(index){
  const service=suggestions[index];
  if(!service)return;
  input.value=service.nombre;
  clearButton.hidden=false;
  closeSuggestions();
  status.textContent=`Seleccionaste ${service.nombre}. Se abre información demostrativa del trámite.`;
  openService(service.id);
}
function submitSearch(){
  const text=input.value.trim();
  if(!text){input.focus();status.textContent='Escribe el nombre de un trámite antes de buscar.';return;}
  const result=getMatches(text);
  if(result.length){closeSuggestions();openService(result[0].id);status.textContent=`Resultado de búsqueda: ${result[0].nombre}.`;}
  else{showSuggestions(text);input.focus();status.textContent=`No hay coincidencias exactas para ${text}. Prueba palabras como afiliación, bono, GES o certificado.`;}
}

input.addEventListener('input',()=>showSuggestions(input.value));
input.addEventListener('keydown',event=>{
  const listVisible=!popover.hidden;
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
    event.preventDefault();
    if(!listVisible)showSuggestions(input.value||'a');
    if(!suggestions.length)return;
    const next=event.key==='ArrowDown'?(activeIndex+1)%suggestions.length:(activeIndex<=0?suggestions.length-1:activeIndex-1);
    setActive(next);
  }else if(event.key==='Enter' && listVisible && activeIndex>=0){
    event.preventDefault();selectSuggestion(activeIndex);
  }else if(event.key==='Escape' && listVisible){
    event.preventDefault();closeSuggestions();status.textContent='Se cerraron las sugerencias de búsqueda.';
  }else if(event.key==='Tab' && listVisible){closeSuggestions();}
});
searchForm.addEventListener('submit',event=>{event.preventDefault();submitSearch();});
clearButton.addEventListener('click',()=>{input.value='';closeSuggestions();clearButton.hidden=true;input.focus();status.textContent='Búsqueda borrada.';});
document.addEventListener('pointerdown',event=>{if(!$('#buscar-tramites').contains(event.target))closeSuggestions();});
$('#focus-search').addEventListener('click',()=>{input.scrollIntoView({behavior:document.body.classList.contains('no-motion')?'instant':'smooth',block:'center'});input.focus({preventScroll:true});});

function openDialog(dialog){
  if(dialog.open)return;
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  closeSuggestions();
  dialog.showModal();
}
function openService(id){
  const service=servicios.find(s=>s.id===id);
  if(!service)return;
  $('#detail-heading').textContent=service.nombre;
  $('#detail-description').textContent=service.detalle;
  openDialog(detailDialog);
}
for(const button of document.querySelectorAll('[data-open]')){
  button.addEventListener('click',()=>openService(button.dataset.open));
}
for(const button of document.querySelectorAll('[data-close]')){
  button.addEventListener('click',()=>document.getElementById(button.dataset.close).close());
}
for(const dialog of document.querySelectorAll('dialog')){
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
}
$('#show-all').addEventListener('click',()=>openDialog(catalogDialog));
const catalogList=$('#catalog-list');
servicios.forEach(service=>{
  const li=document.createElement('li');
  const b=document.createElement('button');
  b.type='button';b.textContent=service.nombre;
  b.addEventListener('click',()=>{catalogDialog.close();openService(service.id);});
  li.append(b);catalogList.append(li);
});

for(const navButton of document.querySelectorAll('[data-info]')){
  navButton.addEventListener('click',()=>{$('#info-heading').textContent=navButton.dataset.info;openDialog(infoDialog);});
}
$('#accessibility-toggle').addEventListener('click',()=>openDialog(accessibilityDialog));
$('#larger-text').addEventListener('change',event=>document.body.classList.toggle('large-text',event.target.checked));
$('#high-contrast').addEventListener('change',event=>document.body.classList.toggle('high-contrast',event.target.checked));
$('#reduce-motion').addEventListener('change',event=>document.body.classList.toggle('no-motion',event.target.checked));
