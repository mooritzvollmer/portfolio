const english = document.documentElement.lang.startsWith('en');
const notes = [...document.querySelectorAll('[data-note-tab]')];
function selectNote(index) {
  notes.forEach((button,i) => {
    button.setAttribute('aria-selected',String(i===index)); button.tabIndex=i===index?0:-1;
    document.getElementById(button.getAttribute('aria-controls')).hidden=i!==index;
  });
}
function addTabs(buttons,select,isHorizontal) {
  buttons.forEach((button,index) => {
    button.addEventListener('click',()=>select(index));
    button.addEventListener('keydown',event=>{
      const horizontal=isHorizontal();
      let next;
      if(event.key===(horizontal?'ArrowLeft':'ArrowUp'))next=(index-1+buttons.length)%buttons.length;
      if(event.key===(horizontal?'ArrowRight':'ArrowDown'))next=(index+1)%buttons.length;
      if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;
      if(next===undefined)return;
      event.preventDefault();event.stopPropagation();select(next);buttons[next].focus({preventScroll:true});
    });
  });
}
addTabs(notes,selectNote,()=>innerWidth<=480);
const dialog=document.querySelector('#skills-app');
const opener=document.querySelector('[data-open-skills]');
const tabs=[...dialog.querySelectorAll('[data-skill-tab]')];
function selectSkill(index){
  tabs.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;document.getElementById(button.getAttribute('aria-controls')).hidden=i!==index;});
  dialog.querySelector('.settings-content').scrollTop=0;
}
addTabs(tabs,selectSkill,()=>innerWidth<=767);
function orientation(){notes[0].parentElement.setAttribute('aria-orientation',innerWidth<=480?'horizontal':'vertical');tabs[0].parentElement.setAttribute('aria-orientation',innerWidth<=767?'horizontal':'vertical');}
orientation();addEventListener('resize',orientation);
opener.addEventListener('click',()=>{dialog.showModal();dialog.querySelector('#skills-title').focus({preventScroll:true});});
dialog.querySelectorAll('[data-skills-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.querySelector('[data-skills-maximize]').addEventListener('click',event=>{const expanded=dialog.classList.toggle('is-maximized');event.currentTarget.setAttribute('aria-pressed',String(expanded));event.currentTarget.setAttribute('aria-label',expanded?(english?'Restore window':'Fenster verkleinern'):(english?'Expand window':'Fenster vergrößern'));});
dialog.addEventListener('close',()=>opener.focus({preventScroll:true}));
['keydown','wheel','touchstart','touchmove','touchend'].forEach(type=>dialog.addEventListener(type,event=>event.stopPropagation()));
dialog.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const controls=[...dialog.querySelectorAll('button,a[href],[tabindex="0"]')].filter(el=>el.tabIndex>=0&&el.getClientRects().length&&!el.disabled);
 const first=controls[0],last=controls.at(-1);
 if(event.shiftKey&&(document.activeElement===first||document.activeElement.id==='skills-title')){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
document.querySelector('[data-copy-email]').addEventListener('click',async()=>{
 const status=document.querySelector('[data-mail-copy-status]');
 try{await navigator.clipboard.writeText('hello@moritzvollmer.de');status.textContent=english?'Copied.':'Kopiert.';}
 catch{status.textContent=english?'Please select and copy the email address.':'Bitte die E-Mail-Adresse markieren und kopieren.';}
});
