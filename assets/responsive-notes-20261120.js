const english=document.documentElement.lang.startsWith('en');
const notes=[...document.querySelectorAll('[data-note-tab]')];
function selectNote(index){
 notes.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;document.getElementById(button.getAttribute('aria-controls')).hidden=i!==index;});
 document.querySelector('[data-nav-panel="about"] .window-content').scrollTop=0;
 document.querySelector('.notes-document').scrollTop=0;
}
notes.forEach((button,index)=>{
 button.addEventListener('click',()=>selectNote(index));
 button.addEventListener('keydown',event=>{
  const horizontal=innerWidth<=600;let next;
  if(event.key===(horizontal?'ArrowLeft':'ArrowUp'))next=(index-1+notes.length)%notes.length;
  if(event.key===(horizontal?'ArrowRight':'ArrowDown'))next=(index+1)%notes.length;
  if(event.key==='Home')next=0;if(event.key==='End')next=notes.length-1;
  if(next===undefined)return;event.preventDefault();event.stopPropagation();selectNote(next);notes[next].focus({preventScroll:true});
 });
});
function orientation(){notes[0].parentElement.setAttribute('aria-orientation',innerWidth<=600?'horizontal':'vertical');}
orientation();addEventListener('resize',orientation);
const pillars=[...document.querySelectorAll('.competency-pillar')];
pillars.forEach(pillar=>pillar.addEventListener('toggle',()=>{if(pillar.open)pillars.forEach(other=>{if(other!==pillar)other.open=false;});}));
document.querySelector('[data-copy-email]').addEventListener('click',async()=>{
 const status=document.querySelector('[data-mail-copy-status]');
 try{await navigator.clipboard.writeText('hello@moritzvollmer.de');status.textContent=english?'Copied.':'Kopiert.';}
 catch{status.textContent=english?'Please select and copy the email address.':'Bitte die E-Mail-Adresse markieren und kopieren.';}
});
