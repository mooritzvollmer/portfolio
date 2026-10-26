// Native details navigation and shared theme preference for content pages.
try {
 const dark=localStorage.getItem('preferred-theme')==='dark'
 document.documentElement.classList.remove('theme-dark','theme-light')
 document.documentElement.classList.add(dark?'theme-dark':'theme-light')
} catch {}
for(const menu of document.querySelectorAll('.subpage-menu')) {
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary')?.focus()}})
 document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false})
}
